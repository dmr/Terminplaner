import { formatDate } from "../lib/time.js";

export default function GuestList({ termine, onOpen }) {
  const offen = termine.filter((t) => t.slots.some((s) => !s.name.trim()));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-1 text-base font-semibold">Termin auswählen</h2>
      <p className="mb-4 text-sm text-slate-500">
        Wähle einen Tag und buche ein freies Zeitfenster für dein Gespräch.
      </p>

      {termine.length === 0 ? (
        <p className="py-8 text-center text-slate-400">
          Aktuell werden keine Termine angeboten.
        </p>
      ) : (
        <div className="grid gap-2.5">
          {termine.map((t) => {
            const free = t.slots.filter((s) => !s.name.trim()).length;
            const full = free === 0;
            return (
              <button
                key={t.id}
                disabled={full}
                onClick={() => onOpen(t.id)}
                className={
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition " +
                  (full
                    ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
                    : "border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50")
                }
              >
                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-[15px]">
                    {t.title}
                  </strong>
                  <span className="text-sm text-slate-500">
                    {t.date ? formatDate(t.date) : ""}
                  </span>
                </div>
                <span
                  className={
                    "whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold " +
                    (full
                      ? "bg-slate-200 text-slate-500"
                      : "bg-emerald-50 text-emerald-700")
                  }
                >
                  {full ? "ausgebucht" : `${free} frei`}
                </span>
              </button>
            );
          })}
        </div>
      )}
      {offen.length === 0 && termine.length > 0 && (
        <p className="mt-4 text-center text-sm text-slate-400">
          Derzeit sind alle Termine ausgebucht.
        </p>
      )}
    </div>
  );
}
