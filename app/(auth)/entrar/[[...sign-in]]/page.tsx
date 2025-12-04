import { Button } from "@/components/ui/button";
import { SignIn } from "@clerk/nextjs";
import { Sparkles, UserPlus } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="relative w-full min-h-screen flex flex-col lg:grid lg:grid-cols-2 overflow-hidden p-2">
      {/* Left Side - Sign In */}
      <div className="relative flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white min-h-[60vh] lg:min-h-screen">
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#3498DB] to-[#2C3E50] rounded-lg"></div>
        </div>
        <div className="w-full max-w-md">
          <SignIn />
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-[#2C3E50] via-[#34495E] to-[#2C3E50] text-white overflow-hidden min-h-[40vh] lg:min-h-screen">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-[#3498DB] rounded-full opacity-10 -top-10 -right-10 sm:-top-20 sm:-right-20 blur-3xl animate-pulse"></div>
          <div
            className="absolute w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-[#3498DB] rounded-full opacity-10 -bottom-10 -left-10 sm:-bottom-20 sm:-left-20 blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative z-10 w-full max-w-lg space-y-6 sm:space-y-8 text-center">
          <div className="space-y-3 sm:space-y-4">
            <div className="inline-block p-3 sm:p-4 bg-[#3498DB] bg-opacity-20 rounded-2xl backdrop-blur-sm">
              <UserPlus className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-[#3498DB]" />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight px-4">
              Novo por aqui?
            </h1>

            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-300 leading-relaxed px-4">
              Crie sua conta agora mesmo e comece a usar nossa plataforma
            </p>
          </div>

          <div className="space-y-4 px-4">
            <Button
              size="lg"
              className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-[#3498DB] hover:bg-[#2980B9] text-white shadow-xl shadow-[#3498DB]/20 transition-all duration-300 hover:scale-105"
            >
              <Link
                href="/criar-conta"
                className="w-full flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Criar conta
              </Link>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#3498DB] to-transparent opacity-50"></div>
      </div>
    </div>
  );
}
