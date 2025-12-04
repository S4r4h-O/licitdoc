import ContactUsForm from "@/components/contact/contact-us-form";
import { MailOpen, MessageCircleQuestion, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-6 py-12 lg:py-24 min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 w-full max-w-6xl items-start">
        <div className="flex flex-col space-y-8 lg:pt-8">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 mb-2">
              <MailOpen size={24} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Fale com a gente
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed max-w-md">
              Tem alguma dúvida sobre o LicitDoc, precisa de suporte técnico ou
              quer sugerir uma melhoria? Preencha o formulário ao lado.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 space-y-4">
            <div className="flex items-start gap-4">
              <MessageCircleQuestion className="text-blue-500 mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold text-white">
                  Dúvidas Frequentes?
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Antes de enviar uma mensagem, verifique se sua dúvida já foi
                  respondida em nossa central de ajuda.
                </p>
                <Link
                  href="/sobre#faqs"
                  className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 mt-3 transition-colors"
                >
                  Ir para o FAQ <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Email Direto
            </p>
            <p className="text-white font-medium">suporte@licitdoc.com.br</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-10"></div>

          <div className="relative bg-gray-950 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl">
            <ContactUsForm />
          </div>
        </div>
      </div>
    </div>
  );
}
