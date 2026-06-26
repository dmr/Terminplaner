import { useState } from "react";
import { useTermine } from "./lib/storage.js";
import CreateWizard from "./components/CreateWizard.jsx";
import TerminList from "./components/TerminList.jsx";
import TerminDetail from "./components/TerminDetail.jsx";
import GuestList from "./components/GuestList.jsx";
import GuestBooking from "./components/GuestBooking.jsx";

export default function App() {
  const [termine, setTermine] = useTermine();
  const [openId, setOpenId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

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
    setTermine((prev) => prev.filter((t) => t.id !== open.id));
    setOpenId(null);
  }

  function switchRole(admin) {
    setIsAdmin(admin);
    setOpenId(null);
  }

  // Gast bucht ein Zeitfenster
  function handleBook(idx, name) {
    if (!open) return;
    const slots = open.slots.map((s, i) => (i === idx ? { ...s, name } : s));
    handleChange({ ...open, slots });
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
          ) : (
            <div className="grid gap-4">
              <CreateWizard onCreate={handleCreate} />
              <TerminList termine={termine} openId={openId} onOpen={setOpenId} />
            </div>
          )
        ) : open ? (
          <GuestBooking
            termin={open}
            onBack={() => setOpenId(null)}
            onBook={handleBook}
          />
        ) : (
          <GuestList termine={termine} onOpen={setOpenId} />
        )}
      </div>
    </div>
  );
}
