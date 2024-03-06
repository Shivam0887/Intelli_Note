"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { ChevronsLeftRight, Loader2, User2 } from "lucide-react";
import { useRouter } from "next/navigation";

const UserItem = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="max-w-max mx-auto my-2">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role="button"
          className="flex items-center text-sm p-2 w-[98%] rounded-sm m-1 hover:bg-primary/5"
        >
          <div className="gap-x-2 flex items-center max-w-[75%]">
            <Avatar className="h-5 w-5 rounded-sm">
              <AvatarImage src={user?.imageUrl} />
            </Avatar>
            <span className="text-start text-zinc-700 dark:text-zinc-300 font-semibold line-clamp-1">
              {user?.fullName}&apos;s Intelli-Note
            </span>
          </div>
          <ChevronsLeftRight className="h-4 w-4 rotate-90 ml-1 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 bg-[#f7f7f7] dark:bg-[#282828] shadow-[0px_0px_10px_0px_#cdcdcd] dark:shadow-[0px_0px_10px_0px_#191919]"
        align="start"
        alignOffset={5}
        forceMount
      >
        <div className="flex flex-col space-y-4 p-2">
          <p className="text-[10px] font-medium leading-none text-muted-foreground">
            {user?.emailAddresses[0].emailAddress}
          </p>
          <div className="flex items-center gap-x-2 ml-2">
            <div className="bg-secondary">
              <Avatar className="h-8 w-8 rounded-sm">
                <AvatarImage src={user?.imageUrl} />
              </Avatar>
            </div>
            <div className="space-y-1">
              <p className="text-sm tex-zinc-700 dark:text-zinc-300 line-clamp-1">
                {user?.fullName}&apos;s Intelli-Note
              </p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-zinc-600" />
        <DropdownMenuItem
          asChild
          className="w-full text-xs font-medium ml-2 cursor-pointer text-muted-foreground"
        >
          <SignOutButton signOutCallback={() => router.push("/")}>
            Log out
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserItem;
