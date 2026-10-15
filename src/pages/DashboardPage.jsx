import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Pencil, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePatients } from "../context/PatientContext";
import Rack from "../components/Rack";
import PatientLabel from "../components/PatientLabel";
import { TubeGlyph } from "../components/Cap";
import { LoadError } from "../components/PageStates";
import { formatDate, fullName, hasAllergies, todayLabel } from "../utils/format";

function Legend({ stats }) {
  const items = [
    { swatch: <span className="h-3.5 w-3.5 rounded-full bg-cap-green" />, value: stats.active, label: stats.active === 1 ? "activo" : "activos", to: "/patients?estado=activos" },
    { swatch: <span className="h-3.5 w-3.5 rounded-full bg-cap-gray" />, value: stats.inactive, label: stats.inactive === 1 ? "inactivo" : "inactivos", to: "/patients?estado=inactivos" },
    { swatch: <span className="h-3.5 w-3.5 rounded-full border-[3px] border-cap-red" />, value: stats.allergic, label: "con alergias", to: "/patients?estado=alergias" },
  ];
  return (
    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2" aria-label="Leyenda de la gradilla">
      {items.map((item) => (
        <li key={item.label}>
          <Link
            to={item.to}
            className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-2 underline decoration-rule-strong hover:text-ink hover:decoration-ink"
          >
            <span aria-hidden="true" className="flex">{item.swatch}</span>
            <span className="font-mono font-bold text-ink tabular">{item.value}</span>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function RackSkeleton() {
  return (
    <div className="rounded-2xl bg-well p-3 sm:p-4" aria-hidden="true">
      <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-8 sm:gap-3">
        {Array.from({ length: 24 }, (_, i) => (
          <span key={i} className="skeleton aspect-square rounded-full" />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { patients, stats, status } = usePatients();
  const [focusedId, setFocusedId] = useState(null);

  // Posiciones estables en la gradilla: orden alfabético por apellidos.
  const rackOrder = useMemo(
    () => [...patients].sort((a, b) => a.lastName.localeCompare(b.lastName, "es")),
    [patients]
  );
  const recent = patients.slice(0, 5); // la API ya los devuelve por última actualización
  const focused = patients.find((p) => p.id === focusedId) || recent[0];

  if (status === "error") return <LoadError />;
  const loading = status === "loading" || status === "idle";

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Hola, {user?.name}</h1>
          <p className="mt-1 font-mono text-sm text-ink-2 tabular first-letter:uppercase">{todayLabel()}</p>
        </div>
        <Link to="/patients/new" className="btn btn-primary self-start sm:self-auto">
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Nuevo paciente
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <section aria-labelledby="rack-title">
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <h2 id="rack-title" className="text-lg font-bold text-ink">
              Tu gradilla
            </h2>
            {!loading && (
              <p className="font-mono text-sm text-ink-3 tabular">
                {stats.total} {stats.total === 1 ? "paciente" : "pacientes"}
              </p>
            )}
          </div>
          {loading ? (
            <RackSkeleton />
          ) : (
            <>
              <Rack patients={rackOrder} focusedId={focused?.id} onFocusPatient={setFocusedId} />
              {patients.length > 0 ? (
                <Legend stats={stats} />
              ) : (
                <p className="mt-4 text-sm text-ink-2">
                  Tu gradilla está vacía. Cada paciente que registres ocupará un alveolo, con su
                  tapón verde si está activo y un anillo rojo si tiene alergias.
                </p>
              )}
            </>
          )}
        </section>

        <aside aria-label="Paciente seleccionado" className="lg:sticky lg:top-0">
          {loading ? (
            <div className="label-stock space-y-3 p-5" aria-hidden="true">
              <span className="skeleton block h-6 w-3/4" />
              <span className="skeleton block h-4 w-1/2" />
              <span className="skeleton block h-12 w-full" />
            </div>
          ) : focused ? (
            <>
              <PatientLabel patient={focused} headingLevel="h2" />
              <div className="mt-3 flex gap-2">
                <Link to={`/patients/${focused.id}`} className="btn btn-ink flex-1">
                  Abrir ficha
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to={`/patients/${focused.id}/edit`}
                  className="btn btn-secondary"
                  aria-label={`Editar a ${fullName(focused)}`}
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Editar
                </Link>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-rule-strong p-6 text-center">
              <p className="font-semibold text-ink">Aquí verás la etiqueta del paciente</p>
              <p className="mt-1 text-sm text-ink-2">
                Pasa el cursor por un tapón de la gradilla para ver sus datos clave.
              </p>
              <Link to="/patients/new" className="btn btn-primary mt-5">
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Registrar el primer paciente
              </Link>
            </div>
          )}
        </aside>
      </div>

      {!loading && recent.length > 0 && (
        <section aria-labelledby="recent-title">
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <h2 id="recent-title" className="text-lg font-bold text-ink">
              Actualizados recientemente
            </h2>
            <Link
              to="/patients"
              className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-ink underline"
            >
              Ver todos
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="panel divide-y divide-rule">
            {recent.map((p) => (
              <li key={p.id} className="flex items-center gap-4 px-4 py-3 sm:px-5">
                <TubeGlyph status={p.status} allergic={hasAllergies(p)} />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/patients/${p.id}`}
                    className="font-semibold text-ink hover:underline"
                  >
                    {fullName(p)}
                  </Link>
                  <p className="truncate text-sm text-ink-2">{p.diagnosis || "Sin diagnóstico registrado"}</p>
                </div>
                <span className="hidden font-mono text-sm text-ink-3 tabular sm:block">
                  {formatDate(p.updatedAt)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
