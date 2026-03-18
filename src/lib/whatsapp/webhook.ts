import { z } from "zod";

// Minimal WhatsApp Cloud webhook shapes we rely on.
export const whatsappWebhookSchema = z.object({
  entry: z.array(
    z.object({
      changes: z.array(
        z.object({
          value: z.object({
            messages: z
              .array(
                z.object({
                  from: z.string(),
                  id: z.string(),
                  timestamp: z.string(),
                  type: z.string(),
                  text: z.object({ body: z.string() }).optional()
                })
              )
              .optional()
          })
        })
      )
    })
  )
});

export type WhatsappWebhook = z.infer<typeof whatsappWebhookSchema>;

export function extractInboundText(payload: WhatsappWebhook) {
  const msg =
    payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0] ??
    null;
  const from = msg?.from ?? null;
  const text = msg?.text?.body ?? null;
  return { from, text, messageId: msg?.id ?? null };
}

