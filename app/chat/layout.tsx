"use client";

import { useChatStore } from "@/lib/store";
import { Sidebar } from "@/components/chat/sidebar";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useChatStore();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile Toggle Overlay */}
      {/* <div className={cn(
          "fixed inset-0 bg-black/50 z-10 md:hidden",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={() => setSidebarOpen(false)} /> */}

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col h-full w-full">
        {/* Toggle Button for Desktop (when closed) */}
        {!sidebarOpen && (
          <div className="absolute top-4 left-4 z-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="hover:bg-white/10"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
