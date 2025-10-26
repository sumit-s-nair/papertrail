import { initTRPC, TRPCError } from "@trpc/server";
import { db } from "@/lib/db";
import superjson from "superjson";

// Create tRPC context
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
    headers: opts.headers,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
