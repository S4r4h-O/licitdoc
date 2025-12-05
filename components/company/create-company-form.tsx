"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { FieldGroup } from "../ui/field";

import { createCompany } from "@/lib/actions/company.action";
import { createCompanyDefaultValues } from "@/lib/contants/defaultValues";
import { CompanySchemaInsert } from "@/lib/validators";
import FormInput from "../input";

type FormData = z.infer<typeof CompanySchemaInsert>;

export default function CreateCompanyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(CompanySchemaInsert),
    defaultValues: createCompanyDefaultValues,
  });

  const router = useRouter();

  async function onSubmit(data: FormData) {
    console.log("Attempting to create company");
    console.log(data);

    const res = await createCompany(data);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    router.push("/empresa/dashboard");
  }

  const formName = "create-company-form";

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-6xl mx-auto space-y-12"
    >
      <FieldGroup>
        <div className="space-y-6">
          <div className="border-l-4 border-[#3498DB] pl-4">
            <h2 className="text-2xl font-bold text-[#2C3E50]">Dados básicos</h2>
            <p className="text-sm text-gray-500 mt-1">
              Informações principais da empresa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              form={form}
              fieldName="razaoSocial"
              label="Razão Social*"
              formName={formName}
              placeholder="Empresa Empresãria LTDA"
              input="input"
            />
            <FormInput
              form={form}
              fieldName="nomeFantasia"
              label="Nome Fantasia*"
              formName={formName}
              placeholder="Nome comercial"
              input="input"
            />
            <FormInput
              form={form}
              fieldName="email"
              label="Email institucional*"
              formName={formName}
              placeholder="empresa@empresa.com"
              input="input"
            />
            <FormInput
              form={form}
              fieldName="cnpj"
              label="CNPJ*"
              formName={formName}
              placeholder="00.000.000/0001-00"
              mask="00.000.000/0000-00"
            />
            <FormInput
              form={form}
              fieldName="phone"
              label="Telefone*"
              formName={formName}
              placeholder="11 4002-8922"
              mask="00 0000-0000"
            />
          </div>
        </div>
      </FieldGroup>

      <FieldGroup>
        <div className="space-y-6">
          <div className="border-l-4 border-[#3498DB] pl-4">
            <h2 className="text-2xl font-bold text-[#2C3E50]">Endereço</h2>
            <p className="text-sm text-gray-500 mt-1">
              Localização da sede da empresa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              form={form}
              fieldName="addressStreet"
              label="Rua*"
              formName={formName}
              placeholder="Rua das Ruas"
              input="input"
            />
            <FormInput
              form={form}
              fieldName="addressState"
              label="Estado*"
              formName={formName}
              placeholder="BA"
              input="input"
            />
            <FormInput
              form={form}
              fieldName="addressCity"
              label="Cidade*"
              formName={formName}
              placeholder="Xique Xique"
              input="input"
            />
            <FormInput
              form={form}
              fieldName="addressCountry"
              label="País*"
              formName={formName}
              placeholder=""
              input="input"
            />
            <FormInput
              form={form}
              fieldName="addressComplement"
              label="Complemento"
              formName={formName}
              placeholder=""
              input="input"
            />
            <FormInput
              form={form}
              fieldName="addressZip"
              label="CEP*"
              formName={formName}
              placeholder="000000-00"
              input="input"
              mask="000000-00"
            />
          </div>
        </div>
      </FieldGroup>

      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button
          type="button"
          className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="px-6 py-2.5 text-white bg-[#3498DB] hover:bg-[#2980B9] rounded-lg font-medium transition-colors shadow-lg shadow-[#3498DB]/20"
        >
          {form.formState.isSubmitting ? "Criando..." : "Criar empresa"}
        </Button>
      </div>
    </form>
  );
}
