import { useState, useRef, useEffect } from "react";
import Form from "../Form/Form";

import Cloud from "../../assets/Services/cloud-services-classic.png"
import Infra from "../../assets/Services/bare-metal-infrastructure.png"
import DevOps from "../../assets/Services/managed-devops-pools.png"
import Data from "../../assets/Services/change-analysis.png"
import Security from "../../assets/Services/network-security-hub.png"
import Cost from "../../assets/Services/cost-budgets.png"
import Network from "../../assets/Services/azure-network-function-manager-functions.png"
import Ai from "../../assets/Services/azure-openai.png"


const SERVICES = [
  {
    id: 0,
    icon: <img src={Cloud} alt="Cloud" style={{ width: 22, height: 22 }} />,
    title: "Cloud Migration",
    accent: "#0078D4",
    iconBg: "rgba(0,120,212,0.18)",
    iconBorder: "rgba(0,120,212,0.35)",
    tag: "Migration",
    desc: "Zero-downtime lift-and-shift or full re-architecture to Azure. We assess, plan, and execute migrations with minimal business disruption.",
    features: [
      "Application dependency mapping & readiness scoring",
      "Phased cutover with automated rollback triggers",
      "Post-migration cost and performance benchmarking",
      "Hybrid connectivity during transition via ExpressRoute",
    ],
    stats: [
      { v: "99.97%", l: "Uptime SLA" },
      { v: "<4h", l: "Avg downtime" },
      { v: "40%", l: "Cost reduction" },
      { v: "3x", l: "Faster delivery" },
    ],
  },
  {
    id: 1,
    icon: <img src={Infra} alt="Infra" style={{ width: 22, height: 22 }} /> ,
    title: "Azure Infrastructure",
    accent: "#38BDF8",
    iconBg: "rgba(56,189,248,0.15)",
    iconBorder: "rgba(56,189,248,0.35)",
    tag: "Infrastructure",
    desc: "Resilient, auto-scaling infrastructure using VMs, AKS, and fully managed Azure services — designed for enterprise workloads.",
    features: [
      "Multi-region active-active architecture",
      "AKS cluster management with Helm & GitOps",
      "Azure Front Door + WAF for global traffic routing",
      "Infrastructure as Code with Terraform & Bicep",
    ],
    stats: [
      { v: "99.99%", l: "Availability" },
      { v: "<30s", l: "Auto-scale" },
      { v: "250+", l: "Services used" },
      { v: "5x", l: "Resilience gain" },
    ],
  },
  {
    id: 2,
    icon: <img src={DevOps} alt="DevOps" style={{ width: 22, height: 22 }} />,
    title: "DevOps & CI/CD",
    accent: "#4ADE80",
    iconBg: "rgba(74,222,128,0.12)",
    iconBorder: "rgba(74,222,128,0.3)",
    tag: "DevOps",
    desc: "Faster, safer delivery pipelines with Azure DevOps and GitHub Actions. Ship multiple times per day with full audit trails.",
    features: [
      "End-to-end pipeline design with quality gates",
      "Automated security scanning (SAST/DAST/SCA)",
      "Blue-green & canary deployment strategies",
      "Rollback automation and release dashboards",
    ],
    stats: [
      { v: "12x", l: "Deploy freq." },
      { v: "85%", l: "Fewer incidents" },
      { v: "<15min", l: "Pipeline time" },
      { v: "100%", l: "Audit coverage" },
    ],
  },
  {
    id: 3,
    icon: <img src={Data} alt="Data" style={{ width: 22, height: 22 }} />,
    title: "Data & Analytics",
    accent: "#A78BFA",
    iconBg: "rgba(124,58,237,0.15)",
    iconBorder: "rgba(124,58,237,0.35)",
    tag: "Analytics",
    desc: "Real-time intelligence with Azure Synapse, Data Factory, and Power BI. Turn raw data into decision-ready insights at scale.",
    features: [
      "Unified analytics with Synapse & Delta Lake",
      "Real-time streaming via Event Hub & Stream Analytics",
      "Enterprise semantic layer with Power BI Premium",
      "Data governance with Microsoft Purview",
    ],
    stats: [
      { v: "<1s", l: "Query latency" },
      { v: "PB-scale", l: "Data volume" },
      { v: "360°", l: "Data view" },
      { v: "98%", l: "Pipeline uptime" },
    ],
  },
  {
    id: 4,
    icon: <img src={Security} alt="Security" style={{ width: 22, height: 22 }} />,
    title: "Security & Compliance",
    accent: "#F87171",
    iconBg: "rgba(239,68,68,0.12)",
    iconBorder: "rgba(239,68,68,0.3)",
    tag: "Security",
    desc: "Zero-Trust architecture, Microsoft Defender, and end-to-end compliance readiness for ISO 27001, SOC 2, and GDPR.",
    features: [
      "Conditional Access & Privileged Identity Management",
      "Microsoft Sentinel SIEM with custom detection rules",
      "DLP policies, encryption at rest & in transit",
      "Compliance automation with Purview & Compliance Manager",
    ],
    stats: [
      { v: "0", l: "Breaches (3yr)" },
      { v: "<5min", l: "Threat response" },
      { v: "ISO/SOC2", l: "Certified" },
      { v: "100%", l: "Data encrypted" },
    ],
  },
  {
    id: 5,
    icon: <img src={Cost} alt="Cost" style={{ width: 22, height: 22 }} />,
    title: "Cost Optimization",
    accent: "#FBBF24",
    iconBg: "rgba(251,191,36,0.12)",
    iconBorder: "rgba(251,191,36,0.3)",
    tag: "FinOps",
    desc: "Cut cloud spend by up to 40% with FinOps best practices — reserved instances, right-sizing, and continuous cost governance.",
    features: [
      "Azure Cost Management + custom anomaly alerts",
      "Reserved Instance & Savings Plan purchasing",
      "Automated resource tagging & chargeback reporting",
      "Waste elimination with idle resource detection",
    ],
    stats: [
      { v: "40%", l: "Avg savings" },
      { v: "$2M+", l: "Saved for clients" },
      { v: "Real-time", l: "Cost visibility" },
      { v: "3mo", l: "Payback period" },
    ],
  },
  {
    id: 6,
    icon: <img src={Network} alt="Network" style={{ width: 22, height: 22 }} />,
    title: "Azure Networking",
    accent: "#38BDF8",
    iconBg: "rgba(56,189,248,0.12)",
    iconBorder: "rgba(56,189,248,0.3)",
    tag: "Networking",
    desc: "Hub-spoke VNets, ExpressRoute, Private Endpoints, and global CDN — enterprise networking that's secure and lightning-fast.",
    features: [
      "Hub-spoke topology with Azure Firewall Premium",
      "ExpressRoute circuits with 10Gbps bandwidth",
      "Private endpoints for all PaaS services",
      "Azure CDN + DDoS Standard protection",
    ],
    stats: [
      { v: "10Gbps", l: "Max bandwidth" },
      { v: "<10ms", l: "Latency P99" },
      { v: "99.95%", l: "Network SLA" },
      { v: "Global", l: "CDN coverage" },
    ],
  },
  {
    id: 7,
    icon: <img src={Ai} alt="Ai" style={{ width: 22, height: 22 }} />,
    title: "AI & Copilot Services",
    accent: "#C4B5FD",
    iconBg: "rgba(167,139,250,0.15)",
    iconBorder: "rgba(167,139,250,0.35)",
    tag: "AI/ML",
    desc: "Azure OpenAI, Cognitive Services, and enterprise Copilot integration — bring AI into your workflows safely and at scale.",
    features: [
      "Azure OpenAI GPT-4o & embedding deployments",
      "RAG pipelines with Azure AI Search",
      "Responsible AI governance with content filters",
      "Copilot Studio custom agents for enterprise workflows",
    ],
    stats: [
      { v: "GPT-4o", l: "Model tier" },
      { v: "<2s", l: "Avg response" },
      { v: "Private", l: "Data stays yours" },
      { v: "10+", l: "AI use cases" },
    ],
  },
];

function useInView(ref, threshold = 0.1) {
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

function useRipple() {
  const [ripples, setRipples] = useState([]);
  const addRipple = (e, accent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.6;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y, size, accent }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
  };
  return { ripples, addRipple };
}

function ServiceCard({ service, index, visible, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const { ripples, addRipple } = useRipple();

  const handleClick = (e) => {
    addRipple(e, service.accent);
    setTimeout(() => onOpen(service), 120);
  };

  return (
    /*
     * Wrapper purpose:
     * - paddingTop: 8px  → headroom so the card's -6px lift never gets clipped by the row border
     * - overflow: visible → lets the elevated card paint above neighbouring cells
     * - position + zIndex → hovered card sits on top of siblings
     */
    <div
      style={{
        paddingTop: 8,
        overflow: "visible",
        position: "relative",
        zIndex: hovered ? 10 : 1,
        height: "100%",
      }}
    >
      <div
        className="relative flex flex-col cursor-pointer overflow-hidden h-full"
        style={{
          padding: "18px 20px 24px",
          background: hovered ? "#0D1F38" : "#020B18",
          border: `1px solid ${hovered ? service.accent + "55" : "rgba(0,120,212,0.10)"}`,
          borderRadius: 14,
          transition: "all 0.35s cubic-bezier(0.34,1.1,0.64,1)",
          transform: visible
            ? hovered ? "translateY(-6px)" : "translateY(0)"
            : "translateY(26px)",
          opacity: visible ? 1 : 0,
          transitionDelay: visible ? `${index * 65}ms` : "0ms",
          boxShadow: hovered
            ? `0 16px 40px ${service.accent}20, 0 0 0 1px ${service.accent}22`
            : "none",
          minHeight: 180,
          fontFamily: "'Syne', sans-serif",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
      >
        {/* Hover glow */}
        <div
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width: 140,
            height: 140,
            background: `radial-gradient(ellipse at top left, ${service.accent}1A, transparent 70%)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
            borderRadius: "50%",
          }}
        />

        {/* Ripples */}
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: r.size,
              height: r.size,
              left: r.x,
              top: r.y,
              background: `${r.accent}28`,
              animation: "ripple 0.7s ease-out forwards",
            }}
          />
        ))}

        {/* Arrow */}
        <div
          className="absolute top-3 right-3 text-xs font-bold"
          style={{
            color: service.accent,
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translate(0,0)" : "translate(-4px,4px)",
            transition: "all 0.3s ease",
          }}
        >
          →
        </div>

        {/* Icon */}
        <div
          className="grid place-items-center mb-4 flex-shrink-0"
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: service.iconBg,
            border: `1px solid ${service.iconBorder}`,
            transition: "all 0.3s ease",
            fontSize: 17,
          }}
        >
          {service.icon}
        </div>

        {/* Title */}
        <h3
          className="font-bold mb-2"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 13.5,
            color: hovered ? "#fff" : "#E2E8F0",
            transition: "color 0.2s",
          }}
        >
          {service.title}
        </h3>

        {/* Desc */}
        <p
          style={{
            fontSize: 12,
            lineHeight: 1.65,
            color: hovered ? "#A0BAD8" : "#8BA3C4",
            transition: "color 0.2s",
          }}
        >
          {service.desc}
        </p>

        {/* Bottom accent bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${service.accent}, transparent)`,
            opacity: hovered ? 0.65 : 0,
            transition: "opacity 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}

function ServiceModal({ service, onClose, setModalOpen }) {
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  if (!service) return null;

  return (

    <div
      className="fixed inset-0 z-[203] flex items-center justify-center p-4 sm:p-6"
      style={{
        background: mounted ? "rgba(0,8,20,0.82)" : "rgba(0,8,20,0)",
        backdropFilter: mounted ? "blur(6px)" : "blur(0px)",
        transition: "all 0.35s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          maxWidth: 460,
          background: "#091526",
          borderRadius: 20,
          border: "1px solid rgba(0,120,212,0.22)",
          transform: mounted ? "scale(1) translateY(0)" : "scale(0.82) translateY(24px)",
          opacity: mounted ? 1 : 0,
          transition: "transform 0.42s cubic-bezier(0.34,1.2,0.64,1), opacity 0.35s ease",
          fontFamily: "'Syne', sans-serif",
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{
            background: `linear-gradient(90deg, ${service.accent}88, ${service.accent}22)`,
          }}
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 grid place-items-center text-sm"
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            border: "none",
            color: "#5A7A9C",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.12)";
            e.currentTarget.style.color = "#A0BAD8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            e.currentTarget.style.color = "#5A7A9C";
          }}
        >
          ✕
        </button>

        <div className="px-7 pt-7 pb-5">
          <div className="flex items-start gap-4">
            <div
              className="grid place-items-center flex-shrink-0"
              style={{
                width: 52,
                height: 52,
                borderRadius: 13,
                background: service.iconBg,
                border: `1px solid ${service.iconBorder}`,
                fontSize: 22,
              }}
            >
              {service.icon}
            </div>
            <div>
              <h2
                className="font-black mb-1"
                style={{ fontSize: 19, color: "#fff", letterSpacing: "-0.02em" }}
              >
                {service.title}
              </h2>
              <span
                className="font-bold tracking-widest uppercase"
                style={{ fontSize: 11, color: service.accent }}
              >
                {service.tag}
              </span>
            </div>
          </div>
        </div>

        <div className="px-7 pb-7">
          <p className="mb-5" style={{ fontSize: 13.5, color: "#8BA3C4", lineHeight: 1.75 }}>
            {service.desc}
          </p>

          <div className="flex flex-col gap-2.5 mb-5">
            {service.features.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div
                  className="flex-shrink-0 rounded-full mt-1.5"
                  style={{ width: 6, height: 6, background: service.accent }}
                />
                <span style={{ fontSize: 12.5, color: "#A0BAD8", lineHeight: 1.55 }}>{f}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-6">
            {service.stats.map((s, i) => (
              <div
                key={i}
                className="rounded-xl"
                style={{
                  padding: "12px 14px",
                  background: "#0D1F38",
                  border: "1px solid rgba(0,120,212,0.14)",
                }}
              >
                <div className="font-black mb-0.5" style={{ fontSize: 20, color: service.accent }}>
                  {s.v}
                </div>
                <div style={{ fontSize: 11, color: "#5A7A9C" }}>{s.l}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2.5">
            <button
              className="flex-1 font-bold rounded-xl"
              style={{
                padding: "11px 16px",
                fontSize: 12.5,
                background: service.accent,
                color: "#020B18",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Syne', sans-serif",
                letterSpacing: "0.03em",
                transition: "opacity 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.88";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
              onClick={() => setModalOpen(true)}
            >
              Get Started →
            </button>
            <button
              className="font-bold rounded-xl"
              style={{
                padding: "11px 16px",
                fontSize: 12.5,
                background: "transparent",
                border: "1px solid rgba(0,120,212,0.25)",
                color: "#5A9FD4",
                cursor: "pointer",
                fontFamily: "'Syne', sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0,120,212,0.08)";
                e.currentTarget.style.color = "#8BC4EE";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#5A9FD4";
              }}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesGrid() {
  const sectionRef = useRef(null);
  const visible = useInView(sectionRef, 0.08);
  const [activeService, setActiveService] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        @keyframes ripple {
          from { transform: scale(0); opacity: 0.45; }
          to   { transform: scale(3.5); opacity: 0; }
        }
      `}</style>

      <section
        id="Services"
        ref={sectionRef}
        className="w-full"
        style={{
          background: "#020B18",
          padding: "80px clamp(20px, 5vw, 80px) 40px",
        }}
      >
        {/* Header */}
        <div className="mb-12">
          <div
            className="flex items-center gap-3 mb-4"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "all 0.55s ease",
            }}
          >
            <div className="h-px w-5" style={{ background: "#38BDF8" }} />
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "#38BDF8", fontFamily: "'Syne', sans-serif" }}
            >
              What We Do
            </span>
          </div>

          <h2
            className="font-black leading-none tracking-tight mb-4"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(32px, 4.5vw, 58px)",
              letterSpacing: "-0.025em",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.65s ease 0.08s",
            }}
          >
            <span style={{ color: "#fff" }}>Enterprise Cloud </span>
            <span
              style={{
                background: "linear-gradient(135deg,#fff 0%,#38BDF8 60%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Services
            </span>
          </h2>

          <p
            className="font-light leading-relaxed"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(13px, 1.5vw, 15px)",
              color: "#8BA3C4",
              maxWidth: 520,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(18px)",
              transition: "all 0.65s ease 0.15s",
            }}
          >
            From infrastructure setup to full-scale DevOps pipelines — we handle every layer of your Azure cloud journey.
          </p>
        </div>


        <div
          style={{
            border: "1px solid rgba(0,120,212,0.16)",
            borderRadius: 18,
            overflow: "visible",
            background: "rgba(6,15,30,0.4)",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s ease 0.2s",
            position: "relative",
          }}
        >
          {/* Row 1 */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              borderBottom: "1px solid rgba(0,120,212,0.12)",
            }}
          >
            {SERVICES.slice(0, 4).map((s, i) => (
              <div
                key={s.id}
                style={{
                  borderRight: i < 3 ? "1px solid rgba(0,120,212,0.12)" : "none",
                  overflow: "visible",
                  position: "relative",
                }}
              >
                <ServiceCard service={s} index={i} visible={visible} onOpen={setActiveService} />
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            }}
          >
            {SERVICES.slice(4).map((s, i) => (
              <div
                key={s.id}
                style={{
                  borderRight: i < 3 ? "1px solid rgba(0,120,212,0.12)" : "none",
                  overflow: "visible",
                  position: "relative",
                }}
              >
                <ServiceCard service={s} index={i + 4} visible={visible} onOpen={setActiveService} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {activeService && (
        <ServiceModal
          service={activeService}
          onClose={() => setActiveService(null)}
          setModalOpen={setModalOpen}
        />
      )}

      <Form
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}