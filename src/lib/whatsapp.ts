const API_VERSION = 'v22.0'
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`

interface WhatsAppConfig {
  phoneNumberId: string
  accessToken: string
}

function getConfig(): WhatsAppConfig {
  return {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN!,
  }
}

export async function sendWhatsAppMessage(
  to: string,
  body: string,
  type: 'text' | 'interactive' = 'text',
  interactive?: Record<string, unknown>
) {
  const config = getConfig()
  const payload: Record<string, unknown> = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
  }

  if (type === 'interactive' && interactive) {
    payload.type = 'interactive'
    payload.interactive = interactive
  } else {
    payload.type = 'text'
    payload.text = { body, preview_url: false }
  }

  const res = await fetch(
    `${BASE_URL}/${config.phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )

  const data = await res.json()
  if (!res.ok) {
    console.error('WhatsApp API error:', data)
    throw new Error(data.error?.message || 'Failed to send WhatsApp message')
  }
  return data
}

export function newOrderTailorMessage(
  customerName: string,
  garmentType: string,
  price: number,
  address: string
) {
  return {
    type: 'interactive' as const,
    interactive: {
      type: 'button',
      body: {
        text: `🧵 नवीन ऑर्डर - Suitsafari\n─────────────────────\nग्राहक: ${customerName}\nकाम: ${garmentType}\nकिंमत: ₹${price}\nपत्ता: ${address}\n─────────────────────`,
      },
      action: {
        buttons: [
          { type: 'reply', reply: { id: 'accept', title: '✅ स्वीकारा' } },
          { type: 'reply', reply: { id: 'reject', title: '❌ नाकारा' } },
        ],
      },
    },
  }
}

export function confirmationCustomerMessage(
  tailorName: string,
  tailorPhone: string,
  tailorAddress: string
) {
  return `✅ ऑर्डर कन्फर्म!\nतुमची ऑर्डर दर्जी ${tailorName} यांच्याकडे तयार होईल.\nसंपर्क: ${tailorPhone}\nपत्ता: ${tailorAddress}`
}

export function completionMessage() {
  return `🎉 तुमची ऑर्डर तयार आहे!\nकृपया दर्जीकडे जाऊन घ्या.\n`
}

export function reviewRequestMessage() {
  return `⭐ Suitsafari वर तुमचा अनुभव कसा होता?\nकृपया 1 ते 5 पर्यंत रेटिंग द्या:\n(5 = खूप छान, 1 = वाईट)`
}

export function monthlyBillMessage(
  subscription: number,
  orderCount: number,
  commissionAmount: number,
  total: number,
  dueDate: string
) {
  return `📋 Suitsafari मासिक बिल\n─────────────────────\nसबस्क्रिप्शन: ₹${subscription}\nकमिशन (${orderCount} ऑर्डर × ₹25): ₹${commissionAmount}\nएकूण: ₹${total}\n─────────────────────\nकृपया ${dueDate} पर्यंत भरणा करा.\n`
}
