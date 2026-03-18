import { NextResponse } from "next/server";
import { requireAutomationToken } from "@/lib/automation/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendWhatsappText } from "@/lib/whatsapp/client";

export async function POST(req: Request) {
  if (!requireAutomationToken(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: users, error: usersErr } = await supabase
    .from("users")
    .select("id,phone")
    .not("phone", "is", null);
  if (usersErr) return NextResponse.json({ error: usersErr.message }, { status: 400 });

  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));

  const alerts: Array<{ user_id: string; category: string; spent: number; limit: number }> = [];

  for (const u of users ?? []) {
    const [budgetsRes, expensesRes] = await Promise.all([
      supabase
        .from("budgets")
        .select("category,limit_amount")
        .eq("user_id", u.id),
      supabase
        .from("expenses")
        .select("amount,category,created_at")
        .eq("user_id", u.id)
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString())
    ]);
    if (budgetsRes.error || expensesRes.error) continue;

    const byCategory = (expensesRes.data ?? []).reduce<Record<string, number>>((acc, r) => {
      const amt = Number(r.amount);
      acc[r.category] = (acc[r.category] ?? 0) + (Number.isFinite(amt) ? amt : 0);
      return acc;
    }, {});

    for (const b of budgetsRes.data ?? []) {
      const spent = byCategory[b.category] ?? 0;
      if (b.limit_amount > 0 && spent >= b.limit_amount) {
        alerts.push({
          user_id: u.id,
          category: b.category,
          spent,
          limit: b.limit_amount
        });
      }
    }

    if (u.phone) {
      const userAlerts = alerts.filter((a) => a.user_id === u.id);
      for (const a of userAlerts) {
        const msg =
          `🚨 Budget alert: *${a.category}*\n` +
          `Spent: *${formatMoney(a.spent)}* / Limit: *${formatMoney(a.limit)}*\n\n` +
          `Tip: try pausing non-essential spend in this category for a few days 💡`;
        await sendWhatsappText({ to: u.phone.replace(/^\+/, ""), body: msg });
        await supabase.from("insights").insert({
          user_id: u.id,
          type: "budget",
          message: `🚨 ${a.category} budget exceeded (${formatMoney(a.spent)} / ${formatMoney(
            a.limit
          )})`
        });
      }
    }
  }

  return NextResponse.json({ ok: true, alerts });
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0
  }).format(amount);
}

