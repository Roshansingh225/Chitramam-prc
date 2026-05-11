import mammoth from "mammoth";

export async function extractReferenceText(filePath?: string): Promise<string | undefined> {
  if (!filePath) return undefined;
  const result = await mammoth.extractRawText({ path: filePath });
  const text = result.value.replace(/\n{3,}/g, "\n\n").trim();
  return text ? text.slice(0, 12000) : undefined;
}
