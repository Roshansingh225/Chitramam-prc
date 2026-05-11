"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, FileText, Loader2, Save, WandSparkles } from "lucide-react";
import { getPrc, updateDraft } from "@/lib/api";
import type { PrcDraft, PrcRecord } from "@/lib/types";
import { formatMoney, formatPercent } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const editableSections: Array<{ key: keyof PrcDraft; label: string; type: "text" | "lines" }> = [
  { key: "subject", label: "Subject", type: "text" },
  { key: "brief", label: "PRC Brief", type: "lines" },
  { key: "vendorParticipation", label: "Vendor Participation", type: "lines" },
  { key: "technicalEvaluation", label: "Technical Evaluation", type: "lines" },
  { key: "commercialEvaluation", label: "Commercial Evaluation", type: "lines" },
  { key: "reverseAuction", label: "Reverse Auction", type: "lines" },
  { key: "negotiationSummary", label: "Negotiation Summary", type: "lines" },
  { key: "justificationNotes", label: "Justification Notes", type: "lines" },
  { key: "finalRecommendation", label: "Final Recommendation", type: "lines" }
];

function toEditable(draft: PrcDraft): Record<string, string> {
  return Object.fromEntries(
    editableSections.map((section) => {
      const value = draft[section.key];
      return [section.key, Array.isArray(value) ? value.join("\n") : value];
    })
  );
}

function fromEditable(values: Record<string, string>, draft: PrcDraft): Partial<PrcDraft> {
  const next: Partial<PrcDraft> = {};
  editableSections.forEach((section) => {
    const value = values[section.key] || "";
    next[section.key] = (section.type === "lines" ? value.split("\n").filter(Boolean) : value) as never;
  });
  return { ...draft, ...next };
}

export function PrcPreviewClient({ id }: { id: string }) {
  const router = useRouter();
  const [record, setRecord] = useState<PrcRecord>();
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getPrc(id)
      .then((data) => {
        setRecord(data);
        setValues(toEditable(data.draft));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load PRC"))
      .finally(() => setLoading(false));
  }, [id]);

  const summary = record?.extraction.summary;
  const abnormalCount = useMemo(() => record?.extraction.items.filter((item) => item.abnormalDeviation).length || 0, [record]);

  async function save() {
    if (!record) return;
    setSaving(true);
    const updated = await updateDraft(record.id, fromEditable(values, record.draft));
    setRecord(updated);
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="grid min-h-80 place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-sail-blue" />
      </div>
    );
  }
  if (!record) {
    return <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error || "PRC not found"}</div>;
  }

  return (
    <div className="space-y-6 pb-16 lg:pb-0">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-sail-ink">Generated PRC Preview</h1>
            <Badge>{record.extraction.metadata.prNumber || "PR unmapped"}</Badge>
            {abnormalCount ? <Badge className="border-red-200 bg-red-50 text-red-700">{abnormalCount} abnormal</Badge> : null}
          </div>
          <p className="mt-1 text-sm text-sail-steel">{record.extraction.metadata.itemsDescription || record.excelFileName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </Button>
          <Button variant="secondary" asChild>
            <Link href={`/export/${record.id}`}>
              <Download className="h-4 w-4" />
              Export
            </Link>
          </Button>
          <Button onClick={() => router.push("/upload")}>
            <WandSparkles className="h-4 w-4" />
            New
          </Button>
        </div>
      </div>

      {summary ? (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wide text-sail-steel">EV</div>
              <div className="mt-1 text-lg font-semibold">{formatMoney(summary.estimatedValue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wide text-sail-steel">L1 Value</div>
              <div className="mt-1 text-lg font-semibold">{formatMoney(summary.l1Value)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wide text-sail-steel">Negotiated</div>
              <div className="mt-1 text-lg font-semibold">{formatMoney(summary.negotiatedValue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wide text-sail-steel">Savings</div>
              <div className="mt-1 text-lg font-semibold">{formatMoney(summary.savings)}</div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card className="shadow-panel">
          <CardHeader>
            <CardTitle>Editable PRC Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editableSections.map((section) => (
              <div key={section.key}>
                <label className="text-sm font-semibold text-sail-ink">{section.label}</label>
                <Textarea
                  className="mt-2 min-h-24"
                  value={values[section.key] || ""}
                  onChange={(event) => setValues((current) => ({ ...current, [section.key]: event.target.value }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-panel">
            <CardHeader>
              <CardTitle>Official Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <article className="document-paper mx-auto max-w-[900px] bg-white text-[15px] leading-7 text-black">
                <p className="font-bold">{values.subject}</p>
                <p className="mt-4 font-bold">PRC brief :</p>
                {(values.brief || "").split("\n").filter(Boolean).map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {editableSections.slice(2).map((section) => (
                  <div key={section.key} className="mt-4">
                    <p className="font-bold underline">{section.label}</p>
                    {(values[section.key] || "").split("\n").filter(Boolean).map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                ))}
              </article>
            </CardContent>
          </Card>

          <Card className="shadow-panel">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>PRC Table</CardTitle>
              <FileText className="h-5 w-5 text-sail-blue" />
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full min-w-[1180px] border-collapse text-xs">
                <thead className="bg-sail-mist text-sail-ink">
                  <tr>
                    {[
                      "PR SN",
                      "Material",
                      "Qty",
                      "Unit EV",
                      "Total EV",
                      "L1 Price",
                      "L1 Dev.",
                      "Negotiated",
                      "Neg. Dev.",
                      "L1 Bidder",
                      "Savings",
                      "Allow."
                    ].map((heading) => (
                      <th key={heading} className="border border-sail-line px-2 py-2 text-left font-semibold">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {record.extraction.items.map((item) => (
                    <tr key={item.itemNo} className={item.requiresFurtherNegotiation ? "bg-red-50" : "bg-white"}>
                      <td className="border border-sail-line px-2 py-2">{item.itemNo}</td>
                      <td className="border border-sail-line px-2 py-2 font-medium">{item.material}</td>
                      <td className="border border-sail-line px-2 py-2">{item.quantity}</td>
                      <td className="border border-sail-line px-2 py-2">{formatMoney(item.unitEv)}</td>
                      <td className="border border-sail-line px-2 py-2">{formatMoney(item.totalEv)}</td>
                      <td className="border border-sail-line px-2 py-2">{formatMoney(item.l1Price)}</td>
                      <td className="border border-sail-line px-2 py-2">{formatPercent(item.l1Deviation)}</td>
                      <td className="border border-sail-line px-2 py-2">{formatMoney(item.negotiatedPrice)}</td>
                      <td className="border border-sail-line px-2 py-2">{formatPercent(item.negotiatedDeviation)}</td>
                      <td className="border border-sail-line px-2 py-2">{item.l1Bidder}</td>
                      <td className="border border-sail-line px-2 py-2">{formatMoney(item.savings)}</td>
                      <td className="border border-sail-line px-2 py-2">{formatPercent(item.allowableDeviation)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
