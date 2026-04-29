import { useState, useRef, useEffect } from "react";

const STATS = [
  { value: 150, suffix: "+", label: "Enterprise Clients Migrated" },
  { value: 8, suffix: "M+", label: "Client Cloud Costs Saved", prefix: "$" },
  { value: 99.99, suffix: "%", label: "Average Uptime SLA", decimals: 2 },
  { value: 40, suffix: "%", label: "Average Cost Reduction" },
];

// ─── Hooks ─────────────────────────────────────────────────────────
function useInView(ref, threshold = 0.2) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return visible;
}

function useCountUp(target, duration, triggered, decimals = 0) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!triggered) return;

    let start = null;

    const raf = (ts) => {
      if (!start) start = ts;

      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);

      setVal(parseFloat((eased * target).toFixed(decimals)));

      if (p < 1) requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
  }, [triggered, target, duration, decimals]);

  return val;
}

// ─── Stat Item ─────────────────────────────────────────────────────
function StatItem({ stat, index, triggered }) {
  const count = useCountUp(stat.value, 1800, triggered, stat.decimals ?? 0);
  const [hovered, setHovered] = useState(false);

  const display = `${stat.prefix ?? ""}${stat.decimals ? count.toFixed(stat.decimals) : count.toLocaleString()
    }${stat.suffix}`;

  return (
    <div
      className="relative flex flex-col items-center justify-center text-center p-6 sm:p-8 transition-all duration-300"
      style={{
        background: hovered ? "#0D1F38" : "#0A1628",
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Number */}
      <div
        className="text-[28px] sm:text-[32px] lg:text-[45px] font-black leading-none mb-2"
        style={{
          fontFamily: "Syne, sans-serif",
          background: "linear-gradient(135deg,#fff 0%,#38BDF8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          opacity: triggered ? 1 : 0,
          transform: triggered
            ? "translateY(0) scale(1)"
            : "translateY(12px) scale(0.95)",
          transition: "all 0.6s ease",
          transitionDelay: `${index * 100}ms`,
        }}
      >
        {display}
      </div>

      {/* Label */}
      <p
        className="text-sm"
        style={{
          color: "#8BA3C4",
          fontFamily: "DM Sans, sans-serif",
          opacity: triggered ? 1 : 0,
          transform: triggered ? "translateY(0)" : "translateY(8px)",
          transition: `all 0.6s ease ${100 + index * 100}ms`,
        }}
      >
        {stat.label}
      </p>

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg,transparent,#0078D4,transparent)",
          opacity: hovered ? 0.6 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
}

// ─── Main Section ──────────────────────────────────────────────────
export default function StatsSection() {
  const sectionRef = useRef(null);
  const triggered = useInView(sectionRef, 0.2);

  return (
    <section
      ref={sectionRef}
      className="text-center"
      style={{
        background: "#020B18",
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 6vw, 80px)",
        borderTop: "1px solid rgba(0,120,212,0.12)",
        borderBottom: "1px solid rgba(0,120,212,0.12)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-center gap-3 mb-4"
        style={{
          opacity: triggered ? 1 : 0,
          transform: triggered ? "translateY(0)" : "translateY(14px)",
          transition: "all 0.6s ease",
        }}
      >
        <div className="h-px w-5 bg-[#38BDF8]" />
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: "#38BDF8", fontFamily: "Syne, sans-serif" }}
        >
          By the Numbers
        </span>
        <div className="h-px w-5 bg-[#38BDF8]" />
      </div>

      {/* Title */}
      <h2
        style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "clamp(30px,4vw,50px)",
          fontWeight: 800,
          letterSpacing: "-0.025em",
          marginBottom: "52px",
          opacity: triggered ? 1 : 0,
          transform: triggered ? "translateY(0)" : "translateY(18px)",
          transition: "all 0.65s ease 0.08s",
        }}
      >
        <span className="text-white">Results That </span>
        <span
          style={{
            background: "linear-gradient(135deg,#fff 0%,#38BDF8 60%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Speak
        </span>
      </h2>

      {/* Responsive Grid */}
      <div
        className="grid h-max border rounded-[14px] 
           grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        style={{
          gap: "1px",
          background: "rgba(0,120,212,0.12)",
          borderColor: "rgba(0,120,212,0.16)",
        }}

      >
        {STATS.map((s, i) => (
          <div key={i} className="relative overflow-hidden  bg-[#020B18]">
            <StatItem stat={s} index={i} triggered={triggered} />
          </div>
        ))}
      </div>
    </section>
  );
}
