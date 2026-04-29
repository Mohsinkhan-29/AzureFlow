import validator from "validator";
import xss from "xss";

/**
 * Sanitize + normalize input
 */
export function sanitize(input = "") {
  if (typeof input !== "string") return "";
  return xss(input.trim());
}

/**
 * Detect obvious SQL injection patterns (defense-in-depth only)
 */
function containsSQLInjection(str = "") {
  const patterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC)\b)/gi,
    /(--|\|\||;|\/\*|\*\/)/g,
    /(\bOR\b|\bAND\b).*(=|LIKE)/gi,
  ];

  return patterns.some((pattern) => pattern.test(str));
}

/**
 * Strict type validation
 */
function isString(value) {
  return typeof value === "string";
}

export function validateConsultation(data) {
  const errors = {};

  // 🧠 Ensure object
  if (!data || typeof data !== "object") {
    return { general: "Invalid payload" };
  }

  // 🔤 Name
  if (!isString(data.name) || validator.isEmpty(data.name || "")) {
    errors.name = "Name required";
  } else if (!validator.isLength(data.name, { min: 2, max: 50 })) {
    errors.name = "Name must be 2–50 characters";
  } else if (containsSQLInjection(data.name)) {
    errors.name = "Invalid characters in name";
  }

  // 📧 Email
  if (!isString(data.email) || !validator.isEmail(data.email || "")) {
    errors.email = "Invalid email";
  } else if (containsSQLInjection(data.email)) {
    errors.email = "Invalid email input";
  }

  // 🧩 Service (whitelist recommended)
  const allowedServices = [
    "Cloud Migration",
    "Azure Infrastructure",
    "DevOps & CI/CD",
    "Data & Analytics",
    "Security & Compliance",
    "Cost Optimization",
    "Azure Networking",
    "AI & Copilot Services",
    "other",
  ];

  if (!isString(data.service) || validator.isEmpty(data.service || "")) {
    errors.service = "Service required";
  } else if (!allowedServices.includes(data.service)) {
    errors.service = "Invalid service selected";
  }

  // 💬 Message
  if (!isString(data.message) || validator.isEmpty(data.message || "")) {
    errors.message = "Message required";
  } else if (!validator.isLength(data.message, { min: 10, max: 1000 })) {
    errors.message = "Message must be 10–1000 characters";
  } else if (containsSQLInjection(data.message)) {
    errors.message = "Message contains unsafe content";
  }

  return errors;
}
