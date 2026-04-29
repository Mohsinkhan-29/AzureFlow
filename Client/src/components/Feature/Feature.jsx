import { useState, useRef, useEffect } from "react";

import Network from "../../assets/Services/azure-network-function-manager-functions.png"
import Infra from "../../assets/Services/bare-metal-infrastructure.png"
import Security from "../../assets/Services/network-security-hub.png"
import Cost from "../../assets/Services/cost-budgets.png"



// ─── Data ─────────────────────────────────────────────────────────────────────
const SLA_ROWS = [
  { label: "API Gateway", pct: 99.99, color: "#0078D4" },
  { label: "Database Cluster", pct: 100, color: "#0078D4" },
  { label: "CDN Network", pct: 99.98, color: "#38BDF8" },
  { label: "Kubernetes Nodes", pct: 99.97, color: "#38BDF8" },
];

const FEATURES = [
  {
    icon: <img src={Network} alt="network" style={{ width: 22, height: 22 }} />,
    iconBg: "rgba(0,120,212,0.14)",
    title: "99.99% Uptime SLA",
    desc: "Geo-redundant architecture with active-active failover across 3+ Azure regions.",
    tag: "HIGH AVAILABILITY",
    tagColor: "#0078D4",
    accent: "#0078D4",
    span: 2, // full width top row left
  },
  {
    icon: <img src={Infra} alt="infra" style={{ width: 22, height: 22 }} />,
    iconBg: "rgba(56,189,248,0.12)",
    title: "Auto-Scaling Infrastructure",
    desc: "Intelligent scaling that responds to traffic spikes in under 60 seconds.",
    tag: "ELASTICITY",
    tagColor: "#38BDF8",
    accent: "#38BDF8",
    span: 2,
  },
  {
    icon: <img src={Security} alt="Security" style={{ width: 22, height: 22 }} />,
    iconBg: "rgba(74,222,128,0.1)",
    title: "Zero-Trust Security",
    desc: "End-to-end encryption, identity-based access, and Azure Defender integration.",
    tag: "ENTERPRISE SECURITY",
    tagColor: "#4ADE80",
    accent: "#4ADE80",
    span: 1,
  },
  {
    icon: <img src={Cost} alt="Cost" style={{ width: 22, height: 22 }} />,
    iconBg: "rgba(251,191,36,0.1)",
    title: "FinOps Cost Control",
    desc: "Real-time budget alerts, tagging strategies, and automated right-sizing.",
    tag: "COST EFFICIENCY",
    tagColor: "#FBBF24",
    accent: "#FBBF24",
    span: 1,
  },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useInView(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function useCountUp(target, duration, triggered) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    let start = null;
    const raf = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(+(eased * target).toFixed(2));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [triggered, target, duration]);
  return val;
}

// ─── Animated SLA bar row ─────────────────────────────────────────────────────
function SlaRow({ row, triggered, delay }) {
  const [w, setW] = useState(0);
  const pct = useCountUp(row.pct, 2000, triggered);

  useEffect(() => {
    if (!triggered) return;
    const t = setTimeout(() => setW(row.pct), delay);
    return () => clearTimeout(t);
  }, [triggered, row.pct, delay]);

  return (
    <div className="flex items-center gap-3">
      <span
        className="flex-shrink-0 text-xs"
        style={{ color: "#8BA3C4", width: "130px", fontFamily: "DM Sans, sans-serif" }}
      >
        {row.label}
      </span>
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height: "3px", background: "rgba(255,255,255,0.07)" }}
      >
        <div
          style={{
            height: "100%",
            width: `${w}%`,
            background: `linear-gradient(90deg, ${row.color}, ${row.color}cc)`,
            borderRadius: "9999px",
            transition: "width 1s cubic-bezier(0.34,1,0.64,1)",
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
      <span
        className="flex-shrink-0 text-xs font-semibold"
        style={{
          color: "#4ADE80",
          fontFamily: "Syne, sans-serif",
          width: "44px",
          textAlign: "right",
        }}
      >
        {triggered ? pct.toFixed(2) : "0.00"}%
      </span>
    </div>
  );
}

// ─── SLA Widget ───────────────────────────────────────────────────────────────
function SlaWidget({ triggered }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "#0A1628", border: "1px solid rgba(0,120,212,0.18)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: "#8BA3C4", fontFamily: "Syne, sans-serif" }}
        >
          Live SLA Dashboard
        </span>
        <span className="flex items-center gap-1.5 text-xs text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {SLA_ROWS.map((row, i) => (
          <SlaRow key={i} row={row} triggered={triggered} delay={300 + i * 120} />
        ))}
      </div>
    </div>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({ feature, index, visible }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex gap-5 cursor-default"
      style={{
        padding: "26px 28px",
        background: hovered ? "#0D1F38" : "#0A1628",
        border: `1px solid ${hovered ? feature.accent + "44" : "rgba(0,120,212,0.16)"}`,
        borderRadius: "14px",
        transition: "all 0.35s cubic-bezier(0.34,1.1,0.64,1)",
        transform: visible
          ? hovered ? "translateY(-4px)" : "translateY(0)"
          : "translateY(24px)",
        opacity: visible ? 1 : 0,
        transitionDelay: visible ? `${index * 80}ms` : "0ms",
        boxShadow: hovered ? `0 14px 36px ${feature.accent}14` : "none",
        overflow: "hidden",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Corner glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "120px",
          height: "120px",
          background: `radial-gradient(ellipse at top left, ${feature.accent}12, transparent 70%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      />

      {/* Icon */}
      <div
        className="grid place-items-center text-lg flex-shrink-0"
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "9px",
          background: hovered
            ? feature.iconBg.replace("0.14", "0.24").replace("0.12", "0.22").replace("0.1", "0.2")
            : feature.iconBg,
          transition: "background 0.3s ease",
        }}
      >
        {feature.icon}
      </div>

      {/* Text */}
      <div>
        <h3
          className="font-bold mb-2"
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "15px",
            color: "#fff",
          }}
        >
          {feature.title}
        </h3>
        <p
          className="text-xs leading-relaxed mb-3"
          style={{ color: "#8BA3C4", lineHeight: "1.65" }}
        >
          {feature.desc}
        </p>
        {/* Tag */}
        <span
          className="inline-block text-xs px-2.5 py-0.5 rounded"
          style={{
            background: `${feature.tagColor}14`,
            border: `1px solid ${feature.tagColor}30`,
            color: feature.tagColor,
            fontFamily: "Syne, sans-serif",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          {feature.tag}
        </span>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg,transparent,${feature.accent},transparent)`,
          opacity: hovered ? 0.5 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function FeaturesSection() {
  const sectionRef = useRef(null);
  const visible = useInView(sectionRef, 0.1);

  return (
    <section
      id="features"
      ref={sectionRef}
      style={{
        background: "#060F1E",
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 6vw, 80px)",
        borderTop: "1px solid rgba(0,120,212,0.1)",
      }}
    >
      {/* ── Top row: heading + SLA widget ── */}
      <div
        className="grid gap-12 mb-12"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          alignItems: "start",
        }}
      >
        {/* Left: heading */}
        <div>
          <div
            className="flex items-center gap-2 mb-4"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(14px)",
              transition: "all 0.6s ease",
            }}
          >
            <div className="h-px w-5" style={{ background: "#38BDF8" }} />
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "#38BDF8", fontFamily: "Syne, sans-serif" }}
            >
              Why AzureFlow
            </span>
          </div>

          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(28px,5vw,52px)", // 👈 slightly safer scaling
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              marginBottom: "16px",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(18px)",
              transition: "all 0.65s ease 0.08s",
            }}
          >
            <span className="text-white">Built for </span>
            <span
              style={{
                background: "linear-gradient(135deg,#fff 0%,#38BDF8 60%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Enterprise
            </span>
            <br />
            <span className="text-white">Scale & Speed</span>
          </h2>

          <p
            className="text-base font-light leading-relaxed"
            style={{
              color: "#8BA3C4",
              maxWidth: "420px",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "all 0.65s ease 0.15s",
            }}
          >
            Every feature engineered for mission-critical workloads that demand reliability above all else.
          </p>
        </div>

        {/* Right: SLA widget */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 1.5s ease 0.5s",
          }}
        >
          <SlaWidget triggered={visible} />
        </div>
      </div>

      {/* ── Feature cards grid ── */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
        style={{
          gap: "14px",
        }}
      >
        {FEATURES.map((f, i) => (
          <FeatureCard key={i} feature={f} index={i} visible={visible} />
        ))}
      </div>

    </section>
  );

}