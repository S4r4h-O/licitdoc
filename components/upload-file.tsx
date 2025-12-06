"use client";
import { FileUp, X, FileText } from "lucide-react";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface UploadFileProps<T extends FieldValues> {
  form: UseFormReturn;
  fieldName: Path<T>;
  onUpload: (file: File) => void;
}

export default function UploadFile<T extends FieldValues>({
  form,
  fieldName,
  onUpload,
}: UploadFileProps<T>) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const uploadedFile = e.target?.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      onUpload(uploadedFile);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      onUpload(uploadedFile);
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleRemove() {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="w-full space-y-2">
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragEnter={handleDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed 
            p-10 text-center transition-all duration-200 ease-in-out cursor-pointer
            ${
              isDragging
                ? "border-blue-500 bg-blue-500/5 ring-4 ring-blue-500/10"
                : "border-muted-foreground/25 bg-muted/5 hover:bg-muted/10 hover:border-muted-foreground/50"
            }
          `}
        >
          <Controller
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <Input
                {...field}
                value={undefined}
                type="file"
                onChange={(e) => {
                  field.onChange(e);
                  handleFileChange(e);
                }}
                ref={(e) => {
                  field.ref(e);
                  inputRef.current = e;
                }}
                accept="application/pdf"
                className="hidden"
              />
            )}
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background border shadow-sm mb-4">
            <FileUp className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              <span className="text-blue-600">Clique para enviar</span> ou
              arraste aqui
            </p>
            <p className="text-xs text-muted-foreground">PDF (máx. 10MB)</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full rounded-lg border bg-muted/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-background border">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
