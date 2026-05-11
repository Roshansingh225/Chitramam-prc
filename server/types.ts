export type PrcItem = {
  itemNo: number;
  prSn: number | string;
  materialCode: string;
  material: string;
  shortText: string;
  quantity: number;
  uom: string;
  unitEv: number;
  totalEv: number;
  l1Price: number;
  l1Deviation: number;
  allowableDeviation: number;
  l1Bidder: string;
  basisOfEstimate: string;
  negotiatedPrice: number;
  negotiatedDeviation: number;
  savings: number;
  requiresFurtherNegotiation: boolean;
  withinAllowableRange: boolean;
  abnormalDeviation: boolean;
  sourceSheet: string;
};

export type PrcMetadata = {
  prNumber?: string;
  prNumberText?: string;
  prDate?: string;
  prReleaseDate?: string;
  itemsDescription?: string;
  nitNumber?: string;
  estimatedValueText?: string;
  estimatedValue?: number;
  mode?: string;
};

export type PrcSummary = {
  estimatedValue: number;
  computedEstimatedValue: number;
  l1Value: number;
  negotiatedValue: number;
  savings: number;
  l1Deviation: number;
  negotiatedDeviation: number;
  itemCount: number;
  requiresFurtherNegotiation: number[];
  recommendedItems: number[];
  l1Vendors: Record<string, number>;
};

export type ExtractedWorkbook = {
  sourceFile: string;
  extractedAt: string;
  sheets: string[];
  metadata: PrcMetadata;
  items: PrcItem[];
  summary: PrcSummary;
};

export type PrcDraft = {
  subject: string;
  brief: string[];
  vendorParticipation: string[];
  technicalEvaluation: string[];
  commercialEvaluation: string[];
  reverseAuction: string[];
  negotiationSummary: string[];
  justificationNotes: string[];
  finalRecommendation: string[];
  footnotes: string[];
  signaturePreparedBy: string;
  committeeMembers: string[];
};

export type PrcRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "exported";
  excelFileName: string;
  referenceFileName?: string;
  extraction: ExtractedWorkbook;
  draft: PrcDraft;
  referenceText?: string;
  exports?: {
    docx?: string;
    pdf?: string;
  };
};
