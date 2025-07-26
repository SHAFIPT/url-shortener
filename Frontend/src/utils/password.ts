export const validatePassword = (pwd: string) => {
  const rules = {
    min: pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    lowercase: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    special: /[^A-Za-z0-9]/.test(pwd),
  };
  const isValid = Object.values(rules).every(Boolean);
  return { isValid, rules };
};