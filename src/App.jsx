import { useState } from "react";
import { useTermine } from "./lib/storage.js";
import { ADMIN_PASSWORD } from "./lib/auth.js";
import CreateForm from "./components/CreateForm.jsx";
import TerminList from "./components/TerminList.jsx";
import TerminDetail from "./components/TerminDetail.jsx";
import GuestList from "./components/GuestList.jsx";
import GuestBooking from "./components/GuestBooking.jsx";
import LoginModal from "./components/LoginModal.jsx";

export default function App() {
  const [termine, setTermine] = useTermine();
  const [openId, setOpenId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

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

  function handleLogin(pw) {
    if (pw === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLogin(false);
      setOpenId(null);
      return true;
    }
    return false;
  }

  function logout() {
    setIsAdmin(false);
    setOpenId(null);
  }

  // Gast bucht ein Zeitfenster
  function handleBook(idx, name) {
    if (!open) return;
    const slots = open.slots.map((s, i) => (i === idx ? { ...s, name } : s));
    handleChange({ ...open, slots });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-6">
      <header className="no-print mb-6 flex items-center gap-3">
        <div className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-blue-600 text-2xl">
          🗓️
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold">Terminplaner</h1>
          <p className="truncate text-sm text-slate-500">
            {isAdmin
              ? "Lehrer-Ansicht – Termine anlegen & verwalten"
              : "Elterngespräche – freies Zeitfenster buchen"}
          </p>
        </div>
        {isAdmin ? (
          <button
            onClick={logout}
            className="flex-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Abmelden
          </button>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="flex-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            🔒 Lehrer-Login
          </button>
        )}
      </header>

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
            <CreateForm onCreate={handleCreate} />
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

      {showLogin && (
        <LoginModal onLogin={handleLogin} onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
}
