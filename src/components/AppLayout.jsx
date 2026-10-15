import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Menu, Search, UserPlus, X } from "lucide-react";
import Sidebar from "./Sidebar";
import Logo from "./Logo";

const isTyping = (el) =>
  el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);

function GlobalSearch({ inputRef }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const onList = location.pathname === "/patients";
  const urlQuery = onList ? searchParams.get("q") || "" : "";
  const [value, setValue] = useState(urlQuery);

  // Mantiene el campo sincronizado con la URL (por ejemplo, al borrar la búsqueda desde la lista).
  useEffect(() => setValue(urlQuery), [urlQuery]);

  function go(query, replace) {
    const params = new URLSearchParams(onList ? searchParams : undefined);
    if (query) params.set("q", query);
    else params.delete("q");
    params.delete("pagina");
    const search = params.toString();
    navigate({ pathname: "/patients", search: search ? `?${search}` : "" }, { replace });
  }

  return (
    <form
      role="search"
      className="relative w-full max-w-xl"
      onSubmit={(e) => {
        e.preventDefault();
        go(value.trim(), onList);
      }}
    >
      <Search
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-3"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (onList) go(e.target.value, true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") e.currentTarget.blur();
        }}
        placeholder="Nombre, DNI o diagnóstico"
        aria-label="Buscar pacientes"
        className="field-input !bg-tray pr-10 pl-9 focus:!bg-label"
      />
      <kbd
        className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded border border-rule-strong px-1.5 font-mono text-[0.7rem] text-ink-3 sm:block"
        aria-hidden="true"
      >
        /
      </kbd>
    </form>
  );
}

function MobileDrawer({ open, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label="Menú"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="m-0 h-dvh max-h-none w-72 max-w-[85vw] bg-rail p-0 text-ink open:motion-safe:animate-[drawer-in_220ms_var(--ease-out-expo)]"
    >
      <button
        type="button"
        onClick={onClose}
        className="icon-btn absolute top-3 right-3"
        aria-label="Cerrar menú"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
      <Sidebar onNavigate={onClose} />
    </dialog>
  );
}

export default function AppLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef(null);

  // Atajos: "/" busca, "n" crea paciente.
  useEffect(() => {
    function onKey(e) {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(document.activeElement)) return;
      if (document.querySelector("dialog[open]")) return;
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        navigate("/patients/new");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  // Al cambiar de página, vuelve arriba.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="relative flex h-dvh overflow-hidden bg-tray">
      <a
        href="#contenido"
        className="sr-only z-50 rounded-md bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>

      <aside className="hidden w-64 shrink-0 border-r border-rule bg-rail lg:block">
        <Sidebar />
      </aside>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-rule bg-label px-4 pt-[env(safe-area-inset-top)] sm:px-6 lg:px-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3">
            <button
              type="button"
              className="icon-btn -ml-2 lg:hidden"
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={drawerOpen}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <Link to="/dashboard" className="lg:hidden" aria-label="PatientApp, ir a la gradilla">
              <Logo />
            </Link>
            <Link
              to="/patients/new"
              className="icon-btn ml-auto text-violet-deep sm:hidden"
              aria-label="Nuevo paciente"
            >
              <UserPlus className="h-5 w-5" aria-hidden="true" />
            </Link>
            <div className="order-last w-full sm:order-none sm:w-auto sm:flex-1">
              <GlobalSearch inputRef={searchRef} />
            </div>
          </div>
        </header>

        <main
          id="contenido"
          ref={mainRef}
          tabIndex={-1}
          className="relative flex-1 overflow-y-auto px-4 py-6 pb-[max(2rem,env(safe-area-inset-bottom))] outline-none sm:px-6 lg:px-10 lg:py-8"
        >
          <div className="mx-auto max-w-6xl">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
