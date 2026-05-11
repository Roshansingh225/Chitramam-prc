import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  icon: Icon,
  tone = "blue"
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "blue" | "green" | "amber" | "red";
}) {
  const tones = {
    blue: "bg-sail-blue/10 text-sail-blue",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-700"
  };
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={`grid h-11 w-11 place-items-center rounded-md ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-sail-steel">{label}</div>
          <div className="mt-1 text-xl font-semibold text-sail-ink">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
