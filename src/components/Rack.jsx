import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { CapTop, capStatusLabel } from "./Cap";
import { fullName, hasAllergies } from "../utils/format";

const ROW = 8; // 8 alveolos por fila en escritorio, 4 en móvil: las filas siempre quedan completas
const MIN_SLOTS = 24;

const initials = (p) => `${p.firstName.charAt(0)}${p.lastName.charAt(0)}`.toUpperCase();

function Well({ children, hidden, desktopOnly }) {
  return (
    <li
      aria-hidden={hidden || undefined}
      className={`${desktopOnly ? "hidden sm:block " : ""}rounded-full bg-rail p-[12%] shadow-[inset_0_2px_3px_rgb(24_32_28/0.2)]`}
    >
      {children}
    </li>
  );
}

/**
 * Gradilla vista desde arriba: un alveolo por paciente, con su tapón.
 * Flechas del teclado para moverse entre tapones; foco o hover selecciona.
 */
export default function Rack({ patients, focusedId, onFocusPatient }) {
  const slots = Math.max(MIN_SLOTS, Math.ceil((patients.length + 1) / ROW) * ROW);
  const empty = slots - patients.length;
  // En móvil (4 por fila) basta con completar la fila y dejar una fila libre.
  const mobileEmpty = Math.ceil((patients.length + 1) / 4) * 4 - patients.length + 4;

  function handleKeyDown(e) {
    const keys = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: "row", ArrowUp: "-row" };
    if (!(e.key in keys)) return;
    const grid = e.currentTarget;
    const links = [...grid.querySelectorAll("a[data-cap]")];
    const index = links.indexOf(document.activeElement);
    if (index === -1) return;
    const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
    const step = keys[e.key] === "row" ? cols : keys[e.key] === "-row" ? -cols : keys[e.key];
    const next = links[index + step];
    if (next) {
      e.preventDefault();
      next.focus();
    }
  }

  return (
    <div className="rounded-2xl bg-well p-3 shadow-[inset_0_2px_8px_rgb(24_32_28/0.14)] sm:p-4">
      <ul
        className="grid grid-cols-4 gap-2.5 sm:grid-cols-8 sm:gap-3"
        aria-label={`Gradilla con ${patients.length} pacientes. Usa las flechas para moverte.`}
        onKeyDown={handleKeyDown}
      >
        {patients.map((p) => {
          const lifted = p.id === focusedId;
          return (
            <Well key={p.id}>
              <Link
                to={`/patients/${p.id}`}
                data-cap
                className="block rounded-full focus-visible:outline-offset-4"
                aria-label={`${fullName(p)}, ${capStatusLabel(p)}`}
                title={fullName(p)}
                onMouseEnter={() => onFocusPatient(p.id)}
                onFocus={() => onFocusPatient(p.id)}
              >
                <CapTop
                  status={p.status}
                  allergic={hasAllergies(p)}
                  initials={initials(p)}
                  lifted={lifted}
                />
              </Link>
            </Well>
          );
        })}
        {Array.from({ length: empty }, (_, i) => (
          <Well key={`empty-${i}`} hidden={i !== 0} desktopOnly={i >= mobileEmpty}>
            {i === 0 ? (
              <Link
                to="/patients/new"
                className="flex aspect-square w-full items-center justify-center rounded-full border-2 border-dashed border-rule-strong text-ink-3 transition-colors duration-150 hover:border-violet-deep hover:text-violet-deep"
                aria-label="Registrar nuevo paciente"
                title="Nuevo paciente"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : (
              <span className="block aspect-square w-full" />
            )}
          </Well>
        ))}
      </ul>
    </div>
  );
}
