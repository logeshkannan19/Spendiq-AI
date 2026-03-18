import { StatCard } from "@/lib/dashboard/stat-card";

export function StatsGrid({
  stats
}: {
  stats: {
    totalSpend: number;
    topCategory: string | null;
    budgetAlerts: Array<{ category: string; spent: number; limit: number; ratio: number }>;
  };
}) {
  const savings = Math.max(0, 0); // future: predicted savings
  const alerts = stats.budgetAlerts.length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Total spend (this month)"
        value={formatMoney(stats.totalSpend)}
        hint={stats.topCategory ? `Top category: ${stats.topCategory}` : "No expenses yet"}
        tone="neutral"
      />
      <StatCard
        title="Savings"
        value={formatMoney(savings)}
        hint="MVP: savings prediction comes from insights workflow"
        tone="good"
      />
      <StatCard
        title="Alerts"
        value={`${alerts}`}
        hint={alerts ? `${alerts} budget(s) exceeded` : "All budgets healthy"}
        tone={alerts ? "warn" : "good"}
      />
    </div>
  );
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0
  }).format(amount);
}

