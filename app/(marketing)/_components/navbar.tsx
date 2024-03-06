"use client";

import useScrollTop from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import Logo from "./logo";
import { ModeToggle } from "@/components/toggle-theme";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const isScrolled = useScrollTop();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      className={cn(
        "z-50 bg-background fixed top-0 flex items-center w-full p-6 dark:bg-[#1f1f1f]",
        isScrolled && "border-b shadow-sm"
      )}
    >
      <Logo className="text-xl w-8 h-8" />

      {isMounted && (
        <div className="flex ml-auto md:justify-end justify-between items-center gap-x-2">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size="sm">Get Intelli-Note free</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/documents">Enter Intelli-Note</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <ModeToggle />
        </div>
      )}
    </div>
  );
};

export default Navbar;
