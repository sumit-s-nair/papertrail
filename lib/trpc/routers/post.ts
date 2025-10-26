import { router, publicProcedure } from "../server";
import { z } from "zod";
import { posts, postCategories, categories } from "@/lib/db/schema";
import { eq, desc, and, like, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

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
        title: z.string().min(1).max(200),
        slug: z.string().min(1),
        content: z.string().min(1),
        description: z.string().max(500).optional(),
        imageUrl: z.string().url().optional().or(z.literal("")),
        published: z.boolean().default(false),
        authorId: z.string(),
        author: z.string().default("Admin"),
        categoryIds: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { categoryIds, ...postData } = input;

      // Insert post
      const [newPost] = await ctx.db
        .insert(posts)
        .values(postData)
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
    }),

  // Update post
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(200).optional(),
        slug: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        description: z.string().max(500).optional(),
        imageUrl: z.string().url().optional().or(z.literal("")),
        published: z.boolean().optional(),
        categoryIds: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, categoryIds, ...updateData } = input;

      // Update post
      const [updatedPost] = await ctx.db
        .update(posts)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, id))
        .returning();

      if (!updatedPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

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
    }),

  // Delete post
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Delete category relationships first
      await ctx.db.delete(postCategories).where(eq(postCategories.postId, input.id));

      // Delete post
      const [deletedPost] = await ctx.db
        .delete(posts)
        .where(eq(posts.id, input.id))
        .returning();

      if (!deletedPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      return deletedPost;
    }),
});
