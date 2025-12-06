import { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import CompanySidebar from "@/components/company/company-sidebar";

export default function CompanyLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <CompanySidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>

        <main className="flex flex-1 flex-col p-6 w-full h-full">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
