import { useState } from "react";
import {
  buildSlotsByRange,
  todayISO,
  toMinutes,
  formatDate,
} from "../lib/time.js";
import { uid } from "../lib/storage.js";

const STEPS = ["Tag", "Uhrzeiten", "Überblick"];

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full border px-4 py-2 text-sm font-semibold transition " +
        (active
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-blue-400")
      }
    >
      {children}
    </button>
  );
}

export default function CreateWizard({ onCreate, onCancel }) {
  const [step, setStep] = useState(0);
  const [date, setDate] = useState(todayISO());
  const [start, setStart] = useState("15:00");
  const [end, setEnd] = useState("18:00");
  const [dur, setDur] = useState(30);
  const [brk, setBrk] = useState(0);

  const preview = buildSlotsByRange(start, end, Number(dur), Number(brk));
  const invalidRange = toMinutes(end) <= toMinutes(start);
  const canContinue = step === 1 ? !invalidRange && preview.length > 0 : true;

  const inputCls =
    "w-full rounded-xl border border-slate-200 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const labelCls = "mb-1.5 block text-sm font-semibold text-slate-500";

  function create() {
    if (invalidRange || preview.length === 0) return;
    onCreate({
      id: uid(),
      title: "",
      date,
      start,
      end,
      dur: Number(dur),
      brk: Number(brk),
      slots: preview,
    });
  }

  function back() {
    if (step === 0) onCancel?.();
    else setStep((s) => s - 1);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold">Neuer Termin</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100"
          >
            Abbrechen
          </button>
        )}
      </div>

      {/* Fortschritt */}
      <div className="mb-5 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div
              className={
                "flex h-7 w-7 flex-none items-center justify-center rounded-full text-sm font-bold " +
                (i < step
                  ? "bg-blue-600 text-white"
                  : i === step
                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                    : "bg-slate-100 text-slate-400")
              }
            >
              {i < step ? "✓" : i + 1}
            </div>
            <span
              className={
                "hidden text-sm font-semibold sm:inline " +
                (i === step ? "text-slate-800" : "text-slate-400")
              }
            >
              {s}
            </span>
            {i < STEPS.length - 1 && <div className="h-px flex-1 bg-slate-200" />}
          </div>
        ))}
      </div>

      {/* Schritt 1: Tag */}
      {step === 0 && (
        <div>
          <label className={labelCls}>An welchem Tag finden die Gespräche statt?</label>
          <input
            type="date"
            className={inputCls}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {date && (
            <p className="mt-2 text-sm text-slate-500">{formatDate(date)}</p>
          )}
        </div>
      )}

      {/* Schritt 2: Uhrzeiten */}
      {step === 1 && (
        <div className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Von</label>
              <input
                type="time"
                className={inputCls}
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Bis</label>
              <input
                type="time"
                className={inputCls + (invalidRange ? " border-red-300" : "")}
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Dauer pro Gespräch</label>
            <div className="flex flex-wrap gap-2">
              {[20, 25, 30].map((d) => (
                <Chip key={d} active={dur === d} onClick={() => setDur(d)}>
                  {d} Min.
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Pause zwischen den Gesprächen</label>
            <div className="flex flex-wrap gap-2">
              {[0, 5, 10].map((b) => (
                <Chip key={b} active={brk === b} onClick={() => setBrk(b)}>
                  {b === 0 ? "keine" : b + " Min."}
                </Chip>
              ))}
            </div>
          </div>

          <div
            className={
              "rounded-xl px-4 py-3 text-sm " +
              (invalidRange ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700")
            }
          >
            {invalidRange ? (
              "Die Endzeit muss nach der Startzeit liegen."
            ) : (
              <>
                Ergibt <strong>{preview.length}</strong> Gespräche
                {preview.length > 0 && (
                  <>
                    {" "}
                    von {preview[0].from} bis {preview[preview.length - 1].to} Uhr
                  </>
                )}
                .
              </>
            )}
          </div>
        </div>
      )}

      {/* Schritt 3: Überblick */}
      {step === 2 && (
        <div className="grid gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-lg font-bold">{formatDate(date)}</p>
            <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-slate-500">Zeitraum</dt>
              <dd className="text-right font-semibold tabular-nums">
                {start}–{end} Uhr
              </dd>
              <dt className="text-slate-500">Gespräche</dt>
              <dd className="text-right font-semibold">
                {preview.length} × {dur} Min.
              </dd>
              <dt className="text-slate-500">Pause</dt>
              <dd className="text-right font-semibold">
                {brk === 0 ? "keine" : brk + " Min."}
              </dd>
            </dl>
          </div>
          <p className="text-center text-xs text-slate-400">
            Namen, Notizen und Markierungen kannst du danach jederzeit anpassen.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={back}
          className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
        >
          ‹ {step === 0 ? "Abbrechen" : "Zurück"}
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => canContinue && setStep((s) => s + 1)}
            disabled={!canContinue}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Weiter ›
          </button>
        ) : (
          <button
            type="button"
            onClick={create}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white transition hover:brightness-110"
          >
            ✓ Termin erstellen
          </button>
        )}
      </div>
    </div>
  );
}
