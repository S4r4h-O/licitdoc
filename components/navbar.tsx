import { Menu } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

interface MenuItem {
  title: string;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    title: "Contato",
    href: "/contato",
  },
  {
    title: "Sobre",
    href: "/sobre",
  },
];

export default async function Navbar() {
  const { userId } = await auth();

  return (
    <nav className="bg-[#2C3E50] sticky w-full z-20 top-0 start-0 border-b border-accent">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <span className="uppercase font-bold text-white text-4xl">
              LICITDOC
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="text-white hover:text-white/80 transition-colors font-medium"
              >
                {item.title}
              </Link>
            ))}
            {userId ? (
              <>
                <UserButton />
                <SignedIn />
                <SignedOut />
              </>
            ) : (
              <>
                <SignInButton />
                <SignUpButton />
              </>
            )}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-white p-2">
                  <Menu className="h-6 w-6" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {menuItems.map((item) => (
                  <DropdownMenuItem key={item.title} asChild>
                    <Link href={item.href} className="w-full">
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
