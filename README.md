# Terminplaner – Elterngespräche

Eine kleine, einfache App zum Planen von Elterngesprächen / Sprechtagen.
Pro Termin legst du mehrere Zeitfenster (Slots) à 20, 25 oder 30 Minuten an
und trägst die Eltern ein. Anschließend kannst du die Liste ausdrucken.

Gebaut mit **Vite + React + Tailwind CSS**, rein **client-side** – keine
Datenbank, kein Backend. Alle Daten bleiben lokal im Browser (localStorage).

## Zwei Ansichten

Die App hat zwei Ansichten, die sich oben rechts umschalten lassen:

- **Eltern-Ansicht (Standard):** Eltern sehen nur, welche Tage angeboten werden
  und welche Zeitfenster *frei* sind. Sie wählen ein freies Fenster, geben ihren
  Namen ein und buchen (inkl. kleiner Erfolgs-Animation). **Die Namen anderer
  Eltern, Notizen und Markierungen sind hier nicht sichtbar.**
- **Lehrer-Ansicht:** Verwaltung – Termine schrittweise anlegen, **alle Namen**
  sehen, **interne Notizen und Markierungen** je Zeitfenster setzen, drucken und
  löschen (mit Sicherheits-Rückfrage).

> ⚠️ Die Ansichten sind **kein Zugriffsschutz**, sondern nur eine UI-Trennung
> (Showcase): Bei einer rein client-seitigen App liegen alle Daten im Browser.
> Für echten Schutz und Buchungen von verschiedenen Geräten wäre ein Backend nötig.

## Funktionen

- **Termin anlegen (Lehrer)**: Schrittweiser Assistent – Tag & Titel →
  Start-/Endzeit, Dauer (20/25/30 Min.) & Pause → Überblick. Die Zeitfenster
  werden automatisch passend zum Zeitraum erzeugt (mit Live-Vorschau).
- **Mehrere Tage**: Pro Tag einen Termin anlegen – beliebig viele parallel.
- **Buchen (Eltern)**: Freies Zeitfenster antippen → fokussierte Namenseingabe →
  absenden – mit Erfolgs-Animation.
- **Verwalten (Lehrer)**: Alle Namen sehen/ändern, interne **Notizen** und farbige
  **Markierungen** je Zeitfenster, Einträge entfernen (mit Rückfrage), umbenennen,
  Termin löschen (mit Rückfrage).
- **Drucken**: Saubere Liste zum Aushängen oder Verteilen (🖨️-Knopf).
- **Speicherung**: Alles wird automatisch lokal im Browser gespeichert
  (localStorage) – kein Server, funktioniert offline.

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
