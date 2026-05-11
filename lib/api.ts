import type { PrcDraft, PrcRecord } from "./types";

export const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || `Request failed with ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function listPrcs(): Promise<PrcRecord[]> {
  return parseResponse(await fetch(`${apiBase}/prcs`, { cache: "no-store" }));
}

export async function getPrc(id: string): Promise<PrcRecord> {
  return parseResponse(await fetch(`${apiBase}/prcs/${id}`, { cache: "no-store" }));
}

export async function uploadPrc(excel: File, reference?: File): Promise<PrcRecord> {
  const formData = new FormData();
  formData.append("excel", excel);
  if (reference) formData.append("reference", reference);
  return parseResponse(
    await fetch(`${apiBase}/prcs`, {
      method: "POST",
      body: formData
    })
  );
}

export async function updateDraft(id: string, draft: Partial<PrcDraft>): Promise<PrcRecord> {
  return parseResponse(
    await fetch(`${apiBase}/prcs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ draft })
    })
  );
}

export function exportUrl(id: string, format: "docx" | "pdf"): string {
  return `${apiBase}/prcs/${id}/export/${format}`;
}
