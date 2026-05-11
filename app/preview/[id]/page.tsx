import { AppShell } from "@/components/app-shell";
import { PrcPreviewClient } from "@/components/prc/prc-preview-client";

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AppShell>
      <PrcPreviewClient id={id} />
    </AppShell>
  );
}
