const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

// Leichtgewichtige CSS-Konfetti-Animation ohne externe Abhängigkeiten.
export default function Confetti({ count = 80 }) {
  const pieces = Array.from({ length: count }, (_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 0.5;
    const duration = 2.2 + Math.random() * 1.3;
    const size = 6 + Math.random() * 6;
    const color = COLORS[i % COLORS.length];
    const rotate = Math.random() * 360;
    const drift = (Math.random() - 0.5) * 80;
    return (
      <span
        key={i}
        className="confetti-piece"
        style={{
          left: `${left}%`,
          width: `${size}px`,
          height: `${size * 0.6}px`,
          background: color,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          "--rot": `${rotate}deg`,
          "--drift": `${drift}px`,
        }}
      />
    );
  });

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {pieces}
    </div>
  );
}
