import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function StatusPill({ status }: { status: "draft" | "exported" }) {
  return (
    <Badge className={cn(status === "exported" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-800")}>
      {status === "exported" ? "Exported" : "Draft"}
    </Badge>
  );
}
