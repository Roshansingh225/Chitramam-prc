import { GoogleGenAI } from "@google/genai";
import { config } from "../config";
import type { ExtractedWorkbook, PrcDraft } from "../types";
import { formatIndianCurrency, formatPercent, sentenceList } from "./format";

function deterministicDraft(extraction: ExtractedWorkbook, referenceText?: string): PrcDraft {
  const { metadata, summary, items } = extraction;
  const itemDescription = metadata.itemsDescription || "tendered items";
  const prNumber = metadata.prNumber || metadata.prNumberText || "the subject PR";
  const subject = `Sub: Price Reason-ability Committee minutes for procurement ${itemDescription} on ${metadata.mode || "tender"} basis.`;
  const failedItems = summary.requiresFurtherNegotiation;
  const recommendedItems = summary.recommendedItems;
  const vendorSummary = Object.entries(summary.l1Vendors)
    .map(([vendor, count]) => `${vendor} emerged as L1 for ${count} item${count === 1 ? "" : "s"}`)
    .join("; ");
  const abnormal = items.filter((item) => item.abnormalDeviation);
  const negotiationItems = items.filter((item) => item.savings > 0).map((item) => item.itemNo);

  return {
    subject,
    brief: [
      `This pertains to procurement of ${itemDescription} against PR no. ${prNumber}${metadata.prDate ? ` dated ${metadata.prDate}` : ""}${metadata.prReleaseDate ? ` released on ${metadata.prReleaseDate}` : ""}; Mode of tender: ${metadata.mode || "as per tender"}; Total estimated value is Rs. ${formatIndianCurrency(summary.estimatedValue)}/-.`,
      `The extracted price sheet covers ${summary.itemCount} item${summary.itemCount === 1 ? "" : "s"} with total L1 LCNS value of Rs. ${formatIndianCurrency(summary.l1Value)}/- and final negotiated LCNS value of Rs. ${formatIndianCurrency(summary.negotiatedValue)}/-.`
    ],
    vendorParticipation: [
      vendorSummary || "L1 vendor status has been detected from the uploaded price sheet.",
      referenceText ? "The uploaded reference PRC has been considered for official tone and paragraph sequencing." : "Vendor participation summary has been generated from the extracted price sheet."
    ],
    technicalEvaluation: [
      "The techno-commercially acceptable offers have been considered item-wise as available in the uploaded price sheet.",
      "Items with unavailable RA or non-standard bid status have been retained in the review table for PRC decision."
    ],
    commercialEvaluation: [
      `Commercial evaluation indicates overall L1 deviation of ${formatPercent(summary.l1Deviation)} against EV and negotiated deviation of ${formatPercent(summary.negotiatedDeviation)} against EV.`,
      `The price reasonability has been checked against the allowable range of deviation mentioned item-wise in the price sheet.`
    ],
    reverseAuction: [
      "Reverse auction / price bid status has been considered as per item-wise L1 status available in the price sheet.",
      "Where RA failed or the L1 price remained beyond the allowable range, the item has been flagged for further PRC attention."
    ],
    negotiationSummary: [
      negotiationItems.length
        ? `After negotiation, savings of Rs. ${formatIndianCurrency(summary.savings)}/- has been recorded for item no. ${sentenceList(negotiationItems)}.`
        : "No post-L1 savings has been recorded in the extracted price sheet.",
      failedItems.length
        ? `After several negotiations for item no. ${sentenceList(failedItems)}, the price is still higher than EV / allowable deviation hence further negotiation is required for these item(s).`
        : "After negotiation, the recommended items are within the allowable deviation range."
    ],
    justificationNotes: [
      abnormal.length
        ? `Abnormal deviation has been detected for item no. ${sentenceList(abnormal.map((item) => item.itemNo))}; these items require specific vendor justification before final placement.`
        : "No abnormal deviation beyond the configured allowable range has been detected.",
      "Vendor justifications, if received, should be attached with the PRC note before approval."
    ],
    finalRecommendation: [
      recommendedItems.length
        ? `PRC recommended for placement order for item no. ${sentenceList(recommendedItems)} for total negotiated LCNS value of Rs. ${formatIndianCurrency(items.filter((item) => item.withinAllowableRange).reduce((sum, item) => sum + item.negotiatedPrice, 0))}/-.`
        : "PRC does not recommend placement of order at this stage as all items require further negotiation.",
      failedItems.length
        ? `Further course of action for item no. ${sentenceList(failedItems)} will be taken after further negotiation and approval of competent authority.`
        : "The case may be processed further for approval of competent authority."
    ],
    footnotes: [
      "Basis of estimate / LPP dates are taken from the uploaded price sheet wherever available.",
      "All values are LCNS values unless otherwise stated."
    ],
    signaturePreparedBy: "Chitra Wagh\nAM (Pur)",
    committeeMembers: [
      "Anuj S Bisen, DGM(Pur)",
      "Bhupendra Singh, GM(Pur)",
      "M K Lal, GM(CTS)",
      "R L Singh, DGM(F&A)",
      "Harsh Nigam, CGM(MM)"
    ]
  };
}

function geminiPrompt(extraction: ExtractedWorkbook, referenceText?: string): string {
  return JSON.stringify(
    {
      instruction:
        "You are a senior SAIL Purchase Department officer generating formal PRC minutes. Return strict JSON only. Use official procurement language. Do not invent values, vendors, dates, or approvals beyond the provided data. Flag items beyond allowable deviation and recommend further negotiation exactly where needed.",
      requiredShape: {
        subject: "string",
        brief: ["string"],
        vendorParticipation: ["string"],
        technicalEvaluation: ["string"],
        commercialEvaluation: ["string"],
        reverseAuction: ["string"],
        negotiationSummary: ["string"],
        justificationNotes: ["string"],
        finalRecommendation: ["string"],
        footnotes: ["string"],
        signaturePreparedBy: "string",
        committeeMembers: ["string"]
      },
      styleReference: referenceText || "",
      extraction
    },
    null,
    2
  );
}

function parseGeminiJson(text: string): PrcDraft {
  const cleaned = text
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();
  return JSON.parse(cleaned) as PrcDraft;
}

function hasAuctionEvidence(extraction: ExtractedWorkbook): boolean {
  const haystack = JSON.stringify(extraction).toLowerCase();
  return /\bra\s*(failed|successful|status)\b|reverse auction|auction/.test(haystack);
}

function sanitizeGeminiDraft(parsed: PrcDraft, fallback: PrcDraft, extraction: ExtractedWorkbook, hasReferenceText: boolean): PrcDraft {
  const unsupportedTechnicalClaim =
    !hasReferenceText ||
    parsed.technicalEvaluation?.some((line) =>
      /all bids received|all bids were|all offers|all participating bidders|participating vendors were duly evaluated|found to be in strict compliance/i.test(
        line
      )
    );
  const unsupportedAuctionClaim =
    !hasAuctionEvidence(extraction) &&
    parsed.reverseAuction?.some((line) => /not conducted|was not conducted|no reverse auction|no reverse/i.test(line));

  return {
    ...fallback,
    ...parsed,
    subject: parsed.subject?.trim().startsWith("Sub:") ? parsed.subject : fallback.subject,
    technicalEvaluation: unsupportedTechnicalClaim ? fallback.technicalEvaluation : parsed.technicalEvaluation || fallback.technicalEvaluation,
    reverseAuction: unsupportedAuctionClaim ? fallback.reverseAuction : parsed.reverseAuction || fallback.reverseAuction,
    footnotes: parsed.footnotes?.length ? parsed.footnotes : fallback.footnotes,
    signaturePreparedBy: fallback.signaturePreparedBy,
    committeeMembers: fallback.committeeMembers
  };
}

export async function generatePrcDraft(extraction: ExtractedWorkbook, referenceText?: string): Promise<PrcDraft> {
  const fallback = deterministicDraft(extraction, referenceText);
  if (!config.geminiApiKey) {
    return fallback;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
    const response = await ai.models.generateContent({
      model: config.geminiModel,
      contents: geminiPrompt(extraction, referenceText),
      config: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });
    const parsed = parseGeminiJson(response.text || "");
    return sanitizeGeminiDraft(parsed, fallback, extraction, Boolean(referenceText));
  } catch (error) {
    console.warn("Gemini drafting failed, using deterministic PRC draft:", error);
    return fallback;
  }
}
