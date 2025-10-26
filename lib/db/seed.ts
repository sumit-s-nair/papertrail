import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { categories } from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
  console.log("Seeding database...");

  try {
    // Check if categories already exist
    const existingCategories = await db.select().from(categories);
    
    if (existingCategories.length > 0) {
      console.log("Database already seeded. Skipping...");
      return;
    }

    // Insert categories
    console.log("Creating categories...");
    const categoryData = [
      {
        name: "Technology",
        slug: "technology",
        description: "Latest in tech and innovation",
      },
      {
        name: "Design",
        slug: "design",
        description: "UI/UX and visual design",
      },
      {
        name: "Development",
        slug: "development",
        description: "Software development and coding",
      },
      {
        name: "Business",
        slug: "business",
        description: "Business strategies and insights",
      },
      {
        name: "Lifestyle",
        slug: "lifestyle",
        description: "Life, culture, and experiences",
      },
      {
        name: "Research",
        slug: "research",
        description: "Research and analysis",
      },
      {
        name: "Tutorial",
        slug: "tutorial",
        description: "Step-by-step guides",
      },
      {
        name: "News",
        slug: "news",
        description: "Latest news and updates",
      },
    ];

    await db.insert(categories).values(categoryData);
    console.log("✅ Categories created");

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("✅ Seeding completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });
