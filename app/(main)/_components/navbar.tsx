"use client";

import { useParams } from "next/navigation";
import { MenuIcon } from "lucide-react";

import Title from "./title";
import Banner from "./banner";
import Menu from "./menu";
import Publish from "./publish";
import { trpc } from "@/trpc/client";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams();

  const { data: document } = trpc.documents.getById.useQuery({
    documentId: params.documentId as string,
  });

  if (document === undefined) {
    return (
      <nav className="bg-background dark:bg-[#191919] px-3 py-2 w-full flex items-center justify-between">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-background dark:bg-[#191919] px-3 py-1 w-full flex items-center gap-x-2">
        {isCollapsed && (
          <span>
            <MenuIcon
              role="button"
              onClick={onResetWidth}
              className="h-5 w-5 md:h-6 md:w-6 text-primary"
            />
          </span>
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={document} />
          <div className="flex items-center gap-x-2">
            <Publish initialData={document} />
            <Menu documentId={document._id} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  );
};
