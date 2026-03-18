import { redirect } from "next/navigation";
import { requireUser } from "@/lib/db/queries";
import { SettingsPanel } from "@/lib/dashboard/settings-panel";

export default async function SettingsPage() {
  const { user } = await requireUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto w-full max-w-3xl">
      <div className="glass rounded-xl p-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-2 text-sm text-text-muted">
          Link WhatsApp, set budgets, and tune your automation.
        </p>
        <div className="mt-6">
          <SettingsPanel />
        </div>
      </div>
    </main>
  );
}

