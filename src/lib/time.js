export function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}

export function addMinutes(hhmm, mins) {
  const [h, m] = hhmm.split(":").map(Number);
  let total = h * 60 + m + mins;
  total = ((total % 1440) + 1440) % 1440;
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

export function buildSlots(start, dur, count, brk) {
  const slots = [];
  let cur = start;
  for (let i = 0; i < count; i++) {
    const to = addMinutes(cur, dur);
    slots.push({ from: cur, to, name: "" });
    cur = addMinutes(to, brk);
  }
  return slots;
}

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
