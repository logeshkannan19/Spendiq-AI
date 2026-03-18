import { LoginForm } from "@/lib/auth/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto w-full max-w-xl px-6 py-10">
      <div className="glass rounded-xl p-6">
        <h1 className="text-2xl font-semibold">Log in</h1>
        <p className="mt-2 text-sm text-text-muted">
          Use a magic link (email OTP). After login, your WhatsApp phone number can be
          linked for automation.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

