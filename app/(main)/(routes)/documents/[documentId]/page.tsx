"use client";

import Toolbar from "@/components/toolbar";
import { Button } from "@/components/ui/button";
import { UploadCoverImage } from "@/components/upload-cover-image";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type DocumentIdPageProps = {
  params: {
    documentId: string;
  };
};

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const { documentId } = params;
  const document = trpc.documents.getById.useQuery({ documentId }).data;
  const [progress, setProgress] = useState(0);

  if (document === undefined) {
    return (
      <>
        <Toolbar.Skeleton />
      </>
    );
  }

  return (
    <div className="mt-[48px]">
      <div
        className={cn(
          "h-56 relative group/coverImage",
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
              <UploadCoverImage
                setProgress={setProgress}
                documentId={document._id}
              >
                <Button variant="secondary" size="sm" className="text-xs">
                  Change cover
                </Button>
              </UploadCoverImage>
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
        <Toolbar initialData={document} setProgress={setProgress} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
