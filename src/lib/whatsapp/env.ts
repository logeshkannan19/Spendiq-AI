import { z } from "zod";

const schema = z.object({
  WHATSAPP_ACCESS_TOKEN: z.string().min(10),
  WHATSAPP_PHONE_NUMBER_ID: z.string().min(3)
});

export function getWhatsappEnv() {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(
      "Missing WhatsApp env. Set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID."
    );
  }
  return parsed.data;
}

