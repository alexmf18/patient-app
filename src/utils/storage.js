const TOKEN_KEY = "patientapp_token";
const DRAFT_PREFIX = "patientapp_draft_";

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Almacenamiento no disponible (modo privado): la app sigue funcionando sin persistencia.
  }
}

export const getToken = () => safeGet(TOKEN_KEY);
export const setToken = (token) => safeSet(TOKEN_KEY, token);

// Borrador de alta: contiene datos clínicos, así que vive solo en esta pestaña
// (sessionStorage), ligado al usuario, y se borra al cerrar sesión.
export function getDraft(userId) {
  try {
    return JSON.parse(sessionStorage.getItem(DRAFT_PREFIX + userId)) || null;
  } catch {
    return null;
  }
}

export function saveDraft(userId, draft) {
  try {
    if (draft) sessionStorage.setItem(DRAFT_PREFIX + userId, JSON.stringify(draft));
    else sessionStorage.removeItem(DRAFT_PREFIX + userId);
  } catch {
    // Sin almacenamiento disponible: simplemente no hay borrador.
  }
}

export function clearDrafts() {
  try {
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith(DRAFT_PREFIX))
      .forEach((key) => sessionStorage.removeItem(key));
  } catch {
    // Nada que limpiar.
  }
}
