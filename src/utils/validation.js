const DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";
const DNI_RE = /^(\d{8})([A-Z])$/;
const NIE_RE = /^([XYZ])(\d{7})([A-Z])$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeDni = (value) => value.toUpperCase().replace(/[\s-]/g, "");

/** Devuelve un mensaje de error o "" si el DNI/NIE es válido. */
export function validateDni(raw, { checkLetter = true } = {}) {
  const value = normalizeDni(raw);
  if (!value) return "El DNI/NIE es obligatorio.";
  let number;
  let letter;
  const dni = value.match(DNI_RE);
  const nie = value.match(NIE_RE);
  if (dni) {
    [, number, letter] = dni;
  } else if (nie) {
    number = "XYZ".indexOf(nie[1]) + nie[2];
    letter = nie[3];
  } else {
    return "Formato no válido. Usa 8 números y una letra (12345678Z) o un NIE (X1234567L).";
  }
  if (checkLetter && DNI_LETTERS[Number(number) % 23] !== letter) {
    return `La letra no corresponde al número. Revisa el documento (debería ser ${DNI_LETTERS[Number(number) % 23]}).`;
  }
  return "";
}

export function validateEmail(value, { required = false } = {}) {
  if (!value.trim()) return required ? "El correo electrónico es obligatorio." : "";
  return EMAIL_RE.test(value.trim()) ? "" : "Introduce un correo válido, por ejemplo nombre@centro.es.";
}

export function validateBirthDate(value) {
  if (!value) return "La fecha de nacimiento es obligatoria.";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha no válida.";
  if (date > new Date()) return "La fecha de nacimiento no puede ser futura.";
  if (new Date().getFullYear() - date.getFullYear() > 130) return "Revisa el año: supera los 130 años.";
  return "";
}

export function validatePhone(value) {
  if (!value.trim()) return "";
  const digits = value.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15
    ? ""
    : "Introduce un teléfono válido (al menos 9 dígitos).";
}
