export function formatIndianCurrency(value: number | null | undefined, withSymbol = false): string {
  const amount = Number(value || 0);
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
  return withSymbol ? `Rs. ${formatted}` : formatted;
}

export function formatPercent(value: number | null | undefined): string {
  const percent = Number(value || 0) * 100;
  return `${percent.toFixed(2)}%`;
}

export function sentenceList(items: Array<number | string>): string {
  if (items.length === 0) return "";
  if (items.length === 1) return String(items[0]);
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function todayIso(): string {
  return new Date().toISOString();
}
