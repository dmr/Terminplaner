# Terminplaner – Elterngespräche

Eine kleine, einfache App zum Planen von Elterngesprächen / Sprechtagen.
Pro Termin legst du mehrere Zeitfenster (Slots) à 20, 25 oder 30 Minuten an
und trägst die Eltern ein. Anschließend kannst du die Liste ausdrucken.

Gebaut mit **Vite + React + Tailwind CSS**, rein **client-side** – keine
Datenbank, kein Backend. Alle Daten bleiben lokal im Browser (localStorage).

## Zwei Ansichten

Die App hat zwei Rollen:

- **Eltern-Ansicht (anonym, Standard):** Eltern sehen nur, welche Tage angeboten
  werden und welche Zeitfenster *frei* sind. Sie wählen ein freies Fenster, geben
  ihren Namen ein und buchen. **Die Namen anderer Eltern sind nicht sichtbar.**
- **Lehrer-Ansicht (nach Login):** Über *🔒 Lehrer-Login* (Demo-Passwort: `lehrer`)
  gelangst du in die Verwaltung – du siehst **alle Namen**, legst Termine an,
  bearbeitest, druckst und löschst.

> ⚠️ Der Login ist nur ein **UI-Gate**, kein echter Schutz: Bei einer rein
> client-seitigen App liegen alle Daten im Browser. Für echten Zugriffsschutz
> (und Buchungen von verschiedenen Geräten) wäre später ein Backend nötig.

## Funktionen

- **Termin anlegen (Lehrer)**: Bezeichnung, **Tag**, **Start- und Endzeit**,
  Dauer pro Gespräch (20/25/30 Min.) und optional eine Pause. Die Zeitfenster
  werden automatisch erzeugt, sodass sie in das Zeitfenster Start–Ende passen
  (mit Live-Vorschau, wie viele Gespräche möglich sind).
- **Mehrere Tage**: Pro Tag einen Termin anlegen – beliebig viele parallel.
- **Buchen (Eltern)**: Freies Zeitfenster wählen, Namen eingeben, absenden –
  inkl. Bestätigung.
- **Verwalten (Lehrer)**: Alle Namen sehen/ändern, Einträge löschen, umbenennen.
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
