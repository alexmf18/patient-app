import { useEffect, useRef, useState } from "react";
import { Link, useBlocker, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { usePatients } from "../context/PatientContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ChoiceField, FormSection, TextAreaField, TextField } from "../components/FormFields";
import ConfirmDialog from "../components/ConfirmDialog";
import Spinner from "../components/Spinner";
import { LoadError } from "../components/PageStates";
import NotFoundPage from "./NotFoundPage";
import { fullName } from "../utils/format";
import { getDraft, saveDraft } from "../utils/storage";
import {
  normalizeDni,
  validateBirthDate,
  validateDni,
  validateEmail,
  validatePhone,
} from "../utils/validation";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  dni: "",
  birthDate: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
  insuranceNumber: "",
  bloodType: "",
  allergies: "",
  diagnosis: "",
  treatment: "",
  notes: "",
  status: "active",
};

const GENDER_OPTIONS = ["Femenino", "Masculino", "Otro", "Prefiero no decirlo"];
const BLOOD_TYPE_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const STATUS_OPTIONS = [
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
];

const FIELD_LABELS = {
  firstName: "Nombre",
  lastName: "Apellidos",
  dni: "DNI / NIE",
  birthDate: "Fecha de nacimiento",
  gender: "Género",
  phone: "Teléfono",
  email: "Correo electrónico",
};

const fromPatient = (patient) =>
  Object.fromEntries(Object.keys(EMPTY_FORM).map((key) => [key, patient[key] ?? EMPTY_FORM[key]]));

const today = () => new Date().toISOString().slice(0, 10);

function validateField(name, form, original) {
  switch (name) {
    case "firstName":
      return form.firstName.trim() ? "" : "Escribe el nombre del paciente.";
    case "lastName":
      return form.lastName.trim() ? "" : "Escribe los apellidos del paciente.";
    case "dni":
      // La letra de control solo se exige si el DNI se ha cambiado.
      return validateDni(form.dni, { checkLetter: normalizeDni(form.dni) !== normalizeDni(original.dni) });
    case "birthDate":
      return validateBirthDate(form.birthDate);
    case "gender":
      return form.gender ? "" : "Elige una opción de género.";
    case "phone":
      return validatePhone(form.phone);
    case "email":
      return validateEmail(form.email);
    default:
      return "";
  }
}

function PatientForm({ initial, patientId, restoredDraft }) {
  const navigate = useNavigate();
  const { addPatient, updatePatient } = usePatients();
  const { user } = useAuth();
  const toast = useToast();
  const isEditing = Boolean(patientId);

  const [form, setForm] = useState(restoredDraft || initial);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDraftNotice, setShowDraftNotice] = useState(Boolean(restoredDraft));
  const allowLeave = useRef(false);
  const summaryRef = useRef(null);

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && !allowLeave.current && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // Borrador local solo para altas nuevas (sobrevive a una recarga o interrupción).
  useEffect(() => {
    if (isEditing) return;
    saveDraft(user.id, dirty ? form : null);
  }, [form, dirty, isEditing, user.id]);

  function setValue(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  const handleChange = (e) => setValue(e.target.name, e.target.value);
  const handleBlur = (e) => {
    const { name } = e.target;
    if (!(name in FIELD_LABELS)) return;
    const error = validateField(name, form, initial);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  function focusField(name) {
    const el = document.getElementById(name);
    const target = el?.matches("input, textarea, select") ? el : el?.querySelector("input");
    target?.focus();
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    const next = Object.fromEntries(
      Object.keys(FIELD_LABELS).map((name) => [name, validateField(name, form, initial)])
    );
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setSaving(true);
    const payload = { ...form, dni: normalizeDni(form.dni) };
    try {
      const saved = isEditing ? await updatePatient(patientId, payload) : await addPatient(payload);
      if (!isEditing) saveDraft(user.id, null);
      allowLeave.current = true;
      toast(isEditing ? "Cambios guardados." : `${fullName(saved)} registrado en tu gradilla.`);
      navigate(`/patients/${saved.id}`);
    } catch (err) {
      setSubmitError(err.message);
      setSaving(false);
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  }

  const errorEntries = Object.entries(errors).filter(([, msg]) => msg);
  const fieldProps = (name) => ({
    id: name,
    value: form[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: errors[name],
  });
  const backTo = isEditing ? `/patients/${patientId}` : "/patients";

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        to={backTo}
        className="-ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-ink-2 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {isEditing ? "Volver a la ficha" : "Pacientes"}
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">
          {isEditing ? `Editar a ${fullName(initial)}` : "Nuevo paciente"}
        </h1>
        <p className="mt-1 text-ink-2">
          Los campos con <span aria-hidden="true">*</span>
          <span className="sr-only">asterisco</span> son obligatorios; el resto puedes completarlo más tarde.
        </p>
      </div>

      {showDraftNotice && (
        <div className="flex flex-col gap-3 rounded-lg border border-dashed border-violet-deep bg-violet-wash px-4 py-3 text-sm text-violet-ink sm:flex-row sm:items-center sm:justify-between">
          <p>Hemos recuperado el borrador que dejaste a medias.</p>
          <button
            type="button"
            className="btn btn-quiet !min-h-9 self-start !text-violet-ink sm:self-auto"
            onClick={() => {
              setForm(initial);
              setErrors({});
              saveDraft(user.id, null);
              setShowDraftNotice(false);
            }}
          >
            Descartar borrador
          </button>
        </div>
      )}

      {(errorEntries.length > 0 || submitError) && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg bg-warn-wash px-4 py-3 text-sm text-warn-ink outline-none focus-visible:outline-2 focus-visible:outline-warn-ink"
        >
          {submitError ? (
            <p className="font-semibold">No se ha podido guardar: {submitError}</p>
          ) : (
            <>
              <p className="font-semibold">
                Revisa {errorEntries.length === 1 ? "este campo" : `estos ${errorEntries.length} campos`} antes de
                guardar:
              </p>
              <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
                {errorEntries.map(([name, msg]) => (
                  <li key={name}>
                    <button type="button" className="text-left underline" onClick={() => focusField(name)}>
                      {FIELD_LABELS[name]}
                    </button>
                    : {msg}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <FormSection title="Identificación">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Nombre" required autoComplete="off" {...fieldProps("firstName")} />
            <TextField label="Apellidos" required autoComplete="off" {...fieldProps("lastName")} />
            <TextField
              label="DNI / NIE"
              required
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              hint="8 números y letra (12345678Z) o NIE (X1234567L)."
              inputClassName="font-mono uppercase"
              {...fieldProps("dni")}
            />
            <TextField
              label="Fecha de nacimiento"
              type="date"
              required
              max={today()}
              inputClassName="font-mono"
              {...fieldProps("birthDate")}
            />
            <ChoiceField
              id="gender"
              label="Género"
              required
              options={GENDER_OPTIONS}
              value={form.gender}
              onChange={setValue}
              error={errors.gender}
              className="sm:col-span-2"
            />
          </div>
        </FormSection>

        <FormSection title="Información clínica" description="Las alergias se mostrarán destacadas en rojo en toda la app.">
          <div className="space-y-5">
            <TextAreaField
              label="Alergias"
              rows={2}
              placeholder="Ej.: penicilina, látex. Déjalo vacío si no tiene."
              {...fieldProps("allergies")}
            />
            <ChoiceField
              id="bloodType"
              label="Grupo sanguíneo"
              options={BLOOD_TYPE_OPTIONS}
              value={form.bloodType}
              onChange={setValue}
            />
            <TextAreaField label="Diagnóstico" rows={2} {...fieldProps("diagnosis")} />
            <TextAreaField label="Tratamiento" rows={3} {...fieldProps("treatment")} />
            <TextAreaField label="Notas clínicas" rows={3} {...fieldProps("notes")} />
            {isEditing && (
              <ChoiceField
                id="status"
                label="Estado"
                required
                options={STATUS_OPTIONS}
                value={form.status}
                onChange={setValue}
              />
            )}
          </div>
        </FormSection>

        <FormSection title="Contacto y datos administrativos">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Teléfono"
              type="tel"
              autoComplete="off"
              inputMode="tel"
              inputClassName="font-mono"
              placeholder="+34 600 000 000"
              {...fieldProps("phone")}
            />
            <TextField
              label="Correo electrónico"
              type="email"
              autoComplete="off"
              inputMode="email"
              {...fieldProps("email")}
            />
            <TextField label="Dirección" autoComplete="off" className="sm:col-span-2" {...fieldProps("address")} />
            <TextField
              label="Nº Seguridad Social"
              autoComplete="off"
              inputClassName="font-mono"
              {...fieldProps("insuranceNumber")}
            />
          </div>
        </FormSection>

        <div className="sticky bottom-0 -mx-4 flex flex-col-reverse gap-2 border-t border-rule bg-tray px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:static sm:mx-0 sm:flex-row sm:justify-end sm:border-0 sm:bg-transparent sm:p-0">
          <Link to={backTo} className="btn btn-secondary">
            Cancelar
          </Link>
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? (
              <>
                <Spinner /> Guardando…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" aria-hidden="true" />
                {isEditing ? "Guardar cambios" : "Registrar paciente"}
              </>
            )}
          </button>
        </div>
      </form>

      <ConfirmDialog
        open={blocker.state === "blocked"}
        title="¿Salir sin guardar?"
        confirmLabel="Salir sin guardar"
        cancelLabel="Seguir editando"
        onConfirm={() => {
          if (!isEditing) saveDraft(user.id, null);
          blocker.proceed?.();
        }}
        onCancel={() => blocker.reset?.()}
      >
        <p>Tienes cambios sin guardar en este formulario. Si sales ahora, se perderán.</p>
      </ConfirmDialog>
    </div>
  );
}

export default function PatientFormPage() {
  const { id } = useParams();
  const { getPatient, status } = usePatients();
  const { user } = useAuth();

  if (!id) {
    const draft = getDraft(user.id);
    return <PatientForm key="new" initial={EMPTY_FORM} restoredDraft={draft ? { ...EMPTY_FORM, ...draft } : null} />;
  }

  if (status === "error") return <LoadError />;
  if (status === "loading" || status === "idle") {
    return (
      <div className="max-w-3xl space-y-4" aria-hidden="true">
        <span className="skeleton block h-8 w-64" />
        <span className="skeleton block h-72 w-full rounded-xl" />
      </div>
    );
  }
  const patient = getPatient(id);
  if (!patient) return <NotFoundPage />;
  return <PatientForm key={id} initial={fromPatient(patient)} patientId={id} />;
}
