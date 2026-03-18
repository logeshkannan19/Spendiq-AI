# Spendiq AI - Intelligent Expense Tracking

![Spendiq Banner](https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200)

> AI-powered expense tracker with WhatsApp-first capture, smart insights, budget alerts, and automated monthly reports.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

## 🚀 Overview

Spendiq AI is a modern expense tracking platform designed for individuals and small businesses. It combines the convenience of WhatsApp messaging with powerful AI-driven insights to make expense management effortless.

**Key Differentiators:**
- Natural language expense logging via WhatsApp
- AI-powered intent detection and categorization
- Real-time budget monitoring and alerts
- Automated daily insights and monthly reports
- Beautiful, responsive dashboard

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📱 **WhatsApp Integration** | Log expenses by messaging - no app required |
| 🤖 **AI Intent Detection** | Automatically categorize and understand expenses |
| 💰 **Budget Management** | Set category budgets with smart alerts |
| 📊 **Daily Insights** | Automated spending analysis delivered to you |
| 📋 **Monthly Reports** | Comprehensive JSON summaries with trends |
| 🌙 **Dark Mode** | Beautiful glassmorphism UI with dark theme |
| 🔒 **Secure** | Supabase Auth + Row Level Security |
| 📱 **Responsive** | Works seamlessly on mobile and desktop |

## 🛠 Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | Next.js 14 | App Router, Server Components |
| **Language** | TypeScript 5.4 | Type safety |
| **Styling** | Tailwind CSS | Glassmorphism, dark mode |
| **Database** | Supabase | PostgreSQL, Auth, RLS |
| **AI** | OpenAI GPT-4 | Intent detection, insights |
| **Messaging** | WhatsApp Cloud API | User communication |
| **Automation** | n8n | Cron jobs, webhooks |
| **Deployment** | Vercel | Edge-ready deployment |

## 📁 Project Structure

```
spendiq/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   │   ├── automation/       # n8n webhook endpoints
│   │   │   ├── whatsapp/         # WhatsApp webhook
│   │   │   └── profile/         # User profile APIs
│   │   ├── auth/                # Authentication
│   │   ├── dashboard/           # Protected dashboard
│   │   ├── docs/               # Documentation pages
│   │   ├── login/              # Login page
│   │   └── page.tsx            # Landing page
│   └── lib/
│       ├── ai/                  # OpenAI integration
│       ├── supabase/            # Supabase clients
│       ├── whatsapp/            # WhatsApp API helpers
│       └── utils/              # Utility functions
├── database/
│   ├── schema.sql              # Database schema
│   └── seed.sql               # Sample data
├── n8n-workflows/             # Automation workflows
│   ├── expense-handler.json
│   ├── insight-generator.json
│   ├── budget-alert.json
│   └── monthly-report.json
├── prompts/                     # AI prompts
└── public/                     # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key
- WhatsApp Business account (optional)
- n8n instance (optional, for automation)

### Installation

```bash
# Clone the repository
git clone https://github.com/logeshkannan19/Spendiq.git
cd Spendiq

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Configure environment variables (see .env.example)
# Edit .env.local with your credentials

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the schema in SQL Editor:
   ```bash
   # Copy contents of database/schema.sql and execute
   ```
3. Copy your project URL and keys to `.env.local`

## 📱 WhatsApp Integration

### Setup Webhook

Configure your WhatsApp Cloud API webhook:

| Setting | Value |
|---------|-------|
| **Callback URL** | `https://your-domain.com/api/whatsapp/webhook` |
| **Verify Token** | Value of `WHATSAPP_VERIFY_TOKEN` in `.env.local` |

### Example Commands

Send these messages to your WhatsApp Business number:

```
Spent 50 AED on food
How much did I spend this month?
Set food budget 1200
Show my expenses
```

## 🔄 n8n Automation

Import workflows from `n8n-workflows/` into your n8n instance.

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `APP_URL` | Your deployed Spendiq URL |
| `AUTOMATION_TOKEN` | Secret token for webhook authentication |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `WHATSAPP_ACCESS_TOKEN` | WhatsApp Cloud API access token |
| `WHATSAPP_PHONE_NUMBER_ID` | Your WhatsApp phone number ID |

## 📊 API Reference

### WhatsApp Webhook
```
POST /api/whatsapp/webhook
```

### Automation Endpoints
```
POST /api/automation/daily-insights
POST /api/automation/budget-check
POST /api/automation/monthly-report
```

### Profile
```
POST /api/profile/link-phone
```

## 🎨 Design System

### Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#10B981` | CTAs, success states |
| Secondary | `#6366F1` | Accents, links |
| Background | `#0F172A` | Dark mode background |
| Surface | `#1E293B` | Cards, panels |
| Text | `#F8FAFC` | Primary text |
| Muted | `#94A3B8` | Secondary text |

### Typography

- **Font**: Inter (Google Fonts)
- **Weights**: 400 (body), 500 (medium), 600 (semibold), 700 (bold)
- **Scale**: Based on 1.25 ratio

### Components

- Glassmorphism cards with backdrop blur
- Rounded corners (xl, 2xl)
- Soft shadows
- Smooth transitions (300ms)
- Dark mode as default

## 🔒 Security

- Supabase Row Level Security (RLS) for data protection
- Environment variables for sensitive credentials
- Webhook verification tokens
- Secure HTTP-only cookies for sessions

## 📱 Responsive Design

| Breakpoint | Columns | Description |
|------------|---------|-------------|
| < 640px | 1 | Mobile phones |
| 640px+ | 2 | Tablets |
| 768px+ | 3 | Small laptops |
| 1024px+ | 4 | Desktops |

## 🔮 Roadmap

- [ ] Multi-currency support
- [ ] Receipt image scanning
- [ ] Export to CSV/PDF
- [ ] Team/shared expenses
- [ ] Recurring expense detection
- [ ] Investment tracking
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a service
- [OpenAI](https://openai.com/) - AI capabilities
- [Meta](https://developers.facebook.com/) - WhatsApp Cloud API
- [n8n](https://n8n.io/) - Workflow automation
- [Tailwind CSS](https://tailwindcss.com/) - Styling
