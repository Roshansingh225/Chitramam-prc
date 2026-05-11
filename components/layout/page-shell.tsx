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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(215,173,87,0.18),transparent_26%),radial-gradient(circle_at_bottom,rgba(244,235,208,0.06),transparent_28%),linear-gradient(180deg,rgba(3,18,8,0.08),rgba(3,18,8,0.36))]" />
      <TopNav />
      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
