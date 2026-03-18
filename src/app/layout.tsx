import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/ui/cn";
import { AppShell } from "@/lib/ui/shell";

export const metadata: Metadata = {
  title: "Spendiq AI",
  description: "AI-powered expense tracking with WhatsApp automation and smart insights."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={cn("min-h-screen", "grid-bg")}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

