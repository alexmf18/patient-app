import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";
import { TextField } from "../components/FormFields";
import PasswordField from "../components/PasswordField";
import Spinner from "../components/Spinner";
import { validateEmail } from "../utils/validation";

const FIELD_ORDER = ["name", "email", "password", "confirmPassword"];

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const refs = {
    name: useRef(null),
    email: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
  };

  function update(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    return {
      name: form.name.trim() ? "" : "Escribe tu nombre completo.",
      email: validateEmail(form.email, { required: true }),
      password:
        form.password.length >= 6 ? "" : "La contraseña debe tener al menos 6 caracteres.",
      confirmPassword:
        form.confirmPassword === form.password ? "" : "Las contraseñas no coinciden.",
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    const next = validate();
    setErrors(next);
    const firstInvalid = FIELD_ORDER.find((key) => next[key]);
    if (firstInvalid) return refs[firstInvalid].current?.focus();

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
    } catch (err) {
      setServerError(err.message);
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Crear cuenta" subtitle="Empieza con una gradilla vacía y registra a tus pacientes.">
      {serverError && (
        <div className="mb-5 rounded-lg bg-warn-wash px-4 py-3 text-sm font-medium text-warn-ink" role="alert">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <TextField
          id="name"
          ref={refs.name}
          label="Nombre completo"
          required
          autoComplete="name"
          value={form.name}
          onChange={update}
          placeholder="Dra. Laura Pérez"
          error={errors.name}
        />
        <TextField
          id="email"
          ref={refs.email}
          label="Correo electrónico"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={form.email}
          onChange={update}
          placeholder="nombre@centro.es"
          error={errors.email}
        />
        <PasswordField
          id="password"
          ref={refs.password}
          label="Contraseña"
          required
          autoComplete="new-password"
          value={form.password}
          onChange={update}
          hint="Mínimo 6 caracteres."
          error={errors.password}
        />
        <PasswordField
          id="confirmPassword"
          ref={refs.confirmPassword}
          label="Repite la contraseña"
          required
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={update}
          error={errors.confirmPassword}
        />
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? (
            <>
              <Spinner /> Creando cuenta…
            </>
          ) : (
            "Crear cuenta"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-2">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="font-semibold text-ink underline">
          Iniciar sesión
        </Link>
      </p>
    </AuthShell>
  );
}
