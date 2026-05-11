import { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import multer from "multer";
import { storageDir } from "../config";
import { extractExcel } from "../services/excel-client";
import { generatePrcDraft } from "../services/gemini";
import { extractReferenceText } from "../services/reference-doc";
import {
  ensureStorage,
  getRecord,
  listRecords,
  saveExportFile,
  saveRecord,
  saveUploadedFile
} from "../services/storage";
import { buildDocx } from "../services/document-generator";
import { buildPdf } from "../services/pdf-generator";
import type { PrcDraft, PrcRecord } from "../types";
import { todayIso } from "../services/format";

const uploadTempDir = path.join(storageDir, "tmp");
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      fs.mkdirSync(uploadTempDir, { recursive: true });
      cb(null, uploadTempDir);
    },
    filename: (_req, file, cb) => {
      const extension = path.extname(file.originalname);
      cb(null, `${randomUUID()}${extension}`);
    }
  }),
  limits: {
    fileSize: 25 * 1024 * 1024
  }
});

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._ -]/g, "_");
}

export const prcRouter = Router();

prcRouter.get("/health", (_req, res) => {
  res.json({ ok: true, service: "sail-prc-api" });
});

prcRouter.get("/prcs", async (_req, res, next) => {
  try {
    res.json(await listRecords());
  } catch (error) {
    next(error);
  }
});

prcRouter.post(
  "/prcs",
  upload.fields([
    { name: "excel", maxCount: 1 },
    { name: "reference", maxCount: 1 }
  ]),
  async (req, res, next) => {
    try {
      await ensureStorage();
      const files = req.files as Record<string, Express.Multer.File[]>;
      const excel = files?.excel?.[0];
      const reference = files?.reference?.[0];
      if (!excel) {
        res.status(400).json({ error: "Excel price sheet is required" });
        return;
      }

      const id = randomUUID();
      const excelName = `${id}-${safeName(excel.originalname)}`;
      const excelPath = await saveUploadedFile(excel.path, excelName);
      const referencePath = reference
        ? await saveUploadedFile(reference.path, `${id}-${safeName(reference.originalname)}`)
        : undefined;

      const extraction = await extractExcel(excelPath);
      const referenceText = await extractReferenceText(referencePath);
      const draft = await generatePrcDraft(extraction, referenceText);
      const createdAt = todayIso();
      const record: PrcRecord = await saveRecord({
        id,
        createdAt,
        updatedAt: createdAt,
        status: "draft",
        excelFileName: excel.originalname,
        referenceFileName: reference?.originalname,
        extraction,
        draft,
        referenceText
      });

      res.status(201).json(record);
    } catch (error) {
      next(error);
    }
  }
);

prcRouter.get("/prcs/:id", async (req, res, next) => {
  try {
    const record = await getRecord(req.params.id);
    if (!record) {
      res.status(404).json({ error: "PRC record not found" });
      return;
    }
    res.json(record);
  } catch (error) {
    next(error);
  }
});

prcRouter.patch("/prcs/:id", async (req, res, next) => {
  try {
    const record = await getRecord(req.params.id);
    if (!record) {
      res.status(404).json({ error: "PRC record not found" });
      return;
    }
    const draft = req.body?.draft as Partial<PrcDraft> | undefined;
    if (!draft) {
      res.status(400).json({ error: "draft is required" });
      return;
    }
    const updated = await saveRecord({
      ...record,
      draft: { ...record.draft, ...draft }
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

prcRouter.post("/prcs/:id/regenerate", async (req, res, next) => {
  try {
    const record = await getRecord(req.params.id);
    if (!record) {
      res.status(404).json({ error: "PRC record not found" });
      return;
    }
    const draft = await generatePrcDraft(record.extraction, record.referenceText);
    const updated = await saveRecord({ ...record, draft });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

prcRouter.get("/prcs/:id/export/:format", async (req, res, next) => {
  try {
    const record = await getRecord(req.params.id);
    if (!record) {
      res.status(404).json({ error: "PRC record not found" });
      return;
    }
    const format = req.params.format;
    if (format !== "docx" && format !== "pdf") {
      res.status(400).json({ error: "format must be docx or pdf" });
      return;
    }

    const buffer = format === "docx" ? await buildDocx(record) : await buildPdf(record);
    const exportFile = await saveExportFile(record.id, format, buffer);
    const updated = await saveRecord({
      ...record,
      status: "exported",
      exports: { ...record.exports, [format]: exportFile }
    });
    const filename = `PRC-${updated.extraction.metadata.prNumber || updated.id}.${format}`;
    res.download(exportFile, filename);
  } catch (error) {
    next(error);
  }
});
