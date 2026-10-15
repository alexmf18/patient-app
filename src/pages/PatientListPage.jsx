import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertTriangle, ChevronLeft, ChevronRight, Pencil, Trash2, UserPlus, X } from "lucide-react";
import { usePatients } from "../context/PatientContext";
import { useToast } from "../context/ToastContext";
import { TubeGlyph } from "../components/Cap";
import ConfirmDialog from "../components/ConfirmDialog";
import { LoadError, SkeletonRows } from "../components/PageStates";
import { formatDate, fullName, hasAllergies } from "../utils/format";

const PAGE_SIZE = 10;

const FILTERS = [
  { id: "todos", label: "Todos", test: () => true },
  { id: "activos", label: "Activos", test: (p) => p.status === "active" },
  { id: "inactivos", label: "Inactivos", test: (p) => p.status === "inactive" },
  { id: "alergias", label: "Con alergias", test: hasAllergies },
];

const SORTS = {
  recientes: { label: "Última actualización", compare: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt) },
  apellido: { label: "Apellidos (A–Z)", compare: (a, b) => a.lastName.localeCompare(b.lastName, "es") },
};

const normalize = (s = "") => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export default function PatientListPage() {
  const { patients, status, deletePatient } = usePatients();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [toDelete, setToDelete] = useState(null);

  const query = searchParams.get("q") || "";
  const filterId = FILTERS.some((f) => f.id === searchParams.get("estado")) ? searchParams.get("estado") : "todos";
  const sortId = searchParams.get("orden") in SORTS ? searchParams.get("orden") : "recientes";
  const page = Math.max(1, Number(searchParams.get("pagina")) || 1);

  function setParam(key, value, defaultValue) {
    const next = new URLSearchParams(searchParams);
    if (!value || value === defaultValue) next.delete(key);
    else next.set(key, value);
    if (key !== "pagina") next.delete("pagina"); // cualquier cambio de criterio vuelve a la página 1
    setSearchParams(next, { replace: key !== "pagina" });
  }

  const searched = useMemo(() => {
    const term = normalize(query.trim());
    if (!term) return patients;
    return patients.filter((p) =>
      [p.firstName, p.lastName, fullName(p), p.dni, p.diagnosis].some((v) => normalize(v).includes(term))
    );
  }, [patients, query]);

  const counts = Object.fromEntries(FILTERS.map((f) => [f.id, searched.filter(f.test).length]));
  const filter = FILTERS.find((f) => f.id === filterId);
  const results = useMemo(
    () => searched.filter(filter.test).sort(SORTS[sortId].compare),
    [searched, filter, sortId]
  );

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function confirmDelete() {
    const patient = toDelete;
    setToDelete(null);
    const undo = deletePatient(patient.id, {
      onError: (err) => toast(`No se pudo eliminar a ${fullName(patient)}: ${err.message}`, { tone: "error" }),
    });
    toast(`${fullName(patient)} eliminado.`, {
      action: { label: "Deshacer", onClick: undo },
      duration: 6000,
    });
  }

  if (status === "error") return <LoadError />;
  const loading = status === "loading" || status === "idle";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Pacientes</h1>
          <p className="mt-1 text-ink-2" aria-live="polite">
            {loading ? (
              "Cargando…"
            ) : query ? (
              <>
                {results.length} {results.length === 1 ? "resultado" : "resultados"} para «{query}»
              </>
            ) : (
              <>
                {patients.length} {patients.length === 1 ? "paciente" : "pacientes"} en tu gradilla
              </>
            )}
          </p>
        </div>
        <Link to="/patients/new" className="btn btn-primary self-start sm:self-auto">
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Nuevo paciente
        </Link>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div
          role="group"
          aria-label="Filtrar por estado"
          className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0"
        >
          {FILTERS.map((f) => {
            const selected = f.id === filterId;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setParam("estado", f.id, "todos")}
                className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors duration-150 ${
                  selected
                    ? "border-violet-deep bg-violet-wash text-violet-ink"
                    : "border-rule-strong bg-label text-ink-2 hover:border-ink-3 hover:text-ink"
                }`}
              >
                {f.label}
                <span className="font-mono text-xs tabular opacity-80">{loading ? "–" : counts[f.id]}</span>
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-2">
          Ordenar por
          <select
            value={sortId}
            onChange={(e) => setParam("orden", e.target.value, "recientes")}
            className="field-input !min-h-10 w-auto !py-1.5 pr-8 text-sm"
          >
            {Object.entries(SORTS).map(([id, s]) => (
              <option key={id} value={id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <SkeletonRows rows={6} />
      ) : results.length === 0 ? (
        <div className="panel flex flex-col items-center px-6 py-14 text-center">
          <TubeGlyph status="inactive" className="h-14 w-7" />
          {patients.length === 0 ? (
            <>
              <h2 className="mt-5 text-lg font-bold text-ink">Aún no has registrado pacientes</h2>
              <p className="mt-1 max-w-sm text-sm text-ink-2">
                Registra el primero: solo necesitas nombre, apellidos, DNI, fecha de nacimiento y género.
              </p>
              <Link to="/patients/new" className="btn btn-primary mt-6">
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Registrar paciente
              </Link>
            </>
          ) : (
            <>
              <h2 className="mt-5 text-lg font-bold text-ink">Ningún paciente coincide</h2>
              <p className="mt-1 max-w-sm text-sm text-ink-2">
                Prueba con otro nombre, un DNI completo o parte del diagnóstico.
              </p>
              <button
                type="button"
                className="btn btn-secondary mt-6"
                onClick={() => setSearchParams(new URLSearchParams(), { replace: true })}
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Quitar búsqueda y filtros
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="panel overflow-hidden">
          <div
            className="hidden grid-cols-[1rem_minmax(0,1.4fr)_8rem_minmax(0,1.3fr)_7rem_6rem] items-center gap-4 border-b border-rule-strong px-5 py-2.5 text-xs font-semibold text-ink-3 md:grid"
            aria-hidden="true"
          >
            <span />
            <span>Paciente</span>
            <span>DNI</span>
            <span>Diagnóstico</span>
            <span>Actualizado</span>
            <span className="text-right">Acciones</span>
          </div>
          <ul className="divide-y divide-rule" aria-label="Lista de pacientes">
            {paginated.map((p) => {
              const allergic = hasAllergies(p);
              return (
                <li
                  key={p.id}
                  className="grid grid-cols-[1rem_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-4 py-3 transition-colors duration-150 hover:bg-rail/70 sm:px-5 md:grid-cols-[1rem_minmax(0,1.4fr)_8rem_minmax(0,1.3fr)_7rem_6rem]"
                >
                  <TubeGlyph status={p.status} allergic={allergic} />
                  <div className="min-w-0">
                    <Link
                      to={`/patients/${p.id}`}
                      className="font-semibold text-ink hover:underline"
                    >
                      <span className="uppercase">{p.lastName}</span>, {p.firstName}
                    </Link>
                    <p className="font-mono text-xs text-ink-3 md:hidden">{p.dni}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                      {p.status === "inactive" && <span className="font-semibold text-ink-3">Inactivo</span>}
                      {allergic && (
                        <span className="inline-flex max-w-full items-center gap-1 font-semibold text-red-ink">
                          <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden="true" />
                          <span className="truncate">Alergia: {p.allergies}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="hidden font-mono text-sm text-ink-2 md:block">{p.dni}</span>
                  <span className="hidden truncate text-sm text-ink-2 md:block" title={p.diagnosis}>
                    {p.diagnosis || "—"}
                  </span>
                  <span className="hidden font-mono text-sm text-ink-3 tabular md:block">
                    {formatDate(p.updatedAt)}
                  </span>
                  <div className="flex justify-end">
                    <Link
                      to={`/patients/${p.id}/edit`}
                      className="icon-btn"
                      aria-label={`Editar a ${fullName(p)}`}
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setToDelete(p)}
                      className="icon-btn"
                      aria-label={`Eliminar a ${fullName(p)}`}
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {totalPages > 1 && (
            <nav
              className="flex items-center justify-between gap-4 border-t border-rule px-4 py-3 sm:px-5"
              aria-label="Paginación"
            >
              <p className="font-mono text-sm text-ink-3 tabular">
                {currentPage} / {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setParam("pagina", String(currentPage - 1), "1")}
                  disabled={currentPage === 1}
                  className="btn btn-secondary !min-h-10 !px-3"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => setParam("pagina", String(currentPage + 1), "1")}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary !min-h-10 !px-3"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </nav>
          )}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="¿Eliminar este paciente?"
        confirmLabel="Eliminar paciente"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      >
        {toDelete && (
          <p>
            Se eliminará la ficha de <strong className="text-ink">{fullName(toDelete)}</strong>. Tendrás
            unos segundos para deshacerlo.
          </p>
        )}
      </ConfirmDialog>
    </div>
  );
}
