import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-28 w-full rounded-md border border-sail-line bg-white px-3 py-2 text-sm leading-6 text-sail-ink outline-none transition focus:border-sail-blue focus:ring-2 focus:ring-sail-blue/15",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
