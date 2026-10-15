import { RotateCw } from "lucide-react";
import { usePatients } from "../context/PatientContext";

export function LoadError() {
  const { loadError, reload } = usePatients();
  return (
    <div className="panel max-w-lg p-6 text-center" role="alert">
      <h2 className="text-lg font-bold text-ink">No se han podido cargar los pacientes</h2>
      <p className="mt-1 text-sm text-ink-2">{loadError}</p>
      <button type="button" onClick={reload} className="btn btn-secondary mt-5">
        <RotateCw className="h-4 w-4" aria-hidden="true" />
        Reintentar
      </button>
    </div>
  );
}

export function SkeletonRows({ rows = 5 }) {
  return (
    <div className="panel divide-y divide-rule" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <span className="skeleton h-8 w-4" />
          <span className="skeleton h-4 w-48" />
          <span className="skeleton ml-auto hidden h-4 w-24 sm:block" />
        </div>
      ))}
    </div>
  );
}
