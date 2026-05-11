"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileCheck2, FileText, Loader2, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";
import { uploadPrc } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

function FileBox({
  label,
  file,
  accept,
  onChange
}: {
  label: string;
  file?: File;
  accept: string;
  onChange: (file?: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onChange(event.dataTransfer.files[0]);
      }}
      className="flex min-h-44 w-full flex-col items-center justify-center rounded-lg border border-dashed border-sail-blue/45 bg-sail-mist/70 p-5 text-center transition hover:border-sail-blue hover:bg-white"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => onChange(event.target.files?.[0])}
      />
      <div className="grid h-12 w-12 place-items-center rounded-md bg-white text-sail-blue shadow-sm">
        {file ? <FileCheck2 className="h-6 w-6" /> : <UploadCloud className="h-6 w-6" />}
      </div>
      <div className="mt-3 text-sm font-semibold text-sail-ink">{label}</div>
      <div className="mt-2 max-w-full truncate text-xs text-sail-steel">{file ? file.name : accept}</div>
    </button>
  );
}

export function UploadPanel() {
  const router = useRouter();
  const [excel, setExcel] = useState<File>();
  const [reference, setReference] = useState<File>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!excel) {
      setError("Excel price sheet required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const record = await uploadPrc(excel, reference);
      router.push(`/preview/${record.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Card className="shadow-panel">
        <CardHeader>
          <CardTitle>Upload PRC Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Excel price sheet</Label>
              <div className="mt-2">
                <FileBox label="Excel Price Sheet" file={excel} accept=".xlsx,.xls" onChange={setExcel} />
              </div>
            </div>
            <div>
              <Label>Reference PRC DOCX</Label>
              <div className="mt-2">
                <FileBox label="Previous PRC Reference" file={reference} accept=".docx" onChange={setReference} />
              </div>
            </div>
          </div>
          {error ? <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => router.push("/dashboard")}>
              <FileText className="h-4 w-4" />
              Dashboard
            </Button>
            <Button type="button" onClick={submit} disabled={!excel || loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              Generate PRC
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
