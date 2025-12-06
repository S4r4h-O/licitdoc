"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { DocumentRequirement, DocumentStatus } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { createDocumentFile } from "@/lib/actions/document-file.actions";
import { uploadFileToS3 } from "@/lib/actions/s3.actions";
import { DocumentFileFormSchema } from "@/lib/validators";
import UploadFile from "../upload-file";

export default function DocumentFileForm({
  requirement,
}: {
  requirement: DocumentRequirement;
}) {
  const [file, setFile] = useState<File | null>(null);

  const { VALIDO, INVALIDO } = DocumentStatus;

  const form = useForm<z.infer<typeof DocumentFileFormSchema>>({
    resolver: zodResolver(DocumentFileFormSchema),
    defaultValues: {
      status: VALIDO,
      issuingAuthority: "",
      documentNumber: "",
      issueDate: undefined,
      expirationDate: undefined,
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.output<typeof DocumentFileFormSchema>) {
    if (!file) {
      toast.error("Nenhum arquivo selecionado");
      return;
    }

    try {
      /* Server actions allow only serializable data (JSON),
       * so we need to convert the buffer to base64
       */
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const { key, fileUrl } = await uploadFileToS3(base64, file.name);

      const res = await createDocumentFile(
        {
          ...data,
          fileUrl,
          fileSize: file.size,
          fileName: file.name,
        },
        requirement,
      );

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      form.reset();
      setFile(null);
      router.refresh();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erro ao enviar arquivo");
    }
  }

  const formName = "document-file-form";

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-6">Adicionar arquivo</h1>
      <form
        id={formName}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <Controller
              name="issuingAuthority"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className="space-y-1.5"
                  aria-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor={`${formName}-issuingAuthority`}>
                    Órgão Expedidor
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Ex: Caixa Econômica Federal"
                    autoComplete="off"
                    type="text"
                    className="bg-background"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            name="documentNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="space-y-1.5" aria-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${formName}-documentNumber`}>
                  Número do documento
                </FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="123456/2026"
                  autoComplete="off"
                  type="text"
                  className="bg-background"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="status"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="space-y-1.5" aria-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${formName}-status`}>
                  Status do documento
                </FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={VALIDO}>Válido</SelectItem>
                      <SelectItem value={INVALIDO}>Inválido</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="issueDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="space-y-1.5" aria-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${formName}-issueDate`}>
                  Data de expedição
                </FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background",
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
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="expirationDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="space-y-1.5" aria-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${formName}-expirationDate`}>
                  Data de vencimento
                </FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background",
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
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="col-span-1 md:col-span-2 pt-2">
            <UploadFile
              form={form}
              fieldName="fileUrl"
              onUpload={(uploadedFile) => setFile(uploadedFile)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" type="button" onClick={() => form.reset()}>
            Limpar
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="min-w-[120px]"
          >
            {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
