import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/lib/ui/logo";
import { UserMenu } from "@/lib/ui/user-menu";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-wide">Spendiq AI</span>
            <span className="text-xs text-text-muted">Expense intelligence</span>
          </div>
        </Link>
        <Suspense>
          <UserMenu />
        </Suspense>
      </div>
      <div className="mx-auto w-full max-w-6xl px-6 pb-16">{children}</div>
    </div>
  );
}

