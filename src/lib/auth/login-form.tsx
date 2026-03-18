"use client";

import { useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/lib/ui/button";

export function LoginForm() {
  const supabase = useMemo(() => createBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("sending");
        setError(null);

        const origin =
          typeof window !== "undefined" ? window.location.origin : undefined;
        const redirectTo = origin ? `${origin}/auth/callback` : undefined;

        const { error: signInError } = await supabase.auth.signInWithOtp({
          email,
          options: redirectTo ? { emailRedirectTo: redirectTo } : undefined
        });

        if (signInError) {
          setStatus("error");
          setError(signInError.message);
          return;
        }

        if (phone.trim()) {
          await fetch("/api/profile/link-phone", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ phone: phone.trim() })
          }).catch(() => {});
        }

        setStatus("sent");
      }}
    >
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Email</span>
        <input
          className="glass rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/40"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">WhatsApp phone (optional)</span>
        <input
          className="glass rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/40"
          type="tel"
          placeholder="+9715xxxxxxxx"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <span className="text-xs text-text-muted">
          Use E.164 format. You can also link later in the dashboard.
        </span>
      </label>

      {error ? <div className="text-sm text-bad">{error}</div> : null}

      <div className="mt-2 flex items-center gap-3">
        <Button disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send magic link"}
        </Button>
        {status === "sent" ? (
          <span className="text-sm text-good">
            Check your inbox. You’ll be redirected after login.
          </span>
        ) : null}
      </div>
    </form>
  );
}

