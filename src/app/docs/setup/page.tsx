import Link from "next/link";
import { Button } from "@/lib/ui/button";

export default function SetupDocPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="glass rounded-xl p-6">
        <h1 className="text-2xl font-semibold">Setup</h1>
        <p className="mt-2 text-sm text-text-muted">
          This page is a friendly pointer to the repository docs. For the complete,
          step-by-step guide, open `SETUP.md` in the project root.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost">Back</Button>
          </Link>
          <Link href="/login">
            <Button>Log in</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

