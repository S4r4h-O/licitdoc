import {
  BookOpen,
  Handshake,
  Landmark,
  LayoutDashboard,
  LucideIcon,
  Settings,
} from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { FilePlus } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export default function CompanySidebar() {
  const items = [
    { title: "Dashboard", href: "/empresa/dashboard", icon: LayoutDashboard },
    { title: "Órgãos", href: "/empresa/orgaos", icon: Landmark },
    { title: "Requisitos", href: "/empresa/requisitos", icon: FilePlus },
    { title: "Licitações", href: "/empresa/licitacoes", icon: Handshake },
    { title: "Configurações", href: "/empresa/configuracoes", icon: Settings },
  ];

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-4">
            Gerenciar
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size="default"
                    className="h-10 hover:bg-accent hover:text-accent-foreground transition-all rounded-md"
                  >
                    <Link
                      href={item.href}
                      className="flex items-center justify-start gap-3 px-3"
                    >
                      <item.icon className="h-4 w-4 opacity-70" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-3 p-4 border-t border-border/50 bg-sidebar-accent/5">
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          </SignedOut>

          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none text-sidebar-foreground">
              Sua conta
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">
              Gerenciar perfil
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
