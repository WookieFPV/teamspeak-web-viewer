import { ts3Router } from "~/server/api/routers/ts3Router";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  ts3: ts3Router,
});

// export type definition of API
export type AppRouter = typeof appRouter;
