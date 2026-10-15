import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { api } from "../lib/api";
import { useAuth } from "./AuthContext";
import { hasAllergies } from "../utils/format";

const PatientContext = createContext(null);

const UNDO_WINDOW_MS = 6000;

// Campos editables que se envían a la API.
const PATIENT_FIELDS = [
  "firstName", "lastName", "dni", "birthDate", "gender", "phone", "email", "address",
  "insuranceNumber", "bloodType", "allergies", "diagnosis", "treatment", "notes", "status",
];

const pickFields = (data) =>
  Object.fromEntries(PATIENT_FIELDS.map((key) => [key, data[key] ?? ""]));

const byUpdatedDesc = (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt);

export function PatientProvider({ children }) {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [loadError, setLoadError] = useState("");
  const pendingDeletes = useRef(new Map());

  const load = useCallback(async () => {
    setStatus("loading");
    setLoadError("");
    try {
      const { patients } = await api.listPatients();
      setPatients(patients);
      setStatus("ready");
    } catch (err) {
      setLoadError(err.message);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (user) {
      load();
    } else {
      setPatients([]);
      setStatus("idle");
    }
  }, [user, load]);

  // Si el proveedor se desmonta, ejecuta los borrados que siguen pendientes.
  useEffect(() => {
    const pending = pendingDeletes.current;
    return () => {
      for (const { timer, commit } of pending.values()) {
        clearTimeout(timer);
        commit();
      }
      pending.clear();
    };
  }, []);

  const addPatient = useCallback(async (data) => {
    const { patient } = await api.createPatient(pickFields(data));
    setPatients((prev) => [patient, ...prev]);
    return patient;
  }, []);

  const updatePatient = useCallback(async (id, data) => {
    const { patient } = await api.updatePatient(id, pickFields(data));
    setPatients((prev) => [patient, ...prev.filter((p) => p.id !== id)]);
    return patient;
  }, []);

  /**
   * Retira al paciente de la vista al instante y confirma el borrado en el
   * servidor tras la ventana de deshacer. Devuelve la función para deshacer.
   */
  const deletePatient = useCallback(
    (id, { onError } = {}) => {
      const removed = patients.find((p) => p.id === id) || null;
      setPatients((prev) => prev.filter((p) => p.id !== id));

      const restore = () => {
        if (removed) {
          setPatients((prev) =>
            prev.some((p) => p.id === id) ? prev : [...prev, removed].sort(byUpdatedDesc)
          );
        }
      };

      const commit = () => {
        pendingDeletes.current.delete(id);
        api.deletePatient(id).catch((err) => {
          restore();
          onError?.(err);
        });
      };

      const timer = setTimeout(commit, UNDO_WINDOW_MS);
      pendingDeletes.current.set(id, { timer, commit });

      return () => {
        clearTimeout(timer);
        pendingDeletes.current.delete(id);
        restore();
      };
    },
    [patients]
  );

  const getPatient = useCallback((id) => patients.find((p) => p.id === id) || null, [patients]);

  const stats = {
    total: patients.length,
    active: patients.filter((p) => p.status === "active").length,
    inactive: patients.filter((p) => p.status === "inactive").length,
    allergic: patients.filter(hasAllergies).length,
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        status,
        loadError,
        reload: load,
        stats,
        addPatient,
        updatePatient,
        deletePatient,
        getPatient,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientContext);
  if (!context) throw new Error("usePatients must be used within PatientProvider");
  return context;
}
