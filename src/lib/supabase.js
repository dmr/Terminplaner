import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cloud-Modus nur, wenn beide Werte gesetzt sind – sonst läuft die App
// weiter rein lokal über localStorage.
export const isCloud = Boolean(url && key);

export const supabase = isCloud ? createClient(url, key) : null;
