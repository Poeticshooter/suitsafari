# Suitsafari — Go-Live Checklist

Follow this step by step. Tick each box as you complete it.

---

## STEP 1: Push to GitHub

```bash
# Already committed locally. Just push to GitHub.
gh repo create suitsafari --public --push
```

✅ Done: _______

---

## STEP 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Add New → Project"
3. Import the `suitsafari` repo from GitHub
4. In "Environment Variables" section, add these:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://imnhpobuqlsqqgehooid.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltbmhwb2J1cWxzcXFnZWhvb2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MTI0MzQsImV4cCI6MjA5NjM4ODQzNH0.w8AANbZvkOceVCa1_iH_y_WxUCIGLE9xOupk97SSXnE` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltbmhwb2J1cWxzcXFnZWhvb2lkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDgxMjQzNCwiZXhwIjoyMDk2Mzg4NDM0fQ.mktqHF8XfxhYjWZDY4HgpDctw9uKxkna_wN0yro1MDY` |
| `WHATSAPP_PHONE_NUMBER_ID` | (get from Step 3) |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | (get from Step 3) |
| `WHATSAPP_ACCESS_TOKEN` | (get from Step 3) |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | `suitsafari-webhook-token` |
| `NEXT_PUBLIC_SITE_URL` | `https://suitsafari.vercel.app` |

5. Click "Deploy"

✅ Done: _______

---

## STEP 3: Set Up WhatsApp Cloud API (30 mins)

### 3a. Create Meta App
1. Go to https://developers.facebook.com
2. Click "My Apps" → "Create App"
3. Choose "Business" → Next
4. App name: `Suitsafari`
5. Add WhatsApp → Click "Set Up"
6. You'll see a **Phone Number ID** and **WhatsApp Business Account ID** — copy both

### 3b. Get Access Token
1. In the same page, click "Manage" next to your WhatsApp account
2. Go to "API Setup" tab
3. Click "Generate Token" — copy the token string

### 3c. Add to Vercel
1. Go to Vercel project → Settings → Environment Variables
2. Add the 3 WhatsApp values you just copied
3. Redeploy the project (Settings → Git → redeploy, or push a change)

### 3d. Set up Webhook
1. In Meta App dashboard → WhatsApp → Configuration → Webhook
2. Callback URL: `https://suitsafari.vercel.app/api/webhook/whatsapp`
3. Verify Token: `suitsafari-webhook-token`
4. Click "Verify and Save"
5. Subscribe to: `messages` (and optionally `message_deliveries`)

✅ Done: _______

---

## STEP 4: Test the Admin Panel

1. Go to `https://suitsafari.vercel.app/admin/login`
2. Login: `shyam@suitsafari.in` / `suitsafari@2026`
3. You should see the dashboard with stats

✅ Done: _______

---

## STEP 5: Send a Test WhatsApp Message

1. In admin panel, go to Settings
2. Enter your personal phone number (with 91 prefix): `919XXXXXXXXX`
3. Type: `नमस्कार! Suitsafari लाईव्ह आहे! 🎉`
4. Click "Send"
5. You should receive it on your phone

✅ Done: _______

---

## STEP 6: Place the First Order

1. Open `https://suitsafari.vercel.app/order` in a browser
2. Select "शर्ट" (shirt)
3. Enter name: `तेस्त ग्राहक`
4. Enter phone: your own number (10 digits)
5. Click Submit
6. Your father (tailor #1) should get the WhatsApp message with ✅ / ❌ buttons

✅ Done: _______

---

## STEP 7: Father Accepts the Order

1. Father taps ✅ on WhatsApp
2. You (as customer) should get a confirmation message
3. In admin panel, go to Orders — status should show "स्वीकारले"
4. Mark it as complete in admin: click "पूर्ण झाले"

✅ Done: _______

---

## STEP 8: Activate Your Social Media

| Platform | Action | Time |
|---|---|---|
| **Instagram** | Post father's photo + "Suitsafari पुन्हा सुरू! लातूरमध्ये चांगला दर्जी आता WhatsApp वर." | Today |
| **Facebook** | Share to "Latur City" groups | Today |
| **Google Business Profile** | Update profile, add link to new site | Today |
| **WhatsApp Broadcast** | Send to your existing customers (32+ from Yappe reviews) | Today |
| **Justdial** | Update listing with new website link | Today |

✅ Done: _______

---

## STEP 9: Onboard More Tailors

| Task | How |
|---|---|
| Show father the system working | Let him see his first WhatsApp order |
| Ask him for 5 nearby tailor friends | Go together, show them |
| Admin → Tailors → Add New | Enter their name, phone, shop name |
| Take 2 photos of their best work | Upload to their profile later |

✅ Done: _______

---

## STEP 10: Monitor & Improve

| What to Watch | How Often |
|---|---|
| Admin dashboard stats | Daily |
| WhatsApp messages (any failures?) | Daily |
| Customer reviews coming in | Weekly |
| Which tailors are getting orders | Weekly |
| Instagram follower growth | Weekly |

---

## Quick Reference URLs

| Page | URL |
|---|---|
| Admin Login | `https://suitsafari.vercel.app/admin/login` |
| Order Page | `https://suitsafari.vercel.app/order` |
| Tailor Directory | `https://suitsafari.vercel.app/tailors` |
| Your Father's Profile | `https://suitsafari.vercel.app/tailors/7836ea32-243a-498d-ad7e-acb769a2ad41` |
| Health Check | `https://suitsafari.vercel.app/api/health` |
| Sitemap | `https://suitsafari.vercel.app/api/sitemap` |
| WhatsApp Webhook | `https://suitsafari.vercel.app/api/webhook/whatsapp` |
| LLMs.txt (AI discoverability) | `https://suitsafari.vercel.app/llms.txt` |
| Supabase Dashboard | `https://supabase.com/dashboard/project/imnhpobuqlsqqgehooid` |
| Meta WhatsApp Dashboard | `https://developers.facebook.com` |

---

## Day 1 Launch Timeline

| Time | Action |
|---|---|
| **10:00 AM** | Deploy to Vercel + set WhatsApp keys |
| **11:00 AM** | Test order → father accepts on WhatsApp |
| **12:00 PM** | Instagram post: father's story + launch |
| **1:00 PM** | WhatsApp broadcast to existing customers |
| **3:00 PM** | First real customer order |
| **5:00 PM** | Onboard 1-2 more tailors with father |
| **8:00 PM** | Post first completed order photo on Instagram |

---

**Print this. Tick each box. You'll be live in 2-3 hours.**
