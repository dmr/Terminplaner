import { useState } from "react";
import { useTermine } from "./lib/storage.js";
import CreateWizard from "./components/CreateWizard.jsx";
import TerminList from "./components/TerminList.jsx";
import TerminDetail from "./components/TerminDetail.jsx";
import GuestFlow from "./components/GuestFlow.jsx";

export default function App() {
  const [termine, setTermine] = useTermine();
  const [openId, setOpenId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [creating, setCreating] = useState(false);

  const open = termine.find((t) => t.id === openId) || null;

  function handleCreate(termin) {
    setTermine((prev) => [termin, ...prev]);
    setCreating(false);
    setOpenId(termin.id);
  }

  function handleChange(updated) {
    setTermine((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  function handleRename() {
    if (!open) return;
    const name = prompt("Bezeichnung (optional):", open.title || "");
    if (name !== null) handleChange({ ...open, title: name.trim() });
  }

  function handleDelete() {
    if (!open) return;
    setTermine((prev) => prev.filter((t) => t.id !== open.id));
    setOpenId(null);
  }

  function switchRole(admin) {
    setIsAdmin(admin);
    setOpenId(null);
    setCreating(false);
  }

  function handleGuestBook(terminId, idx, name) {
    setTermine((prev) =>
      prev.map((t) =>
        t.id === terminId
          ? { ...t, slots: t.slots.map((s, i) => (i === idx ? { ...s, name } : s)) }
          : t
      )
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-6">
      <header className="no-print mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-blue-600 text-xl text-white">
          🗓️
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold tracking-tight">Terminplaner</h1>
          <p className="truncate text-sm text-slate-500">
            {isAdmin ? "Lehrer-Ansicht" : "Termin für ein Gespräch buchen"}
          </p>
        </div>
        <button
          onClick={() => switchRole(!isAdmin)}
          className="flex-none rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-400 hover:text-blue-600"
        >
          {isAdmin ? "Eltern-Ansicht" : "Lehrer-Ansicht"}
        </button>
      </header>

      <div className="animate-pop">
        {isAdmin ? (
          open ? (
            <TerminDetail
              termin={open}
              onBack={() => setOpenId(null)}
              onChange={handleChange}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          ) : creating ? (
            <CreateWizard
              onCreate={handleCreate}
              onCancel={() => setCreating(false)}
            />
          ) : (
            <div className="grid gap-4">
              <button
                onClick={() => setCreating(true)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4 font-semibold text-blue-600 transition hover:border-blue-400 hover:bg-blue-50"
              >
                <span className="text-lg leading-none">＋</span> Neuer Termin
              </button>
              <TerminList termine={termine} onOpen={setOpenId} />
            </div>
          )
        ) : (
          <GuestFlow termine={termine} onBook={handleGuestBook} />
        )}
      </div>
    </div>
  );
}
