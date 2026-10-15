export function formatDate(dateStr, month = "short") {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-ES", { day: "2-digit", month, year: "numeric" });
}

export function calculateAge(birthDate) {
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export const fullName = (p) => `${p.firstName} ${p.lastName}`;

// Valores que en la práctica clínica significan "sin alergias conocidas".
const NO_ALLERGY_RE = /^(-+|no|ninguna?s?( conocidas?)?|sin alergias( conocidas)?|nkda|nada|n\/a)\.?$/i;

export const hasAllergies = (p) => {
  const value = (p.allergies || "").trim();
  return Boolean(value) && !NO_ALLERGY_RE.test(value);
};

/** Código corto y estable para la etiqueta, derivado del id. */
export const shortCode = (id = "") => id.replace(/-/g, "").slice(0, 8).toUpperCase();

export function todayLabel() {
  return new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
