import { CapTop } from "./Cap";
import Logo from "./Logo";

// Gradilla ilustrativa para las pantallas de acceso (decorativa).
const RACK = [
  "active", "active", null, "inactive", "active",
  "active", "allergic", "active", null, "active",
  null, "active", "inactive", "active", "allergic",
];

function DecorativeRack() {
  return (
    <div className="grid grid-cols-5 gap-3 rounded-2xl bg-well p-4 shadow-[inset_0_2px_6px_rgb(24_32_28/0.12)]" aria-hidden="true">
      {RACK.map((slot, i) => (
        <span key={i} className="rounded-full bg-rail p-1.5 shadow-[inset_0_2px_3px_rgb(24_32_28/0.18)]">
          {slot ? (
            <CapTop
              status={slot === "inactive" ? "inactive" : "active"}
              allergic={slot === "allergic"}
            />
          ) : (
            <span className="block aspect-square w-full" />
          )}
        </span>
      ))}
    </div>
  );
}

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="flex min-h-dvh bg-tray">
      <div className="hidden flex-1 flex-col justify-between border-r border-rule bg-rail p-12 lg:flex">
        <Logo />
        <div className="mx-auto w-full max-w-sm">
          <DecorativeRack />
          <p className="mt-8 text-2xl leading-snug font-bold text-balance text-ink">
            Tus pacientes, de un vistazo: quién está activo y quién tiene alergias.
          </p>
          <p className="mt-3 text-ink-2">
            Pensado para la consulta del centro de salud, en el ordenador y en la tablet.
          </p>
        </div>
        <p className="text-sm text-ink-3">Proyecto de demostración con datos ficticios.</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <Logo className="mb-8 justify-center lg:hidden" />
          <div className="label-stock overflow-hidden">
            <div className="h-2 bg-cap-violet" aria-hidden="true" />
            <div className="p-6 sm:p-8">
              <h1 className="text-2xl font-bold text-ink">{title}</h1>
              <p className="mt-1 text-sm text-ink-2">{subtitle}</p>
              <div className="mt-6">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
