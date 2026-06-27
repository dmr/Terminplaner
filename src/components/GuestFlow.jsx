import { useState } from "react";
import { formatDate } from "../lib/time.js";
import Confetti from "./Confetti.jsx";

export default function GuestFlow({ termine, onBook }) {
  const [phase, setPhase] = useState("welcome"); // welcome | days | times | name | done
  const [termId, setTermId] = useState(null);
  const [slotIdx, setSlotIdx] = useState(null);
  const [name, setName] = useState("");

  const freeDays = termine.filter((t) => t.slots.some((s) => !s.name.trim()));
  const termin = termine.find((t) => t.id === termId) || null;

  function start() {
    if (freeDays.length === 0) {
      setPhase("empty");
    } else if (freeDays.length === 1) {
      setTermId(freeDays[0].id);
      setPhase("times");
    } else {
      setPhase("days");
    }
  }

  function pickDay(id) {
    setTermId(id);
    setPhase("times");
  }

  function pickSlot(idx) {
    setSlotIdx(idx);
    setPhase("name");
  }

  function backFromTimes() {
    if (freeDays.length > 1) setPhase("days");
    else {
      setPhase("welcome");
      setTermId(null);
    }
  }

  function book(e) {
    e.preventDefault();
    if (!termin || slotIdx == null || !name.trim()) return;
    if (termin.slots[slotIdx].name.trim()) {
      setPhase("times"); // inzwischen belegt
      return;
    }
    onBook(termin.id, slotIdx, name.trim());
    setPhase("done");
  }

  function restart() {
    setPhase("welcome");
    setTermId(null);
    setSlotIdx(null);
    setName("");
  }

  const card =
    "animate-pop rounded-2xl border border-slate-200 bg-white p-6 shadow-sm";
  const backBtn =
    "mb-4 rounded-lg px-2 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50";

  // --- Willkommen ---
  if (phase === "welcome") {
    return (
      <div className={card + " text-center"}>
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-3xl">
          👋
        </div>
        <h2 className="text-xl font-bold">Willkommen</h2>
        <p className="mx-auto mt-2 max-w-sm text-slate-500">
          Bitte wählen Sie einen Termin für unser Elterngespräch.
        </p>
        <button
          onClick={start}
          className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3.5 text-lg font-semibold text-white transition hover:brightness-110"
        >
          Weiter ›
        </button>
      </div>
    );
  }

  // --- Keine freien Termine ---
  if (phase === "empty") {
    return (
      <div className={card + " text-center"}>
        <div className="mb-3 text-4xl">📅</div>
        <h2 className="text-lg font-bold">Aktuell keine Termine frei</h2>
        <p className="mt-1 text-slate-500">
          Derzeit sind alle Gespräche ausgebucht. Bitte versuchen Sie es später
          erneut.
        </p>
        <button onClick={restart} className="mt-5 text-sm font-semibold text-blue-600">
          Zurück
        </button>
      </div>
    );
  }

  // --- Stufe 1: Tag wählen (nur bei mehreren Tagen) ---
  if (phase === "days") {
    return (
      <div className={card}>
        <h2 className="text-lg font-bold">Welcher Tag passt Ihnen?</h2>
        <p className="mb-4 text-sm text-slate-500">Bitte einen Tag auswählen.</p>
        <div className="grid gap-2.5">
          {freeDays.map((t) => {
            const free = t.slots.filter((s) => !s.name.trim()).length;
            return (
              <button
                key={t.id}
                onClick={() => pickDay(t.id)}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-4 text-left transition hover:border-blue-500 hover:bg-blue-50"
              >
                <span className="font-semibold">{formatDate(t.date)}</span>
                <span className="whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  {free} frei ›
                </span>
              </button>
            );
          })}
        </div>
        <button onClick={restart} className={backBtn + " mt-4"}>
          ‹ Zurück
        </button>
      </div>
    );
  }

  // --- Stufe 2: Uhrzeit wählen ---
  if (phase === "times" && termin) {
    const free = termin.slots
      .map((s, i) => ({ ...s, i }))
      .filter((s) => !s.name.trim());
    return (
      <div className={card}>
        <button onClick={backFromTimes} className={backBtn}>
          ‹ {freeDays.length > 1 ? "Anderer Tag" : "Zurück"}
        </button>
        <h2 className="text-lg font-bold">Uhrzeit wählen</h2>
        <p className="mb-4 text-sm text-slate-500">{formatDate(termin.date)}</p>
        {free.length === 0 ? (
          <p className="py-8 text-center text-slate-400">
            Dieser Tag ist leider ausgebucht.
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {free.map((s) => (
              <button
                key={s.i}
                onClick={() => pickSlot(s.i)}
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 px-4 py-3.5 text-left transition hover:border-blue-500 hover:bg-blue-50"
              >
                <span className="text-lg font-bold tabular-nums">
                  {s.from}–{s.to}
                </span>
                <span className="text-sm font-semibold text-emerald-700">›</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- Name eingeben (voller Fokus) ---
  if (phase === "name" && termin && slotIdx != null) {
    const slot = termin.slots[slotIdx];
    return (
      <form onSubmit={book} className={card}>
        <button
          type="button"
          onClick={() => setPhase("times")}
          className={backBtn}
        >
          ‹ Andere Uhrzeit
        </button>
        <div className="rounded-xl bg-blue-50 px-4 py-5 text-center">
          <p className="text-sm font-semibold text-blue-600">Ihr Termin</p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-blue-700">
            {slot.from}–{slot.to}
          </p>
          <p className="mt-1 text-sm text-slate-500">{formatDate(termin.date)}</p>
        </div>
        <div className="mt-6">
          <label className="mb-1.5 block text-center text-sm font-semibold text-slate-500">
            Bitte tragen Sie Ihren Namen ein
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

  // --- Bestätigung ---
  if (phase === "done" && termin && slotIdx != null) {
    const slot = termin.slots[slotIdx];
    return (
      <div className="animate-pop rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
        <Confetti />
        <div className="animate-check mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-emerald-600 text-3xl text-white shadow-lg shadow-emerald-200">
          ✓
        </div>
        <h2 className="text-xl font-bold text-emerald-800">Termin gebucht!</h2>
        <p className="mt-1 text-emerald-700">
          <strong className="text-xl tabular-nums">
            {slot.from}–{slot.to} Uhr
          </strong>
          <br />
          {formatDate(termin.date)}
          <br />
          für {name.trim()}
        </p>
        <button
          onClick={restart}
          className="mt-6 rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:brightness-110"
        >
          Fertig
        </button>
      </div>
    );
  }

  return null;
}
