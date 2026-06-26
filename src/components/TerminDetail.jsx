import { formatDate } from "../lib/time.js";

export default function TerminDetail({ termin, onBack, onChange, onRename, onDelete }) {
  if (!termin) return null;

  const booked = termin.slots.filter((s) => s.name.trim()).length;

  function setName(idx, name) {
    const slots = termin.slots.map((s, i) => (i === idx ? { ...s, name } : s));
    onChange({ ...termin, slots });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Druck-Kopf */}
      <div className="print-only mb-4 hidden">
        <h2 className="text-2xl font-bold">{termin.title}</h2>
        <p className="text-slate-600">
          {termin.date ? formatDate(termin.date) + " · " : ""}
          Gesprächsdauer je {termin.dur} Minuten
        </p>
      </div>

      {/* Toolbar */}
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onBack}
            className="rounded-lg px-2 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
          >
            ‹ Übersicht
          </button>
          <span className="text-sm text-slate-500">
            {termin.title} · {booked} von {termin.slots.length} Plätzen vergeben
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => window.print()}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold hover:bg-slate-50"
          >
            🖨️ Drucken
          </button>
          <button
            onClick={onRename}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold hover:bg-slate-50"
          >
            Umbenennen
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Löschen
          </button>
        </div>
      </div>

      {/* Slots */}
      <div className="grid gap-2">
        {termin.slots.map((s, idx) => {
          const filled = s.name.trim();
          return (
            <div
              key={idx}
              className={
                "print-slot flex items-center gap-3 rounded-xl border py-2 pl-4 pr-2.5 " +
                (filled
                  ? "border-orange-200 bg-orange-50"
                  : "border-emerald-200 bg-emerald-50")
              }
            >
              <span className="w-[110px] flex-none font-bold tabular-nums">
                {s.from}–{s.to}
              </span>
              <input
                className="flex-1 rounded-md border border-transparent bg-transparent px-2 py-1.5 italic placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:not-italic"
                value={s.name}
                placeholder="frei – Name eintragen"
                onChange={(e) => setName(idx, e.target.value)}
              />
              {filled && (
                <button
                  onClick={() => setName(idx, "")}
                  title="Eintrag löschen"
                  className="no-print flex-none rounded-md px-2 py-1 text-sm text-slate-400 hover:bg-white hover:text-red-600"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Legende */}
      <div className="no-print mt-3 flex gap-4 px-0.5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <i className="inline-block h-3 w-3 rounded-sm border border-emerald-200 bg-emerald-50" />
          frei
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block h-3 w-3 rounded-sm border border-orange-200 bg-orange-50" />
          belegt
        </span>
      </div>
    </div>
  );
}
