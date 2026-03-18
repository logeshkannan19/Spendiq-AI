import { NextResponse } from "next/server";
import { z } from "zod";
import { whatsappWebhookSchema, extractInboundText } from "@/lib/whatsapp/webhook";
import { detectIntent } from "@/lib/ai/intent";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendWhatsappText } from "@/lib/whatsapp/client";

const verifySchema = z.object({
  "hub.mode": z.string().optional(),
  "hub.verify_token": z.string().optional(),
  "hub.challenge": z.string().optional()
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = verifySchema.parse(Object.fromEntries(url.searchParams.entries()));
  const mode = parsed["hub.mode"];
  const token = parsed["hub.verify_token"];
  const challenge = parsed["hub.challenge"];

  if (mode === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return NextResponse.json({ error: "forbidden" }, { status: 403 });
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = whatsappWebhookSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: true }); // WhatsApp retries; keep it 200.
  }

  const { from, text } = extractInboundText(parsed.data);
  if (!from || !text) return NextResponse.json({ ok: true });

  const supabase = createSupabaseAdminClient();
  const { data: userRow, error: userErr } = await supabase
    .from("users")
    .select("id, phone, name")
    .eq("phone", `+${from}`)
    .maybeSingle();

  if (userErr || !userRow?.id) {
    await safeReply(from, "👋 Hey! Please link your number in Spendiq first: open the dashboard → Settings → WhatsApp link.");
    return NextResponse.json({ ok: true });
  }

  const intent = await detectIntent(text);

  if (intent.action === "add_expense" && intent.amount && intent.category) {
    const { error: insertErr } = await supabase.from("expenses").insert({
      user_id: userRow.id,
      amount: intent.amount,
      category: intent.category,
      note: intent.note
    });

    if (insertErr) {
      await safeReply(from, `⚠️ I couldn’t save that expense (${insertErr.message}). Try again?`);
      return NextResponse.json({ ok: true });
    }

    await safeReply(
      from,
      `✅ Logged *${formatMoney(intent.amount)}* in *${intent.category}*${intent.note ? ` — ${intent.note}` : ""}\n\nWant a recap? Ask: “How much did I spend this month?” 📊`
    );
    return NextResponse.json({ ok: true });
  }

  if (intent.action === "set_budget" && intent.amount && intent.category) {
    const { error: upErr } = await supabase.from("budgets").upsert(
      {
        user_id: userRow.id,
        category: intent.category,
        limit_amount: intent.amount
      },
      { onConflict: "user_id,category" }
    );
    if (upErr) {
      await safeReply(from, `⚠️ I couldn’t set that budget (${upErr.message}).`);
      return NextResponse.json({ ok: true });
    }
    await safeReply(from, `🎯 Budget set: *${intent.category}* = *${formatMoney(intent.amount)}* / month`);
    return NextResponse.json({ ok: true });
  }

  if (intent.action === "query_month_total") {
    const { start, end, monthLabel } = monthRangeUTC(new Date());
    const { data: rows, error } = await supabase
      .from("expenses")
      .select("amount,category,created_at")
      .eq("user_id", userRow.id)
      .gte("created_at", start.toISOString())
      .lt("created_at", end.toISOString());
    if (error) {
      await safeReply(from, `⚠️ I couldn’t compute that right now (${error.message}).`);
      return NextResponse.json({ ok: true });
    }
    const total = (rows ?? []).reduce((a, r) => a + Number(r.amount), 0);
    const top = topCategory(rows ?? []);
    await safeReply(
      from,
      `📅 *${monthLabel} spend so far*: *${formatMoney(total)}*\n${top ? `🏷️ Top category: *${top.category}* (${formatMoney(top.amount)})` : "Add a few expenses and I’ll start spotting patterns 🤝"}`
    );
    return NextResponse.json({ ok: true });
  }

  if (intent.action === "query_category_total" && intent.category) {
    const { start, end, monthLabel } = monthRangeUTC(new Date());
    const { data: rows, error } = await supabase
      .from("expenses")
      .select("amount,category,created_at")
      .eq("user_id", userRow.id)
      .eq("category", intent.category)
      .gte("created_at", start.toISOString())
      .lt("created_at", end.toISOString());
    if (error) {
      await safeReply(from, `⚠️ I couldn’t compute that right now (${error.message}).`);
      return NextResponse.json({ ok: true });
    }
    const total = (rows ?? []).reduce((a, r) => a + Number(r.amount), 0);
    await safeReply(
      from,
      `📅 *${monthLabel}* · *${intent.category}*: *${formatMoney(total)}*\nWant the full breakdown? Open your dashboard 📊`
    );
    return NextResponse.json({ ok: true });
  }

  await safeReply(
    from,
    "Got it. Try:\n- “Spent 50 on food”\n- “Set food budget 1200”\n- “How much did I spend this month?” 🙂"
  );
  return NextResponse.json({ ok: true });
}

async function safeReply(to: string, body: string) {
  try {
    await sendWhatsappText({ to, body });
  } catch {
    // Ignore; webhook must still 200.
  }
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0
  }).format(amount);
}

function monthRangeUTC(d: Date) {
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0));
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1, 0, 0, 0));
  const monthLabel = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(
    d
  );
  return { start, end, monthLabel };
}

function topCategory(rows: Array<{ amount: any; category: string }>) {
  const by = rows.reduce<Record<string, number>>((acc, r) => {
    const amt = Number(r.amount);
    acc[r.category] = (acc[r.category] ?? 0) + (Number.isFinite(amt) ? amt : 0);
    return acc;
  }, {});
  const entry = Object.entries(by).sort((a, b) => b[1] - a[1])[0];
  if (!entry) return null;
  return { category: entry[0], amount: entry[1] };
}

