import * as React from "react";
import { cn } from "@/lib/ui/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition",
        "focus:outline-none focus:ring-2 focus:ring-accent/60 focus:ring-offset-0",
        variant === "primary" &&
          "bg-accent text-white hover:brightness-110 active:brightness-95",
        variant === "ghost" &&
          "border border-card-border/60 bg-white/0 text-text hover:bg-white/5",
        className
      )}
      {...props}
    />
  );
}

