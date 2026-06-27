import { useEffect, useState } from "react";
import { useStore } from "./lib/store.js";
import CreateWizard from "./components/CreateWizard.jsx";
import TerminList from "./components/TerminList.jsx";
import TerminDetail from "./components/TerminDetail.jsx";
import GuestFlow from "./components/GuestFlow.jsx";
import Login from "./components/Login.jsx";
import ShareDialog from "./components/ShareDialog.jsx";

const shareId = new URLSearchParams(window.location.search).get("t");

export default function App() {
  const store = useStore();
  const [openId, setOpenId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [creating, setCreating] = useState(false);
  const [shareFor, setShareFor] = useState(null);

  // Teilen-Link: einzelnen Termin laden (undefined = lädt, null = nicht gefunden)
  const [shared, setShared] = useState(undefined);
  useEffect(() => {
    if (!shareId || !store.ready) return;
    let active = true;
    store.loadShared(shareId).then((t) => active && setShared(t || null));
    return () => {
      active = false;
    };
  }, [store.ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const open = store.termine.find((t) => t.id === openId) || null;

  async function handleCreate(meta) {
    const id = await store.createTermin(meta);
    setCreating(false);
    if (id) setOpenId(id);
  }

  function handleRename() {
    if (!open) return;
    const name = prompt("Bezeichnung (optional):", open.title || "");
    if (name !== null) store.renameTermin(open.id, name.trim());
  }

  async function handleGuestBook(terminId, idx, name) {
    await store.bookSlot(terminId, idx, name);
    if (shareId) {
      const t = await store.loadShared(shareId);
      setShared(t || null);
    }
  }

  async function handleGuestCancel(terminId, idx, name) {
    await store.cancelBooking(terminId, idx, name);
    if (shareId) {
      const t = await store.loadShared(shareId);
      setShared(t || null);
    }
  }

  function switchRole(admin) {
    setIsAdmin(admin);
    setOpenId(null);
    setCreating(false);
  }

  const wrap = "mx-auto max-w-2xl px-4 pb-20 pt-6";

  // --- Ladezustand ---
  if (!store.ready || (shareId && shared === undefined)) {
    return (
      <div className={wrap}>
        <p className="py-20 text-center text-slate-400">Lädt …</p>
      </div>
    );
  }

  // --- Eltern über Teilen-Link (eigene, schlanke Ansicht) ---
  if (shareId) {
    return (
      <div className={wrap}>
        <Header />
        <div className="animate-pop">
          {shared ? (
            <GuestFlow
              termine={[shared]}
              onBook={handleGuestBook}
              onCancel={handleGuestCancel}
            />
          ) : (
            <Card>
              <p className="py-6 text-center text-slate-500">
                Dieser Termin wurde nicht gefunden oder ist nicht mehr verfügbar.
              </p>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={wrap}>
      <Header>
        <div className="flex flex-none items-center gap-2">
          {store.mode === "cloud" && store.user && isAdmin && (
            <button
              onClick={() => {
                store.signOut();
                switchRole(false);
              }}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50"
            >
              Abmelden
            </button>
          )}
          <button
            onClick={() => switchRole(!isAdmin)}
            className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-400 hover:text-blue-600"
          >
            {isAdmin ? "Eltern-Ansicht" : "Lehrer-Ansicht"}
          </button>
        </div>
      </Header>

      <div className="animate-pop">
        {isAdmin ? (
          store.mode === "cloud" && store.needsAuth ? (
            <Login onSignIn={store.signIn} />
          ) : open ? (
            <TerminDetail
              termin={open}
              onBack={() => setOpenId(null)}
              onSetSlot={store.setSlot}
              onRemoveBooking={store.removeBooking}
              onRename={handleRename}
              onDelete={() => {
                store.deleteTermin(open.id);
                setOpenId(null);
              }}
              onShare={() => setShareFor(open.id)}
            />
          ) : creating ? (
            <CreateWizard onCreate={handleCreate} onCancel={() => setCreating(false)} />
          ) : (
            <div className="grid gap-4">
              <button
                onClick={() => setCreating(true)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4 font-semibold text-blue-600 transition hover:border-blue-400 hover:bg-blue-50"
              >
                <span className="text-lg leading-none">＋</span> Neuer Termin
              </button>
              <TerminList termine={store.termine} onOpen={setOpenId} />
            </div>
          )
        ) : store.mode === "cloud" ? (
          <Card>
            <div className="py-6 text-center">
              <div className="mb-2 text-3xl">🔗</div>
              <p className="font-semibold">Bitte den Link Ihrer Lehrkraft öffnen</p>
              <p className="mt-1 text-sm text-slate-500">
                Eltern buchen über den geteilten Termin-Link.
              </p>
            </div>
          </Card>
        ) : (
          <GuestFlow
            termine={store.termine}
            onBook={handleGuestBook}
            onCancel={handleGuestCancel}
          />
        )}
      </div>

      {shareFor && (
        <ShareDialog terminId={shareFor} onClose={() => setShareFor(null)} />
      )}
    </div>
  );
}

function Header({ children }) {
  return (
    <header className="no-print mb-6 flex items-center gap-3">
      <div className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-blue-600 text-xl text-white">
        🗓️
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="text-lg font-bold tracking-tight">Terminplaner</h1>
        <p className="truncate text-sm text-slate-500">Elterngespräche</p>
      </div>
      {children}
    </header>
  );
}

function Card({ children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {children}
    </div>
  );
}
