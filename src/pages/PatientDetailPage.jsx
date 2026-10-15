import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { usePatients } from "../context/PatientContext";
import { useToast } from "../context/ToastContext";
import PatientLabel from "../components/PatientLabel";
import ConfirmDialog from "../components/ConfirmDialog";
import { LoadError } from "../components/PageStates";
import NotFoundPage from "./NotFoundPage";
import { formatDate, fullName } from "../utils/format";

function ClinicalBlock({ title, value, empty }) {
  return (
    <section className="px-5 pt-5 sm:px-7">
      <h2 className="text-sm font-bold text-ink-3">{title}</h2>
      {value ? (
        <p className="mt-1.5 max-w-[68ch] leading-relaxed whitespace-pre-wrap text-ink">{value}</p>
      ) : (
        <p className="mt-1.5 text-ink-3">{empty}</p>
      )}
    </section>
  );
}

function DataList({ title, items }) {
  return (
    <section className="panel p-5 sm:p-6">
      <h2 className="text-sm font-bold text-ink-3">{title}</h2>
      <dl className="mt-3 space-y-3">
        {items.map(({ label, value, mono, href }) => (
          <div key={label}>
            <dt className="text-xs text-ink-3">{label}</dt>
            <dd className={`mt-0.5 break-words text-ink ${mono ? "font-mono text-sm" : ""}`}>
              {!value ? (
                <span className="text-ink-3">No registrado</span>
              ) : href ? (
                <a href={href} className="text-ink underline">
                  {value}
                </a>
              ) : (
                value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPatient, deletePatient, status } = usePatients();
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const patient = getPatient(id);

  if (status === "error") return <LoadError />;
  if (status === "loading" || status === "idle") {
    return (
      <div className="space-y-4" aria-hidden="true">
        <span className="skeleton block h-5 w-32" />
        <span className="skeleton block h-48 w-full rounded-xl" />
      </div>
    );
  }
  if (!patient) return <NotFoundPage />;

  function handleDelete() {
    setConfirmOpen(false);
    const name = fullName(patient);
    const undo = deletePatient(patient.id, {
      onError: (err) => toast(`No se pudo eliminar a ${name}: ${err.message}`, { tone: "error" }),
    });
    navigate("/patients");
    toast(`${name} eliminado.`, {
      duration: 6000,
      action: {
        label: "Deshacer",
        onClick: () => {
          undo();
          navigate(`/patients/${patient.id}`);
        },
      },
    });
  }

  const actions = (
    <div className="flex gap-2 lg:flex-col">
      <Link to={`/patients/${patient.id}/edit`} className="btn btn-primary flex-1">
        <Pencil className="h-4 w-4" aria-hidden="true" />
        Editar ficha
      </Link>
      <button type="button" onClick={() => setConfirmOpen(true)} className="btn btn-secondary flex-1">
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        Eliminar
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <Link
        to="/patients"
        className="-ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-ink-2 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Pacientes
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-6">
          <PatientLabel patient={patient} size="lg" headingLevel="h1">
            <div className="-mx-5 mt-5 border-t border-dashed border-rule sm:-mx-7">
              <ClinicalBlock title="Diagnóstico" value={patient.diagnosis} empty="Sin diagnóstico registrado." />
              <ClinicalBlock title="Tratamiento" value={patient.treatment} empty="Sin tratamiento registrado." />
              <ClinicalBlock title="Notas clínicas" value={patient.notes} empty="Sin notas." />
            </div>
          </PatientLabel>
          <div className="lg:hidden">
            {actions}
          </div>
        </div>

        <div className="space-y-6">
          <div className="hidden lg:block">{actions}</div>
          <DataList
            title="Contacto"
            items={[
              { label: "Teléfono", value: patient.phone, mono: true, href: patient.phone && `tel:${patient.phone.replace(/\s/g, "")}` },
              { label: "Correo electrónico", value: patient.email, href: patient.email && `mailto:${patient.email}` },
              { label: "Dirección", value: patient.address },
            ]}
          />
          <DataList
            title="Datos administrativos"
            items={[
              { label: "Nacimiento", value: formatDate(patient.birthDate, "long"), mono: true },
              { label: "Nº Seguridad Social", value: patient.insuranceNumber, mono: true },
              { label: "Alta en PatientApp", value: formatDate(patient.createdAt, "long"), mono: true },
            ]}
          />
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="¿Eliminar este paciente?"
        confirmLabel="Eliminar paciente"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      >
        <p>
          Se eliminará la ficha de <strong className="text-ink">{fullName(patient)}</strong>. Tendrás unos
          segundos para deshacerlo.
        </p>
      </ConfirmDialog>
    </div>
  );
}
