# Terminplaner – Elterngespräche

Eine kleine, einfache App zum Planen von Elterngesprächen / Sprechtagen.
Pro Termin legst du mehrere Zeitfenster (Slots) à 20, 25 oder 30 Minuten an
und trägst die Eltern ein. Anschließend kannst du die Liste ausdrucken.

Gebaut mit **Vite + React + Tailwind CSS**. Die App läuft in zwei Modi:

- **Lokal (Standard):** ohne jede Konfiguration – alle Daten bleiben im Browser
  (localStorage). Ideal als Tablet/Kiosk am Elternabend.
- **Cloud (optional, Supabase):** geräteübergreifende Buchung über einen
  **Teilen-Link**. Eltern buchen von zu Hause, Doppelbuchungen werden serverseitig
  verhindert, Namen bleiben dank Row-Level-Security privat.

## Zwei Ansichten

Die App hat zwei Ansichten, die sich oben rechts umschalten lassen:

- **Eltern-Ansicht (Standard):** Eltern sehen nur, welche Tage angeboten werden
  und welche Zeitfenster *frei* sind. Sie wählen ein freies Fenster, geben ihren
  Namen ein und buchen (inkl. kleiner Erfolgs-Animation). **Die Namen anderer
  Eltern, Notizen und Markierungen sind hier nicht sichtbar.**
- **Lehrer-Ansicht:** Verwaltung – Termine schrittweise anlegen, **alle Namen**
  sehen, **interne Notizen und Markierungen** je Zeitfenster setzen, drucken und
  löschen (mit Sicherheits-Rückfrage).

> Im **lokalen Modus** ist die Trennung nur eine UI-Umschaltung (alle Daten
> liegen im Browser). Im **Cloud-Modus** (Supabase) ist sie echt: Die Lehrkraft
> meldet sich per E-Mail-Link an, und Namen sind per Row-Level-Security geschützt.

## Funktionen

- **Termin anlegen (Lehrer)**: Schrittweiser Assistent – Tag → Start-/Endzeit,
  Dauer (20/25/30 Min.) & Pause → Überblick. Die Zeitfenster werden automatisch
  passend zum Zeitraum erzeugt (mit Live-Vorschau).
- **Mehrere Tage**: Pro Tag einen Termin anlegen – beliebig viele parallel.
- **Buchen (Eltern)**: Freies Zeitfenster antippen → fokussierte Namenseingabe →
  absenden – mit Erfolgs-Animation.
- **Verwalten (Lehrer)**: Alle Namen sehen/ändern, interne **Notizen** und farbige
  **Markierungen** je Zeitfenster, Einträge entfernen (mit Rückfrage), umbenennen,
  Termin löschen (mit Rückfrage).
- **Teilen-Link + QR-Code (Lehrer)**: Pro Termin ein Link, den Eltern öffnen, um
  ein freies Zeitfenster zu buchen – auch als QR-Code zum Aushängen.
- **Kalender-Export (.ics)**: Lehrkraft exportiert alle gebuchten Gespräche eines
  Tages als Kalenderdatei. Dank stabiler UIDs **aktualisiert** ein erneuter Import
  bestehende Einträge statt zu duplizieren; **freigewordene Slots werden als
  Stornierung exportiert**, sodass keine „Import-Leichen" im Kalender bleiben.
- **Eltern: Zum Kalender hinzufügen** – nach der Buchung den eigenen Termin als
  .ics speichern.
- **Eltern: stornieren / ändern** – die eigene Buchung wird auf dem Gerät
  wiedererkannt und lässt sich stornieren (Ändern = stornieren + neu buchen).
- **Drucken**: Saubere Liste zum Aushängen oder Verteilen (🖨️-Knopf).
- **Speicherung**: Lokal im Browser oder – mit Supabase – in der Cloud.

## Lokal entwickeln

Voraussetzung: Node.js 18+.

```bash
npm install      # Abhängigkeiten installieren
npm run dev      # Entwicklungsserver (http://localhost:5173/Terminplaner/)
npm run build    # Produktions-Build nach dist/
npm run preview  # Build lokal testen
```

## Deployment auf GitHub Pages

Das Repository enthält einen GitHub-Actions-Workflow
(`.github/workflows/deploy.yml`), der die App automatisch baut und auf
GitHub Pages veröffentlicht.

Einmalige Einrichtung:

1. Im Repository unter **Settings → Pages**.
2. Bei *Build and deployment* als Quelle **GitHub Actions** wählen.
3. Den Branch nach `main` mergen (oder den Workflow unter **Actions** manuell
   per *Run workflow* starten – „workflow_dispatch").

Danach läuft der Workflow bei jedem Push auf `main` und veröffentlicht die App
unter:

```
https://<dein-github-name>.github.io/Terminplaner/
```

> **Hinweis zum Pfad:** In `vite.config.js` ist `base: "/Terminplaner/"`
> gesetzt – passend zum Repo-Namen. Wenn das Repository anders heißt, diesen
> Wert entsprechend anpassen.

## Cloud-Modus mit Supabase (optional)

Damit Eltern von verschiedenen Geräten buchen können, lässt sich die App mit
[Supabase](https://supabase.com) (kostenloses Free-Tier genügt) verbinden.

**1. Projekt & Schema**

1. In Supabase ein Projekt anlegen.
2. Im **SQL Editor** den Inhalt von [`supabase/schema.sql`](supabase/schema.sql)
   einmal ausführen. Das legt die Tabellen, die Datenschutz-Sicht und die
   Buchungs-Funktion samt Row-Level-Security an.
3. Unter **Authentication → Providers** ist **Email** standardmäßig aktiv
   (Anmeldung der Lehrkraft per Magic-Link, kein Passwort).

**2. Schlüssel eintragen**

Aus **Project Settings → API** die Werte kopieren:

```bash
cp .env.example .env
# VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY eintragen
```

Lokal startet `npm run dev` damit im Cloud-Modus. Für GitHub Pages dieselben
Werte als **Repository-Secrets** hinterlegen (Settings → Secrets and variables →
Actions): `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY`. Der Deploy-Workflow
liest sie beim Build.

**3. Ablauf**

- Lehrkraft meldet sich per E-Mail-Link an, legt Termine an und teilt je Termin
  den **Link/QR-Code**.
- Eltern öffnen den Link (`…/Terminplaner/?t=<Termin-ID>`), sehen nur freie
  Zeitfenster und buchen. Namen anderer Eltern bleiben verborgen.

### Datenschutz-Modell

- `termine` enthält nur Metadaten (Datum/Zeiten), **keine Namen** – die zufällige
  Termin-ID dient als Teilen-Link.
- `bookings` (Namen/Notizen) ist nur für den Owner lesbar (RLS).
- Eltern sehen über die Sicht `taken_slots` ausschließlich, **welche** Slots
  belegt sind – nicht **von wem**.
- Buchungen laufen über die Funktion `book_slot()` und sind atomar
  (keine Doppelbuchung).

## Hinweis zum lokalen Modus

Ohne Supabase-Konfiguration liegen die Daten nur lokal im Browser und werden
nicht zwischen Geräten synchronisiert. Perfekt für ein Tablet vor Ort; für
Buchungen von zu Hause den Cloud-Modus einrichten.
