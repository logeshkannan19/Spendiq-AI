import { z } from "zod";
import { getOpenAI } from "@/lib/ai/openai";
import { loadPrompt } from "@/lib/ai/prompt-loader";

export const intentSchema = z.object({
  action: z.enum([
    "add_expense",
    "query_month_total",
    "query_category_total",
    "set_budget",
    "unknown"
  ]),
  amount: z.number().nullable(),
  category: z.string().nullable(),
  note: z.string().nullable()
});

export type Intent = z.infer<typeof intentSchema>;

export async function detectIntent(message: string): Promise<Intent> {
  const openai = getOpenAI();
  const system = await loadPrompt("prompts/intent-detector.md");

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages: [
      { role: "system", content: system },
      { role: "user", content: message }
    ],
    response_format: { type: "json_object" }
  });

  const text = resp.choices[0]?.message?.content ?? "{}";
  const parsed = intentSchema.safeParse(JSON.parse(text));
  if (!parsed.success) {
    return { action: "unknown", amount: null, category: null, note: null };
  }
  return parsed.data;
}

