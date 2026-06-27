-- Terminplaner – Supabase-Schema
-- Im Supabase-Dashboard unter "SQL Editor" einmal ausführen.
--
-- Datenschutz-Idee:
--   * termine  : öffentliche Metadaten (Datum/Zeiten). Die zufällige id IST der
--                Teilen-Link. Enthält KEINE Namen.
--   * bookings : Namen/Notizen/Markierungen. Nur die Lehrkraft (Owner) darf lesen.
--   * free_slots / taken_slots: was Eltern sehen dürfen – nur welche Slot-Nummern
--                belegt sind, ohne Namen.
--   * book_slot(): bucht atomar (verhindert Doppelbuchung).

-- ---------------------------------------------------------------------------
-- Tabellen
-- ---------------------------------------------------------------------------
create table if not exists public.termine (
  id          uuid primary key default gen_random_uuid(),
  owner       uuid not null references auth.users (id) on delete cascade,
  title       text not null default '',
  date        date not null,
  start_time  text not null,
  end_time    text not null,
  dur         int  not null,
  brk         int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.bookings (
  termin_id   uuid not null references public.termine (id) on delete cascade,
  slot_index  int  not null,
  name        text not null default '',
  note        text not null default '',
  flag        text not null default '',
  created_at  timestamptz not null default now(),
  primary key (termin_id, slot_index)
);

create index if not exists bookings_termin_idx on public.bookings (termin_id);
create index if not exists termine_owner_idx on public.termine (owner);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.termine  enable row level security;
alter table public.bookings enable row level security;

-- termine: jeder mit der id darf die Metadaten lesen (= Teilen-Link).
drop policy if exists termine_select_public on public.termine;
create policy termine_select_public on public.termine
  for select using (true);

-- termine: nur der Owner darf anlegen/ändern/löschen.
drop policy if exists termine_insert_owner on public.termine;
create policy termine_insert_owner on public.termine
  for insert with check (owner = auth.uid());

drop policy if exists termine_update_owner on public.termine;
create policy termine_update_owner on public.termine
  for update using (owner = auth.uid());

drop policy if exists termine_delete_owner on public.termine;
create policy termine_delete_owner on public.termine
  for delete using (owner = auth.uid());

-- bookings: NUR der Owner des zugehörigen Termins darf Namen lesen/ändern.
-- Eltern buchen ausschließlich über die Funktion book_slot() (security definer).
drop policy if exists bookings_owner_all on public.bookings;
create policy bookings_owner_all on public.bookings
  for all using (
    exists (
      select 1 from public.termine t
      where t.id = bookings.termin_id and t.owner = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.termine t
      where t.id = bookings.termin_id and t.owner = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Öffentliche Sicht für Eltern: nur belegte Slot-Nummern, ohne Namen.
-- ---------------------------------------------------------------------------
create or replace view public.taken_slots
  with (security_invoker = off) as
  select termin_id, slot_index
  from public.bookings
  where coalesce(name, '') <> '';

grant select on public.taken_slots to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Atomare Buchung (verhindert Doppelbuchung) – auch für anonyme Eltern.
-- ---------------------------------------------------------------------------
create or replace function public.book_slot(p_termin uuid, p_index int, p_name text)
  returns void
  language plpgsql
  security definer
  set search_path = public
as $$
begin
  if coalesce(trim(p_name), '') = '' then
    raise exception 'name_required';
  end if;

  insert into public.bookings (termin_id, slot_index, name)
    values (p_termin, p_index, trim(p_name));
exception
  when unique_violation then
    -- Slot existierte schon (z. B. leere Notiz-Zeile). Nur buchen, wenn frei.
    update public.bookings
       set name = trim(p_name)
     where termin_id = p_termin
       and slot_index = p_index
       and coalesce(name, '') = '';
    if not found then
      raise exception 'slot_taken';
    end if;
end;
$$;

grant execute on function public.book_slot(uuid, int, text) to anon, authenticated;
