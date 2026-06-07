# Suitsafari

चांगलं कपडं, हमखास. — Good clothes, guaranteed.

A WhatsApp-first platform connecting customers with trusted local tailors in Latur, Maharashtra.

## Tech Stack

- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS 4
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Messaging:** WhatsApp Cloud API
- **Hosting:** Vercel (free tier)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Supabase account (free)
- Meta Developer account (for WhatsApp API)

### Setup

```bash
# Install dependencies
pnpm install

# Copy env template and fill in your values
cp .env.example .env.local

# Run development server
pnpm dev
```

### Database

Run `supabase/schema.sql` in your Supabase SQL editor to create all tables, indexes, and RLS policies.

### Admin Login

1. Create an admin user in Supabase Auth (email/password)
2. Login at `/admin/login`
3. Default credentials configured via `.env.local`

## Deploy to Vercel

```bash
# Push to GitHub first
gh repo create suitsafari --public --push

# Then deploy
vercel --prod
```

Set the following environment variables in Vercel:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp Business Phone Number ID |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | WhatsApp Business Account ID |
| `WHATSAPP_ACCESS_TOKEN` | WhatsApp API access token |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | Custom webhook verify token |

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/orders` | POST | Create new order |
| `/api/orders` | GET | List orders (admin) |
| `/api/orders/[id]` | PATCH | Update order status |
| `/api/orders/[id]` | GET | Get order details |
| `/api/tailors` | GET | List active tailors |
| `/api/tailors` | POST | Add new tailor (admin) |
| `/api/reviews` | POST | Submit review |
| `/api/reviews` | GET | List reviews |
| `/api/webhook/whatsapp` | POST | WhatsApp incoming messages |
| `/api/health` | GET | Health check |
| `/api/sitemap` | GET | Dynamic XML sitemap |

## WhatsApp Message Flow

1. Customer places order → System finds nearest tailor
2. Tailor receives WhatsApp: "नवीन ऑर्डर - स्वीकारा/नाकारा"
3. Tailor taps ✅ → Customer gets confirmation
4. Tailor sends "तयार" → Customer gets completion message
5. Customer receives rating request (1-5 stars)

## License

MIT
