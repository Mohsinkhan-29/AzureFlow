import { useState } from "react";
import api from "../../api";
import Azure from "../../assets/Azure-A.png"

// ─── Data ─────────────────────────────────────────────────────────────────────
const FOOTER_LINKS = {
  Services: [
    "Cloud Migration",
    "Azure Infrastructure",
    "DevOps & CI/CD",
    "Data & Analytics",
    "Security",
    "Cost Optimization",
    "Azure Networking",
    "AI & Copilot",
  ],
  Company: ["About Us", "Case Studies", "Blog", "Careers", "Partners", "Contact"],
  Resources: [
    "Documentation",
    "Azure Calculator",
    "Migration Guide",
    "Status Page",
    "SLA Policy",
    "Security Whitepaper",
  ],
};

const SOCIALS = [
  { label: "in", href: "#" },
  { label: "tw", href: "#" },
  { label: "gh", href: "#" },
  { label: "yt", href: "#" },
];

const scrollToSection = (index) => {
  const el = document.getElementById(`cap-${index}`);
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
};


// ─── Sub-components ───────────────────────────────────────────────────────────
function FooterLinkCol({ heading, links, onServiceClick }) {
  return (
    <div>
      <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
        {heading}
      </h4>

      <ul className="flex flex-col gap-2.5">
        {links.map((link, i) => (
          <li key={link}>
            <a
              href="#"
              onClick={(e) => {
                if (onServiceClick) {
                  e.preventDefault();
                  onServiceClick(i); // 👈 now matches id="0", "1", etc.
                }
              }}
              className="text-sm transition-colors duration-200"
              style={{ color: "#8BA3C4" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "#8BA3C4")
              }
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialBtn({ label }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="#"
      className="grid place-items-center text-xs font-semibold transition-all duration-200"
      style={{
        width: "30px",
        height: "30px",
        borderRadius: "6px",
        border: `1px solid ${hovered ? "#0078D4" : "rgba(0,120,212,0.18)"}`,
        color: hovered ? "#0078D4" : "#8BA3C4",
        fontFamily: "Syne, sans-serif",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </a>
  );
}

// ─── Main Footer ──────────────────────────────────────────────────────────────
export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);



  const handleSubscribe = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    try {
      const res = await api.post("/subscribe", {
        email: trimmedEmail,
      });

      if (res.data?.success) {
        setSubscribed(true);
        setEmail("");

        setTimeout(() => setSubscribed(false), 3000);
      }

    } catch (err) {
      console.error("Subscribe error:", err.response?.data || err.message);
    }
  };


  return (
    <footer
      className="bg-[#020B18] px-6 sm:px-10 lg:px-[80px] py-12 sm:py-14 lg:py-[60px]"
    >
      {/* ── Top Grid ── */}
      <div
        className="
          grid gap-10 lg:gap-11 mb-10 lg:mb-11
          grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
        "
      >
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="grid place-items-center flex-shrink-0"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "7px",
                background: "#0078D4",
              }}
            >
              <div>
              <img src={Azure} alt="Azure" className="w-[26px] h-[26px] " />
            </div>
            </div>

            <span
              className="text-lg font-black text-white"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              AzureFlow
            </span>
          </div>

          <p
            className="text-sm leading-relaxed mb-5"
            style={{ color: "#8BA3C4", maxWidth: "270px" }}
          >
            Enterprise Azure cloud solutions — migration, DevOps, security, and cost
            optimization for companies that can't afford to be slow.
          </p>

          {/* Newsletter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              className="flex-1 text-xs outline-none"
              style={{
                background: "#0A1628",
                border: "1px solid rgba(0,120,212,0.18)",
                borderRadius: "7px",
                padding: "9px 12px",
                color: "#fff",
                fontFamily: "DM Sans, sans-serif",
              }}
            />

            <button
              onClick={handleSubscribe}
              className="text-xs font-semibold text-white flex-shrink-0"
              style={{
                background: subscribed ? "#4ADE80" : "#0078D4",
                borderRadius: "7px",
                padding: "9px 14px",
                fontFamily: "Syne, sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              {subscribed ? "✓ Subscribed!" : "Subscribe"}
            </button>
          </div>
        </div>

        {/* Link Columns */}
        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <FooterLinkCol
            key={heading}
            heading={heading}
            links={links}
            onServiceClick={heading === "Services" ? scrollToSection : null}
          />
        ))}


      </div>

      {/* Divider */}
      <div
        className="mb-6 lg:mb-[22px]"
        style={{ height: "1px", background: "rgba(0,120,212,0.14)" }}
      />

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-start md:items-center justify-between">
        <span className="text-xs" style={{ color: "#8BA3C4" }}>
          © 2026 AzureFlow Technologies. All rights reserved.
        </span>

        <div className="flex items-center gap-4">
          {["Privacy", "Terms", "Cookies"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-xs"
              style={{ color: "#8BA3C4" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8BA3C4")}
            >
              {l}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {SOCIALS.map((s) => (
            <SocialBtn key={s.label} label={s.label} />
          ))}
        </div>
      </div>
    </footer>
  );
}
