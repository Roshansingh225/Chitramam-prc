import type { ExtractedWorkbook } from "../types";
import { config } from "../config";

export async function extractExcel(workbookPath: string): Promise<ExtractedWorkbook> {
  const response = await fetch(`${config.excelServiceUrl}/extract`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ workbookPath })
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error || "Excel extraction failed");
  }
  return payload as ExtractedWorkbook;
}

export async function checkExcelService(): Promise<boolean> {
  try {
    const response = await fetch(`${config.excelServiceUrl}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
