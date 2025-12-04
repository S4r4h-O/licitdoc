"use client";

import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface FormInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  fieldName: Path<T>;
  label: string;
  formName: string;
  placeholder?: string;
  type?: string;
  input: "input" | "textarea";
}

export default function FormInput<T extends FieldValues>({
  form,
  fieldName,
  label,
  formName,
  placeholder,
  type,
  input = "input",
}: FormInputProps<T>) {
  return (
    <>
      <Controller
        name={fieldName}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>{label}</FieldLabel>
            {input === "input" ? (
              <Input
                {...field}
                id={`${formName}-${fieldName}`}
                placeholder={placeholder}
                autoComplete="off"
                type={type}
              />
            ) : (
              <Textarea
                {...field}
                id={`${formName}-${fieldName}`}
                placeholder={placeholder}
                autoComplete="off"
              />
            )}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  );
}
