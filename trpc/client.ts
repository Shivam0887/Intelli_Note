import type { AppRouter } from "@/app/_server";
import { createTRPCReact } from "@trpc/react-query";

// trpc client -> making request to tRPC server
export const trpc = createTRPCReact<AppRouter>({});
