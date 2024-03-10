"use client";

import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { useUser } from "@clerk/nextjs";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DocumentsPage = () => {
  const { user } = useUser();
  const router = useRouter();

  const utils = trpc.useUtils();
  const { mutateAsync } = trpc.documents.create.useMutation({
    onSuccess: (data) => {
      utils.invalidate(undefined, {
        queryKey: [["documents", "getSidebar"], { type: "query" }],
      });
      router.push(`/documents/${data?._id}`);
    },
  });

  const onCreate = () => {
    const promise = mutateAsync({ title: "Untitled" });
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        height={300}
        width={300}
        alt="Empty"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        height={300}
        width={300}
        alt="Empty"
        className="hidden dark:block"
      />
      <h2>Welcome to {user?.firstName}&apos;s Intelli-Note</h2>
      <Button aria-label="create note button" onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
};

export default DocumentsPage;
