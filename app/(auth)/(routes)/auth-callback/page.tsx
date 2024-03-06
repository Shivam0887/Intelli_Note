"use client";
import { trpc } from "@/trpc/client";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const origin = useSearchParams().get("origin");

  const { data, isError, error } = trpc.authCallback.useQuery(undefined, {
    retry: true,
    retryDelay: 500,
  });

  if (data?.success) {
    router.push((origin === "/" || origin === null) ? "/" : `/${origin}`);
  } else if (isError) {
    if (error.data?.code === "UNAUTHORIZED") {
      router.push("/sign-in");
    }
  }

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
}
