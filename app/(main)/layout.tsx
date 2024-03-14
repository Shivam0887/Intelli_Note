import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Navigation from "./_components/navigation";
import { SearchCommand } from "@/components/search-command";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();

  if (!user) redirect("/auth-callback?origin=documents");

  return (
    <div className="relative w-full h-full flex dark:bg-[#191919] overflow-hidden">
      <Navigation />
      <main className="w-full flex-1 h-full overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
