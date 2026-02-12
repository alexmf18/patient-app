import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { usePatients } from "../context/PatientContext";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Droplets,
  Shield,
  AlertTriangle,
  FileText,
  Pill,
  StickyNote,
  Activity,
} from "lucide-react";

export default function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPatient, deletePatient } = usePatients();
  const [patient, setPatient] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const p = getPatient(id);
    if (p) {
      setPatient(p);
    } else {
      navigate("/patients");
    }
  }, [id, getPatient, navigate]);

  function handleDelete() {
    deletePatient(id);
    navigate("/patients");
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function calculateAge(birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  if (!patient) return null;

  function InfoItem({ icon: Icon, label, value, color = "text-primary-500" }) {
    if (!value) return null;
    return (
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 shrink-0 ${color}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400">{label}</p>
          <p className="text-sm text-gray-700">{value}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border border-gray-300 p-2 text-gray-500 transition hover:bg-gray-50"
            aria-label="Volver atrás"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {patient.firstName} {patient.lastName}
              </h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  patient.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {patient.status === "active" ? "Activo" : "Inactivo"}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">DNI: {patient.dni}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/patients/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Editar
          </Link>
          <button
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Eliminar
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Personal info */}
        <div className="space-y-6">
          <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
              <User className="h-4 w-4 text-primary-500" aria-hidden="true" />
              Datos Personales
            </h2>
            <div className="space-y-4">
              <InfoItem icon={Calendar} label="Fecha de nacimiento" value={`${formatDate(patient.birthDate)} (${calculateAge(patient.birthDate)} años)`} />
              <InfoItem icon={User} label="Género" value={patient.gender} />
              <InfoItem icon={Droplets} label="Grupo sanguíneo" value={patient.bloodType} color="text-red-500" />
              <InfoItem icon={Shield} label="Nº Seguridad Social" value={patient.insuranceNumber} color="text-accent-600" />
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
              <Phone className="h-4 w-4 text-primary-500" aria-hidden="true" />
              Contacto
            </h2>
            <div className="space-y-4">
              <InfoItem icon={Phone} label="Teléfono" value={patient.phone} />
              <InfoItem icon={Mail} label="Email" value={patient.email} />
              <InfoItem icon={MapPin} label="Dirección" value={patient.address} />
            </div>
          </section>
        </div>

        {/* Right column - Medical info */}
        <div className="space-y-6 lg:col-span-2">
          {patient.allergies && (
            <section className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
              <h2 className="mb-2 flex items-center gap-2 text-base font-semibold text-red-800">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                Alergias
              </h2>
              <p className="text-sm text-red-700">{patient.allergies}</p>
            </section>
          )}

          <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
              <FileText className="h-4 w-4 text-primary-500" aria-hidden="true" />
              Diagnóstico
            </h2>
            <p className="whitespace-pre-wrap text-sm text-gray-700">
              {patient.diagnosis || "Sin diagnóstico registrado."}
            </p>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
              <Pill className="h-4 w-4 text-accent-600" aria-hidden="true" />
              Tratamiento
            </h2>
            <p className="whitespace-pre-wrap text-sm text-gray-700">
              {patient.treatment || "Sin tratamiento registrado."}
            </p>
          </section>

          {patient.notes && (
            <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
                <StickyNote className="h-4 w-4 text-amber-500" aria-hidden="true" />
                Notas Clínicas
              </h2>
              <p className="whitespace-pre-wrap text-sm text-gray-700">{patient.notes}</p>
            </section>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Activity className="h-3 w-3" aria-hidden="true" />
              Creado: {formatDate(patient.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Activity className="h-3 w-3" aria-hidden="true" />
              Actualizado: {formatDate(patient.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Delete modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar eliminación"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <h2 className="mb-2 text-center text-lg font-bold text-gray-900">
              Eliminar paciente
            </h2>
            <p className="mb-6 text-center text-sm text-gray-500">
              ¿Estás seguro de que deseas eliminar a{" "}
              <strong>
                {patient.firstName} {patient.lastName}
              </strong>
              ? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
