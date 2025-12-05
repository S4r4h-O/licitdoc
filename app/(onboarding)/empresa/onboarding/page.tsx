import CreateCompanyForm from "@/components/company/create-company-form";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Building2 } from "lucide-react";
import { getUserByClerkId } from "@/lib/actions";

export default async function OnboardingPage() {
  const { userId } = await auth();
  console.log(userId);

  if (!userId) throw new Error("User not found or unauthenticated");

  const user = await getUserByClerkId(userId);

  if (user?.companyId) redirect("/empresa/dashboard");

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-950">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 mb-4 border border-blue-500/20">
            <Building2 size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Vamos registrar sua empresa
          </h1>
          <p className="text-lg text-gray-400 max-w-lg mx-auto">
            Preencha os dados abaixo para configurar seu ambiente de gestão de
            licitações.
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-10">
            <CreateCompanyForm />
          </div>
        </div>
      </div>
    </div>
  );
}
