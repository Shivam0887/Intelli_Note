"use client";

import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import UserItem from "./user-item";
import { trpc } from "@/trpc/client";
import Item from "./item";
import { toast } from "sonner";
import DocumentList from "./documentList";

const Navigation = () => {
  const pathName = usePathname();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);

  const [isResetting, setIsResetting] = useState(false);
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

  const onCreate = () => {
    const promise = mutateAsync({ title: "Untitled" });
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isResizingRef.current) return;

    const newWidth = Math.min(Math.max(e.clientX, 240), 480);

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
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
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0px" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0px";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0px");

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
          <Item label="Search" icon={Search} isSearch onClick={() => {}} />
          <Item label="Settings" icon={Settings} onClick={() => {}} />
          <Item onClick={() => onCreate()} label="New page" icon={PlusCircle} />
        </div>

        <div className="mt-4">
          <DocumentList />
          <Item
           onClick={onCreate}
           label="Add a page"
           icon={Plus}
          />
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
        <nav className="bg-transparent p-3 w-full">
          {isCollapsed && (
            <MenuIcon onClick={resetWidth} role="button" className="h-6 w-6" />
          )}
        </nav>
      </div>
    </>
  );
};

export default Navigation;
