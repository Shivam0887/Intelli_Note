import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/app/_server";

const handler = (req: Request) => {
  /**
   * tRPC is not a server on its own, and must therefore be served using other hosts.
   * appRouter is turned into a server with the help of a
   * specific adapter, in this case it is 'fetch'
   */

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });
};

export { handler as GET, handler as POST };
