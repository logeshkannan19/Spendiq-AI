import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Budget, Expense, Insight } from "@/lib/db/types";

export async function requireUser() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return { user: null, supabase };
  }
  return { user: data.user, supabase };
}

export async function getDashboardData(userId: string) {
  const supabase = createSupabaseServerClient();
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));

  const [expensesRes, budgetsRes, insightsRes] = await Promise.all([
    supabase
      .from("expenses")
      .select("id,user_id,amount,category,note,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("budgets")
      .select("id,user_id,category,limit_amount")
      .eq("user_id", userId)
      .order("category", { ascending: true }),
    supabase
      .from("insights")
      .select("id,user_id,type,message,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10)
  ]);

  if (expensesRes.error) throw expensesRes.error;
  if (budgetsRes.error) throw budgetsRes.error;
  if (insightsRes.error) throw insightsRes.error;

  const expenses = (expensesRes.data ?? []) as Expense[];
  const budgets = (budgetsRes.data ?? []) as Budget[];
  const insights = (insightsRes.data ?? []) as Insight[];

  const monthExpenses = expenses.filter(
    (e) => new Date(e.created_at).getTime() >= monthStart.getTime()
  );
  const totalSpend = sum(monthExpenses.map((e) => e.amount));

  const byCategory = monthExpenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});

  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const budgetAlerts = computeBudgetAlerts(byCategory, budgets);

  return {
    expenses,
    budgets,
    insights,
    stats: {
      totalSpend,
      topCategory,
      budgetAlerts
    },
    charts: {
      byCategory
    }
  };
}

function sum(nums: number[]) {
  return nums.reduce((a, b) => a + b, 0);
}

function computeBudgetAlerts(
  monthByCategory: Record<string, number>,
  budgets: Budget[]
): Array<{ category: string; spent: number; limit: number; ratio: number }> {
  const alerts: Array<{ category: string; spent: number; limit: number; ratio: number }> = [];
  for (const b of budgets) {
    const spent = monthByCategory[b.category] ?? 0;
    if (b.limit_amount <= 0) continue;
    const ratio = spent / b.limit_amount;
    if (ratio >= 1) alerts.push({ category: b.category, spent, limit: b.limit_amount, ratio });
  }
  return alerts.sort((a, b) => b.ratio - a.ratio);
}

