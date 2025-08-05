export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateTelefon = (telefon: string): boolean => {
  const re = /^\d{8}$/;
  return re.test(telefon);
};

export const validateMelding = (melding: string): boolean => {
  return melding.trim().length >= 10 && melding.length <= 256;
};
