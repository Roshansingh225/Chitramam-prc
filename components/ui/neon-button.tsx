import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "success";
}

export function NeonButton({ className, variant = "primary", ...props }: NeonButtonProps) {
  return (
    <button
      className={cn(
        "rounded-full border px-5 py-3 font-accent text-sm uppercase tracking-[0.28em] transition duration-300",
        variant === "primary" &&
          "border-cyan-300/40 bg-cyan-300/15 text-white shadow-glow hover:bg-cyan-300/20",
        variant === "ghost" && "border-white/10 bg-white/5 text-white/85 hover:border-white/30 hover:bg-white/10",
        variant === "success" &&
          "border-emerald-300/40 bg-emerald-300/15 text-emerald-50 hover:bg-emerald-300/20",
        className
      )}
      {...props}
    />
  );
}
