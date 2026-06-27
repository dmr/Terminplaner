import { useCallback, useEffect, useState } from "react";
import { supabase, isCloud } from "./supabase.js";
import { buildSlotsByRange } from "./time.js";

const KEY = "terminplaner.v2";

// --- gemeinsame Helfer ------------------------------------------------------
function uid() {
  return "t" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Baut die Slot-Liste aus den Metadaten + optionalen Buchungen.
function buildSlots(meta, bookingsByIndex = {}) {
  return buildSlotsByRange(meta.start, meta.end, meta.dur, meta.brk).map(
    (s, i) => {
      const b = bookingsByIndex[i];
      return {
        ...s,
        name: b?.name || "",
        note: b?.note || "",
        flag: b?.flag || "",
      };
    }
  );
}

function metaFromRow(row) {
  return {
    id: row.id,
    title: row.title || "",
    date: row.date,
    start: row.start_time,
    end: row.end_time,
    dur: row.dur,
    brk: row.brk,
  };
}

// ===========================================================================
// LOKALER Modus (localStorage)
// ===========================================================================
function loadLocal() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw).termine || [];
  } catch {
    /* ignore */
  }
  return [];
}

function useLocalStore() {
  const [termine, setTermine] = useState(loadLocal);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ termine }));
    } catch {
      /* ignore */
    }
  }, [termine]);

  const patchSlot = (id, idx, patch) =>
    setTermine((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              slots: t.slots.map((s, i) => (i === idx ? { ...s, ...patch } : s)),
            }
          : t
      )
    );

  return {
    mode: "local",
    ready: true,
    user: { local: true },
    needsAuth: false,
    termine,
    signIn: async () => {},
    signOut: async () => {},
    createTermin: async (meta) => {
      const t = { id: uid(), ...meta, slots: buildSlots(meta) };
      setTermine((prev) => [t, ...prev]);
      return t.id;
    },
    renameTermin: async (id, title) =>
      setTermine((prev) =>
        prev.map((t) => (t.id === id ? { ...t, title } : t))
      ),
    setSlot: async (id, idx, patch) => patchSlot(id, idx, patch),
    removeBooking: async (id, idx) =>
      patchSlot(id, idx, { name: "", note: "", flag: "" }),
    deleteTermin: async (id) =>
      setTermine((prev) => prev.filter((t) => t.id !== id)),
    bookSlot: async (id, idx, name) => patchSlot(id, idx, { name }),
    loadShared: async (id) =>
      loadLocal().find((t) => t.id === id) || null,
    refresh: async () => {},
  };
}

// ===========================================================================
// CLOUD-Modus (Supabase)
// ===========================================================================
function useCloudStore() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [termine, setTermine] = useState([]);

  // Auth-Status verfolgen
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setUser(data.session?.user || null);
        setReady(true);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Termine des angemeldeten Owners laden (inkl. Buchungen)
  const refresh = useCallback(async () => {
    if (!user) {
      setTermine([]);
      return;
    }
    const { data: rows } = await supabase
      .from("termine")
      .select("*")
      .order("date", { ascending: true });
    const ids = (rows || []).map((r) => r.id);
    let bookings = [];
    if (ids.length) {
      const { data: bk } = await supabase
        .from("bookings")
        .select("*")
        .in("termin_id", ids);
      bookings = bk || [];
    }
    const byTermin = {};
    bookings.forEach((b) => {
      (byTermin[b.termin_id] ||= {})[b.slot_index] = b;
    });
    setTermine(
      (rows || []).map((r) => {
        const meta = metaFromRow(r);
        return { ...meta, slots: buildSlots(meta, byTermin[r.id] || {}) };
      })
    );
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function upsertBooking(id, idx, patch) {
    const t = termine.find((x) => x.id === id);
    const cur = t?.slots[idx] || { name: "", note: "", flag: "" };
    const next = {
      termin_id: id,
      slot_index: idx,
      name: patch.name ?? cur.name,
      note: patch.note ?? cur.note,
      flag: patch.flag ?? cur.flag,
    };
    await supabase.from("bookings").upsert(next);
    await refresh();
  }

  return {
    mode: "cloud",
    ready,
    user,
    needsAuth: !user,
    termine,
    signIn: async (email) => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.href },
      });
      if (error) throw error;
    },
    signOut: async () => {
      await supabase.auth.signOut();
      setTermine([]);
    },
    createTermin: async (meta) => {
      const { data, error } = await supabase
        .from("termine")
        .insert({
          owner: user.id,
          title: meta.title || "",
          date: meta.date,
          start_time: meta.start,
          end_time: meta.end,
          dur: meta.dur,
          brk: meta.brk,
        })
        .select()
        .single();
      if (error) throw error;
      await refresh();
      return data.id;
    },
    renameTermin: async (id, title) => {
      await supabase.from("termine").update({ title }).eq("id", id);
      await refresh();
    },
    setSlot: async (id, idx, patch) => upsertBooking(id, idx, patch),
    removeBooking: async (id, idx) => {
      await supabase
        .from("bookings")
        .delete()
        .eq("termin_id", id)
        .eq("slot_index", idx);
      await refresh();
    },
    deleteTermin: async (id) => {
      await supabase.from("termine").delete().eq("id", id);
      await refresh();
    },
    bookSlot: async (id, idx, name) => {
      const { error } = await supabase.rpc("book_slot", {
        p_termin: id,
        p_index: idx,
        p_name: name,
      });
      if (error) throw error;
    },
    // Eltern-Sicht über Teilen-Link: nur Metadaten + belegte Slot-Nummern.
    loadShared: async (id) => {
      const { data: row } = await supabase
        .from("termine")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!row) return null;
      const { data: taken } = await supabase
        .from("taken_slots")
        .select("slot_index")
        .eq("termin_id", id);
      const takenSet = new Set((taken || []).map((x) => x.slot_index));
      const meta = metaFromRow(row);
      const slots = buildSlots(meta).map((s, i) => ({
        ...s,
        name: takenSet.has(i) ? "—" : "",
      }));
      return { ...meta, slots };
    },
    refresh,
  };
}

// ===========================================================================
export function useStore() {
  // Hook-Aufrufreihenfolge ist stabil, weil isCloud zur Build-Zeit feststeht.
  return isCloud ? useCloudStore() : useLocalStore();
}
