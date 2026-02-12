const STORAGE_KEYS = {
  USERS: "patientapp_users",
  CURRENT_USER: "patientapp_current_user",
  PATIENTS: "patientapp_patients",
};

export function getFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function removeFromStorage(key) {
  localStorage.removeItem(key);
}

export { STORAGE_KEYS };
