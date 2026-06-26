import { useState } from "react";
import { buildSlotsByRange, todayISO, toMinutes } from "../lib/time.js";
import { uid } from "../lib/storage.js";

export default function CreateForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayISO());
  const [start, setStart] = useState("15:00");
  const [end, setEnd] = useState("18:00");
  const [dur, setDur] = useState(30);
  const [brk, setBrk] = useState(0);

  // Live-Vorschau der erzeugten Zeitfenster
  const preview = buildSlotsByRange(start, end, Number(dur), Number(brk));
  const invalidRange = toMinutes(end) <= toMinutes(start);

  function submit(e) {
    e.preventDefault();
    if (invalidRange || preview.length === 0) return;
    const termin = {
      id: uid(),
      title: title.trim() || "Elterngespräche",
      date,
      start,
      end,
      dur: Number(dur),
      brk: Number(brk),
      slots: preview,
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
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
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
          <label className={labelCls}>Tag</label>
          <input
            type="date"
            className={inputCls}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Startzeit</label>
          <input
            type="time"
            className={inputCls}
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Endzeit</label>
          <input
            type="time"
            className={inputCls + (invalidRange ? " border-red-300" : "")}
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Dauer pro Gespräch</label>
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
          <label className={labelCls}>Pause zwischen den Gesprächen</label>
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
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {invalidRange ? (
            <span className="text-red-600">
              Die Endzeit muss nach der Startzeit liegen.
            </span>
          ) : (
            <>
              Ergibt{" "}
              <strong className="text-slate-700">{preview.length}</strong>{" "}
              Zeitfenster
              {preview.length > 0 && (
                <>
                  {" "}
                  ({preview[0].from}–{preview[preview.length - 1].to})
                </>
              )}
              .
            </>
          )}
        </p>
        <button
          type="submit"
          disabled={invalidRange || preview.length === 0}
          className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Termin erstellen
        </button>
      </div>
    </form>
  );
}
