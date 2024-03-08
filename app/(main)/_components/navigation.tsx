"use client";

import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { toast } from "sonner";

import Item from "./item";
import UserItem from "./user-item";
import Trashbox from "./trash-box";
import DocumentList from "./documentList";

import { trpc } from "@/trpc/client";
import { useMediaQuery } from "usehooks-ts";

import { useParams, usePathname } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";

import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { Navbar } from "./navbar";

const Navigation = () => {
  const { onOpen } = useSearch();
  const { onOpen: openSettings } = useSettings();

  const pathName = usePathname();
  const params = useParams();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const isResizingRef = useRef(false); // Is sidebar resizing?
  const sidebarRef = useRef<ElementRef<"aside">>(null); // Controlling the sidebar - e.g. width
  const navbarRef = useRef<ElementRef<"div">>(null); // Controlling the sidebar after collapsing

  const [isResetting, setIsResetting] = useState(false); // resetting the width of the sidebar to its original width
  const [isCollapsed, setIsCollapsed] = useState(false);

  const utils = trpc.useUtils();
  const { mutateAsync } = trpc.documents.create.useMutation({
    onSettled: () => {
      utils.invalidate(undefined, {
        queryKey: [["documents", "getSidebar"], { type: "query" }],
      });
    },
  });

  useEffect(() => {
    setIsCollapsed(isMobile);

    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile, pathName]);

  // Invoked on document creation
  const onCreate = () => {
    const promise = mutateAsync({ title: "Untitled" });
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  // On pointer move - resizing the width of the sidebar
  const handlePointerMove = (e: PointerEvent) => {
    if (!isResizingRef.current) return;

    const newWidth = Math.min(Math.max(e.clientX, 240), 480);

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`; // Calculating the new width of the sidebar
      navbarRef.current.style.setProperty("left", `${newWidth}px`); // changing the position of the hamburger icon in accordance with the sidebar width
      navbarRef.current.style.width = `calc(100% - ${newWidth}px)`;
    }
  };

  const handlePointerUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      navbarRef.current.style.width = isMobile ? "0px" : "calc(100% - 240px)";

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0px";
      navbarRef.current.style.setProperty("left", "0px");
      navbarRef.current.style.width = "100%";

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full w-60 bg-secondary overflow-y-auto relative z-[99999] flex flex-col border-r border-zinc-300 dark:border-zinc-700",
          {
            "transition-all ease-in-out duration-300": isResetting,
            "w-0": isMobile,
          }
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "absolute text-muted-foreground right-4 top-2.5 hover:bg-neutral-300 dark:hover:bg-neutral-600 opacity-0 group-hover/sidebar:opacity-100 transition rounded-sm cursor-pointer",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6" strokeWidth={1.5} />
        </div>

        <div>
          <UserItem />
          <Item label="Search" icon={Search} isSearch onClick={onOpen} />
          <Item label="Settings" icon={Settings} onClick={openSettings} />
          <Item onClick={() => onCreate()} label="New page" icon={PlusCircle} />
        </div>

        <div className="mt-4">
          <DocumentList />
          <Item onClick={onCreate} label="Add a page" icon={Plus} />

          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              side={isMobile ? "bottom" : "right"}
              className="p-1 w-72 dark:bg-neutral-900"
            >
              <Trashbox />
            </PopoverContent>
          </Popover>
        </div>

        <div
          onPointerDown={handlePointerDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-col-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>

      <div
        ref={navbarRef}
        className={cn("absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]", {
          "transition-all ease-in-out": isResetting,
          "left-0 w-full": isMobile,
        })}
      >
        {!!params.documentId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          <nav className="bg-transparent p-3 w-full">
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                role="button"
                className="h-5 w-5 md:h-6 md:w-6"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};

export default Navigation;
