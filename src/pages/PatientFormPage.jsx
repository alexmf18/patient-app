import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePatients } from "../context/PatientContext";
import { Save, ArrowLeft } from "lucide-react";

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

const GENDER_OPTIONS = ["Masculino", "Femenino", "Otro", "Prefiero no decirlo"];
const BLOOD_TYPE_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function PatientFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPatient, addPatient, updatePatient } = usePatients();
  const isEditing = !!id;

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const existing = getPatient(id);
      if (existing) {
        setForm(existing);
      } else {
        navigate("/patients");
      }
    }
  }, [id, isEditing, getPatient, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "El nombre es obligatorio.";
    if (!form.lastName.trim()) errs.lastName = "Los apellidos son obligatorios.";
    if (!form.dni.trim()) errs.dni = "El DNI/NIE es obligatorio.";
    if (!form.birthDate) errs.birthDate = "La fecha de nacimiento es obligatoria.";
    if (!form.gender) errs.gender = "Selecciona un género.";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));

    if (isEditing) {
      updatePatient(id, form);
    } else {
      addPatient(form);
    }

    navigate("/patients");
    setSaving(false);
  }

  function Field({ label, name, required, type = "text", children }) {
    return (
      <div>
        <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children || (
          <input
            id={name}
            name={name}
            type={type}
            value={form[name]}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm transition focus:ring-2 focus:outline-none ${
              errors[name]
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-primary-500 focus:ring-primary-500/20"
            }`}
          />
        )}
        {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg border border-gray-300 p-2 text-gray-500 transition hover:bg-gray-50"
          aria-label="Volver atrás"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Editar Paciente" : "Nuevo Paciente"}
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {isEditing
              ? "Modifica los datos del paciente."
              : "Completa el formulario para registrar un nuevo paciente."}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6">
          {/* Personal info */}
          <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Información Personal</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre" name="firstName" required />
              <Field label="Apellidos" name="lastName" required />
              <Field label="DNI / NIE" name="dni" required />
              <Field label="Fecha de nacimiento" name="birthDate" type="date" required />
              <Field label="Género" name="gender" required>
                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm transition focus:ring-2 focus:outline-none ${
                    errors.gender
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 focus:border-primary-500 focus:ring-primary-500/20"
                  }`}
                >
                  <option value="">Seleccionar...</option>
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </Field>
              <Field label="Grupo sanguíneo" name="bloodType">
                <select
                  id="bloodType"
                  name="bloodType"
                  value={form.bloodType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                >
                  <option value="">Seleccionar...</option>
                  {BLOOD_TYPE_OPTIONS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </Field>
            </div>
          </section>

          {/* Contact info */}
          <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Contacto</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Teléfono" name="phone" type="tel" />
              <Field label="Correo electrónico" name="email" type="email" />
              <div className="sm:col-span-2">
                <Field label="Dirección" name="address" />
              </div>
              <Field label="Nº Seguridad Social" name="insuranceNumber" />
            </div>
          </section>

          {/* Medical info */}
          <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Información Médica</h2>
            <div className="grid gap-4">
              <Field label="Alergias" name="allergies">
                <textarea
                  id="allergies"
                  name="allergies"
                  rows={2}
                  value={form.allergies}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                  placeholder="Ej: Penicilina, Polen..."
                />
              </Field>
              <Field label="Diagnóstico" name="diagnosis">
                <textarea
                  id="diagnosis"
                  name="diagnosis"
                  rows={2}
                  value={form.diagnosis}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                />
              </Field>
              <Field label="Tratamiento" name="treatment">
                <textarea
                  id="treatment"
                  name="treatment"
                  rows={3}
                  value={form.treatment}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                />
              </Field>
              <Field label="Notas clínicas" name="notes">
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                />
              </Field>
              {isEditing && (
                <Field label="Estado" name="status">
                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </Field>
              )}
            </div>
          </section>
        </div>

        {/* Submit */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" aria-hidden="true" />
                {isEditing ? "Guardar Cambios" : "Registrar Paciente"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
