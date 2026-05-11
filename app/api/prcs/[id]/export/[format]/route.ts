import { NextRequest, NextResponse } from "next/server";
import { buildDocx } from "@/server/services/document-generator";
import { buildPdf } from "@/server/services/pdf-generator";
import { getRecord, saveExportFile, saveRecord } from "@/server/services/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string; format: string }> }) {
  const { id, format } = await params;
  const record = await getRecord(id);
  if (!record) return NextResponse.json({ error: "PRC record not found" }, { status: 404 });
  if (format !== "docx" && format !== "pdf") {
    return NextResponse.json({ error: "format must be docx or pdf" }, { status: 400 });
  }

  const buffer = format === "docx" ? await buildDocx(record) : await buildPdf(record);
  const exportFile = await saveExportFile(record.id, format, buffer);
  await saveRecord({ ...record, status: "exported", exports: { ...record.exports, [format]: exportFile } });
  const filename = `PRC-${record.extraction.metadata.prNumber || record.id}.${format}`;
  const body = new Uint8Array(buffer);
  return new NextResponse(body, {
    headers: {
      "Content-Type":
        format === "docx"
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`
    }
  });
}
