import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatError(error: any) {
  if (error instanceof ZodError || Array.isArray(error?.errors)) {
    const fieldErrors = (error.errors || []).map(
      (err: any) =>
        `${err.path?.join?.(".") ?? "unknown"}: ${err.message ?? "Invalid value"}`,
    );
    return fieldErrors.join(". ");
  }

  if (
    error?.name === "PrismaClientKnownRequestError" &&
    error?.code === "P2002"
  ) {
    const field = error.meta?.target?.[0] ?? "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  return typeof error?.message === "string" ? error.message : "Unknown error";
}
