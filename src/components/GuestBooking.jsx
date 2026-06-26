import { useState } from "react";
import { formatDate } from "../lib/time.js";

export default function GuestBooking({ termin, onBack, onBook }) {
  const [selected, setSelected] = useState(null); // Index des gewählten Slots
  const [name, setName] = useState("");
  const [confirmed, setConfirmed] = useState(null);

  const freeSlots = termin.slots
    .map((s, i) => ({ ...s, i }))
    .filter((s) => !s.name.trim());
  const takenCount = termin.slots.length - freeSlots.length;

  function book(e) {
    e.preventDefault();
    if (selected == null || !name.trim()) return;
    // Slot inzwischen belegt? (paralleles Buchen) -> zurück zur Auswahl
    if (termin.slots[selected].name.trim()) {
      setSelected(null);
      return;
    }
    onBook(selected, name.trim());
    setConfirmed(termin.slots[selected]);
  }

  // --- Bestätigung ---
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

  // --- Schritt 2: voller Fokus auf Namenseingabe ---
  if (selected != null) {
    const slot = termin.slots[selected];
    return (
      <form
        onSubmit={book}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <button
          type="button"
          onClick={() => {
            setSelected(null);
            setName("");
          }}
          className="mb-4 rounded-lg px-2 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
        >
          ‹ Anderes Zeitfenster
        </button>

        <div className="rounded-xl bg-blue-50 px-4 py-4 text-center">
          <p className="text-sm font-semibold text-blue-600">
            Gewähltes Zeitfenster
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-blue-700">
            {slot.from}–{slot.to}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {termin.title}
            {termin.date ? " · " + formatDate(termin.date) : ""}
          </p>
        </div>

        <div className="mt-6">
          <label className="mb-1.5 block text-center text-sm font-semibold text-slate-500">
            Bitte trage deinen Namen ein
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z. B. Familie Müller"
            className="w-full rounded-xl border border-slate-200 px-4 py-4 text-center text-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-4 text-lg font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Termin verbindlich buchen
        </button>
      </form>
    );
  }

  // --- Schritt 1: freies Zeitfenster wählen ---
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
        Tippe auf ein freies Zeitfenster.
      </p>

      {freeSlots.length === 0 ? (
        <p className="py-8 text-center text-slate-400">
          Dieser Termin ist leider ausgebucht.
        </p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {freeSlots.map((s) => (
            <button
              key={s.i}
              onClick={() => setSelected(s.i)}
              className="flex items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-left transition hover:border-blue-500 hover:bg-blue-50"
            >
              <span className="text-lg font-bold tabular-nums">
                {s.from}–{s.to}
              </span>
              <span className="text-sm font-semibold text-emerald-700">
                frei ›
              </span>
            </button>
          ))}
        </div>
      )}

      {takenCount > 0 && (
        <p className="mt-4 text-center text-xs text-slate-400">
          {takenCount} {takenCount === 1 ? "Fenster ist" : "Fenster sind"} bereits
          belegt.
        </p>
      )}
    </div>
  );
}
