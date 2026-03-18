import Link from "next/link";
import { Button } from "@/lib/ui/button";

export function DashboardHeader() {
  return (
    <div className="glass flex flex-col justify-between gap-4 rounded-xl p-6 md:flex-row md:items-center">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-text-muted">
          Your month-at-a-glance spend, budgets, and AI insights.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/dashboard/settings">
          <Button variant="ghost">Settings</Button>
        </Link>
        <Link href="/dashboard/new">
          <Button>Add expense</Button>
        </Link>
      </div>
    </div>
  );
}

