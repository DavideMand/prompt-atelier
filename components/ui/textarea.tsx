import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-24 w-full resize-y rounded-md border border-input bg-white/70 px-3 py-2 text-sm leading-6 outline-none transition focus:ring-2 focus:ring-ring",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
