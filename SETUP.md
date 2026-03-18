# Spendiq AI — Setup Guide (Supabase + WhatsApp + n8n)

This guide is written to get you from zero → production-ready MVP.

## 1) Supabase

### Create project

- Create a new Supabase project.
- In **Project Settings → API**, copy:
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only)

### Apply schema

In Supabase **SQL Editor**, run:
- `database/schema.sql`

This creates tables + indexes + RLS policies, and a trigger that auto-creates `public.users` rows when a user signs up.

### Auth settings

In **Authentication → URL Configuration**:
- Set **Site URL** to your app URL (local: `http://localhost:3000`, prod: your domain).
- Add Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://<your-domain>/auth/callback`

### Create a user and link phone

Run the app, log in via `/login` (magic link).

Then go to:
- **Dashboard → Settings → WhatsApp link**
- Save your phone in **E.164** format (example: `+9715xxxxxxx`)

This is how inbound WhatsApp messages map to the correct user.

### Optional seed data

After you have a Supabase Auth user created, you can run `database/seed.sql`:
- Replace the `demo_user` UUID in the file with your actual `auth.users.id`
- Run it in Supabase SQL Editor

## 2) WhatsApp Cloud API (Meta)

### Create Meta app

- Create a Meta Developer app.
- Add **WhatsApp** product.
- Use the test phone number initially.

You’ll need:
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- A **Verify Token** you choose: `WHATSAPP_VERIFY_TOKEN`

### Configure webhooks

In WhatsApp settings:
- **Callback URL**: `https://<your-domain>/api/whatsapp/webhook`
- **Verify token**: your `WHATSAPP_VERIFY_TOKEN`

Subscribe to webhook fields for messages.

### Production note

For production:
- Verify your Meta business
- Configure a permanent token or a system user token
- Ensure the app has stable hosting (Vercel recommended)

## 3) OpenAI

Create an API key and set:
- `OPENAI_API_KEY`

The app uses:
- `prompts/intent-detector.md` for strict JSON extraction
- `prompts/insight-generator.md` for daily insights
- `prompts/report-generator.md` for monthly summaries

## 4) Next.js app

### Environment

Copy and fill env:

```bash
cp .env.example .env.local
```

Minimum required to run end-to-end:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`

For automation endpoints:
- `AUTOMATION_TOKEN`

### Run

```bash
npm install
npm run dev
```

## 5) n8n (automation)

You can run automation in two ways:
- **Recommended**: import workflows in `n8n-workflows/` and run them on schedules.
- **Alternative**: call the Spendiq automation endpoints directly from any scheduler.

### Import workflows

Import:
- `n8n-workflows/expense-handler.json` (optional if you use the built-in Next.js webhook)
- `n8n-workflows/insight-generator.json`
- `n8n-workflows/budget-alert.json`
- `n8n-workflows/monthly-report.json`

### n8n environment variables

Set in your n8n instance:
- `APP_URL`: your deployed Spendiq base URL (example: `https://spendiq.ai`)
- `AUTOMATION_TOKEN`: must match your app’s `AUTOMATION_TOKEN`

If using the direct WhatsApp-to-Supabase workflow:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`

## Verification checklist

- You can log in via `/login` and access `/dashboard`
- You can add expenses via `/dashboard/new`
- You can link your phone in `/dashboard/settings`
- Sending WhatsApp message “Spent 50 AED on food” logs an expense and replies
- n8n daily insights workflow posts to `/api/automation/daily-insights` successfully

