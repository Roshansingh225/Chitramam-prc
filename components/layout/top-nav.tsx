"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, Crown, Shield, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/play", label: "Mind Reader", icon: BrainCircuit },
  { href: "/admin", label: "Admin", icon: Shield }
] as const;

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="glass-panel mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-200 shadow-glow">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-base uppercase tracking-[0.3em] text-white sm:text-lg">
              IPL Mind Reader AI
            </p>
            <p className="font-accent text-xs uppercase tracking-[0.25em] text-cyan-100/70">
              Futuristic Cricket Oracle
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-2 font-accent text-xs uppercase tracking-[0.25em] transition duration-300 sm:text-sm",
                  active
                    ? "border-cyan-300/50 bg-cyan-300/15 text-white shadow-glow"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-cyan-300/30 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
