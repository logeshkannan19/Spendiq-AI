import { NextResponse } from "next/server";
import { requireAutomationToken } from "@/lib/automation/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateInsights } from "@/lib/ai/insights";
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
  const since = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 14); // last 14 days

  const results: Array<{ user_id: string; insights: number }> = [];
  for (const u of users ?? []) {
    const [expensesRes, budgetsRes] = await Promise.all([
      supabase
        .from("expenses")
        .select("amount,category,note,created_at")
        .eq("user_id", u.id)
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("budgets")
        .select("category,limit_amount")
        .eq("user_id", u.id)
    ]);
    if (expensesRes.error) continue;
    if (budgetsRes.error) continue;

    const payload = {
      user: { id: u.id, name: u.name },
      horizon_days: 14,
      expenses: expensesRes.data ?? [],
      budgets: budgetsRes.data ?? []
    };

    const out = await generateInsights(payload);
    const messages = out.insights.slice(0, 6);
    for (const i of messages) {
      await supabase.from("insights").insert({
        user_id: u.id,
        type: i.type,
        message: i.message
      });
    }

    if (u.phone) {
      const whatsappBody =
        `📌 *Spendiq daily insights*\n\n` +
        messages.map((m) => `- ${m.message}`).join("\n");
      await sendWhatsappText({ to: u.phone.replace(/^\+/, ""), body: whatsappBody });
    }

    results.push({ user_id: u.id, insights: messages.length });
  }

  return NextResponse.json({ ok: true, results });
}

