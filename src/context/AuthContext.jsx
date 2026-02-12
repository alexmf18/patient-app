import { createContext, useContext, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { STORAGE_KEYS, getFromStorage, saveToStorage, removeFromStorage } from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getFromStorage(STORAGE_KEYS.CURRENT_USER));

  const register = useCallback((name, email, password) => {
    const users = getFromStorage(STORAGE_KEYS.USERS) || [];
    if (users.find((u) => u.email === email)) {
      return { success: false, error: "Este correo electrónico ya está registrado." };
    }
    const newUser = { id: uuidv4(), name, email, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    saveToStorage(STORAGE_KEYS.CURRENT_USER, safeUser);
    return { success: true };
  }, []);

  const login = useCallback((email, password) => {
    const users = getFromStorage(STORAGE_KEYS.USERS) || [];
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      return { success: false, error: "Correo o contraseña incorrectos." };
    }
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    saveToStorage(STORAGE_KEYS.CURRENT_USER, safeUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    removeFromStorage(STORAGE_KEYS.CURRENT_USER);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
