import { useState, type FormEvent } from "react";
import { api, type User } from "../api";

export default function AuthForm({ onSignedIn }: { onSignedIn: (user: User) => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email"));
    const password = String(data.get("password"));
    setBusy(true);
    setError(null);
    try {
      const { user } = mode === "login" ? await api.login(email, password) : await api.signup(email, password);
      onSignedIn(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-label={mode === "login" ? "Sign in" : "Create account"}>
      <form className="auth-form" onSubmit={submit}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={8}
          required
        />
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button className="primary" type="submit" disabled={busy}>
          {mode === "login" ? "Sign in" : "Sign up"}
        </button>
      </form>
      <p className="summary">
        {mode === "login" ? "New here? " : "Already have an account? "}
        <button className="ghost" type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
          {mode === "login" ? "Create an account" : "Sign in instead"}
        </button>
      </p>
    </section>
  );
}
