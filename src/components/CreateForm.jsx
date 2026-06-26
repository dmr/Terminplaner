import { useState } from "react";
import { buildSlots, todayISO } from "../lib/time.js";
import { uid } from "../lib/storage.js";

export default function CreateForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayISO());
  const [start, setStart] = useState("15:00");
  const [dur, setDur] = useState(30);
  const [count, setCount] = useState(15);
  const [brk, setBrk] = useState(0);

  function submit(e) {
    e.preventDefault();
    const n = Math.max(1, Math.min(60, Number(count) || 15));
    const termin = {
      id: uid(),
      title: title.trim() || "Elterngespräche",
      date,
      start,
      dur: Number(dur),
      brk: Number(brk),
      slots: buildSlots(start, Number(dur), n, Number(brk)),
    };
    onCreate(termin);
    setTitle("");
  }

  const labelCls = "block text-sm font-semibold text-slate-500 mb-1";
  const inputCls =
    "w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <form
      onSubmit={submit}
      className="no-print rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="mb-4 text-base font-semibold">Neuen Termin anlegen</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Bezeichnung</label>
          <input
            className={inputCls}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="z. B. Elternsprechtag Klasse 3a"
          />
        </div>
        <div>
          <label className={labelCls}>Datum</label>
          <input
            type="date"
            className={inputCls}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelCls}>Beginn (erste Uhrzeit)</label>
          <input
            type="time"
            className={inputCls}
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Dauer pro Slot</label>
          <select
            className={inputCls}
            value={dur}
            onChange={(e) => setDur(e.target.value)}
          >
            <option value={20}>20 Minuten</option>
            <option value={25}>25 Minuten</option>
            <option value={30}>30 Minuten</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Anzahl Zeitfenster</label>
          <input
            type="number"
            min={1}
            max={60}
            className={inputCls}
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Pause zwischen den Slots</label>
          <select
            className={inputCls}
            value={brk}
            onChange={(e) => setBrk(e.target.value)}
          >
            <option value={0}>keine Pause</option>
            <option value={5}>5 Minuten</option>
            <option value={10}>10 Minuten</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:brightness-110"
          >
            Termin &amp; Zeitfenster erstellen
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Die Uhrzeiten werden automatisch berechnet – du trägst nur noch die
        Namen der Eltern ein.
      </p>
    </form>
  );
}
