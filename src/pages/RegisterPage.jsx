import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Heart, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const result = register(name, email, password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden flex-1 flex-col justify-between bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-500 shadow-lg">
            <Heart className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">PatientApp</span>
        </div>
        <div className="max-w-md">
          <h2 className="mb-4 text-4xl font-bold leading-tight">
            Únete a PatientApp
          </h2>
          <p className="text-lg text-primary-200">
            Crea tu cuenta y comienza a gestionar tus pacientes de forma
            eficiente, segura y organizada.
          </p>
        </div>
        <p className="text-sm text-primary-300">
          &copy; 2026 PatientApp. Todos los derechos reservados.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-700 shadow-lg">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-800">PatientApp</span>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900">Crear Cuenta</h1>
              <p className="mt-1 text-sm text-gray-500">
                Regístrate para acceder a la plataforma
              </p>
            </div>

            {error && (
              <div
                className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Nombre completo
                </label>
                <div className="relative">
                  <User
                    className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />
                  <input
                    id="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Juan Pérez"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />
                  <input
                    id="reg-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@hospital.com"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pr-10 pl-10 text-sm transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />
                  <input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la contraseña"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creando cuenta...
                  </>
                ) : (
                  "Crear Cuenta"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
