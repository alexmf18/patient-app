import { AlertTriangle } from "lucide-react";
import Barcode from "./Barcode";
import { calculateAge, formatDate, hasAllergies, shortCode } from "../utils/format";

/**
 * Etiqueta térmica del paciente: identidad impresa, alergias destacadas y
 * código de barras. `size="lg"` para la cabecera de la ficha.
 */
export default function PatientLabel({ patient, size = "md", headingLevel = "h2", children }) {
  const Heading = headingLevel;
  const age = calculateAge(patient.birthDate);
  const allergic = hasAllergies(patient);
  const active = patient.status === "active";
  const large = size === "lg";

  return (
    <article className="label-stock overflow-hidden">
      <div
        className={`h-2 ${active ? "bg-cap-green" : "bg-cap-gray"}`}
        aria-hidden="true"
      />
      <div className={large ? "p-5 sm:p-7" : "p-5"}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Heading
              className={`font-bold text-balance text-ink ${
                large ? "text-2xl leading-tight sm:text-3xl" : "text-xl leading-snug"
              }`}
            >
              <span className="uppercase">{patient.lastName}</span>, {patient.firstName}
            </Heading>
            <p className="mt-1.5 font-mono text-sm text-ink-2 tabular">
              DNI {patient.dni}
              {age !== null && <> · {age} años</>}
              {patient.gender && <> · {patient.gender}</>}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            {patient.bloodType && (
              <span
                className="rounded-md border border-ink px-2 py-0.5 font-mono text-base font-bold text-ink"
                title="Grupo sanguíneo"
              >
                <span className="sr-only">Grupo sanguíneo </span>
                {patient.bloodType}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                active ? "text-green-ink" : "text-ink-3"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${active ? "bg-cap-green" : "bg-cap-gray"}`}
                aria-hidden="true"
              />
              {active ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>

        <div
          className={`mt-4 flex items-start gap-2.5 rounded-lg px-3.5 py-3 ${
            allergic ? "bg-red-wash text-red-ink" : "bg-tray text-ink-3"
          }`}
        >
          <AlertTriangle
            className={`mt-0.5 h-4 w-4 shrink-0 ${allergic ? "" : "opacity-60"}`}
            aria-hidden="true"
          />
          <p className="text-sm">
            <span className="font-bold">{allergic ? "Alergias: " : "Sin alergias registradas"}</span>
            {allergic && patient.allergies}
          </p>
        </div>

        {children}

        <div className="mt-4 flex items-end justify-between gap-4 border-t border-dashed border-rule pt-3">
          <div className="flex items-end gap-3">
            <Barcode code={shortCode(patient.id)} className="h-8 w-24" />
            <span className="font-mono text-xs text-ink-3">{shortCode(patient.id)}</span>
          </div>
          <span className="font-mono text-xs whitespace-nowrap text-ink-3 tabular">
            Act. {formatDate(patient.updatedAt)}
          </span>
        </div>
      </div>
    </article>
  );
}
