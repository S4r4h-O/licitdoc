import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="container mx-auto min-h-[calc(100vh-80px)] flex items-center justify-center p-6 md:p-12 lg:p-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="flex flex-col items-start justify-center space-y-6 lg:space-y-8 order-2 lg:order-1">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
            Organize e produza mais
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">
            Perde muito tempo procurando por documentação em pastas e acaba
            esquecendo de outras etapas do processo? Então aqui é para você!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              asChild
              className="bg-[#3498DB] hover:bg-[#2980b9] text-lg py-6 px-8 rounded-full w-full sm:w-auto transition-all"
            >
              <Link href="/sobre">Saiba mais</Link>
            </Button>

            <Button
              asChild
              className="bg-[#3498DB] hover:bg-[#2980b9] text-lg py-6 px-8 rounded-full w-full sm:w-auto transition-all"
            >
              <Link href="/criar-conta">Começar</Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center w-full order-1 lg:order-2">
          <Image
            src="/hero-banner.jpg"
            alt="People Collaborating"
            width={700}
            height={700}
            className="rounded-xl w-full h-auto object-cover shadow-lg"
            priority
          />
        </div>
      </div>
    </section>
  );
}
