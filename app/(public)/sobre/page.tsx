import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

import { faqs } from "@/lib/contants/faq";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-12 lg:py-24">
      <section className="max-w-3xl mr-auto mb-32 space-y-8">
        <div className="space-y-2">
          <span className="text-blue-500 font-semibold tracking-wide uppercase text-sm">
            Sobre o projeto
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight">
            Motivações
          </h1>
        </div>

        <div className="space-y-6 text-lg sm:text-xl text-gray-600 leading-relaxed text-left">
          <p>
            Mesmo com mais de 4 anos de experiência, às vezes eu me pegava
            perdida no meio de centenas de documentos antigos, mesmo separando
            por ano e mês. Não havia sistema, então recorríamos às planilhas
            manuais ou atualizávamos em uma frequência fixa.
          </p>
          <p>
            Além disso, os requisitos eram marcados em papel (!!), com rasuras
            ou falta de histórico. Hoje não trabalho mais na área, porém, me
            lembrei desse cenário e com minhas habilidades de programação juntei
            o útil ao agradável, surgindo a ideia do site.
          </p>
        </div>

        <div className="w-24 h-1.5 bg-gray-200 rounded-full"></div>
      </section>

      <div className="space-y-32">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex flex-col items-start space-y-6 order-2 lg:order-1 lg:pr-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
              Bagunça nunca mais!
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Preencha os requisitos do processo e gere uma pasta zipada. Os
              requisitos e documentação são salvos para fins de auditoria
              interna e controle de qualidade.
            </p>
            <div className="h-1.5 w-24 bg-blue-500 rounded-full mt-4"></div>
          </div>

          <div className="relative order-1 lg:order-2 w-full max-w-lg mx-auto lg:mr-0">
            <div className="absolute inset-0 bg-blue-100 rounded-2xl transform translate-x-4 translate-y-4 -z-10"></div>
            <div className="relative aspect-[3/4] w-full">
              <Image
                src="/docs-mess.jpg"
                alt="Pilha desorganizada de documentos"
                fill
                className="rounded-2xl object-cover shadow-2xl border border-gray-100"
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative order-1 lg:order-1 w-full max-w-lg mx-auto lg:ml-0">
            <div className="absolute inset-0 bg-blue-100 rounded-2xl transform -translate-x-4 translate-y-4 -z-10"></div>
            <div className="relative aspect-[3/4] w-full">
              <Image
                src="/boss-documents.jpg"
                alt="Chefe entregando documentos"
                fill
                className="rounded-2xl object-cover shadow-2xl border border-gray-100"
              />
            </div>
          </div>

          <div className="flex flex-col items-start space-y-6 order-2 lg:order-2 lg:pl-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
              Controle
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Seu chefe gosta de papel? Sem problema, geramos um pdf do processo
              com todos os requisitos preenchidos e a documentação utilizada.
            </p>
            <div className="h-1.5 w-24 bg-blue-500 rounded-full mt-4"></div>
          </div>
        </section>
      </div>

      <div id="faqs" className="mt-32">
        <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
          Perguntas frequentes
        </p>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem value={`Faq ${index}`} key={faq.question}>
              <AccordionTrigger className="text-2xl">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-xl">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
