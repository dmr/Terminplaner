# Terminplaner – Elterngespräche

Eine kleine, einfache App zum Planen von Elterngesprächen / Sprechtagen.
Pro Termin legst du mehrere Zeitfenster (Slots) à 20, 25 oder 30 Minuten an
und trägst die Eltern ein. Anschließend kannst du die Liste ausdrucken.

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

## Benutzung

Die App ist eine einzige Datei. Es gibt **keine Installation**:

1. `index.html` herunterladen.
2. Per Doppelklick im Browser (Chrome, Firefox, Safari, Edge) öffnen.

Fertig. Die Daten bleiben in dem Browser gespeichert, in dem du die App benutzt.

### Online nutzen (optional, GitHub Pages)

Wenn du die App lieber über einen Link öffnen möchtest, kannst du sie über
GitHub Pages bereitstellen:

1. Im Repository unter **Settings → Pages**.
2. Bei *Build and deployment* die Quelle **Deploy from a branch** wählen.
3. Branch auf den Branch mit dieser Datei und Ordner `/ (root)` setzen, speichern.
4. Nach kurzer Zeit ist die App unter der angezeigten URL erreichbar.

## Hinweis

Die Daten liegen nur lokal im Browser. Möchtest du sie auf ein anderes Gerät
übertragen, trage die Termine dort neu ein oder drucke die Liste aus.
