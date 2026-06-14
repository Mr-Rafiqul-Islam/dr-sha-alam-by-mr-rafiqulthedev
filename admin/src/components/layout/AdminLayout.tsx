import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { PageLoadingFallback } from "../common";
import { SidebarProvider, useSidebar } from "../../contexts/SidebarContext";
import { cn } from "../../lib/cn";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

function LayoutContent() {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen flex bg-background text-on-surface">
      <Sidebar />
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-[margin] duration-300 ml-0",
          isCollapsed ? "lg:ml-sidebar-collapsed" : "lg:ml-sidebar-expanded",
        )}
      >
        <TopBar />
        <main className="flex-1 p-4 md:p-6 lg:p-margin-desktop">
          <div className="max-w-container-max mx-auto w-full min-w-0">
            <Suspense fallback={<PageLoadingFallback />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

export function AdminLayout() {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
}
