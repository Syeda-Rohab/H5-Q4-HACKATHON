# 🤖 CRM FTE Factory - Hackathon 5

**100% FREE Deployment** - AI-Powered Customer Support Agent built entirely with free services.

## 🚀 Tech Stack (All FREE)

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| **Vercel** | Hosting & Deployment | Hobby Plan (Free) |
| **Supabase** | PostgreSQL Database | 500MB Free |
| **OpenRouter** | AI Models (Llama 3.2, Gemma) | Free Models |
| **Twilio** | WhatsApp Messaging | $15.50 Trial Credit |
| **Gmail API** | Email Support | Free Service Account |

## 📁 Project Structure

```
crm-fte-free/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── support/page.tsx        # Web support form
│   └── api/
│       ├── agent/route.ts      # Main AI agent endpoint
│       ├── webhook/gmail/route.ts
│       └── webhook/whatsapp/route.ts
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── agent.ts                # OpenRouter AI client
│   ├── tools.ts                # 6 Agent tools
│   └── prompts.ts              # System prompts
├── schema.sql                  # Database schema
├── package.json
├── vercel.json
└── .env.local.example
```

## 🛠️ Quick Start (5 Minutes)

### Step 1: Clone & Install

```bash
cd crm-fte-free
npm install
```

### Step 2: Setup FREE Services

#### 2.1 Supabase (Database)
1. Go to [supabase.com](https://supabase.com)
2. Sign up (FREE)
3. Create new project
4. Go to **SQL Editor** → Run `schema.sql`
5. Copy **Project URL** and **Anon Key** from Settings → API

#### 2.2 OpenRouter (AI)
1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up (FREE)
3. Create API Key
4. Copy the key

#### 2.3 Twilio (WhatsApp - Optional)
1. Go to [twilio.com](https://twilio.com)
2. Sign up for FREE trial ($15.50 credit)
3. Enable WhatsApp Sandbox
4. Copy **Account SID** and **Auth Token**

#### 2.4 Gmail API (Email - Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project → Enable Gmail API
3. Create Service Account
4. Download JSON credentials

### Step 3: Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Supabase (Required)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenRouter (Required)
OPENROUTER_API_KEY=your_openrouter_api_key

# Twilio (Optional - for WhatsApp)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Gmail (Optional - for Email)
GMAIL_CLIENT_EMAIL=your_service_account_email
GMAIL_PRIVATE_KEY="your_private_key"

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy to Vercel (FREE)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Set Environment Variables on Vercel

```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add OPENROUTER_API_KEY
vercel env add TWILIO_ACCOUNT_SID
vercel env add TWILIO_AUTH_TOKEN
```

Or set them in Vercel Dashboard → Project Settings → Environment Variables

**Your app is now LIVE at:** `https://your-app.vercel.app` 🎉

## 🎯 Features

### AI Agent Tools
1. **create_ticket** - Create support tickets automatically
2. **search_kb** - Search knowledge base for solutions
3. **get_ticket_status** - Check ticket status
4. **update_ticket_status** - Update and respond to tickets
5. **send_whatsapp** - Send WhatsApp messages
6. **send_gmail** - Send email responses

### Channels
- 🌐 **Web Portal** - Professional support form
- 📱 **WhatsApp** - Twilio integration
- 📧 **Email** - Gmail API integration

## 📊 Database Schema

```sql
customers     - Store customer info
tickets       - Support tickets with status/priority
messages      - Conversation history
knowledge_base - Solution articles
```

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/agent` | POST | Main AI agent endpoint |
| `/api/webhook/gmail` | POST | Gmail webhook |
| `/api/webhook/whatsapp` | POST | WhatsApp webhook |

## 🎨 Pages

- `/` - Landing page with features
- `/support` - Support ticket form

## 💰 Cost Breakdown

| Service | Cost |
|---------|------|
| Vercel | $0 (Hobby) |
| Supabase | $0 (500MB) |
| OpenRouter | $0 (Free models) |
| Twilio | $0 (Trial credit) |
| Gmail API | $0 |
| **TOTAL** | **$0** |

## 🚨 Important Notes

- **OpenRouter Free Models:** Uses `meta-llama/llama-3.2-3b-instruct:free`
- **Twilio Trial:** WhatsApp sandbox mode for testing
- **Rate Limits:** Free tiers have usage limits (sufficient for hackathon)
- **Production:** Upgrade services if needed post-hackathon

## 🏃 Hackathon Demo Flow

1. Open `/support` page
2. Fill form with email & issue
3. AI creates ticket automatically
4. Response via preferred channel
5. Check database for ticket

## 📝 Sample Test

```bash
curl -X POST http://localhost:3000/api/agent \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need help with my account",
    "customerEmail": "test@example.com",
    "customerName": "Test User",
    "channel": "web"
  }'
```

## 🎯 Hackathon Checklist

- [x] Next.js 15 App Router
- [x] Supabase Postgres (FREE)
- [x] OpenRouter AI (FREE models)
- [x] Twilio WhatsApp (FREE trial)
- [x] Vercel Deployment (FREE)
- [x] Tailwind CSS UI
- [x] 6 Agent Tools
- [x] Web Form UI
- [x] Webhooks for WhatsApp/Gmail

## 🙏 Credits

Built for **CRM FTE Factory Hackathon 5**

All services are 100% FREE - No credit card required for demo!

## 📄 License

MIT - Hackathon Project
