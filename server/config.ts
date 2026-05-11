import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const rootDir = path.resolve(__dirname, "..");
const defaultStorageDir = process.env.VERCEL ? "/tmp/sail-prc-storage" : path.join(rootDir, "storage");
export const storageDir = process.env.STORAGE_DIR || defaultStorageDir;

dotenv.config({ path: path.join(rootDir, ".env.local") });
dotenv.config({ path: path.join(rootDir, ".env") });

export const config = {
  port: Number(process.env.API_PORT || 4000),
  excelServiceUrl: process.env.EXCEL_SERVICE_URL || "http://localhost:5055",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  supabaseBucket: process.env.SUPABASE_BUCKET || "prc-documents",
  allowDevAuth: process.env.ALLOW_DEV_AUTH !== "false"
};
