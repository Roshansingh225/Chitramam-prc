"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileText, ShieldCheck, UploadCloud, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/upload", label: "Upload PRC Data", icon: UploadCloud }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen">
      <aside className="fixed left-0 top-0 z-20 hidden h-screen w-64 border-r border-sail-line bg-sail-ink text-white lg:block">
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-white text-sail-ink">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide">SAIL PRC</div>
            <div className="text-xs text-white/65">Chitra Mam Workspace</div>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white",
                  active && "bg-white text-sail-ink hover:bg-white hover:text-sail-ink"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-3 right-3 overflow-hidden rounded-lg border border-white/10 bg-white/[0.07] p-4">
          <div className="steel-scan absolute inset-x-0 top-0 h-px bg-white/60" />
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-white text-sail-ink">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">Chitra Mam</div>
              <div className="text-xs text-white/65">AM (Purchase)</div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-md border border-white/10 bg-black/15 px-3 py-2 text-xs text-white/75">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            PRC drafting desk ready
          </div>
        </div>
      </aside>
      <header className="sticky top-0 z-10 border-b border-sail-line bg-white/90 backdrop-blur lg:pl-64">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="lg:hidden">
            <div className="text-sm font-semibold text-sail-ink">SAIL PRC</div>
            <div className="text-xs text-sail-steel">Chitra Mam Workspace</div>
          </div>
          <div className="hidden items-center gap-3 text-sm text-sail-steel lg:flex">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            Chitra Mam procurement workspace
          </div>
          <div className="flex items-center gap-2 rounded-md border border-sail-line bg-sail-mist px-3 py-2 text-sm font-semibold text-sail-ink">
            <UserRound className="h-4 w-4 text-sail-blue" />
            Chitra Mam
          </div>
        </div>
      </header>
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">{children}</div>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-2 border-t border-sail-line bg-white lg:hidden">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("flex h-14 flex-col items-center justify-center text-xs text-sail-steel", active && "text-sail-blue")}
            >
              <Icon className="mb-1 h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
