import { router } from "./trpc";
import { authCallback } from "./routes";
import {
  create,
  getSidebar,
  archieve,
  getTrash,
  remove,
  restore,
  getSearch,
} from "./routes/documents";

const documentRouter = router({
  create,
  getSidebar,
  archieve,
  getTrash,
  remove,
  restore,
  getSearch,
});

// appRouter instance
export const appRouter = router({
  authCallback,
  documents: documentRouter,
});

//AppRouter - One who is responsible for type-safety b/w client & server
export type AppRouter = typeof appRouter;
