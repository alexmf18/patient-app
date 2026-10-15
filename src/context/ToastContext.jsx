import { createContext, useCallback, useContext, useRef, useState } from "react";
import { Check, X, AlertCircle } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message, { tone = "success", action, duration = 4500 } = {}) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev.slice(-2), { id, message, tone, action }]);
      setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[200] flex flex-col items-center gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-end sm:p-6"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg bg-ink py-2 pr-2 pl-4 text-sm text-white shadow-[var(--shadow-lift)] motion-safe:animate-[toast-in_220ms_var(--ease-out-expo)]"
          >
            {t.tone === "error" ? (
              <AlertCircle className="h-4 w-4 shrink-0 text-[#ffb27a]" aria-hidden="true" />
            ) : (
              <Check className="h-4 w-4 shrink-0 text-[#7fd6a3]" aria-hidden="true" />
            )}
            <p className="flex-1 py-1.5">{t.message}</p>
            {t.action && (
              <button
                type="button"
                onClick={() => {
                  t.action.onClick();
                  dismiss(t.id);
                }}
                className="min-h-9 rounded-md px-3 font-semibold text-[#c9b8ff] hover:bg-white/10"
              >
                {t.action.label}
              </button>
            )}
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Cerrar aviso"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
