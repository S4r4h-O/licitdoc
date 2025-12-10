import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface DocumentsCardProps {
  docInfo: number;
  title: string;
  description?: string;
}

export default function DocumentsCard({
  docInfo,
  title,
  description,
}: DocumentsCardProps) {
  return (
    <Card className="w-full md:max-w-xs shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-2xl font-bold">{docInfo}</div>
        <p className="text-xs text-muted-foreground mt-1 truncate">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
