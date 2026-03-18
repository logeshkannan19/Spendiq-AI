"use client";

import { useMemo } from "react";
import { ResponsiveContainer, Pie, PieChart, Cell, Tooltip } from "recharts";

export function CategoryChart({ byCategory }: { byCategory: Record<string, number> }) {
  const data = useMemo(() => {
    const entries = Object.entries(byCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    return entries.length ? entries : [{ name: "No data", value: 1 }];
  }, [byCategory]);

  const total = Object.values(byCategory).reduce((a, b) => a + b, 0);

  return (
    <div className="glass h-full rounded-xl p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold">Category breakdown</h2>
        <div className="text-sm text-text-muted">
          {total ? `Total: ${formatMoney(total)}` : "This month"}
        </div>
      </div>
      <div className="mt-4 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={68}
              outerRadius={120}
              paddingAngle={2}
              stroke="rgba(255,255,255,0.08)"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={palette[i % palette.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "rgba(15, 18, 26, 0.9)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12
              }}
              formatter={(v: unknown) => formatMoney(Number(v))}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-text-muted md:grid-cols-3">
        {Object.entries(byCategory)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([cat, amt], i) => (
            <div key={cat} className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: palette[i % palette.length] }}
              />
              <span className="truncate">{cat}</span>
              <span className="ml-auto tabular-nums">{formatMoney(amt)}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

const palette = [
  "#60a5fa",
  "#34d399",
  "#fbbf24",
  "#a78bfa",
  "#fb7185",
  "#22d3ee",
  "#f472b6"
];

function formatMoney(amount: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0
  }).format(amount);
}

