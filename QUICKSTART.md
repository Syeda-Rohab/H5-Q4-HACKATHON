# CRM FTE Factory - Quick Start Guide

## ✅ Project Generated Successfully!

### 📁 Location: `C:\Users\Dell\Desktop\H5\crm-fte-free`

---

## 🚀 Quick Deploy (3 Steps)

### Step 1: Setup FREE Services (5 minutes)

#### 1.1 Supabase (Database)
```
1. Go to https://supabase.com
2. Sign up FREE
3. Create new project
4. SQL Editor → Run schema.sql
5. Copy: Project URL + Anon Key
```

#### 1.2 OpenRouter (AI - FREE)
```
1. Go to https://openrouter.ai
2. Sign up FREE
3. Create API Key
4. Copy the key
```

#### 1.3 Twilio (WhatsApp - Optional)
```
1. Go to https://twilio.com
2. FREE trial ($15.50 credit)
3. Enable WhatsApp Sandbox
4. Copy: Account SID + Auth Token
```

### Step 2: Configure Environment

```bash
cd crm-fte-free
copy .env.local.example .env.local
```

Edit `.env.local` with your keys:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
OPENROUTER_API_KEY=your_openrouter_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### Step 3: Deploy to Vercel (FREE)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Set environment variables when prompted or in Vercel Dashboard.

**DONE!** Your app is LIVE at `https://your-app.vercel.app` 🎉

---

## 💻 Local Development

```bash
cd crm-fte-free
npm run dev
```

Open: http://localhost:3000

---

## 📊 What's Included

### Pages
- ✅ `/` - Landing page
- ✅ `/support` - Support form

### API Endpoints
- ✅ `/api/agent` - AI Agent
- ✅ `/api/webhook/gmail` - Gmail webhook
- ✅ `/api/webhook/whatsapp` - WhatsApp webhook

### FREE Services
- ✅ Vercel Hosting (FREE Hobby)
- ✅ Supabase Postgres (FREE 500MB)
- ✅ OpenRouter AI (FREE models)
- ✅ Twilio WhatsApp (FREE trial)
- ✅ Gmail API (FREE)

### AI Tools
- ✅ create_ticket
- ✅ search_kb
- ✅ get_ticket_status
- ✅ update_ticket_status
- ✅ send_whatsapp
- ✅ send_gmail

---

## 🎯 Test the Agent

```bash
curl -X POST http://localhost:3000/api/agent ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"I need help\", \"customerEmail\": \"test@example.com\", \"channel\": \"web\"}"
```

---

## 💰 Total Cost: $0

All services are FREE for hackathon demo!

---

## 🔗 Links

- Supabase: https://supabase.com
- OpenRouter: https://openrouter.ai
- Twilio: https://twilio.com
- Vercel: https://vercel.com

---

**Built for CRM FTE Factory Hackathon 5**
100% FREE Services - No Credit Card Required!
