import { useState } from "react";

export default function LoginModal({ onLogin, onClose }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!onLogin(pw)) setError(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 className="mb-1 text-lg font-bold">Lehrer-Login</h2>
        <p className="mb-4 text-sm text-slate-500">
          Melde dich an, um alle Namen zu sehen und Termine zu verwalten.
        </p>
        <input
          type="password"
          autoFocus
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setError(false);
          }}
          placeholder="Passwort"
          className={
            "w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 " +
            (error ? "border-red-400" : "border-slate-200 focus:border-blue-500")
          }
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">Passwort ist nicht korrekt.</p>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:brightness-110"
          >
            Anmelden
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          Demo-Login – Passwort: <code className="font-mono">lehrer</code>
        </p>
      </form>
    </div>
  );
}
