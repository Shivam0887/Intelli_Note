"use client";

import Editor from "@/components/editor";
import Toolbar from "@/components/toolbar";
import { Button } from "@/components/ui/button";
import { UploadCoverImage } from "@/components/upload-cover-image";
import useDocUpdate from "@/hooks/use-docUpdate";
import useThrottle from "@/hooks/use-throttle";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { notFound, usePathname, useRouter } from "next/navigation";

type DocumentIdPageProps = {
  params: {
    documentId: string;
  };
};

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  const pathname = usePathname();
  const router = useRouter();
  const { documentId } = params;
  const {
    data: document,
    isError,
    error,
  } = trpc.documents.getById.useQuery({ documentId });
  const [progress, setProgress] = useState(0);
  const { updateDocument } = useDocUpdate(documentId);
  const throttleContent = useThrottle(updateDocument());

  if (isError) {
    toast.error(error.message);
    setTimeout(() => router.push("/documents"), 0);
  }

  if (document === undefined) {
    return (
      <>
        <Toolbar.Skeleton />
      </>
    );
  }

  if (!document.isPublished && pathname.includes("preview")) {
    notFound();
  }

  const onChange = (content: string) => {
    throttleContent({ _id: documentId!, content });
  };

  return (
    <div
      className={cn(
        "mt-[48px]",
        document.isPublished && pathname.includes("preview") && "mt-0"
      )}
    >
      <div
        className={cn(
          "h-56 relative group/coverImage mb-4",
          !document.coverImage && "h-32"
        )}
      >
        {document.coverImage && (
          <>
            <Image
              src={document.coverImage}
              alt="cover image"
              priority
              fill
              quality={100}
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <div className="absolute right-[20%] top-5 opacity-0 group-hover/coverImage:opacity-100 transition">
              {!document.isPublished && (
                <UploadCoverImage
                  setProgress={setProgress}
                  documentId={document._id}
                >
                  <Button variant="secondary" size="sm" className="text-xs">
                    Change cover
                  </Button>
                </UploadCoverImage>
              )}
            </div>
          </>
        )}
        {progress > 0 && progress < 100 && (
          <div className="absolute bottom-2 right-2 flex gap-x-2 items-center">
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
            <p>{progress}</p>
          </div>
        )}
      </div>
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar preview initialData={document} setProgress={setProgress} />
        <Editor
          editable={false}
          onChange={onChange}
          initialContent={document.content}
        />
      </div>
    </div>
  );
};

export default DocumentIdPage;
