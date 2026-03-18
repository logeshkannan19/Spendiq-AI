import type { Insight } from "@/lib/db/types";

export function InsightFeed({ insights }: { insights: Insight[] }) {
  return (
    <div className="glass h-full rounded-xl p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold">Insights</h2>
        <div className="text-sm text-text-muted">Daily AI insights</div>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {insights.map((i) => (
          <div key={i.id} className="glass rounded-xl p-4">
            <div className="text-xs font-semibold text-text-muted">
              {formatDate(i.created_at)} · {i.type}
            </div>
            <div className="mt-2 text-sm">{i.message}</div>
          </div>
        ))}
        {!insights.length ? (
          <div className="text-sm text-text-muted">
            No insights yet. Import the n8n daily insight workflow (or call the insight
            API) to generate them automatically.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit"
  }).format(d);
}

