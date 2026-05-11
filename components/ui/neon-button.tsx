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
          "border-amber-200/30 bg-leather/85 text-cream shadow-glow hover:bg-leather/95",
        variant === "ghost" && "border-white/10 bg-black/15 text-white/85 hover:border-amber-200/25 hover:bg-white/10",
        variant === "success" &&
          "border-emerald-300/30 bg-emerald-700/55 text-emerald-50 hover:bg-emerald-700/70",
        className
      )}
      {...props}
    />
  );
}
