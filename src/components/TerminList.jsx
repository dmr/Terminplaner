import { terminLabel, terminEnd } from "../lib/time.js";

export default function TerminList({ termine, onOpen }) {
  if (termine.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="py-8 text-center text-slate-400">
          Noch keine Termine angelegt. Lege oben deinen ersten Termin an.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold">Meine Termine</h2>
      <div className="grid gap-2.5">
        {termine.map((t) => {
          const booked = t.slots.filter((s) => s.name.trim()).length;
          return (
            <button
              key={t.id}
              onClick={() => onOpen(t.id)}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-blue-500 hover:bg-blue-50"
            >
              <div className="min-w-0 flex-1">
                <strong className="block truncate text-[15px]">
                  {terminLabel(t)}
                </strong>
                <span className="text-sm text-slate-500 tabular-nums">
                  {t.start}–{terminEnd(t)} Uhr
                </span>
              </div>
              <span className="whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                {booked}/{t.slots.length} belegt
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
