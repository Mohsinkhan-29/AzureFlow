import { useRef, useEffect, useState } from "react";
import Form from "../Form/Form";

function useInView(ref, threshold = 0.2) {
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

export default function CTASection() {
  const sectionRef = useRef(null);
  const visible = useInView(sectionRef, 0.2);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden text-center"
      style={{
        background: "#0D1F38",
        padding: "100px 80px",
        borderTop: "1px solid rgba(0,120,212,0.14)",
      }}
    >
      {/* Central radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "600px",
          height: "280px",
          background: "radial-gradient(ellipse,rgba(0,120,212,0.2) 0%,transparent 70%)",
        }}
      />

      {/* Corner glows */}
      <div
        className="absolute top-0 left-0 w-72 h-72 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top left,rgba(0,120,212,0.08) 0%,transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-72 h-72 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at bottom right,rgba(56,189,248,0.06) 0%,transparent 70%)" }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,120,212,0.04) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(0,120,212,0.04) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Tag */}
        <div
          className="flex items-center justify-center gap-3 mb-5"
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
            Get Started
          </span>
          <div className="h-px w-5" style={{ background: "#38BDF8" }} />
        </div>

        {/* Headline */}
        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(36px,4.5vw,64px)",
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            marginBottom: "16px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s ease 0.08s",
          }}
        >
          <span className="text-white">Ready to Move<br />to the </span>
          <span
            style={{
              background: "linear-gradient(135deg,#fff 0%,#38BDF8 55%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Cloud?
          </span>
        </h2>

        {/* Subtext */}
        <p
          className="text-base font-light mx-auto mb-10"
          style={{
            color: "#8BA3C4",
            maxWidth: "420px",
            lineHeight: "1.75",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.65s ease 0.16s",
          }}
        >
          Book a free 30-minute call with our lead cloud architect. No sales pitch — just real advice.
        </p>

        {/* Buttons */}
        <div
          className="
    flex flex-col sm:flex-row
    items-center justify-center
    gap-3 w-full
  "
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.65s ease 0.24s",
          }}
        >
          {/* Primary Button */}
          <button
            className="
      w-full sm:w-auto
      text-sm font-semibold text-white
      transition-all duration-300
      hover:-translate-y-0.5 active:translate-y-0
    "
            style={{
              padding: "15px 36px",
              borderRadius: "10px",
              background: "#0078D4",
              border: "none",
              fontFamily: "Syne, sans-serif",
              cursor: "pointer",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1a8fe8";
              e.currentTarget.style.boxShadow =
                "0 14px 36px rgba(0,120,212,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0078D4";
              e.currentTarget.style.boxShadow = "none";
            }}
            onClick={() => setModalOpen(true)}
          >
            Book Free Consultation →
          </button>

          {/* Secondary Button */}
          <button
            className="
      w-full sm:w-auto
      text-sm font-medium text-slate-200
      transition-all duration-300
      hover:-translate-y-0.5
    "
            style={{
              padding: "15px 36px",
              borderRadius: "10px",
              background: "transparent",
              border: "1px solid rgba(0,120,212,0.25)",
              fontFamily: "Syne, sans-serif",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#0078D4";
              e.currentTarget.style.background = "rgba(0,120,212,0.08)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                "rgba(0,120,212,0.25)";
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "";
            }}
          >
            View Case Studies
          </button>
        </div>

        {/* Trust micro-line */}
        <div
          className="flex items-center justify-center gap-6 mt-10"
          style={{
            opacity: visible ? 0.7 : 0,
            transition: "opacity 0.8s ease 0.4s",
          }}
        >
          {["No credit card required", "Setup in 48 hours", "Cancel anytime"].map((t, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span style={{ color: "#4ADE80", fontSize: "10px" }}>✓</span>
              <span className="text-xs" style={{ color: "#8BA3C4", fontFamily: "DM Sans, sans-serif" }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <Form
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>

  );
}