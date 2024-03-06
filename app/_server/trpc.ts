import { auth, currentUser } from "@clerk/nextjs";
import { TRPCError, initTRPC } from "@trpc/server";

// Initializing tRPC backend

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */

const t = initTRPC.create();
const middleware = t.middleware;

const isAuth = middleware(async ({ next }) => {
  const user = await currentUser();

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      userId: user.id,
    },
  });
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */

export const router = t.router;

export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
