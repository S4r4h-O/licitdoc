"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContractingAuthority, Licitacao } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { LicitacaoFormSchema } from "@/lib/validators";
import FormInput from "../input";

type LicitacaoWithContractor = Licitacao & {
  contractor: ContractingAuthority;
};

export default function LicitacaoUpdateForm({
  authorities,
  licitacao,
}: {
  authorities: ContractingAuthority[];
  licitacao: LicitacaoWithContractor;
}) {
  const form = useForm<z.infer<typeof LicitacaoFormSchema>>({
    resolver: zodResolver(LicitacaoFormSchema),
    defaultValues: {
      licitacaoNumber: licitacao.licitacaoNumber ?? "",
      processNumber: licitacao.processNumber ?? "",
      contractor: licitacao.contractorId,
      openingDate: licitacao.openingDate ?? undefined,
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.output<typeof LicitacaoFormSchema>) {
    console.log(data);
  }

  const formName = "licitacao-create-form";

  return (
    <div className="max-w-2xl w-full p-6">
      <form
        id={formName}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            form={form}
            formName={formName}
            fieldName="licitacaoNumber"
            label="Número da licitação"
          />

          <FormInput
            form={form}
            formName={formName}
            fieldName="processNumber"
            label="Número do processo"
          />

          <Controller
            control={form.control}
            name="openingDate"
            render={({ field, fieldState }) => (
              <Field className="flex flex-col space-y-1.5">
                <FieldLabel>Data de abertura</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background border-input",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value
                        ? format(field.value, "dd/MM/yyy", { locale: ptBR })
                        : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="space-y-1.5 md:col-span-2">
            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Órgão contratante
            </span>
            <Controller
              name="contractor"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Selecione o órgão responsável..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {authorities.map((authority) => (
                          <SelectItem value={authority.id} key={authority.id}>
                            {authority.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <span className="text-xs font-medium text-destructive mt-1 block">
                      {fieldState.error?.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="min-w-[120px]"
          >
            {form.formState.isSubmitting ? "Salvando..." : "Salvar Licitação"}
          </Button>
        </div>
      </form>
    </div>
  );
}
