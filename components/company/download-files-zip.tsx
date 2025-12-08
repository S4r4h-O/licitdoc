"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function DownloadFilesZip({
  licitacaoId,
}: {
  licitacaoId: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // request file from api route
      const res = await fetch(`/api/licitacoes/${licitacaoId}/download`);

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error);
      }

      // convert res stream to blob
      const blob = await res.blob();

      // create temporary url for blob
      const url = window.URL.createObjectURL(blob);

      // download the file automatically
      const a = document.createElement("a");
      a.href = url;
      a.download = `licitacao-${licitacaoId}.zip`;
      a.click();

      // clean up temporary url
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Erro ao baixar o arquivo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={loading}>
      {loading ? "Baixando..." : "Baixar zip"}
    </Button>
  );
}
