# Terminplaner – Elterngespräche

Eine kleine, einfache App zum Planen von Elterngesprächen / Sprechtagen.
Pro Termin legst du mehrere Zeitfenster (Slots) à 20, 25 oder 30 Minuten an
und trägst die Eltern ein. Anschließend kannst du die Liste ausdrucken.

Gebaut mit **Vite + React + Tailwind CSS**, rein **client-side** – keine
Datenbank, kein Backend. Alle Daten bleiben lokal im Browser (localStorage).

## Funktionen

- **Termin anlegen**: Bezeichnung, Datum, Startuhrzeit, Slot-Dauer (20/25/30 Min.),
  Anzahl der Zeitfenster (Standard: 15) und optional eine Pause zwischen den Slots.
- **Uhrzeiten automatisch**: Alle Zeitfenster werden automatisch berechnet
  (z. B. 15:00–15:30, 15:30–16:00 …). Du trägst nur noch die Namen ein.
- **Eltern eintragen**: Pro Slot einen Namen eintragen – belegte Slots werden
  farblich markiert (grün = frei, orange = belegt).
- **Mehrere Termine**: Beliebig viele Termine parallel verwalten.
- **Drucken**: Saubere Liste zum Aushängen oder Verteilen (🖨️-Knopf).
- **Speicherung**: Alles wird automatisch lokal im Browser gespeichert
  (localStorage) – kein Login, kein Server, funktioniert offline.

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

## Hinweis zu den Daten

Die Daten liegen nur lokal im Browser (localStorage). Sie werden **nicht** in
die Cloud synchronisiert. Möchtest du sie auf einem anderen Gerät nutzen, trage
die Termine dort neu ein oder drucke die Liste aus.
