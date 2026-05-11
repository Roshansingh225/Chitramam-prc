import { NextRequest, NextResponse } from "next/server";
import { generatePrcDraft } from "@/server/services/gemini";
import { getRecord, saveRecord } from "@/server/services/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getRecord(id);
  if (!record) return NextResponse.json({ error: "PRC record not found" }, { status: 404 });
  const draft = await generatePrcDraft(record.extraction, record.referenceText);
  return NextResponse.json(await saveRecord({ ...record, draft }));
}
