import { router, publicProcedure } from "../server";
import { z } from "zod";
import { posts, postCategories, categories, postViews } from "@/lib/db/schema";
import { eq, desc, and, like, inArray, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

function calculateReadTime(content: string): number {
  if (!content) return 1;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export const postRouter = router({
  // Get all posts with categories (optional userId filter for dashboard)
  getAll: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        publishedOnly: z.boolean().default(true),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const conditions = [];
      
      // Default to showing only published posts for public queries
      const publishedOnly = input?.publishedOnly ?? true;
      
      if (publishedOnly) {
        conditions.push(eq(posts.published, true));
      }
      
      if (input?.userId) {
        conditions.push(eq(posts.authorId, input.userId));
      }

      return await ctx.db.query.posts.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: desc(posts.createdAt),
        with: {
          postCategories: {
            with: {
              category: true,
            },
          },
        },
      });
    }),

  // Get post by slug with categories
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.slug, input.slug),
        with: {
          postCategories: {
            with: {
              category: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      return post;
    }),

  // Get posts by user
  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.authorId, input.userId))
        .orderBy(desc(posts.createdAt));
    }),

  // Create new post
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required").max(200, "Title is too long"),
        slug: z.string().min(1, "Slug is required"),
        content: z.string().min(1, "Content is required"),
        description: z.string().max(500, "Description is too long").optional(),
        imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
        published: z.boolean().default(false),
        authorId: z.string().min(1, "Author ID is required"),
        author: z.string().default("Admin"),
        categoryIds: z.array(z.string()).min(1, "At least one category is required").optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { categoryIds, ...postData } = input;

      try {
        // Check for duplicate slug
        const existingPost = await ctx.db.query.posts.findFirst({
          where: eq(posts.slug, input.slug),
        });

        if (existingPost) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A post with this slug already exists",
          });
        }

        // Calculate reading time mathematically
        const readTime = calculateReadTime(postData.content);

        // Insert post
        const [newPost] = await ctx.db
          .insert(posts)
          .values({ ...postData, readTime })
          .returning();

        // Link categories if provided
        if (categoryIds && categoryIds.length > 0) {
          await ctx.db.insert(postCategories).values(
            categoryIds.map((categoryId) => ({
              postId: newPost.id,
              categoryId,
            }))
          );
        }

        return newPost;
      } catch (error: any) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        // Handle database errors
        if (error.code === "23505") { // Unique constraint violation
          throw new TRPCError({
            code: "CONFLICT",
            message: "A post with this slug already exists",
          });
        }
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to create post",
        });
      }
    }),

  // Update post
  update: publicProcedure
    .input(
      z.object({
        id: z.string().min(1, "Post ID is required"),
        title: z.string().min(1, "Title is required").max(200, "Title is too long").optional(),
        slug: z.string().min(1, "Slug is required").optional(),
        content: z.string().min(1, "Content is required").optional(),
        description: z.string().max(500, "Description is too long").optional(),
        imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
        published: z.boolean().optional(),
        categoryIds: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, categoryIds, ...updateData } = input;

      try {
        // Check if post exists
        const existingPost = await ctx.db.query.posts.findFirst({
          where: eq(posts.id, id),
        });

        if (!existingPost) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }

        const updatePayload: any = {
            ...updateData,
            updatedAt: new Date(),
        };

        if (updateData.content !== undefined) {
          updatePayload.readTime = calculateReadTime(updateData.content);
        }

        // Update post
        const [updatedPost] = await ctx.db
          .update(posts)
          .set(updatePayload)
          .where(eq(posts.id, id))
          .returning();

        // Update categories if provided
        if (categoryIds) {
          // Delete existing category relationships
          await ctx.db.delete(postCategories).where(eq(postCategories.postId, id));

          // Insert new category relationships
          if (categoryIds.length > 0) {
            await ctx.db.insert(postCategories).values(
              categoryIds.map((categoryId) => ({
                postId: id,
                categoryId,
              }))
            );
          }
        }

        return updatedPost;
      } catch (error: any) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to update post",
        });
      }
    }),

  // Delete post
  delete: publicProcedure
    .input(z.object({ id: z.string().min(1, "Post ID is required") }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if post exists
        const existingPost = await ctx.db.query.posts.findFirst({
          where: eq(posts.id, input.id),
        });

        if (!existingPost) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }

        // Delete category relationships first (cascade)
        await ctx.db.delete(postCategories).where(eq(postCategories.postId, input.id));

        // Delete post
        const [deletedPost] = await ctx.db
          .delete(posts)
          .where(eq(posts.id, input.id))
          .returning();

        return deletedPost;
      } catch (error: any) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to delete post",
        });
      }
    }),

  // Analytics tracking views
  addView: publicProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.slug, input.slug),
        columns: { id: true }
      });
      if (post) {
        await ctx.db.insert(postViews).values({ postId: post.id });
      }
      return { success: true };
    }),

  // Get daily analytics for a user's posts
  getAnalytics: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Fetch all posts for this user along with their view timestamps
      const userPosts = await ctx.db.query.posts.findMany({
        where: eq(posts.authorId, input.userId),
        with: {
          postViews: {
            columns: { viewedAt: true }
          }
        }
      });

      // Prepare an empty map for the last 30 days
      const dailyCounts: Record<string, number> = {};
      const last30Days = [...Array(30)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();

      last30Days.forEach(day => { dailyCounts[day] = 0; });

      let totalViews = 0;

      // Group views by day natively to avoid raw complex SQL dialects
      userPosts.forEach(post => {
        post.postViews.forEach(view => {
          totalViews++;
          const day = new Date(view.viewedAt).toISOString().split('T')[0];
          if (dailyCounts[day] !== undefined) {
             dailyCounts[day]++;
          }
        });
      });

      return {
        totalViews,
        timeline: last30Days.map(date => ({
          date,
          views: dailyCounts[date]
        }))
      };
    }),
});
