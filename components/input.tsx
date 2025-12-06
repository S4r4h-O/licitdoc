"use client";

import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { IMaskInput } from "react-imask";

interface FormInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  fieldName: Path<T>;
  label: string;
  formName: string;
  placeholder?: string;
  type?: string;
  mask?: string;
  input?: "input" | "textarea";
}

export default function FormInput<T extends FieldValues>({
  form,
  fieldName,
  label,
  formName,
  placeholder,
  type,
  input = "input",
  mask,
}: FormInputProps<T>) {
  return (
    <>
      <Controller
        name={fieldName}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>{label}</FieldLabel>
            {mask ? (
              <IMaskInput
                {...field}
                mask={mask}
                id={`${formName}-${fieldName}`}
                placeholder={placeholder}
                autoComplete="off"
                lazy={false}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md"
                onAccept={(value) => field.onChange(value)}
              />
            ) : input === "input" ? (
              <Input
                {...field}
                id={`${formName}-${fieldName}`}
                placeholder={placeholder}
                autoComplete="off"
                type={type}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            ) : (
              <Textarea
                {...field}
                id={`${formName}-${fieldName}`}
                placeholder={placeholder}
                autoComplete="off"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            )}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  );
}
