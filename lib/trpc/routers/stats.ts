import { router, publicProcedure } from "../server";
import { posts } from "@/lib/db/schema";
import { eq, countDistinct, count } from "drizzle-orm";

export const statsRouter = router({
  // Get platform statistics
  getStats: publicProcedure.query(async ({ ctx }) => {
    // Count total published articles
    const articlesResult = await ctx.db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.published, true));
    
    const articles = articlesResult[0]?.count ?? 0;

    // Count unique writers (users who have published at least one article)
    const writersResult = await ctx.db
      .select({ count: countDistinct(posts.authorId) })
      .from(posts)
      .where(eq(posts.published, true));
    
    const writers = writersResult[0]?.count ?? 0;

    // All users are considered readers (same as writers for now)
    const readers = writers;

    return {
      articles,
      readers,
      writers,
    };
  }),
});
