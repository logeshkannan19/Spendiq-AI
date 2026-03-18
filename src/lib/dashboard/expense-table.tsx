import type { Expense } from "@/lib/db/types";

export function ExpenseTable({ expenses }: { expenses: Expense[] }) {
  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold">Recent expenses</h2>
        <div className="text-sm text-text-muted">{expenses.length} shown</div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[680px] border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-xs font-semibold text-text-muted">
              <th className="px-3 py-2">When</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Note</th>
              <th className="px-3 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id} className="glass rounded-xl">
                <td className="px-3 py-3 text-sm">{formatDate(e.created_at)}</td>
                <td className="px-3 py-3 text-sm font-semibold">{e.category}</td>
                <td className="px-3 py-3 text-sm text-text-muted">
                  {e.note ?? "—"}
                </td>
                <td className="px-3 py-3 text-right text-sm font-semibold">
                  {formatMoney(e.amount)}
                </td>
              </tr>
            ))}
            {!expenses.length ? (
              <tr>
                <td className="px-3 py-8 text-sm text-text-muted" colSpan={4}>
                  No expenses yet. Add one via WhatsApp or the “Add expense” page.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0
  }).format(amount);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(d);
}

