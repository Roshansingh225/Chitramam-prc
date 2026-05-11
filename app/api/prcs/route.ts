import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import type { PrcRecord } from "@/server/types";
import { extractExcelBuffer } from "@/server/services/excel-js";
import { generatePrcDraft } from "@/server/services/gemini";
import { listRecords, saveRecord } from "@/server/services/storage";
import { todayIso } from "@/server/services/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await listRecords());
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const excel = formData.get("excel");
  if (!(excel instanceof File)) {
    return NextResponse.json({ error: "Excel price sheet is required" }, { status: 400 });
  }

  const reference = formData.get("reference");
  const referenceText = reference instanceof File ? (await reference.text().catch(() => "")).slice(0, 12000) : undefined;
  const id = randomUUID();
  const buffer = Buffer.from(await excel.arrayBuffer());
  const extraction = extractExcelBuffer(buffer, excel.name);
  const draft = await generatePrcDraft(extraction, referenceText);
  const createdAt = todayIso();
  const record: PrcRecord = await saveRecord({
    id,
    createdAt,
    updatedAt: createdAt,
    status: "draft",
    excelFileName: excel.name,
    referenceFileName: reference instanceof File ? reference.name : undefined,
    extraction,
    draft,
    referenceText
  });

  return NextResponse.json(record, { status: 201 });
}
