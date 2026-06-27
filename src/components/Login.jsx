import { useState } from "react";

export default function Login({ onSignIn }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    try {
      await onSignIn(email.trim());
      setStatus("sent");
    } catch (err) {
      setError(err?.message || "Senden fehlgeschlagen.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="animate-pop rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="mb-3 text-4xl">📧</div>
        <h2 className="text-lg font-bold">E-Mail unterwegs</h2>
        <p className="mt-1 text-slate-500">
          Wir haben dir einen Anmelde-Link an <strong>{email}</strong> geschickt.
          Öffne ihn auf diesem Gerät, um dich anzumelden.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="animate-pop rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-bold">Lehrer-Anmeldung</h2>
      <p className="mb-4 mt-1 text-sm text-slate-500">
        Melde dich per E-Mail-Link an, um Termine anzulegen und alle Namen zu
        sehen. Kein Passwort nötig.
      </p>
      <input
        type="email"
        required
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="deine@schule.de"
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      {status === "error" && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
      >
        {status === "sending" ? "Wird gesendet…" : "Anmelde-Link senden"}
      </button>
    </form>
  );
}
