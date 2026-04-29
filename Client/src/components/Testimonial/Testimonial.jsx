import { useState, useRef, useEffect } from "react";

const TESTIMONIALS = [
  {
    stars: 5,
    quote:
      "AzureFlow cut our cloud bill by 38% in the first quarter. Their FinOps team found inefficiencies our internal team missed for two years.",
    name: "Ahmad Karimi",
    role: "CTO, NovaTech Solutions",
    initials: "AK",
    avatarBg: "#0078D4",
  },
  {
    stars: 5,
    quote:
      "The migration was flawless — zero downtime, zero data loss. We moved 12 years of production data to Azure in 6 weeks.",
    name: "Sarah Reinhardt",
    role: "VP Engineering, FinEdge Corp",
    initials: "SR",
    avatarBg: "#7C3AED",
  },
  {
    stars: 5,
    quote:
      "The DevOps pipelines deploy 5× faster than before. Our release cycle went from bi-weekly to multiple deploys per day.",
    name: "Marcus Johnson",
    role: "Director of DevOps, LogiChain",
    initials: "MJ",
    avatarBg: "#0F6E56",
  },
];

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

function TestimonialCard({ t, index, visible }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex flex-col relative overflow-hidden"
      style={{
        padding: "28px",
        borderRadius: "16px",
        background: hovered ? "#0D1F38" : "#0A1628",
        border: `1px solid ${hovered ? "rgba(0,120,212,0.32)" : "rgba(0,120,212,0.14)"}`,
        transition: `all 0.4s cubic-bezier(0.34,1.1,0.64,1) ${index * 100}ms`,
        transform: visible
          ? hovered ? "translateY(-5px)" : "translateY(0)"
          : "translateY(28px)",
        opacity: visible ? 1 : 0,
        boxShadow: hovered ? "0 18px 44px rgba(0,120,212,0.12)" : "none",
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Quote glow top-right */}
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "-10px",
          fontSize: "80px",
          lineHeight: 1,
          color: "rgba(0,120,212,0.07)",
          fontFamily: "Georgia, serif",
          userSelect: "none",
          pointerEvents: "none",
          transition: "color 0.3s",
          ...(hovered && { color: "rgba(0,120,212,0.12)" }),
        }}
      >
        "
      </div>

      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: t.stars }).map((_, i) => (
          <span key={i} style={{ color: "#FBBF24", fontSize: "13px" }}>★</span>
        ))}
      </div>

      {/* Quote */}
      <p
        className="text-sm leading-relaxed flex-1 mb-6 italic font-light"
        style={{ color: "#8BA3C4", lineHeight: "1.78" }}
      >
        "{t.quote}"
      </p>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(0,120,212,0.1)", marginBottom: "18px" }} />

      {/* Author */}
      <div className="flex items-center gap-3">
        <div
          className="grid place-items-center flex-shrink-0 text-xs font-bold text-white"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: t.avatarBg,
            fontFamily: "Syne, sans-serif",
          }}
        >
          {t.initials}
        </div>
        <div>
          <div
            className="text-xs font-semibold text-white"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            {t.name}
          </div>
          <div className="text-xs" style={{ color: "#8BA3C4" }}>
            {t.role}
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg,transparent,${t.avatarBg},transparent)`,
          opacity: hovered ? 0.5 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef(null);
  const visible = useInView(sectionRef, 0.1);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      style={{ background: "#020B18", padding: "100px 80px" }}
    >
      {/* Header */}
      <div className="text-center mb-14">
        <div
          className="flex items-center justify-center gap-3 mb-4"
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
            Client Stories
          </span>
          <div className="h-px w-5" style={{ background: "#38BDF8" }} />
        </div>

        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(32px,3.5vw,50px)",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(18px)",
            transition: "all 0.65s ease 0.08s",
          }}
        >
          <span className="text-white">Trusted by </span>
          <span
            style={{
              background: "linear-gradient(135deg,#fff 0%,#38BDF8 60%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Industry Leaders
          </span>
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">

        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={i} t={t} index={i} visible={visible} />
        ))}
      </div>
    </section>
  );
}