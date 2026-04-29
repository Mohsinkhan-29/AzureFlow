import validator from "validator";
import xss from "xss";

export function sanitize(input = "") {
  return xss(input.trim());
}

export function validateConsultation(data) {
  const errors = {};

  if (!data.name) errors.name = "Name required";

  if (!validator.isEmail(data.email || ""))
    errors.email = "Invalid email";

  if (!data.service)
    errors.service = "Service required";

  if (!data.message || data.message.length < 10)
    errors.message = "Message too short";

  return errors;
}
