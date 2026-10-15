// Código de barras ilustrativo derivado del código del paciente: siempre el
// mismo patrón para el mismo paciente, como la etiqueta impresa de un tubo.
export default function Barcode({ code, className = "h-8 w-28" }) {
  const bars = [];
  let x = 0;
  const pattern = `*${code}*`;
  for (const char of pattern) {
    const n = char.charCodeAt(0);
    for (let i = 0; i < 4; i++) {
      const width = ((n >> i) & 1) + 1;
      if (i % 2 === 0) bars.push({ x, width });
      x += width + 1;
    }
  }
  return (
    <svg viewBox={`0 0 ${x} 20`} preserveAspectRatio="none" className={className} aria-hidden="true">
      {bars.map((bar, i) => (
        <rect key={i} x={bar.x} y="0" width={bar.width} height="20" fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
