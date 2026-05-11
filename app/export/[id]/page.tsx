import { AppShell } from "@/components/app-shell";
import { ExportClient } from "@/components/prc/export-client";

export default async function ExportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AppShell>
      <ExportClient id={id} />
    </AppShell>
  );
}
