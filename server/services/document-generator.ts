import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  PageBreak,
  Paragraph,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType
} from "docx";
import type { PrcRecord, PrcItem } from "../types";
import { formatIndianCurrency, formatPercent } from "./format";

const font = "Times New Roman";

function text(text: string, options: { bold?: boolean; size?: number; underline?: boolean } = {}): TextRun {
  return new TextRun({
    text,
    bold: options.bold,
    underline: options.underline ? {} : undefined,
    font,
    size: options.size || 22
  });
}

function paragraph(content: string, options: { bold?: boolean; heading?: boolean; spacingAfter?: number } = {}): Paragraph {
  return new Paragraph({
    heading: options.heading ? HeadingLevel.HEADING_3 : undefined,
    spacing: { after: options.spacingAfter ?? 140, line: 276 },
    children: [text(content, { bold: options.bold, size: options.heading ? 24 : 22, underline: options.heading })]
  });
}

function numberedParagraph(content: string): Paragraph {
  return new Paragraph({
    spacing: { after: 120, line: 276 },
    children: [text(content)]
  });
}

function cell(content: string, width: number, bold = false): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 70, bottom: 70, left: 70, right: 70 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "333333" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "333333" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "333333" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "333333" }
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [text(content, { bold, size: 16 })]
      })
    ]
  });
}

function priceRow(item: PrcItem): string[] {
  return [
    String(item.itemNo),
    item.material || item.shortText,
    formatIndianCurrency(item.quantity).replace(".00", ""),
    formatIndianCurrency(item.unitEv),
    formatIndianCurrency(item.totalEv),
    formatIndianCurrency(item.l1Price),
    formatPercent(item.l1Deviation),
    formatIndianCurrency(item.negotiatedPrice),
    formatPercent(item.negotiatedDeviation),
    item.basisOfEstimate || "-",
    item.savings > 0 ? formatIndianCurrency(item.savings) : "-",
    formatPercent(item.allowableDeviation).replace(".00%", "%")
  ];
}

function priceTable(record: PrcRecord): Table {
  const header = [
    "PR SN",
    "Material",
    `PR Qty (${record.extraction.items[0]?.uom || ""})`,
    "Unit EV (Rs.)",
    "Total EV (Rs.)",
    "L1 LCNS Price (Rs.)",
    "Dev.",
    "L1 Negotiated LCNS Price (Rs.)",
    "Dev.",
    "Basis of estimate LPP",
    "Savings",
    "Allow. range of dev."
  ];
  const widths = [6, 11, 8, 8, 10, 10, 6, 12, 6, 10, 8, 8];
  const rows = [
    new TableRow({ tableHeader: true, children: header.map((value, index) => cell(value, widths[index], true)) }),
    ...record.extraction.items.map((item) => new TableRow({ children: priceRow(item).map((value, index) => cell(value, widths[index])) })),
    new TableRow({
      children: [
        cell("", widths[0]),
        cell("", widths[1]),
        cell("", widths[2]),
        cell("", widths[3]),
        cell(formatIndianCurrency(record.extraction.summary.estimatedValue), widths[4], true),
        cell(formatIndianCurrency(record.extraction.summary.l1Value), widths[5], true),
        cell(formatPercent(record.extraction.summary.l1Deviation), widths[6], true),
        cell(formatIndianCurrency(record.extraction.summary.negotiatedValue), widths[7], true),
        cell(formatPercent(record.extraction.summary.negotiatedDeviation), widths[8], true),
        cell("", widths[9]),
        cell(formatIndianCurrency(record.extraction.summary.savings), widths[10], true),
        cell("", widths[11])
      ]
    })
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows
  });
}

function section(title: string, paragraphs: string[]): Paragraph[] {
  if (!paragraphs.length) return [];
  return [paragraph(title, { bold: true, heading: true }), ...paragraphs.map(numberedParagraph)];
}

export async function buildDocx(record: PrcRecord): Promise<Buffer> {
  const children: Array<Paragraph | Table> = [
    paragraph(record.draft.subject, { bold: true, spacingAfter: 220 }),
    paragraph("PRC brief :", { bold: true }),
    ...record.draft.brief.map(numberedParagraph),
    ...section("Vendor participation summary", record.draft.vendorParticipation),
    ...section("Technical evaluation summary", record.draft.technicalEvaluation),
    ...section("Commercial evaluation summary", record.draft.commercialEvaluation),
    ...section("Reverse auction details", record.draft.reverseAuction),
    ...section("Negotiation summary", record.draft.negotiationSummary),
    paragraph("Final negotiated LCNS price for the items is as follows:", { spacingAfter: 90 }),
    priceTable(record),
    ...record.draft.footnotes.map((note) => paragraph(`*${note}`, { spacingAfter: 80 })),
    ...section("Justification notes", record.draft.justificationNotes),
    ...record.draft.finalRecommendation.map((line) => paragraph(line, { bold: line.startsWith("PRC recommended") })),
    new Paragraph({ children: [new PageBreak()] }),
    paragraph(record.draft.signaturePreparedBy, { spacingAfter: 300 }),
    paragraph("PRC Member:", { bold: true, spacingAfter: 160 }),
    ...record.draft.committeeMembers.map((member) => paragraph(member, { spacingAfter: 120 }))
  ];

  const doc = new Document({
    creator: "SAIL PRC Automation",
    description: "Price Reasonability Committee minutes",
    styles: {
      default: {
        document: {
          run: { font, size: 22 },
          paragraph: { spacing: { line: 276 } }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 900,
              right: 720,
              bottom: 720,
              left: 720
            }
          }
        },
        children
      }
    ]
  });

  return Buffer.from(await Packer.toBuffer(doc));
}
