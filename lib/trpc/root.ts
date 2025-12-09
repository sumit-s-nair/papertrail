import { router } from "./server";
import { postRouter } from "./routers/post";
import { categoryRouter } from "./routers/category";
import { statsRouter } from "./routers/stats";

export const appRouter = router({
  post: postRouter,
  category: categoryRouter,
  stats: statsRouter,
});

export type AppRouter = typeof appRouter;
