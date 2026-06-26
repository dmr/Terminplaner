import { useState } from "react";
import { useTermine } from "./lib/storage.js";
import CreateForm from "./components/CreateForm.jsx";
import TerminList from "./components/TerminList.jsx";
import TerminDetail from "./components/TerminDetail.jsx";

export default function App() {
  const [termine, setTermine] = useTermine();
  const [openId, setOpenId] = useState(null);

  const open = termine.find((t) => t.id === openId) || null;

  function handleCreate(termin) {
    setTermine((prev) => [termin, ...prev]);
    setOpenId(termin.id);
  }

  function handleChange(updated) {
    setTermine((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  function handleRename() {
    if (!open) return;
    const name = prompt("Bezeichnung ändern:", open.title);
    if (name !== null && name.trim()) {
      handleChange({ ...open, title: name.trim() });
    }
  }

  function handleDelete() {
    if (!open) return;
    if (!confirm(`Termin „${open.title}" wirklich löschen?`)) return;
    setTermine((prev) => prev.filter((t) => t.id !== open.id));
    setOpenId(null);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-6">
      <header className="no-print mb-6 flex items-center gap-3">
        <div className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-blue-600 text-2xl">
          🗓️
        </div>
        <div>
          <h1 className="text-xl font-bold">Terminplaner</h1>
          <p className="text-sm text-slate-500">
            Elterngespräche planen – Zeitfenster anlegen, Eltern eintragen, Liste
            ausdrucken.
          </p>
        </div>
      </header>

      {open ? (
        <TerminDetail
          termin={open}
          onBack={() => setOpenId(null)}
          onChange={handleChange}
          onRename={handleRename}
          onDelete={handleDelete}
        />
      ) : (
        <div className="grid gap-4">
          <CreateForm onCreate={handleCreate} />
          <TerminList termine={termine} openId={openId} onOpen={setOpenId} />
        </div>
      )}
    </div>
  );
}
