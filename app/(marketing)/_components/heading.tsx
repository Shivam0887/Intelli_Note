"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Heading = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Ideas, Documents, & Plans, Unified. Welcome to{" "}
        <span className="underline">Intelli-Note</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        A workspace where better, faster work happens.
      </h3>
      {isMounted && (
        <>
          <SignedIn>
            <Button>
              <div className="flex items-center">
                <Link href="/documents">Enter Intelli-Note</Link>
                <ArrowRight className="h-4 w-4 ml-2" />
              </div>
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button>
                Get Intelli-Note free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </SignInButton>
          </SignedOut>
        </>
      )}
    </div>
  );
};

export default Heading;
