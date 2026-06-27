// Kalender-Export (.ics). Stabile UIDs pro Slot, damit erneuter Import
// bestehende Einträge aktualisiert statt zu duplizieren. Freigewordene Slots
// werden als STATUS:CANCELLED exportiert, damit keine "Import-Leichen" bleiben.

const PRODID = "-//Terminplaner//Elterngespraeche//DE";

function esc(t) {
  return String(t)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function pad(n) {
  return String(n).padStart(2, "0");
}

// Lokale "schwebende" Zeit (ohne Zeitzone) – Termin findet zur Wandzeit statt.
function dtLocal(date, hhmm) {
  return date.replace(/-/g, "") + "T" + hhmm.replace(":", "") + "00";
}

function stampUTC() {
  const d = new Date();
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

function uidFor(terminId, index) {
  return `terminplaner-${terminId}-${index}@terminplaner`;
}

function isBooked(slot) {
  const n = (slot.name || "").trim();
  return n !== "" && n !== "—";
}

function vevent({ uid, seq, stamp, start, end, status, summary, description }) {
  const lines = [
    "BEGIN:VEVENT",
    "UID:" + uid,
    "DTSTAMP:" + stamp,
    "SEQUENCE:" + seq,
    "DTSTART:" + start,
    "DTEND:" + end,
    "STATUS:" + status,
    "SUMMARY:" + esc(summary),
  ];
  if (description) lines.push("DESCRIPTION:" + esc(description));
  lines.push("END:VEVENT");
  return lines;
}

function wrap(events) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:" + PRODID,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

// --- Merker, welche Slots zuletzt als Termin exportiert wurden -------------
const expKey = (id) => "terminplaner.ics." + id;
function loadExported(id) {
  try {
    return new Set(JSON.parse(localStorage.getItem(expKey(id)) || "[]"));
  } catch {
    return new Set();
  }
}
function saveExported(id, indices) {
  try {
    localStorage.setItem(expKey(id), JSON.stringify(indices));
  } catch {
    /* ignore */
  }
}

// Ganzen Termin exportieren: gebuchte Slots als CONFIRMED, seit dem letzten
// Export freigewordene Slots als CANCELLED.
export function buildTerminICS(termin) {
  const seq = Math.floor(Date.now() / 1000);
  const stamp = stampUTC();

  const bookedIdx = [];
  const events = [];

  termin.slots.forEach((s, i) => {
    if (isBooked(s)) {
      bookedIdx.push(i);
      events.push(
        ...vevent({
          uid: uidFor(termin.id, i),
          seq,
          stamp,
          start: dtLocal(termin.date, s.from),
          end: dtLocal(termin.date, s.to),
          status: "CONFIRMED",
          summary: "Elterngespräch – " + s.name.trim(),
          description: (s.note || "").trim() || undefined,
        })
      );
    }
  });

  // Stornierungen: vorher exportiert, jetzt nicht mehr gebucht.
  const prev = loadExported(termin.id);
  prev.forEach((i) => {
    if (!bookedIdx.includes(i)) {
      const s = termin.slots[i];
      events.push(
        ...vevent({
          uid: uidFor(termin.id, i),
          seq,
          stamp,
          start: dtLocal(termin.date, s ? s.from : "00:00"),
          end: dtLocal(termin.date, s ? s.to : "00:00"),
          status: "CANCELLED",
          summary: "Elterngespräch (storniert)",
        })
      );
    }
  });

  saveExported(termin.id, bookedIdx);
  return wrap(events);
}

// Einzelnen Termin (für Eltern, "Zum Kalender hinzufügen").
export function buildEventICS(termin, index) {
  const s = termin.slots[index];
  return wrap(
    vevent({
      uid: uidFor(termin.id, index),
      seq: Math.floor(Date.now() / 1000),
      stamp: stampUTC(),
      start: dtLocal(termin.date, s.from),
      end: dtLocal(termin.date, s.to),
      status: "CONFIRMED",
      summary: "Elterngespräch",
    })
  );
}

export function downloadICS(filename, content) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
