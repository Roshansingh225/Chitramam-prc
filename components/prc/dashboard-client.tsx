"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  ClipboardCheck,
  Download,
  FileText,
  Gauge,
  IndianRupee,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  UploadCloud
} from "lucide-react";
import { motion } from "framer-motion";
import { listPrcs } from "@/lib/api";
import type { PrcRecord } from "@/lib/types";
import { formatMoney, formatPercent } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MetricCard } from "@/components/prc/metric-card";
import { StatusPill } from "@/components/prc/status-pill";

const processSteps = [
  { label: "Excel extraction", icon: UploadCloud, tone: "bg-sail-blue" },
  { label: "Gemini PRC draft", icon: Sparkles, tone: "bg-sail-copper" },
  { label: "Committee export", icon: ClipboardCheck, tone: "bg-emerald-600" }
];

export function DashboardClient() {
  const [records, setRecords] = useState<PrcRecord[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPrcs()
      .then(setRecords)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return records.filter((record) => {
      const haystack = [
        record.extraction.metadata.prNumber,
        record.extraction.metadata.itemsDescription,
        record.excelFileName,
        record.status
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [query, records]);

  const totalValue = records.reduce((sum, record) => sum + record.extraction.summary.negotiatedValue, 0);
  const totalSavings = records.reduce((sum, record) => sum + record.extraction.summary.savings, 0);
  const flagged = records.reduce((sum, record) => sum + record.extraction.summary.requiresFurtherNegotiation.length, 0);
  const vendorCounts = records.reduce<Record<string, number>>((acc, record) => {
    Object.entries(record.extraction.summary.l1Vendors).forEach(([vendor, count]) => {
      acc[vendor] = (acc[vendor] || 0) + count;
    });
    return acc;
  }, {});

  return (
    <div className="space-y-6 pb-16 lg:pb-0">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-sail-ink">Chitra Mam PRC Dashboard</h1>
          <p className="mt-1 text-sm text-sail-steel">Price reasonability history and vendor analytics</p>
        </div>
        <Button asChild>
          <Link href="/upload">
            <UploadCloud className="h-4 w-4" />
            New PRC
          </Link>
        </Button>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-lg border border-sail-line bg-white shadow-panel"
      >
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(90deg,#061a33_1px,transparent_1px),linear-gradient(0deg,#061a33_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="steel-scan absolute left-0 top-0 h-px w-full bg-sail-blue" />
        <div className="relative grid gap-5 p-5 lg:grid-cols-[1fr_430px] lg:p-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-sail-line bg-sail-mist px-3 py-1 text-xs font-semibold text-sail-ink">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Dedicated for Chitra Mam
            </div>
            <h2 className="mt-4 max-w-2xl text-2xl font-semibold leading-tight text-sail-ink">
              Official PRC drafting desk for SAIL Purchase Department
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-sail-steel">
              Upload Excel price sheets, review item-wise deviations, edit the note, and export committee-ready DOCX/PDF from one workspace.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/upload">
                  Start PRC
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <div className="flex items-center gap-2 rounded-md border border-sail-line bg-white px-3 py-2 text-sm text-sail-steel">
                <Gauge className="h-4 w-4 text-sail-blue" />
                {flagged ? `${flagged} items need attention` : "Deviation monitor clear"}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-sail-line bg-sail-ink p-4 text-white">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">PRC Flow</div>
                <div className="text-xs text-white/60">Excel to official minutes</div>
              </div>
              <Sparkles className="h-5 w-5 text-sail-copper" />
            </div>
            <div className="grid gap-3">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * index, duration: 0.35 }}
                    className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.06] p-3"
                  >
                    <div className={`grid h-9 w-9 place-items-center rounded-md ${step.tone}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold">{step.label}</div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/12">
                        <div className="meter-shimmer relative h-full rounded-full bg-white/55" style={{ width: `${78 + index * 7}%` }} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "PRC files", value: String(records.length), icon: FileText, tone: "blue" as const },
          { label: "Negotiated value", value: formatMoney(totalValue, true), icon: IndianRupee, tone: "green" as const },
          { label: "Savings", value: formatMoney(totalSavings, true), icon: TrendingDown, tone: "amber" as const },
          { label: "Negotiation flags", value: String(flagged), icon: Activity, tone: flagged ? ("red" as const) : ("green" as const) }
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index, duration: 0.32 }}
          >
            <MetricCard label={metric.label} value={metric.value} icon={metric.icon} tone={metric.tone} />
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="shadow-panel">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>PRC History</CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sail-steel" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Search PR number" />
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead className="bg-sail-mist text-left text-xs uppercase tracking-wide text-sail-steel">
                <tr>
                  <th className="px-5 py-3">PR number</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Negotiated value</th>
                  <th className="px-5 py-3">Deviation</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-5 py-7 text-sail-steel" colSpan={6}>
                      Loading records
                    </td>
                  </tr>
                ) : filtered.length ? (
                  filtered.map((record) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-t border-sail-line bg-white"
                    >
                      <td className="px-5 py-4 font-semibold text-sail-ink">{record.extraction.metadata.prNumber || "Unmapped"}</td>
                      <td className="px-5 py-4 text-sail-steel">{record.extraction.metadata.itemsDescription || record.excelFileName}</td>
                      <td className="px-5 py-4 font-medium">{formatMoney(record.extraction.summary.negotiatedValue)}</td>
                      <td className="px-5 py-4">{formatPercent(record.extraction.summary.negotiatedDeviation)}</td>
                      <td className="px-5 py-4">
                        <StatusPill status={record.status} />
                      </td>
                      <td className="px-5 py-4">
                        <Button asChild variant="secondary" size="sm">
                          <Link href={`/preview/${record.id}`}>
                            <Download className="h-4 w-4" />
                            Open
                          </Link>
                        </Button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-5 py-7 text-sail-steel" colSpan={6}>
                      No PRC records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="shadow-panel">
          <CardHeader>
            <CardTitle>Vendor Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(vendorCounts).length ? (
              Object.entries(vendorCounts).map(([vendor, count]) => {
                const width = Math.max(12, (count / Math.max(...Object.values(vendorCounts))) * 100);
                return (
                  <div key={vendor}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-sail-ink">{vendor}</span>
                      <span className="text-sail-steel">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-sail-mist">
                      <motion.div
                        className="h-2 rounded-full bg-sail-blue"
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.55 }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-lg border border-dashed border-sail-line bg-sail-mist p-4 text-sm text-sail-steel">
                Upload pe vendor analytics yahan animate hoga.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
