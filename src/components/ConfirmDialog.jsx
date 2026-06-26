export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Entfernen",
  cancelLabel = "Abbrechen",
  danger = true,
  onConfirm,
  onCancel,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold">{title}</h2>
        {message && <p className="mt-1 text-sm text-slate-600">{message}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={
              "rounded-lg px-4 py-2 font-semibold text-white hover:brightness-110 " +
              (danger ? "bg-red-600" : "bg-blue-600")
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
