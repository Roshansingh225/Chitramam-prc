import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";
import { config, storageDir } from "../config";
import type { PrcRecord } from "../types";
import { todayIso } from "./format";

const recordsDir = path.join(storageDir, "records");
const uploadsDir = path.join(storageDir, "uploads");
const exportsDir = path.join(storageDir, "exports");

let supabase: SupabaseClient | undefined;

function getSupabase(): SupabaseClient | undefined {
  if (!config.supabaseUrl || !config.supabaseServiceRoleKey) return undefined;
  if (!supabase) {
    supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);
  }
  return supabase;
}

export async function ensureStorage(): Promise<void> {
  await fs.mkdir(recordsDir, { recursive: true });
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.mkdir(exportsDir, { recursive: true });
}

export function uploadPath(filename: string): string {
  return path.join(uploadsDir, filename);
}

export function exportPath(filename: string): string {
  return path.join(exportsDir, filename);
}

function recordPath(id: string): string {
  return path.join(recordsDir, `${id}.json`);
}

export async function saveRecord(record: PrcRecord): Promise<PrcRecord> {
  await ensureStorage();
  const updated = { ...record, updatedAt: todayIso() };
  await fs.writeFile(recordPath(updated.id), JSON.stringify(updated, null, 2), "utf8");

  const client = getSupabase();
  if (client) {
    await client.from("prc_records").upsert({
      id: updated.id,
      pr_number: updated.extraction.metadata.prNumber,
      status: updated.status,
      excel_file_name: updated.excelFileName,
      reference_file_name: updated.referenceFileName || null,
      payload: updated,
      updated_at: updated.updatedAt,
      created_at: updated.createdAt
    });
  }
  return updated;
}

export async function listRecords(): Promise<PrcRecord[]> {
  await ensureStorage();
  const client = getSupabase();
  if (client) {
    const { data, error } = await client
      .from("prc_records")
      .select("payload")
      .order("updated_at", { ascending: false })
      .limit(100);
    if (!error && data?.length) {
      return data.map((row) => row.payload as PrcRecord);
    }
  }

  const files = await fs.readdir(recordsDir);
  const records = await Promise.all(
    files
      .filter((file) => file.endsWith(".json"))
      .map(async (file) => JSON.parse(await fs.readFile(path.join(recordsDir, file), "utf8")) as PrcRecord)
  );
  return records.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getRecord(id: string): Promise<PrcRecord | undefined> {
  const client = getSupabase();
  if (client) {
    const { data } = await client.from("prc_records").select("payload").eq("id", id).maybeSingle();
    if (data?.payload) return data.payload as PrcRecord;
  }

  try {
    return JSON.parse(await fs.readFile(recordPath(id), "utf8")) as PrcRecord;
  } catch {
    return undefined;
  }
}

export async function saveExportFile(recordId: string, extension: "docx" | "pdf", data: Buffer): Promise<string> {
  await ensureStorage();
  const filename = `${recordId}.${extension}`;
  const localPath = exportPath(filename);
  await fs.writeFile(localPath, data);

  const client = getSupabase();
  if (client) {
    await client.storage.from(config.supabaseBucket).upload(`exports/${filename}`, data, {
      contentType:
        extension === "docx"
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : "application/pdf",
      upsert: true
    });
  }
  return localPath;
}

export async function saveUploadedFile(tempPath: string, filename: string): Promise<string> {
  await ensureStorage();
  const destination = uploadPath(filename);
  await fs.rename(tempPath, destination);
  return destination;
}
