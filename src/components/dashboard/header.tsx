
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-[var(--custom-topbar-bg)] px-4 print:hidden lg:h-[60px] lg:px-6">
      <SidebarTrigger className="flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-accent" />
      <nav aria-label="breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm">
          <li>
            <a href="#" className="font-medium text-foreground hover:underline">
              Dashboard
            </a>
          </li>
        </ol>
      </nav>
      <div className="ml-auto">{/* Future elements can go here */}</div>
    </header>
  );
}
