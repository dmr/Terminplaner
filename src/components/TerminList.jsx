import { formatDate } from "../lib/time.js";

export default function TerminList({ termine, openId, onOpen }) {
  return (
    <div className="no-print rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold">Meine Termine</h2>

      {termine.length === 0 ? (
        <p className="py-8 text-center text-slate-400">
          Noch keine Termine angelegt.
        </p>
      ) : (
        <div className="grid gap-2.5">
          {termine.map((t) => {
            const booked = t.slots.filter((s) => s.name.trim()).length;
            const active = t.id === openId;
            return (
              <button
                key={t.id}
                onClick={() => onOpen(t.id)}
                className={
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition " +
                  (active
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50")
                }
              >
                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-[15px]">
                    {t.title}
                  </strong>
                  <span className="text-sm text-slate-500">
                    {t.date ? formatDate(t.date) + " · " : ""}ab {t.start} ·{" "}
                    {t.dur} Min.
                  </span>
                </div>
                <span className="whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                  {booked}/{t.slots.length} belegt
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
