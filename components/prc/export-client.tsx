"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Download, FileText, Loader2, Printer, RefreshCw } from "lucide-react";
import { exportUrl, getPrc } from "@/lib/api";
import type { PrcRecord } from "@/lib/types";
import { formatMoney, formatPercent } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ExportClient({ id }: { id: string }) {
  const [record, setRecord] = useState<PrcRecord>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPrc(id)
      .then(setRecord)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="grid min-h-80 place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-sail-blue" />
      </div>
    );
  }

  if (!record) {
    return <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">PRC not found</div>;
  }

  const summary = record.extraction.summary;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-sail-ink">Export PRC</h1>
            <Badge>{record.extraction.metadata.prNumber || "PR unmapped"}</Badge>
          </div>
          <p className="mt-1 text-sm text-sail-steel">DOCX and PDF generated from the final editable draft</p>
        </div>
        <Button asChild variant="secondary">
          <Link href={`/preview/${record.id}`}>
            <RefreshCw className="h-4 w-4" />
            Back to Preview
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-sail-steel">Items</div>
            <div className="mt-1 text-xl font-semibold">{summary.itemCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-sail-steel">EV</div>
            <div className="mt-1 text-xl font-semibold">{formatMoney(summary.estimatedValue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-sail-steel">Deviation</div>
            <div className="mt-1 text-xl font-semibold">{formatPercent(summary.negotiatedDeviation)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-sail-steel">Savings</div>
            <div className="mt-1 text-xl font-semibold">{formatMoney(summary.savings)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="shadow-panel">
          <CardHeader>
            <CardTitle>DOCX</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid h-24 w-24 place-items-center rounded-lg bg-sail-mist text-sail-blue">
              <FileText className="h-9 w-9" />
            </div>
            <p className="text-sm leading-6 text-sail-steel">Editable official PRC minutes with PRC table, notes, recommendation and signature block.</p>
            <Button asChild>
              <a href={exportUrl(record.id, "docx")}>
                <Download className="h-4 w-4" />
                Download DOCX
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-panel">
          <CardHeader>
            <CardTitle>PDF</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid h-24 w-24 place-items-center rounded-lg bg-sail-mist text-sail-blue">
              <Printer className="h-9 w-9" />
            </div>
            <p className="text-sm leading-6 text-sail-steel">Print-ready PDF for sharing with committee members and approvals.</p>
            <Button asChild variant="secondary">
              <a href={exportUrl(record.id, "pdf")}>
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
