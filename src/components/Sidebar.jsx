import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  LogOut,
  Menu,
  X,
  Heart,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Panel Principal", icon: LayoutDashboard },
  { to: "/patients", label: "Mis Pacientes", icon: Users },
  { to: "/patients/new", label: "Nuevo Paciente", icon: UserPlus },
];

export default function Sidebar({ isOpen, onToggle }) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-72 flex-col bg-gradient-to-b from-primary-800 to-primary-900 text-white shadow-xl transition-transform duration-300 lg:relative lg:z-auto lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="navigation"
        aria-label="Navegación principal"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-primary-700/50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500 shadow-md">
              <Heart className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">PatientApp</h1>
              <p className="text-xs text-primary-300">Gestión Clínica</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="rounded-lg p-1.5 hover:bg-primary-700 lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User info */}
        <div className="border-b border-primary-700/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500/20 text-sm font-semibold text-accent-300">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs text-primary-300">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Menú principal">
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => window.innerWidth < 1024 && onToggle()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-white/15 text-white shadow-sm"
                        : "text-primary-200 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-primary-700/50 p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-primary-200 transition-all hover:bg-red-500/20 hover:text-red-300"
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile hamburger button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-30 rounded-lg bg-primary-700 p-2 text-white shadow-lg lg:hidden"
        aria-label="Abrir menú"
        aria-expanded={isOpen}
      >
        <Menu className="h-5 w-5" />
      </button>
    </>
  );
}
