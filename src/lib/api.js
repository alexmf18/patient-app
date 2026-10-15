import { getToken } from "../utils/storage";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

let onUnauthorized = () => {};
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

async function request(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.",
      0
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token) onUnauthorized();
    throw new ApiError(data.error || "Ha ocurrido un error inesperado. Inténtalo de nuevo.", res.status);
  }
  return data;
}

export const api = {
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password } }),
  register: (name, email, password) =>
    request("/auth/register", { method: "POST", body: { name, email, password } }),
  me: () => request("/auth/me"),
  listPatients: () => request("/patients"),
  createPatient: (data) => request("/patients", { method: "POST", body: data }),
  updatePatient: (id, data) => request(`/patients/${id}`, { method: "PUT", body: data }),
  deletePatient: (id) => request(`/patients/${id}`, { method: "DELETE" }),
};
