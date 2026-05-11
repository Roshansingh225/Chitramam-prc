import { AppShell } from "@/components/app-shell";
import { UploadPanel } from "@/components/prc/upload-panel";

export default function UploadPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-sail-ink">Upload PRC Data</h1>
          <p className="mt-1 text-sm text-sail-steel">Excel price sheet with optional previous PRC reference</p>
        </div>
        <UploadPanel />
      </div>
    </AppShell>
  );
}
