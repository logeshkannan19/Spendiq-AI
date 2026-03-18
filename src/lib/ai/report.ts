import { z } from "zod";
import { getOpenAI } from "@/lib/ai/openai";
import { loadPrompt } from "@/lib/ai/prompt-loader";

const outSchema = z.object({
  summary_json: z.object({
    month: z.string().regex(/^\d{4}-\d{2}$/),
    total_spend: z.number(),
    top_categories: z.array(z.object({ category: z.string(), amount: z.number() })),
    savings_tips: z.array(z.string())
  }),
  whatsapp_message: z.string().min(1)
});

export async function generateMonthlyReport(payload: unknown) {
  const openai = getOpenAI();
  const system = await loadPrompt("prompts/report-generator.md");
  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    messages: [
      { role: "system", content: system },
      { role: "user", content: JSON.stringify(payload) }
    ],
    response_format: { type: "json_object" }
  });
  const text = resp.choices[0]?.message?.content ?? "{}";
  return outSchema.parse(JSON.parse(text));
}

