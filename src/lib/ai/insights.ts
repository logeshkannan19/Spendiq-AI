import { z } from "zod";
import { getOpenAI } from "@/lib/ai/openai";
import { loadPrompt } from "@/lib/ai/prompt-loader";

const insightOutSchema = z.object({
  insights: z.array(
    z.object({
      type: z.enum(["trend", "budget", "anomaly", "tip"]),
      message: z.string().min(1).max(200)
    })
  )
});

export async function generateInsights(payload: unknown) {
  const openai = getOpenAI();
  const system = await loadPrompt("prompts/insight-generator.md");
  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      { role: "system", content: system },
      { role: "user", content: JSON.stringify(payload) }
    ],
    response_format: { type: "json_object" }
  });
  const text = resp.choices[0]?.message?.content ?? "{}";
  return insightOutSchema.parse(JSON.parse(text));
}

