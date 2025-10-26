import { z } from "zod";
import { router, publicProcedure } from "../server";
import { categories } from "@/lib/db/schema";

export const categoryRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });
  }),
});
