// Speichert die eigenen Buchungen der Eltern pro Browser, damit sie ihre
// Buchung später wiederfinden, ändern oder stornieren können.
const KEY = "terminplaner.mybookings";

export function getMine() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

function save(arr) {
  try {
    localStorage.setItem(KEY, JSON.stringify(arr));
  } catch {
    /* ignore */
  }
}

export function addMine(entry) {
  const rest = getMine().filter((x) => x.terminId !== entry.terminId);
  rest.push(entry);
  save(rest);
}

export function removeMine(terminId) {
  save(getMine().filter((x) => x.terminId !== terminId));
}

export function mineForTermin(terminId) {
  return getMine().find((x) => x.terminId === terminId) || null;
}
