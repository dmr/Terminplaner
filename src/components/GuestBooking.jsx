import { useState } from "react";
import { formatDate } from "../lib/time.js";

export default function GuestBooking({ termin, onBack, onBook }) {
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");
  const [confirmed, setConfirmed] = useState(null);

  function submit(e) {
    e.preventDefault();
    if (selected == null || !name.trim()) return;
    // Sicherheit: Slot inzwischen belegt? (z. B. paralleles Buchen)
    if (termin.slots[selected].name.trim()) {
      setSelected(null);
      return;
    }
    onBook(selected, name.trim());
    setConfirmed(termin.slots[selected]);
  }

  if (confirmed) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center shadow-sm">
        <div className="mb-2 text-4xl">✅</div>
        <h2 className="text-lg font-bold text-emerald-800">Termin gebucht!</h2>
        <p className="mt-1 text-emerald-700">
          {termin.title}
          {termin.date ? ", " + formatDate(termin.date) : ""}
          <br />
          <strong className="text-xl tabular-nums">
            {confirmed.from}–{confirmed.to} Uhr
          </strong>
          <br />
          für {name.trim()}
        </p>
        <button
          onClick={onBack}
          className="mt-5 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:brightness-110"
        >
          Zurück zur Übersicht
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <button
        type="button"
        onClick={onBack}
        className="mb-3 rounded-lg px-2 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
      >
        ‹ Andere Termine
      </button>

      <h2 className="text-base font-semibold">{termin.title}</h2>
      <p className="mb-4 text-sm text-slate-500">
        {termin.date ? formatDate(termin.date) + " · " : ""}
        Bitte ein freies Zeitfenster wählen.
      </p>

      <div className="grid gap-2">
        {termin.slots.map((s, idx) => {
          const taken = s.name.trim();
          if (taken) {
            return (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-3 opacity-60"
              >
                <span className="w-[110px] flex-none font-bold tabular-nums text-slate-400">
                  {s.from}–{s.to}
                </span>
                <span className="text-sm text-slate-400">belegt</span>
              </div>
            );
          }
          const isSel = selected === idx;
          return (
            <label
              key={idx}
              className={
                "flex cursor-pointer items-center gap-3 rounded-xl border py-2.5 pl-4 pr-3 transition " +
                (isSel
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                  : "border-emerald-200 bg-emerald-50 hover:border-blue-400")
              }
            >
              <input
                type="radio"
                name="slot"
                className="h-4 w-4 accent-blue-600"
                checked={isSel}
                onChange={() => setSelected(idx)}
              />
              <span className="w-[100px] flex-none font-bold tabular-nums">
                {s.from}–{s.to}
              </span>
              <span className="text-sm font-semibold text-emerald-700">frei</span>
            </label>
          );
        })}
      </div>

      <div className="mt-5">
        <label className="mb-1 block text-sm font-semibold text-slate-500">
          Dein Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="z. B. Familie Müller"
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <button
        type="submit"
        disabled={selected == null || !name.trim()}
        className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Termin verbindlich buchen
      </button>
    </form>
  );
}
