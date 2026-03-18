import { z } from "zod";

const schema = z.object({
  AUTOMATION_TOKEN: z.string().min(8)
});

export function requireAutomationToken(req: Request) {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error("Missing AUTOMATION_TOKEN.");
  }
  const got = req.headers.get("x-spendiq-token");
  if (!got || got !== parsed.data.AUTOMATION_TOKEN) {
    return false;
  }
  return true;
}

