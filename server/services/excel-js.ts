import * as XLSX from "xlsx";
import type { ExtractedWorkbook, PrcItem } from "../types";

type Sheet = unknown[][];

function clean(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function num(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const text = clean(value)
    .replace(/,/g, "")
    .replace("/-", "")
    .replace("Rs.", "")
    .replace("₹", "")
    .replace("%", "");
  const match = text.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : undefined;
}

function percent(value: unknown): number | undefined {
  const n = num(value);
  if (n === undefined) return undefined;
  return Math.abs(n) > 1 ? n / 100 : n;
}

function money(value: number | undefined): number {
  return Math.round((value || 0) * 100) / 100;
}

function pct(value: number | undefined): number {
  return Math.round((value || 0) * 1_000_000) / 1_000_000;
}

function rightValue(row: unknown[], index: number): string {
  for (const value of row.slice(index + 1)) {
    const text = clean(value);
    if (text) return text;
  }
  return "";
}

function normalize(value: unknown): string {
  return clean(value)
    .toLowerCase()
    .replace(/l-1|l 1/g, "l1")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function metadata(sheet: Sheet) {
  const meta: ExtractedWorkbook["metadata"] = {};
  sheet.slice(0, 14).forEach((row) => {
    row.forEach((cell, index) => {
      const label = normalize(cell);
      if (label === "pr no") meta.prNumberText = rightValue(row, index);
      if (label === "items" || label === "item") meta.itemsDescription = rightValue(row, index);
      if (label.startsWith("nit no")) meta.nitNumber = rightValue(row, index);
      if (label === "ev rs" || label === "ev") meta.estimatedValueText = rightValue(row, index);
      if (label === "mode") meta.mode = rightValue(row, index);
    });
  });
  const prText = meta.prNumberText || "";
  meta.prNumber = prText.match(/\b\d{8,12}\b/)?.[0];
  const dates = prText.match(/\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/g) || [];
  meta.prDate = dates[0];
  meta.prReleaseDate = dates[1];
  const ev = num(meta.estimatedValueText);
  if (ev !== undefined) meta.estimatedValue = money(ev);
  return meta;
}

function headerIndex(sheet: Sheet): number {
  return sheet.findIndex((row) => {
    const joined = row.map(normalize).join(" | ");
    return joined.includes("pr sn") && joined.includes("material") && (joined.includes("total ev") || joined.includes("unit ev"));
  });
}

function mapHeaders(headers: unknown[]) {
  const mapped: Record<string, number> = {};
  let devCount = 0;
  headers.map(normalize).forEach((text, index) => {
    if (text === "pr sn" || text.startsWith("pr sn")) mapped.prSn ??= index;
    else if (text === "material") mapped.material ??= index;
    else if (text.includes("short text") || text.includes("description")) mapped.shortText ??= index;
    else if (text.includes("pr qty") || text === "qty") mapped.quantity ??= index;
    else if (text === "uom") mapped.uom ??= index;
    else if (text.includes("unit ev")) mapped.unitEv ??= index;
    else if (text.includes("total ev")) mapped.totalEv ??= index;
    else if (text.includes("l1 lcns price") || (text.includes("l1") && text.includes("price") && !text.includes("neg"))) mapped.l1Price ??= index;
    else if (text.startsWith("dev")) mapped[devCount++ === 0 ? "l1Deviation" : "negotiatedDeviation"] ??= index;
    else if (text.includes("allow") && text.includes("dev")) mapped.allowableDeviation ??= index;
    else if (text.includes("bidder")) mapped.l1Bidder ??= index;
    else if (text.includes("basis") || text.includes("lpp")) mapped.basisOfEstimate ??= index;
    else if (text.includes("neg") && text.includes("price")) mapped.negotiatedPrice ??= index;
  });
  return mapped;
}

function get(row: unknown[], mapping: Record<string, number>, key: string): unknown {
  const index = mapping[key];
  return index === undefined ? undefined : row[index];
}

function materialLabel(shortText: string): string {
  const text = shortText.toUpperCase();
  const core = text.includes("IWRC") ? "IWRC" : text.includes("FMC") ? "FMC" : "";
  const dia = text.match(/DIA\s*:?\s*(\d+(?:\.\d+)?)\s*MM/);
  return core && dia ? `SWR-${core}-${dia[1].replace(/\.0$/, "")}MM` : text.slice(0, 42);
}

function parseItems(sheet: Sheet, sheetName: string) {
  const index = headerIndex(sheet);
  if (index < 0) return { items: [] as PrcItem[], totals: {} as Record<string, number> };
  const mapping = mapHeaders(sheet[index]);
  const items: PrcItem[] = [];
  const totals: Record<string, number> = {};
  let itemNo = 1;

  sheet.slice(index + 1).forEach((row) => {
    const prSn = num(get(row, mapping, "prSn"));
    const materialCode = clean(get(row, mapping, "material"));
    const shortText = clean(get(row, mapping, "shortText"));
    const totalEvRaw = num(get(row, mapping, "totalEv"));
    const l1Raw = num(get(row, mapping, "l1Price"));
    if (prSn === undefined && !materialCode && !shortText && (totalEvRaw !== undefined || l1Raw !== undefined)) {
      if (totalEvRaw !== undefined) totals.estimatedValue = money(totalEvRaw);
      if (l1Raw !== undefined) totals.l1Price = money(l1Raw);
      return;
    }
    if (prSn === undefined || !materialCode) return;

    const quantity = num(get(row, mapping, "quantity")) || 0;
    const unitEv = num(get(row, mapping, "unitEv"));
    const totalEv = totalEvRaw ?? (unitEv || 0) * quantity;
    const l1Price = l1Raw || 0;
    const l1Deviation = percent(get(row, mapping, "l1Deviation")) ?? (totalEv ? (l1Price - totalEv) / totalEv : 0);
    const negotiated = num(get(row, mapping, "negotiatedPrice"));
    const negotiatedDeviation = percent(get(row, mapping, "negotiatedDeviation"));
    items.push({
      itemNo: itemNo++,
      prSn: Number.isInteger(prSn) ? prSn : String(prSn),
      materialCode,
      material: materialLabel(shortText),
      shortText,
      quantity: money(quantity),
      uom: clean(get(row, mapping, "uom")),
      unitEv: money(unitEv),
      totalEv: money(totalEv),
      l1Price: money(l1Price),
      l1Deviation: pct(l1Deviation),
      allowableDeviation: pct(percent(get(row, mapping, "allowableDeviation"))),
      l1Bidder: clean(get(row, mapping, "l1Bidder")) || "Not detected",
      basisOfEstimate: clean(get(row, mapping, "basisOfEstimate")),
      negotiatedPrice: negotiated === undefined ? 0 : money(negotiated),
      negotiatedDeviation: negotiatedDeviation === undefined ? 0 : pct(negotiatedDeviation),
      savings: 0,
      requiresFurtherNegotiation: false,
      withinAllowableRange: false,
      abnormalDeviation: false,
      sourceSheet: sheetName
    });
  });
  return { items, totals };
}

function numericRows(sheet: Sheet): number[][] {
  return sheet
    .map((row) => row.map(num).filter((value): value is number => value !== undefined))
    .filter((row) => row.length >= 2);
}

function attachNegotiation(items: PrcItem[], sheets: Record<string, Sheet>) {
  let bestRows: number[][] = [];
  let bestScore = -1;
  Object.values(sheets).forEach((sheet) => {
    const rows = numericRows(sheet);
    if (rows.length < Math.max(1, Math.floor(items.length / 2))) return;
    let score = 0;
    items.forEach((item, index) => {
      const row = rows[index];
      if (!row) return;
      const l1Index = row.findIndex((value, valueIndex) => Math.abs(value - item.l1Price) <= Math.max(1, item.l1Price * 0.002) && row[valueIndex + 1] >= Math.max(1, item.totalEv * 0.2));
      if (l1Index >= 0) score += 1;
    });
    if (score > bestScore) {
      bestScore = score;
      bestRows = rows;
    }
  });

  if (bestScore <= 0) return;
  items.forEach((item, index) => {
    const row = bestRows[index];
    if (!row) return;
    const l1Index = row.findIndex((value, valueIndex) => Math.abs(value - item.l1Price) <= Math.max(1, item.l1Price * 0.002) && row[valueIndex + 1] >= Math.max(1, item.totalEv * 0.2));
    if (l1Index < 0) return;
    const negotiated = row[l1Index + 1];
    item.negotiatedPrice = item.negotiatedPrice || money(negotiated);
    item.savings = money(Math.max(0, row[l1Index + 2] ?? item.l1Price - negotiated));
  });
}

function finalize(items: PrcItem[]) {
  items.forEach((item) => {
    if (!item.negotiatedPrice) item.negotiatedPrice = item.l1Price;
    if (!item.negotiatedDeviation) item.negotiatedDeviation = pct(item.totalEv ? (item.negotiatedPrice - item.totalEv) / item.totalEv : 0);
    item.savings = money(item.savings || Math.max(0, item.l1Price - item.negotiatedPrice));
    item.requiresFurtherNegotiation = item.negotiatedDeviation > item.allowableDeviation;
    item.withinAllowableRange = item.negotiatedDeviation <= item.allowableDeviation;
    item.abnormalDeviation = item.negotiatedDeviation > Math.max(item.allowableDeviation * 1.5, item.allowableDeviation + 0.05);
  });
}

export function extractExcelBuffer(buffer: Buffer, sourceFile: string): ExtractedWorkbook {
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: false });
  const sheets = Object.fromEntries(
    workbook.SheetNames.map((name) => [name, XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1, defval: null }) as Sheet])
  );
  const priceSheetName = sheets.Price ? "Price" : workbook.SheetNames[0];
  let meta = metadata(sheets[priceSheetName]);
  let { items, totals } = parseItems(sheets[priceSheetName], priceSheetName);
  if (!items.length) {
    for (const name of workbook.SheetNames) {
      const parsed = parseItems(sheets[name], name);
      if (parsed.items.length) {
        items = parsed.items;
        totals = parsed.totals;
        meta = { ...meta, ...metadata(sheets[name]) };
        break;
      }
    }
  }
  attachNegotiation(items, sheets);
  finalize(items);
  const computedEv = money(items.reduce((sum, item) => sum + item.totalEv, 0));
  const l1Value = money(items.reduce((sum, item) => sum + item.l1Price, 0));
  const negotiatedValue = money(items.reduce((sum, item) => sum + item.negotiatedPrice, 0));
  const l1Vendors = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.l1Bidder] = (acc[item.l1Bidder] || 0) + 1;
    return acc;
  }, {});
  return {
    sourceFile,
    extractedAt: new Date().toISOString(),
    sheets: workbook.SheetNames,
    metadata: meta,
    items,
    summary: {
      estimatedValue: money(totals.estimatedValue || meta.estimatedValue || computedEv),
      computedEstimatedValue: computedEv,
      l1Value: money(totals.l1Price || l1Value),
      negotiatedValue,
      savings: money(items.reduce((sum, item) => sum + item.savings, 0)),
      l1Deviation: pct(computedEv ? (l1Value - computedEv) / computedEv : 0),
      negotiatedDeviation: pct(computedEv ? (negotiatedValue - computedEv) / computedEv : 0),
      itemCount: items.length,
      requiresFurtherNegotiation: items.filter((item) => item.requiresFurtherNegotiation).map((item) => item.itemNo),
      recommendedItems: items.filter((item) => item.withinAllowableRange).map((item) => item.itemNo),
      l1Vendors
    }
  };
}
