"use client";

import { ContactUsSchema } from "@/lib/validators/contact-us.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type FormData = z.infer<typeof ContactUsSchema>;

export default function ContactUsForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(ContactUsSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(data: FormData) {
    console.log();
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Fale conosco</CardTitle>
        <CardDescription>
          Ficou com alguma dúvida ou precisa falar conosco?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="contact-us-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Nome</FieldLabel>
                  <Input
                    {...field}
                    id="contact-us-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Fulano da Silva"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    id="contact-us-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="fulano@email.com"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="message"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Mensagem</FieldLabel>
                  <Textarea
                    {...field}
                    id="contact-us-name"
                    aria-invalid={fieldState.invalid}
                    placeholder=""
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Apagar
          </Button>
          <Button type="submit" form="contact-us-form">
            Enviar
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
