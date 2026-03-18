import { getWhatsappEnv } from "@/lib/whatsapp/env";

type SendTextArgs = {
  to: string;
  body: string;
};

export async function sendWhatsappText({ to, body }: SendTextArgs) {
  const { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = getWhatsappEnv();
  const url = `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body }
    })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WhatsApp send failed: ${res.status} ${text}`);
  }
}

