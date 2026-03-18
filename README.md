# Spendiq AI

**Spendiq AI** is an AI-powered expense tracker with **WhatsApp-first capture**, **smart insights**, **budget alerts**, and **monthly reports**.

Built like a YC-grade MVP:
- **Frontend**: Next.js 14 (App Router) + Tailwind (glassmorphism, dark mode, Apple-style minimal UI)
- **Backend**: Supabase (Postgres + Auth + RLS)
- **Automation**: n8n workflows (exportable JSON)
- **AI**: OpenAI (intent detection, insights, reports)
- **Messaging**: WhatsApp Cloud API (Meta)

## What you get

- **WhatsApp expense logging**: “Spent 50 AED on food” → stored in Supabase + instant reply
- **Queries**: “How much did I spend this month?” → instant total
- **Budgets**: set in dashboard (or via WhatsApp: “Set food budget 1200”)
- **Daily insights**: cron-triggered automation generates insights + sends WhatsApp digest
- **Budget alerts**: automation checks monthly budget overruns + warns on WhatsApp
- **Monthly reports**: structured JSON summary + WhatsApp-formatted message

## Repository structure

- `src/app/`: Next.js App Router (dashboard, login, API routes)
- `src/lib/`: Supabase, AI, WhatsApp, and dashboard components
- `database/`: `schema.sql` + `seed.sql` for Supabase
- `n8n-workflows/`: importable workflow exports
- `prompts/`: curated OpenAI prompts (strict JSON IO)

## Quickstart (local)

1) Copy env file:

```bash
cp .env.example .env.local
```

2) Create a Supabase project and apply `database/schema.sql`.

3) Set these env vars in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `AUTOMATION_TOKEN`

4) Install + run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## WhatsApp webhook

Set your WhatsApp Cloud API webhook to:
- **Verify/Callback URL**: `https://<your-domain>/api/whatsapp/webhook`
- **Verify token**: value of `WHATSAPP_VERIFY_TOKEN`

When a WhatsApp message arrives:
- Spendiq maps the sender phone to `public.users.phone`
- Runs OpenAI intent extraction
- Writes to Supabase (`expenses` / `budgets`)
- Replies instantly

## n8n automation

Import workflows from `n8n-workflows/` into your n8n instance:
- `expense-handler.json`
- `insight-generator.json`
- `budget-alert.json`
- `monthly-report.json`

Set n8n environment variables:
- `APP_URL` (your deployed Spendiq URL)
- `AUTOMATION_TOKEN` (must match app env)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`

## Docs

- `SETUP.md`: step-by-step Supabase + Meta + n8n setup
- `ARCHITECTURE.md`: system flow + diagrams

## Deployment

- Deploy Next.js to Vercel (or any Node runtime that supports Next 14).
- Store secrets as environment variables.
- Supabase hosts Postgres + Auth + Realtime.

