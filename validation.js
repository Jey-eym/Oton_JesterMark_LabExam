
const Validators = (() => {
  "use strict";

  const LIMITS = { name: 50, email: 254, username: 20, passwordMin: 8, passwordMax: 64 };

  const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;
  const USERNAME_RE = /^[A-Za-z0-9._-]+$/;
  const NAME_RE = /^[A-Za-z\u00C0-\u024F]+(?:[ '.-][A-Za-z\u00C0-\u024F]+)*\.?$/;
  const COMMON_PASSWORDS = [
    "password", "password1", "password123", "12345678", "123456789", "qwerty123",
    "qwertyuiop", "iloveyou", "admin123", "welcome1", "letmein123", "abc12345", "p@ssw0rd",
  ];

  /* Remove control characters and invisible junk; collapse nothing else. */
  const clean = (v) => String(v ?? "").replace(/[\u0000-\u001F\u007F\u200B-\u200D\uFEFF]/g, "");

  const fullName = (raw) => {
    const v = clean(raw).trim().replace(/\s+/g, " ");
    if (!v) return "Full name is required.";
    if (v.length < 2) return "Full name must be at least 2 characters.";
    if (v.length > LIMITS.name) return `Full name must be ${LIMITS.name} characters or fewer.`;
    if (/\d/.test(v)) return "Full name cannot contain numbers.";
    if (!NAME_RE.test(v)) return "Use letters only (spaces, apostrophes, periods and hyphens are allowed).";
    return "";
  };

  const email = (raw) => {
    const v = clean(raw).trim();
    if (!v) return "Email is required.";
    if (/\s/.test(v)) return "Email cannot contain spaces.";
    if (!v.includes("@")) return "Email must contain an @ symbol.";
    if (v.length > LIMITS.email) return "Email is too long.";
    const [local = ""] = v.split("@");
    if (local.length > 64) return "The part before @ is too long.";
    if (v.split("@").length !== 2 || !local) return "Enter the name before the @ symbol.";
    if (local.startsWith(".") || local.endsWith(".") || v.includes(".."))
      return "Email cannot start/end with a dot or contain consecutive dots.";
    if (!EMAIL_RE.test(v)) return "Please enter a valid email address (e.g. name@example.com).";
    return "";
  };

  const username = (raw) => {
    const v = clean(raw).trim();
    if (v.length < 3) return "Username must be at least 3 characters.";
    if (v.length > LIMITS.username) return `Username must be ${LIMITS.username} characters or fewer.`;
    if (!USERNAME_RE.test(v)) return "Username can only use letters, numbers, dot, underscore and hyphen.";
    return "";
  };

  /* Login field: accepts an email OR a username. */
  const identifier = (raw) => {
    const v = clean(raw).trim();
    if (!v) return "Email or username is required.";
    return v.includes("@") ? email(v) : username(v);
  };

  
  const password = (raw, ctx = {}) => {
    const v = String(raw ?? "");
    if (!v) return "Password is required.";
    if (/\s/.test(v)) return "Password cannot contain spaces.";
    if (v.length < LIMITS.passwordMin) return `Password must be at least ${LIMITS.passwordMin} characters.`;
    if (v.length > LIMITS.passwordMax) return `Password must be ${LIMITS.passwordMax} characters or fewer.`;
    if (!/[a-z]/.test(v)) return "Password needs at least one lowercase letter (a-z).";
    if (!/[A-Z]/.test(v)) return "Password needs at least one uppercase letter (A-Z).";
    if (!/\d/.test(v)) return "Password needs at least one number (0-9).";
    if (!/[^A-Za-z0-9]/.test(v)) return "Password needs at least one special character (e.g. ! @ # $).";
    if (/(.)\1{3,}/.test(v)) return "Password cannot repeat the same character 4+ times in a row.";
    if (COMMON_PASSWORDS.includes(v.toLowerCase())) return "That password is too common. Choose a stronger one.";
    const local = clean(ctx.email).split("@")[0].toLowerCase();
    if (local.length >= 3 && v.toLowerCase().includes(local)) return "Password cannot contain your email name.";
    const first = clean(ctx.name).trim().split(" ")[0].toLowerCase();
    if (first.length >= 3 && v.toLowerCase().includes(first)) return "Password cannot contain your name.";
    return "";
  };

  const loginPassword = (raw) => (String(raw ?? "") ? "" : "Password is required.");

  const confirmPassword = (raw, original) => {
    if (!raw) return "Please confirm your password.";
    if (raw !== original) return "Passwords do not match.";
    return "";
  };

  const terms = (checked) => (checked ? "" : "You must agree to the Terms & Conditions.");

  return { LIMITS, clean, fullName, email, username, identifier, password, loginPassword, confirmPassword, terms };
})();

if (typeof module !== "undefined") module.exports = Validators;