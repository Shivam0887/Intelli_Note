"use client";

import Toolbar from "@/components/toolbar";
import { trpc } from "@/trpc/client";

type DocumentIdPageProps = {
  params: {
    documentId: string;
  };
};

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const { documentId } = params;
  const document = trpc.documents.getById.useQuery({ documentId }).data;

  if (document === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <div className="pb-[52px]">
      <div className="h-52"></div>
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
