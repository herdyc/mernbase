import { useEffect, useState } from "react";
import { api, type User } from "./api";
import AuthForm from "./components/AuthForm";
import Planner from "./components/Planner";

export default function App() {
  // undefined = still checking, null = signed out
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    api
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    await api.logout();
    setUser(null);
  }

  return (
    <main className="planner">
      <header>
        <h1>Study Planner</h1>
        <p className="tagline">Rung 3 · MERN: MongoDB, Express, React and Node, with accounts.</p>
        {user && (
          <p className="tagline">
            Signed in as {user.email}{" "}
            <button className="ghost" type="button" onClick={logout}>
              Sign out
            </button>
          </p>
        )}
      </header>
      {user === undefined && <p className="summary">Loading…</p>}
      {user === null && <AuthForm onSignedIn={setUser} />}
      {user && <Planner />}
    </main>
  );
}
