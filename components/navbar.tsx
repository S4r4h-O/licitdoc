import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
                <button className="text-white p-2 outline-none">
                  <Menu className="h-6 w-6" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 bg-gray-950 border-gray-800 text-white"
              >
                {menuItems.map((item) => (
                  <DropdownMenuItem
                    key={item.title}
                    asChild
                    className="focus:bg-gray-800 focus:text-white cursor-pointer"
                  >
                    <Link href={item.href} className="w-full">
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator className="bg-gray-800" />

                <SignedIn>
                  <div className="flex items-center justify-between px-2 py-2">
                    <span className="text-sm font-medium pl-2">Sua Conta</span>
                    <UserButton />
                  </div>
                </SignedIn>

                <SignedOut>
                  <DropdownMenuItem
                    asChild
                    className="focus:bg-gray-800 focus:text-white"
                  >
                    <SignInButton mode="modal">
                      <Button className="w-full text-left cursor-pointer">
                        Entrar
                      </Button>
                    </SignInButton>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    asChild
                    className="focus:bg-gray-800 focus:text-white"
                  >
                    <SignUpButton mode="modal">
                      <Button className="w-full text-left cursor-pointer">
                        Cadastrar
                      </Button>
                    </SignUpButton>
                  </DropdownMenuItem>
                </SignedOut>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
