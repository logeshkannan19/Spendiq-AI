"use client";

import { useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/lib/ui/button";

const categories = [
  "food",
  "shopping",
  "transport",
  "bills",
  "rent",
  "health",
  "subscriptions",
  "travel",
  "other"
];

export function NewExpenseForm() {
  const supabase = useMemo(() => createBrowserClient(), []);
  const [amount, setAmount] = useState<number>(50);
  const [category, setCategory] = useState("food");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("saving");
        setError(null);

        const { data: auth } = await supabase.auth.getUser();
        if (!auth.user) {
          setStatus("error");
          setError("Please log in again.");
          return;
        }

        const { error: insertErr } = await supabase.from("expenses").insert({
          user_id: auth.user.id,
          amount,
          category,
          note: note.trim() ? note.trim() : null
        });
        if (insertErr) {
          setStatus("error");
          setError(insertErr.message);
          return;
        }

        setStatus("saved");
        setNote("");
        setTimeout(() => (window.location.href = "/dashboard"), 450);
      }}
    >
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Amount (AED)</span>
        <input
          className="glass rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/40"
          type="number"
          inputMode="numeric"
          min={0}
          step="1"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Category</span>
        <select
          className="glass rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/40"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Note</span>
        <input
          className="glass rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/40"
          placeholder="e.g., lunch with team"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>

      {error ? <div className="text-sm text-bad">{error}</div> : null}

      <div className="mt-2 flex items-center gap-3">
        <Button disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Add expense"}
        </Button>
        {status === "saved" ? (
          <span className="text-sm text-good">Added. Redirecting…</span>
        ) : null}
      </div>
    </form>
  );
}

