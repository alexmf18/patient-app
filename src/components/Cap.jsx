// Tapón de tubo: el color codifica el estado (verde activo, gris inactivo) y
// la banda roja marca alergias. Ningún otro uso de estos colores.
import { hasAllergies } from "../utils/format";

const CAP_COLOR = {
  active: "var(--color-cap-green)",
  inactive: "var(--color-cap-gray)",
};

export function capStatusLabel(patient) {
  const state = patient.status === "active" ? "activo" : "inactivo";
  return hasAllergies(patient) ? `${state}, con alergias` : state;
}

/** Tubo de perfil, para filas y cabeceras. */
export function TubeGlyph({ status = "active", allergic = false, className = "h-8 w-4" }) {
  return (
    <svg viewBox="0 0 16 32" className={`shrink-0 ${className}`} aria-hidden="true">
      <rect x="2.5" y="10" width="11" height="20.5" rx="5.5" fill="#fff" stroke="var(--color-rule-strong)" />
      {allergic && <rect x="2.5" y="17" width="11" height="4" fill="var(--color-cap-red)" />}
      <rect x="0.5" y="1" width="15" height="9.5" rx="2.5" fill={CAP_COLOR[status] ?? CAP_COLOR.active} />
    </svg>
  );
}

/** Tapón visto desde arriba, para la gradilla. */
export function CapTop({ status = "active", allergic = false, initials = "", lifted = false }) {
  return (
    <span
      className={`relative flex aspect-square w-full items-center justify-center rounded-full transition-transform duration-200 ease-[var(--ease-out-expo)] ${
        lifted ? "-translate-y-1 shadow-[var(--shadow-lift)]" : "shadow-[inset_0_-3px_0_rgb(0_0_0/0.18)]"
      }`}
      style={{ background: CAP_COLOR[status] ?? CAP_COLOR.active }}
      aria-hidden="true"
    >
      {allergic && (
        <span className="absolute inset-[-4px] rounded-full border-[3px] border-cap-red" />
      )}
      <span className="absolute inset-[18%] rounded-full border border-white/25" />
      <span className="relative font-mono text-[0.7rem] font-semibold tracking-wide text-white sm:text-xs">
        {initials}
      </span>
    </span>
  );
}
