import { redirect } from "next/navigation";
import { getDashboardData, requireUser } from "@/lib/db/queries";
import { DashboardHeader } from "@/lib/dashboard/dashboard-header";
import { StatsGrid } from "@/lib/dashboard/stats-grid";
import { ExpenseTable } from "@/lib/dashboard/expense-table";
import { CategoryChart } from "@/lib/dashboard/category-chart";
import { InsightFeed } from "@/lib/dashboard/insight-feed";

export default async function DashboardPage() {
  const { user } = await requireUser();
  if (!user) redirect("/login");

  const data = await getDashboardData(user.id);

  return (
    <main className="flex flex-col gap-6">
      <DashboardHeader />
      <StatsGrid stats={data.stats} />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CategoryChart byCategory={data.charts.byCategory} />
        </div>
        <div className="lg:col-span-2">
          <InsightFeed insights={data.insights} />
        </div>
      </div>
      <ExpenseTable expenses={data.expenses} />
    </main>
  );
}

