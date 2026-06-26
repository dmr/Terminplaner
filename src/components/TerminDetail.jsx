import { useState } from "react";
import { formatDate } from "../lib/time.js";
import ConfirmDialog from "./ConfirmDialog.jsx";

const FLAGS = [
  { key: "rot", color: "#ef4444", label: "Wichtig" },
  { key: "gelb", color: "#f59e0b", label: "Rückruf" },
  { key: "gruen", color: "#10b981", label: "Erledigt" },
  { key: "blau", color: "#3b82f6", label: "Notiz" },
];
const flagColor = (key) => FLAGS.find((f) => f.key === key)?.color || null;

export default function TerminDetail({ termin, onBack, onChange, onRename, onDelete }) {
  const [openFlag, setOpenFlag] = useState(null);
  const [openNote, setOpenNote] = useState(null);
  const [pendingClear, setPendingClear] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(false);

  if (!termin) return null;

  const booked = termin.slots.filter((s) => s.name.trim()).length;

  function setSlot(idx, patch) {
    onChange({
      ...termin,
      slots: termin.slots.map((s, i) => (i === idx ? { ...s, ...patch } : s)),
    });
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
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <button
            onClick={onBack}
            className="mb-1 rounded-lg px-2 py-1 text-sm font-semibold text-blue-600 hover:bg-blue-50"
          >
            ‹ Übersicht
          </button>
          <h2 className="truncate text-lg font-bold">{termin.title}</h2>
          <p className="text-sm text-slate-500">
            {termin.date ? formatDate(termin.date) + " · " : ""}
            {booked} von {termin.slots.length} Plätzen vergeben
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => window.print()}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Drucken
          </button>
          <button
            onClick={onRename}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Umbenennen
          </button>
          <button
            onClick={() => setPendingDelete(true)}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Löschen
          </button>
        </div>
      </div>

      {/* Slots */}
      <div className="grid gap-2">
        {termin.slots.map((s, idx) => {
          const filled = s.name.trim();
          const accent = flagColor(s.flag);
          const noteVisible = openNote === idx || s.note;
          return (
            <div
              key={idx}
              className={
                "print-slot overflow-hidden rounded-xl border " +
                (filled ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50/60")
              }
              style={accent ? { borderLeft: `4px solid ${accent}` } : undefined}
            >
              <div className="flex items-center gap-3 py-2 pl-4 pr-2">
                <span className="w-[104px] flex-none font-semibold tabular-nums text-slate-700">
                  {s.from}–{s.to}
                </span>
                <input
                  className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-2 py-1.5 placeholder:italic placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
                  value={s.name}
                  placeholder="frei – Name eintragen"
                  onChange={(e) => setSlot(idx, { name: e.target.value })}
                />
                <div className="no-print flex flex-none items-center gap-1">
                  <button
                    title="Markierung"
                    onClick={() => {
                      setOpenFlag(openFlag === idx ? null : idx);
                      setOpenNote(null);
                    }}
                    className="grid h-8 w-8 place-items-center rounded-md hover:bg-slate-100"
                  >
                    <span
                      className="inline-block h-3.5 w-3.5 rounded-full border"
                      style={{
                        background: accent || "transparent",
                        borderColor: accent || "#cbd5e1",
                      }}
                    />
                  </button>
                  <button
                    title="Interne Notiz"
                    onClick={() => {
                      setOpenNote(openNote === idx ? null : idx);
                      setOpenFlag(null);
                    }}
                    className={
                      "grid h-8 w-8 place-items-center rounded-md hover:bg-slate-100 " +
                      (s.note ? "text-blue-600" : "text-slate-400")
                    }
                  >
                    ✎
                  </button>
                  {filled && (
                    <button
                      title="Eintrag entfernen"
                      onClick={() => setPendingClear(idx)}
                      className="grid h-8 w-8 place-items-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Markierungs-Palette */}
              {openFlag === idx && (
                <div className="no-print flex items-center gap-2 border-t border-slate-100 px-4 py-2.5">
                  <button
                    onClick={() => {
                      setSlot(idx, { flag: "" });
                      setOpenFlag(null);
                    }}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                  >
                    keine
                  </button>
                  {FLAGS.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => {
                        setSlot(idx, { flag: f.key });
                        setOpenFlag(null);
                      }}
                      title={f.label}
                      className="flex items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold hover:bg-slate-50"
                    >
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ background: f.color }}
                      />
                      {f.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Interne Notiz */}
              {noteVisible && (
                <div className="no-print border-t border-slate-100 px-4 py-2.5">
                  <textarea
                    rows={2}
                    value={s.note || ""}
                    onChange={(e) => setSlot(idx, { note: e.target.value })}
                    placeholder="Interne Notiz – nur für dich sichtbar, Eltern sehen sie nicht."
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {pendingClear !== null && (
        <ConfirmDialog
          title="Eintrag entfernen?"
          message={`Der Termin ${termin.slots[pendingClear].from}–${termin.slots[pendingClear].to} Uhr von „${termin.slots[pendingClear].name}" wird wieder freigegeben. Notiz und Markierung gehen verloren.`}
          confirmLabel="Eintrag entfernen"
          onCancel={() => setPendingClear(null)}
          onConfirm={() => {
            setSlot(pendingClear, { name: "", note: "", flag: "" });
            setPendingClear(null);
          }}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Termin löschen?"
          message={`„${termin.title}" und alle ${termin.slots.length} Zeitfenster werden dauerhaft gelöscht. Das kann nicht rückgängig gemacht werden.`}
          confirmLabel="Termin löschen"
          onCancel={() => setPendingDelete(false)}
          onConfirm={() => {
            setPendingDelete(false);
            onDelete();
          }}
        />
      )}
    </div>
  );
}
