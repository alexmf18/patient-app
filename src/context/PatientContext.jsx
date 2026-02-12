import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { STORAGE_KEYS, getFromStorage, saveToStorage } from "../utils/storage";
import { getSeedPatients } from "../utils/seedData";
import { useAuth } from "./AuthContext";

const PatientContext = createContext(null);

export function PatientProvider({ children }) {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user) {
      setPatients([]);
      return;
    }
    const allPatients = getFromStorage(STORAGE_KEYS.PATIENTS) || {};
    if (!allPatients[user.id]) {
      allPatients[user.id] = getSeedPatients(user.id);
      saveToStorage(STORAGE_KEYS.PATIENTS, allPatients);
    }
    setPatients(allPatients[user.id]);
  }, [user]);

  const persistPatients = useCallback(
    (updated) => {
      if (!user) return;
      const allPatients = getFromStorage(STORAGE_KEYS.PATIENTS) || {};
      allPatients[user.id] = updated;
      saveToStorage(STORAGE_KEYS.PATIENTS, allPatients);
      setPatients(updated);
    },
    [user]
  );

  const addPatient = useCallback(
    (patientData) => {
      const newPatient = {
        ...patientData,
        id: uuidv4(),
        userId: user.id,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      persistPatients([...patients, newPatient]);
      return newPatient;
    },
    [user, patients, persistPatients]
  );

  const updatePatient = useCallback(
    (id, updates) => {
      const updated = patients.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      );
      persistPatients(updated);
    },
    [patients, persistPatients]
  );

  const deletePatient = useCallback(
    (id) => {
      persistPatients(patients.filter((p) => p.id !== id));
    },
    [patients, persistPatients]
  );

  const getPatient = useCallback(
    (id) => patients.find((p) => p.id === id) || null,
    [patients]
  );

  const filteredPatients = patients.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.firstName.toLowerCase().includes(term) ||
      p.lastName.toLowerCase().includes(term) ||
      p.dni.toLowerCase().includes(term) ||
      (p.diagnosis && p.diagnosis.toLowerCase().includes(term))
    );
  });

  const stats = {
    total: patients.length,
    active: patients.filter((p) => p.status === "active").length,
    inactive: patients.filter((p) => p.status === "inactive").length,
  };

  return (
    <PatientContext.Provider
      value={{
        patients: filteredPatients,
        allPatients: patients,
        stats,
        searchTerm,
        setSearchTerm,
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
