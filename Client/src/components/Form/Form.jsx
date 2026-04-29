import { useState, useEffect, useCallback, useRef } from "react";
import api from "../../api";

// ─── Constants ────────────────────────────────────────────────────────────────

const SERVICES = [
  { value: "", label: "Select a service...", disabled: true },
  { value: "Cloud Migration", label: "Cloud Migration & Lift-Shift" },
  { value: "Azure Infrastructure", label: "Azure Infrastructure Setup" },
  { value: "DevOps & CI/CD", label: "DevOps & CI/CD Pipelines" },
  { value: "Data & Analytics", label: "Data & Analytics" },
  { value: "Security & Compliance", label: "Security & Compliance Audit" },
  { value: "Cost Optimization", label: "Cost Optimization & FinOps" },
  { value: "Azure Networking", label: "Azure Networking" },
  { value: "AI & Copilot Services", label: "AI / ML Workloads on Azure" },
  { value: "other", label: "Other / Not Sure Yet" },
];

const SIZES = [
  { value: "", label: "Select size...", disabled: true },
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-1000", label: "201–1,000 employees" },
  { value: "1000+", label: "1,000+ employees" },
];

const BUDGETS = [
  { value: "", label: "Select range...", disabled: true },
  { value: "<1k", label: "Under $1,000" },
  { value: "1k-5k", label: "$1,000 – $5,000" },
  { value: "5k-20k", label: "$5,000 – $20,000" },
  { value: "20k-100k", label: "$20,000 – $100,000" },
  { value: "100k+", label: "$100,000+" },
];

const PRIORITIES = [
  { value: "low", label: "🟢 Low" },
  { value: "medium", label: "🟡 Medium" },
  { value: "high", label: "🔴 High" },
  { value: "critical", label: "⚡ Critical" },
];

const INITIAL_FORM = {
  name: "", email: "", company: "", phone: "",
  service: "", company_size: "", budget: "",
  priority: "medium", message: "",
};

const INITIAL_ERRORS = {
  name: "", email: "", company: "", phone: "",
  service: "", message: "",
};

const MESSAGE_MIN = 20;
const MESSAGE_MAX = 1000;

// ─── Common typo domains for email suggestion ─────────────────────────────────
const COMMON_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"];

function suggestEmailFix(email) {
  const parts = email.split("@");
  if (parts.length !== 2) return null;
  const domain = parts[1].toLowerCase();
  // Check for obviously misspelled common domains
  const typoMap = {
    "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gmail.co": "gmail.com",
    "gmil.com": "gmail.com", "gamil.com": "gmail.com",
    "yaho.com": "yahoo.com", "yahooo.com": "yahoo.com",
    "hotmial.com": "hotmail.com", "hotmal.com": "hotmail.com",
    "outlok.com": "outlook.com", "outllok.com": "outlook.com",
  };
  if (typoMap[domain]) return `${parts[0]}@${typoMap[domain]}`;
  return null;
}

// ─── Validation rules ─────────────────────────────────────────────────────────

function validateField(name, value, allValues) {
  switch (name) {
    case "name": {
      const trimmed = value.trim();
      if (!trimmed) return "Full name is required.";
      if (trimmed.length < 2) return "Name must be at least 2 characters.";
      if (trimmed.length > 80) return "Name must be 80 characters or fewer.";
      if (/\d/.test(trimmed)) return "Name should not contain numbers.";
      if (!/^[a-zA-Z\s'\-\.]+$/.test(trimmed))
        return "Name can only contain letters, spaces, hyphens, and apostrophes.";
      if (trimmed.split(/\s+/).length < 2)
        return "Please enter your full name (first and last).";
      return "";
    }

    case "email": {
      const trimmed = value.trim();
      if (!trimmed) return "Work email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed))
        return "Please enter a valid email address.";
      if (trimmed.length > 254) return "Email address is too long.";
      // Warn about suspicious patterns
      const localPart = trimmed.split("@")[0];
      if (localPart.length < 2) return "Email address appears invalid.";
      return "";
    }

    case "company": {
      const trimmed = value.trim();
      if (trimmed.length > 100) return "Company name must be 100 characters or fewer.";
      return "";
    }

    case "phone": {
      const trimmed = value.trim();
      if (!trimmed) return ""; // optional field
      // Strip formatting chars and check digit count
      const digits = trimmed.replace(/[\s\-\(\)\+\.]/g, "");
      if (!/^\d+$/.test(digits)) return "Phone number can only contain digits, spaces, +, -, and parentheses.";
      if (digits.length < 7) return "Phone number is too short (minimum 7 digits).";
      if (digits.length > 15) return "Phone number is too long (maximum 15 digits).";
      return "";
    }

    case "service": {
      if (!value) return "Please select the service you need.";
      return "";
    }

    case "message": {
      const trimmed = value.trim();
      if (!trimmed) return "Please describe your project or requirements.";
      if (trimmed.length < MESSAGE_MIN)
        return `Please add a bit more detail (${MESSAGE_MIN - trimmed.length} more character${MESSAGE_MIN - trimmed.length === 1 ? "" : "s"} needed).`;
      if (trimmed.length > MESSAGE_MAX)
        return `Message is too long — please keep it under ${MESSAGE_MAX} characters.`;
      return "";
    }

    default:
      return "";
  }
}

function validateAll(form) {
  const fields = ["name", "email", "company", "phone", "service", "message"];
  const newErrors = { ...INITIAL_ERRORS };
  let valid = true;
  for (const field of fields) {
    const err = validateField(field, form[field], form);
    newErrors[field] = err;
    if (err) valid = false;
  }
  return { newErrors, valid };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldLabel({ children, required }) {
  return (
    <label className="block text-[11px] font-bold tracking-[0.07em] uppercase text-[#94b8d8] mb-1.5">
      {children}
      {required && <span className="text-[#00d4ff] ml-0.5">*</span>}
    </label>
  );
}

function inputCls(hasError, isTouched) {
  return [
    "w-full bg-[#0a1525] text-[#e8f0fe] text-sm rounded-lg px-3.5 py-2.5",
    "border outline-none transition-all duration-200 font-barlow",
    "placeholder:text-[rgba(122,156,192,0.4)]",
    hasError && isTouched
      ? "border-[rgba(248,113,113,0.5)] shadow-[0_0_0_3px_rgba(248,113,113,0.07)]"
      : !hasError && isTouched
      ? "border-[rgba(34,197,94,0.45)] shadow-[0_0_0_3px_rgba(34,197,94,0.06)]"
      : "border-[rgba(30,100,200,0.25)] focus:border-[rgba(0,160,255,0.6)] focus:bg-[#0f1e35] focus:shadow-[0_0_0_3px_rgba(0,160,255,0.08)]",
  ].join(" ");
}

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="mt-1 text-[11px] text-[#f87171] flex items-center gap-1" style={{ animation: "azShakeIn 0.25s ease" }}>
      <span>⚠</span> {msg}
    </p>
  );
}

function FieldSuccess({ show, msg = "Looks good!" }) {
  if (!show) return null;
  return (
    <p className="mt-1 text-[11px] text-[#4ade80] flex items-center gap-1">
      <span>✓</span> {msg}
    </p>
  );
}

function EmailSuggestion({ suggestion, onAccept }) {
  if (!suggestion) return null;
  return (
    <p className="mt-1 text-[11px] text-[#fbbf24]">
      Did you mean{" "}
      <button
        type="button"
        onClick={onAccept}
        className="underline font-bold hover:text-[#fcd34d] transition-colors"
      >
        {suggestion}
      </button>
      ?
    </p>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function ConsultationModal({ isOpen, onClose }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  // Track which fields the user has interacted with (for green ✓ / red ✗)
  const [touched, setTouched] = useState({});
  const [emailSuggestion, setEmailSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitShake, setSubmitShake] = useState(false);
  const formRef = useRef(null);

  // ── Escape key + body scroll lock ─────────────────────────────────────────
  const handleKey = useCallback((e) => { if (e.key === "Escape") onClose(); }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKey]);

  // ── Reset on open ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setForm(INITIAL_FORM);
      setErrors(INITIAL_ERRORS);
      setTouched({});
      setEmailSuggestion(null);
      setSuccess(false);
      setLoading(false);
      setSubmitShake(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ── Derived: how many required fields are complete ─────────────────────────
  const requiredFields = ["name", "email", "service", "message"];
  const completedCount = requiredFields.filter(
    (f) => form[f] && !errors[f]
  ).length;
  const progressPct = Math.round((completedCount / requiredFields.length) * 100);

  // ── Change handler (validate on-the-fly for touched fields) ───────────────
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Real-time validation only after field has been touched
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value, { ...form, [name]: value }) }));
    }

    // Email suggestion
    if (name === "email") {
      const suggestion = suggestEmailFix(value);
      setEmailSuggestion(suggestion);
    }
  }

  // ── Blur handler (mark field as touched, run validation) ──────────────────
  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value, form) }));

    if (name === "email") {
      const suggestion = suggestEmailFix(value);
      setEmailSuggestion(suggestion);
    }
  }

  // ── Accept email suggestion ────────────────────────────────────────────────
  function acceptEmailSuggestion() {
    setForm((prev) => ({ ...prev, email: emailSuggestion }));
    setEmailSuggestion(null);
    setTouched((prev) => ({ ...prev, email: true }));
    setErrors((prev) => ({ ...prev, email: "" }));
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();

    // Mark all validatable fields as touched
    const allTouched = { name: true, email: true, company: true, phone: true, service: true, message: true };
    setTouched(allTouched);

    const { newErrors, valid } = validateAll(form);
    setErrors(newErrors);

    if (!valid) {
      // Shake the submit button and scroll to first error
      setSubmitShake(true);
      setTimeout(() => setSubmitShake(false), 600);

      const firstErrorField = ["name", "email", "service", "message", "phone", "company"].find(
        (f) => newErrors[f]
      );
      if (firstErrorField && formRef.current) {
        const el = formRef.current.querySelector(`[name="${firstErrorField}"]`);
        if (el) el.focus();
      }
      return;
    }

    setLoading(true);

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim(),
      phone: form.phone.trim(),
      service: form.service,
      company_size: form.company_size,
      budget: form.budget,
      priority: form.priority,
      message: form.message.trim(),
      submitted_at: new Date().toISOString(),
    };

    try {
      const res = await api.post("/consultation", payload);
      if (res.data?.success) {
        setSuccess(true);
      }
    } catch (err) {
      console.error("Submission failed:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleOverlay(e) {
    if (e.target === e.currentTarget) onClose();
  }

  const msgLen = form.message.trim().length;
  const msgColor =
    msgLen === 0 ? "#7a9cc0"
    : msgLen < MESSAGE_MIN ? "#f87171"
    : msgLen > MESSAGE_MAX * 0.9 ? "#fbbf24"
    : "#4ade80";

  return (
    <div
      className="fixed inset-0 z-[205] flex items-center justify-center bg-[rgba(4,10,22,0.82)] backdrop-blur-[10px]"
      style={{ animation: "azFadeIn 0.25s ease" }}
      onClick={handleOverlay}
    >
      <div
        className="relative bg-[#0d1b2e] rounded-2xl w-[580px] max-w-[95vw] max-h-[92vh] overflow-y-auto
                   border border-[rgba(0,140,255,0.2)]
                   shadow-[0_0_0_1px_rgba(0,100,255,0.07),0_32px_80px_rgba(0,0,0,0.7),0_0_60px_rgba(0,100,220,0.08)]"
        style={{ animation: "azSlideUp 0.3s cubic-bezier(0.22,1,0.36,1)" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-heading"
      >
        {/* Gradient top stripe */}
        <div className="h-[3px] rounded-t-2xl bg-gradient-to-r from-[#0078d4] via-[#00d4ff] to-[#7c3aed]" />

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-3 px-8 pt-7">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[rgba(0,168,255,0.08)] border border-[rgba(0,168,255,0.2)]
                            rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.08em] uppercase text-[#00a8ff] mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]" style={{ animation: "azPulse 1.8s infinite" }} />
              Free Consultation
            </div>
            <h2 id="modal-heading" className="font-barlow-condensed text-[28px] font-extrabold leading-tight text-[#e8f0fe]">
              Get Started with<br />
              <span className="text-[#00d4ff]">Azure Cloud</span>
            </h2>
            <p className="mt-1.5 text-[13.5px] text-[#7a9cc0] leading-relaxed">
              Tell us about your infrastructure needs — our engineers will reach&nbsp;out within 24&nbsp;hours.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg
                       bg-white/[0.04] border border-white/[0.08] text-[#7a9cc0] text-lg
                       transition-all duration-200 hover:bg-[rgba(248,113,113,0.1)] hover:border-[rgba(248,113,113,0.3)] hover:text-[#f87171]"
          >
            ✕
          </button>
        </div>

        {/* ── Body ──────────────────────────────────────────────────────── */}
        <div className="px-8 pb-8 pt-6">
          {success ? (
            <div className="flex flex-col items-center justify-center text-center gap-3 py-10"
              style={{ animation: "azSlideUp 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl
                              bg-[rgba(34,197,94,0.1)] border-2 border-[#22c55e]"
                style={{ animation: "azPopIn 0.4s cubic-bezier(0.22,1,0.36,1)" }}>
                ✓
              </div>
              <p className="font-barlow-condensed text-2xl font-extrabold text-[#e8f0fe]">You're All Set!</p>
              <p className="text-sm text-[#7a9cc0] leading-relaxed max-w-xs">
                Your consultation request has been submitted successfully.<br />
                A certified Azure engineer will contact you within{" "}
                <strong className="text-[#00d4ff]">24 hours</strong>.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-7 py-3 rounded-lg text-sm font-bold text-white
                           bg-gradient-to-r from-[#0078d4] to-[#00a8ff]
                           shadow-[0_0_24px_rgba(0,120,212,0.45)] hover:shadow-[0_0_36px_rgba(0,168,255,0.55)]
                           transition-all duration-200 hover:-translate-y-px"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* ── Progress bar ──────────────────────────────────────────── */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold tracking-[0.07em] uppercase text-[#94b8d8]">
                    Form Completion
                  </span>
                  <span className="text-[11px] font-bold text-[#00d4ff]">{progressPct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[rgba(0,140,255,0.1)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0078d4] to-[#00d4ff] transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* ── Form ─────────────────────────────────────────────────── */}
              <form onSubmit={handleSubmit} noValidate ref={formRef}>
                <div className="grid grid-cols-2 gap-4">

                  {/* Name */}
                  <div>
                    <FieldLabel required>Full Name</FieldLabel>
                    <input
                      type="text" name="name" value={form.name}
                      onChange={handleChange} onBlur={handleBlur}
                      autoComplete="name" placeholder="John Carter"
                      className={inputCls(!!errors.name, touched.name)}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "err-name" : undefined}
                      maxLength={80}
                    />
                    {touched.name && errors.name
                      ? <FieldError msg={errors.name} />
                      : <FieldSuccess show={touched.name && !errors.name && !!form.name.trim()} />
                    }
                  </div>

                  {/* Email */}
                  <div>
                    <FieldLabel required>Work Email</FieldLabel>
                    <input
                      type="email" name="email" value={form.email}
                      onChange={handleChange} onBlur={handleBlur}
                      autoComplete="email" placeholder="john@company.com"
                      className={inputCls(!!errors.email, touched.email)}
                      aria-invalid={!!errors.email}
                      maxLength={254}
                    />
                    {touched.email && errors.email
                      ? <FieldError msg={errors.email} />
                      : touched.email && !errors.email && form.email.trim()
                        ? <FieldSuccess show />
                        : null
                    }
                    <EmailSuggestion suggestion={emailSuggestion} onAccept={acceptEmailSuggestion} />
                  </div>

                  {/* Company */}
                  <div>
                    <FieldLabel>Company / Organization</FieldLabel>
                    <input
                      type="text" name="company" value={form.company}
                      onChange={handleChange} onBlur={handleBlur}
                      autoComplete="organization" placeholder="Acme Corp"
                      className={inputCls(!!errors.company, touched.company)}
                      maxLength={100}
                    />
                    {touched.company && errors.company && <FieldError msg={errors.company} />}
                  </div>

                  {/* Phone */}
                  <div>
                    <FieldLabel>Phone Number</FieldLabel>
                    <input
                      type="tel" name="phone" value={form.phone}
                      onChange={handleChange} onBlur={handleBlur}
                      autoComplete="tel" placeholder="+1 (555) 000-0000"
                      className={inputCls(!!errors.phone, touched.phone)}
                      maxLength={20}
                    />
                    {touched.phone && errors.phone
                      ? <FieldError msg={errors.phone} />
                      : <FieldSuccess show={touched.phone && !errors.phone && !!form.phone.trim()} />
                    }
                  </div>

                  {/* Service */}
                  <div className="col-span-2">
                    <FieldLabel required>Service Required</FieldLabel>
                    <select
                      name="service" value={form.service}
                      onChange={handleChange} onBlur={handleBlur}
                      className={inputCls(!!errors.service, touched.service) + " cursor-pointer"}
                      aria-invalid={!!errors.service}
                    >
                      {SERVICES.map((s) => (
                        <option key={s.value} value={s.value} disabled={s.disabled}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    {touched.service && errors.service
                      ? <FieldError msg={errors.service} />
                      : <FieldSuccess show={touched.service && !errors.service && !!form.service} />
                    }
                  </div>

                  {/* Company Size */}
                  <div>
                    <FieldLabel>Company Size</FieldLabel>
                    <select
                      name="company_size" value={form.company_size}
                      onChange={handleChange}
                      className={inputCls(false, false) + " cursor-pointer"}
                    >
                      {SIZES.map((s) => (
                        <option key={s.value} value={s.value} disabled={s.disabled}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Budget */}
                  <div>
                    <FieldLabel>Est. Monthly Budget</FieldLabel>
                    <select
                      name="budget" value={form.budget}
                      onChange={handleChange}
                      className={inputCls(false, false) + " cursor-pointer"}
                    >
                      {BUDGETS.map((b) => (
                        <option key={b.value} value={b.value} disabled={b.disabled}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div className="col-span-2">
                    <FieldLabel>Project Priority</FieldLabel>
                    <div className="flex gap-2">
                      {PRIORITIES.map((p) => (
                        <label
                          key={p.value}
                          className={[
                            "flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 cursor-pointer",
                            "text-[12px] font-bold tracking-[0.04em] uppercase border transition-all duration-200",
                            form.priority === p.value
                              ? "border-[#00a8ff] bg-[rgba(0,168,255,0.09)] text-[#00a8ff] shadow-[0_0_0_1px_rgba(0,168,255,0.15)]"
                              : "border-[rgba(30,100,200,0.25)] bg-[#0a1525] text-[#7a9cc0] hover:border-[rgba(0,168,255,0.35)] hover:text-[#e8f0fe]",
                          ].join(" ")}
                        >
                          <input
                            type="radio" name="priority" value={p.value}
                            checked={form.priority === p.value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          {p.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="col-span-2">
                    <FieldLabel required>Message / Project Details</FieldLabel>
                    <textarea
                      name="message" value={form.message}
                      onChange={handleChange} onBlur={handleBlur}
                      rows={4} maxLength={MESSAGE_MAX}
                      placeholder="Describe your current infrastructure, goals, pain points, or any specific requirements..."
                      className={inputCls(!!errors.message, touched.message) + " resize-y leading-relaxed"}
                      aria-invalid={!!errors.message}
                    />
                    {/* Counter + error row */}
                    <div className="flex items-start justify-between mt-1 gap-2">
                      <div>
                        {touched.message && errors.message
                          ? <FieldError msg={errors.message} />
                          : <FieldSuccess show={touched.message && !errors.message && msgLen >= MESSAGE_MIN} msg="Looking good!" />
                        }
                      </div>
                      <span
                        className="text-[11px] font-mono flex-shrink-0 transition-colors duration-200"
                        style={{ color: msgColor }}
                      >
                        {msgLen}/{MESSAGE_MAX}
                      </span>
                    </div>
                    {msgLen < MESSAGE_MIN && msgLen > 0 && !touched.message && (
                      <p className="mt-0.5 text-[11px] text-[#7a9cc0]">
                        The more detail you share, the better we can prepare for your consultation.
                      </p>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="my-5 h-px bg-gradient-to-r from-transparent via-[rgba(0,140,255,0.15)] to-transparent" />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{ animation: submitShake ? "azShake 0.5s ease" : undefined }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold text-[15px]
                             tracking-[0.05em] text-white border-none cursor-pointer
                             bg-gradient-to-r from-[#0078d4] via-[#0095e8] to-[#00a8ff]
                             shadow-[0_4px_24px_rgba(0,120,212,0.4)]
                             hover:shadow-[0_4px_36px_rgba(0,168,255,0.5)] hover:-translate-y-px
                             active:translate-y-0 transition-all duration-200
                             disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <>
                      <span>Request Free Consultation</span>
                      <span className="text-[18px]">→</span>
                    </>
                  )}
                </button>

                <p className="mt-3.5 text-center text-[12px] text-[#7a9cc0]">
                  By submitting, you agree to our{" "}
                  <a href="#" className="text-[#00a8ff] hover:underline">Privacy Policy</a> &amp;{" "}
                  <a href="#" className="text-[#00a8ff] hover:underline">Terms of Service</a>.{" "}
                  No spam. We'll reach out within <strong className="text-[#00a8ff]">24 hours</strong>.
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes azFadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes azSlideUp { from { opacity: 0; transform: translateY(28px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes azPulse   { 0%,100%{ opacity:1; } 50%{ opacity:0.3; } }
        @keyframes azPopIn   { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes azShakeIn { from { transform: translateX(-4px); opacity:0; } to { transform: translateX(0); opacity:1; } }
        @keyframes azShake {
          0%,100% { transform: translateX(0); }
          15%     { transform: translateX(-6px); }
          30%     { transform: translateX(6px); }
          45%     { transform: translateX(-5px); }
          60%     { transform: translateX(5px); }
          75%     { transform: translateX(-3px); }
          90%     { transform: translateX(3px); }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #0078d4; border-radius: 4px; }
        select option { background: #0d1b2e; color: #e8f0fe; }
      `}</style>
    </div>
  );
}