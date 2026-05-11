import { ReactNode } from "react";

import { StadiumScene } from "@/components/scene/stadium-scene";
import { TopNav } from "@/components/layout/top-nav";

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <StadiumScene />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(75,225,255,0.16),transparent_28%),radial-gradient(circle_at_bottom,rgba(113,255,187,0.06),transparent_28%)]" />
      <TopNav />
      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
