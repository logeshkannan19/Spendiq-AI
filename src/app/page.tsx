import Link from "next/link";
import { Button } from "@/lib/ui/button";
import { Logo } from "@/lib/ui/logo";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-wide">Spendiq AI</span>
            <span className="text-xs text-text-muted">
              Your personal CFO on WhatsApp
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Open dashboard</Button>
          </Link>
        </div>
      </header>

      <section className="glass relative overflow-hidden rounded-xl p-10">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-10 top-10 h-40 w-40 animate-float rounded-full bg-accent-soft blur-2xl" />
          <div className="absolute right-12 top-24 h-44 w-44 animate-float rounded-full bg-emerald-500/10 blur-2xl" />
        </div>
        <div className="relative flex flex-col gap-4">
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Track expenses in seconds. Get insights like a finance pro.
          </h1>
          <p className="max-w-2xl text-pretty text-base text-text-muted md:text-lg">
            Send a WhatsApp message like “Spent 50 AED on food” and Spendiq adds the
            expense, categorizes it, watches your budgets, and sends crisp reports.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link href="/dashboard">
              <Button>Go to dashboard</Button>
            </Link>
            <Link href="/docs/setup">
              <Button variant="ghost">Setup guide</Button>
            </Link>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <Feature title="WhatsApp-native" body="Fast replies, friendly tone, zero friction." />
            <Feature
              title="AI categorization"
              body="Intent detection + extraction into strict JSON."
            />
            <Feature title="Budgets + reports" body="Alerts + monthly summaries built-in." />
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-sm text-text-muted">{body}</div>
    </div>
  );
}

