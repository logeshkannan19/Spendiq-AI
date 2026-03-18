import { redirect } from "next/navigation";
import { requireUser } from "@/lib/db/queries";
import { NewExpenseForm } from "@/lib/dashboard/new-expense-form";

export default async function NewExpensePage() {
  const { user } = await requireUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto w-full max-w-2xl">
      <div className="glass rounded-xl p-6">
        <h1 className="text-2xl font-semibold">Add expense</h1>
        <p className="mt-2 text-sm text-text-muted">
          This writes directly to Supabase. For the “WhatsApp-first” experience, use the
          n8n workflow or the WhatsApp webhook API.
        </p>
        <div className="mt-6">
          <NewExpenseForm />
        </div>
      </div>
    </main>
  );
}

