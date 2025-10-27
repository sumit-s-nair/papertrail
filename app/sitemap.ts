import { MetadataRoute } from 'next'
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://papertrail-chi.vercel.app';

  // Get all published posts
  const publishedPosts = await db.query.posts.findMany({
    where: eq(posts.published, true),
    columns: {
      slug: true,
      updatedAt: true,
    },
  });

  // Generate post URLs
  const postUrls = publishedPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  return [...routes, ...postUrls];
}
