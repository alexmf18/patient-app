import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";
import { TextField } from "../components/FormFields";
import PasswordField from "../components/PasswordField";
import Spinner from "../components/Spinner";
import { validateEmail } from "../utils/validation";

const DEMO = { email: "demo@hospital.com", password: "password123" };

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  async function signIn(emailValue, passwordValue) {
    setServerError("");
    setLoading(true);
    try {
      await login(emailValue, passwordValue);
      // PublicRoute redirige al panel (o a la página de origen) al detectar la sesión.
    } catch (err) {
      setServerError(err.message);
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const next = {
      email: validateEmail(email, { required: true }),
      password: password ? "" : "Introduce tu contraseña.",
    };
    setErrors(next);
    if (next.email) return emailRef.current?.focus();
    if (next.password) return passwordRef.current?.focus();
    signIn(email, password);
  }

  return (
    <AuthShell title="Iniciar sesión" subtitle="Accede a la gradilla de tus pacientes.">
      {serverError && (
        <div className="mb-5 rounded-lg bg-warn-wash px-4 py-3 text-sm font-medium text-warn-ink" role="alert">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <TextField
          id="email"
          ref={emailRef}
          label="Correo electrónico"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((p) => ({ ...p, email: "" }));
          }}
          placeholder="nombre@centro.es"
          error={errors.email}
        />
        <PasswordField
          id="password"
          ref={passwordRef}
          label="Contraseña"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((p) => ({ ...p, password: "" }));
          }}
          error={errors.password}
        />
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? (
            <>
              <Spinner /> Entrando…
            </>
          ) : (
            "Entrar"
          )}
        </button>
      </form>

      <div className="mt-6 rounded-lg border border-dashed border-rule-strong p-4">
        <p className="text-sm font-semibold text-ink">¿Solo quieres probarla?</p>
        <p className="mt-0.5 font-mono text-xs text-ink-2">
          {DEMO.email} · {DEMO.password}
        </p>
        <button
          type="button"
          className="btn btn-secondary mt-3 w-full"
          disabled={loading}
          onClick={() => {
            setEmail(DEMO.email);
            setPassword(DEMO.password);
            setErrors({});
            signIn(DEMO.email, DEMO.password);
          }}
        >
          Entrar con la cuenta de demostración
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-ink-2">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="font-semibold text-ink underline">
          Crear una cuenta
        </Link>
      </p>
    </AuthShell>
  );
}
