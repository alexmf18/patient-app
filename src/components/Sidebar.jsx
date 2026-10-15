import { NavLink } from "react-router-dom";
import { LayoutGrid, Users, UserPlus, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Gradilla", icon: LayoutGrid },
  { to: "/patients", label: "Pacientes", icon: Users, end: true },
  { to: "/patients/new", label: "Nuevo paciente", icon: UserPlus, shortcut: "N" },
];

/** Contenido de navegación compartido entre la barra fija y el cajón móvil. */
export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-5 pb-6">
        <Logo />
      </div>

      <nav className="flex-1 px-3" aria-label="Navegación principal">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end, shortcut }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group flex min-h-11 items-center gap-3 rounded-lg px-3 text-[0.9375rem] font-medium transition-colors duration-150 ${
                    isActive
                      ? "bg-label text-ink"
                      : "text-ink-2 hover:bg-label/60 hover:text-ink"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-violet-deep" : ""}`}
                      aria-hidden="true"
                    />
                    <span className="flex-1">{label}</span>
                    {shortcut && (
                      <kbd className="hidden rounded border border-rule-strong px-1.5 font-mono text-[0.7rem] text-ink-3 lg:inline">
                        {shortcut}
                      </kbd>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-rule p-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-sm font-semibold text-white"
            aria-hidden="true"
          >
            {user?.name?.replace(/^(Dr|Dra)\.?\s+/i, "").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
            <p className="truncate text-xs text-ink-3">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="mt-1 flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-ink-2 transition-colors duration-150 hover:bg-label/60 hover:text-ink"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
