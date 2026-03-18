import { cn } from "@/lib/ui/cn";

export function StatCard({
  title,
  value,
  hint,
  tone
}: {
  title: string;
  value: string;
  hint: string;
  tone: "neutral" | "good" | "warn" | "bad";
}) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="text-sm font-semibold text-text-muted">{title}</div>
      <div className={cn("mt-2 text-3xl font-semibold tracking-tight", toneClass(tone))}>
        {value}
      </div>
      <div className="mt-2 text-sm text-text-muted">{hint}</div>
    </div>
  );
}

function toneClass(tone: "neutral" | "good" | "warn" | "bad") {
  switch (tone) {
    case "good":
      return "text-good";
    case "warn":
      return "text-warn";
    case "bad":
      return "text-bad";
    default:
      return "text-text";
  }
}

