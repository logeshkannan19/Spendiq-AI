import OpenAI from "openai";
import { z } from "zod";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(20)
});

export function getOpenAI() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error("Missing OPENAI_API_KEY.");
  }
  return new OpenAI({ apiKey: parsed.data.OPENAI_API_KEY });
}

