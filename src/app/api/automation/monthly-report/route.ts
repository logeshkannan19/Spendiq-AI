import { NextResponse } from "next/server";
import { requireAutomationToken } from "@/lib/automation/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateMonthlyReport } from "@/lib/ai/report";
import { sendWhatsappText } from "@/lib/whatsapp/client";

export async function POST(req: Request) {
  if (!requireAutomationToken(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: users, error: usersErr } = await supabase
    .from("users")
    .select("id,phone,name")
    .not("phone", "is", null);
  if (usersErr) return NextResponse.json({ error: usersErr.message }, { status: 400 });

  const now = new Date();
  const month = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
  const monthKey = `${month.getUTCFullYear()}-${String(month.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}`;
  const start = month;
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));

  const results: Array<{ user_id: string; month: string; total: number }> = [];

  for (const u of users ?? []) {
    const { data: expenses, error: expErr } = await supabase
      .from("expenses")
      .select("amount,category,note,created_at")
      .eq("user_id", u.id)
      .gte("created_at", start.toISOString())
      .lt("created_at", end.toISOString());
    if (expErr) continue;

    const total = (expenses ?? []).reduce((a, r) => a + Number(r.amount), 0);
    const by = (expenses ?? []).reduce<Record<string, number>>((acc, r) => {
      const amt = Number(r.amount);
      acc[r.category] = (acc[r.category] ?? 0) + (Number.isFinite(amt) ? amt : 0);
      return acc;
    }, {});
    const top = Object.entries(by)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount }));

    const payload = {
      month: monthKey,
      totals: { total_spend: total },
      top_categories: top,
      expense_count: (expenses ?? []).length,
      sample_expenses: (expenses ?? []).slice(0, 20)
    };

    const report = await generateMonthlyReport(payload);
    await supabase.from("reports").upsert(
      {
        user_id: u.id,
        month: monthKey,
        summary_json: report.summary_json
      },
      { onConflict: "user_id,month" }
    );

    if (u.phone) {
      await sendWhatsappText({ to: u.phone.replace(/^\+/, ""), body: report.whatsapp_message });
    }

    results.push({ user_id: u.id, month: monthKey, total });
  }

  return NextResponse.json({ ok: true, results });
}

