import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function indianGroup(integerPart: string): string {
  const sign = integerPart.startsWith("-") ? "-" : "";
  const digits = integerPart.replace("-", "");
  if (digits.length <= 3) return `${sign}${digits}`;
  const lastThree = digits.slice(-3);
  const leading = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${sign}${leading},${lastThree}`;
}

function trimDecimal(value: number): string {
  return value.toFixed(1).replace(/\.0$/, "");
}

export function formatMoney(value: number | undefined, compact = false): string {
  const amount = Number.isFinite(value) ? Number(value) : 0;
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  if (compact) {
    if (abs >= 10000000) return `${sign}₹${trimDecimal(abs / 10000000)}Cr`;
    if (abs >= 100000) return `${sign}₹${trimDecimal(abs / 100000)}L`;
    if (abs >= 1000) return `${sign}₹${trimDecimal(abs / 1000)}K`;
    return `${sign}₹${trimDecimal(abs)}`;
  }

  const [integerPart, decimalPart] = abs.toFixed(2).split(".");
  return `${sign}₹${indianGroup(integerPart)}.${decimalPart}`;
}

export function formatPercent(value: number | undefined): string {
  return `${((value || 0) * 100).toFixed(2)}%`;
}
