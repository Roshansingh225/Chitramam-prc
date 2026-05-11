import { NextRequest, NextResponse } from "next/server";
import type { PrcDraft } from "@/server/types";
import { getRecord, saveRecord } from "@/server/services/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getRecord(id);
  if (!record) return NextResponse.json({ error: "PRC record not found" }, { status: 404 });
  return NextResponse.json(record);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getRecord(id);
  if (!record) return NextResponse.json({ error: "PRC record not found" }, { status: 404 });
  const body = (await request.json()) as { draft?: Partial<PrcDraft> };
  if (!body.draft) return NextResponse.json({ error: "draft is required" }, { status: 400 });
  return NextResponse.json(await saveRecord({ ...record, draft: { ...record.draft, ...body.draft } }));
}
