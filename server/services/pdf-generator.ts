import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { PrcRecord } from "../types";
import { formatIndianCurrency, formatPercent } from "./format";

const pageWidth = 842;
const pageHeight = 595;
const margin = 36;

function wrap(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (`${current} ${word}`.trim().length > maxChars) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function buildPdf(record: PrcRecord): Promise<Buffer> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.TimesRoman);
  const bold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  let page = pdf.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  const newPage = () => {
    page = pdf.addPage([pageWidth, pageHeight]);
    y = pageHeight - margin;
  };

  const drawLine = (content: string, size = 10, isBold = false, indent = 0) => {
    for (const line of wrap(content, Math.floor((pageWidth - margin * 2 - indent) / (size * 0.46)))) {
      if (y < margin + 20) newPage();
      page.drawText(line, {
        x: margin + indent,
        y,
        size,
        font: isBold ? bold : font,
        color: rgb(0.04, 0.1, 0.18)
      });
      y -= size + 5;
    }
    y -= 3;
  };

  drawLine(record.draft.subject, 12, true);
  drawLine("PRC brief :", 11, true);
  record.draft.brief.forEach((line) => drawLine(line));
  [
    ["Vendor participation summary", record.draft.vendorParticipation],
    ["Technical evaluation summary", record.draft.technicalEvaluation],
    ["Commercial evaluation summary", record.draft.commercialEvaluation],
    ["Reverse auction details", record.draft.reverseAuction],
    ["Negotiation summary", record.draft.negotiationSummary]
  ].forEach(([title, lines]) => {
    drawLine(String(title), 11, true);
    (lines as string[]).forEach((line) => drawLine(line));
  });

  if (y < 260) newPage();
  drawLine("Final negotiated LCNS price for the items is as follows:", 10, false);
  const headers = ["SN", "Material", "Qty", "EV", "L1", "Dev", "Neg.", "Dev", "Savings", "Allow."];
  const widths = [26, 95, 48, 70, 70, 42, 74, 42, 62, 44];
  const rowHeight = 28;
  const drawRow = (values: string[], isHeader = false) => {
    if (y < margin + rowHeight) newPage();
    let x = margin;
    values.forEach((value, index) => {
      page.drawRectangle({
        x,
        y: y - rowHeight + 7,
        width: widths[index],
        height: rowHeight,
        borderColor: rgb(0.25, 0.3, 0.35),
        borderWidth: 0.5,
        color: isHeader ? rgb(0.9, 0.93, 0.96) : undefined
      });
      page.drawText(wrap(value, Math.max(4, Math.floor(widths[index] / 5.2)))[0] || "", {
        x: x + 3,
        y: y - 10,
        size: 6.5,
        font: isHeader ? bold : font,
        color: rgb(0.02, 0.08, 0.15)
      });
      x += widths[index];
    });
    y -= rowHeight;
  };
  drawRow(headers, true);
  record.extraction.items.forEach((item) =>
    drawRow([
      String(item.itemNo),
      item.material,
      String(item.quantity).replace(".00", ""),
      formatIndianCurrency(item.totalEv),
      formatIndianCurrency(item.l1Price),
      formatPercent(item.l1Deviation),
      formatIndianCurrency(item.negotiatedPrice),
      formatPercent(item.negotiatedDeviation),
      item.savings > 0 ? formatIndianCurrency(item.savings) : "-",
      formatPercent(item.allowableDeviation)
    ])
  );

  drawLine("Justification notes", 11, true);
  record.draft.justificationNotes.forEach((line) => drawLine(line));
  record.draft.finalRecommendation.forEach((line) => drawLine(line, 10, line.startsWith("PRC recommended")));
  drawLine(record.draft.signaturePreparedBy, 10, false);
  drawLine("PRC Member:", 10, true);
  record.draft.committeeMembers.forEach((member) => drawLine(member));

  return Buffer.from(await pdf.save());
}
