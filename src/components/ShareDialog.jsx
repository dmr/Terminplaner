import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { isCloud } from "../lib/supabase.js";

export default function ShareDialog({ terminId, onClose }) {
  const url = `${window.location.origin}${import.meta.env.BASE_URL}?t=${terminId}`;
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(url, { width: 240, margin: 1 }).then(setQr).catch(() => {});
  }, [url]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold">Termin teilen</h2>
        <p className="mt-1 text-sm text-slate-500">
          Eltern öffnen diesen Link und buchen ein freies Zeitfenster.
        </p>

        {qr && (
          <img
            src={qr}
            alt="QR-Code"
            className="mx-auto my-4 h-48 w-48 rounded-xl border border-slate-100"
          />
        )}

        <div className="flex items-center gap-2">
          <input
            readOnly
            value={url}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
          />
          <button
            onClick={copy}
            className="flex-none rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            {copied ? "✓" : "Kopieren"}
          </button>
        </div>

        {!isCloud && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-left text-xs text-amber-700">
            Hinweis: Im lokalen Modus funktioniert der Link nur auf diesem Gerät.
            Für geräteübergreifende Buchung Supabase einrichten (siehe README).
          </p>
        )}

        <button
          onClick={onClose}
          className="mt-4 text-sm font-semibold text-slate-500 hover:text-slate-700"
        >
          Schließen
        </button>
      </div>
    </div>
  );
}
