import { useState, useRef, useEffect } from "react";
import Form from "../Form/Form";

const PLANS = [
  {
    tier: "Starter",
    price: "1,299",
    period: "per month, billed annually",
    featured: false,
    features: [
      { text: "Up to 10 VMs managed", on: true },
      { text: "Basic Azure setup", on: true },
      { text: "CI/CD pipeline (1 project)", on: true },
      { text: "8×5 support", on: true },
      { text: "Multi-region deployment", on: false },
      { text: "Dedicated cloud architect", on: false },
    ],
    cta: "Get Started →",
    ctaStyle: "outline",
  },
  {
    tier: "Business",
    price: "3,499",
    period: "per month, billed annually",
    featured: true,
    badge: "Most Popular",
    features: [
      { text: "Up to 50 VMs managed", on: true },
      { text: "Full Azure infrastructure", on: true },
      { text: "Unlimited CI/CD pipelines", on: true },
      { text: "24×7 priority support", on: true },
      { text: "Multi-region deployment", on: true },
      { text: "Dedicated cloud architect", on: false },
    ],
    cta: "Get Started →",
    ctaStyle: "solid",
  },
  {
    tier: "Enterprise",
    price: null,
    customLabel: "Custom",
    period: "tailored to your scale",
    featured: false,
    features: [
      { text: "Unlimited VM fleet", on: true },
      { text: "Custom architecture design", on: true },
      { text: "Unlimited CI/CD pipelines", on: true },
      { text: "24×7 SLA-backed support", on: true },
      { text: "Multi-region + DR", on: true },
      { text: "Dedicated cloud architect", on: true },
    ],
    cta: "Contact Sales →",
    ctaStyle: "outline",
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

function PlanCard({ plan, index, visible, setModalOpen }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const glowColor = "rgba(0,120,212,0.55)";
  const glowColorStrong = "rgba(0,120,212,0.80)";

  const isActive = hovered || pressed;

  return (
    <div
      className="relative flex flex-col w-full"
      style={{
        padding: "clamp(20px, 4vw, 32px)",
        borderRadius: "18px",
        background: plan.featured ? "#0D1F38" : "#0A1628",
        border: `1px solid ${plan.featured
          ? isActive ? "#38BDF8" : "#0078D4"
          : isActive
            ? "rgba(0,120,212,0.65)"
            : "rgba(0,120,212,0.16)"
          }`,
        transform: visible
          ? plan.featured
            ? isActive ? "scale(1.04) translateY(-6px)" : "scale(1.03)"
            : isActive ? "translateY(-6px)" : "translateY(0)"
          : "translateY(32px)",
        opacity: visible ? 1 : 0,
        transition: `all 0.5s cubic-bezier(0.34,1.1,0.64,1) ${index * 100}ms`,
        boxShadow: isActive
          ? plan.featured
            ? `0 0 0 1px #38BDF8, 0 0 32px ${glowColorStrong}, 0 0 80px ${glowColor}, 0 20px 48px rgba(0,120,212,0.28)`
            : `0 0 0 1px rgba(0,120,212,0.65), 0 0 24px ${glowColor}, 0 0 60px rgba(0,120,212,0.25), 0 16px 40px rgba(0,120,212,0.18)`
          : plan.featured
            ? `0 0 0 1px #0078D4, 0 20px 48px rgba(0,120,212,0.18)`
            : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      {/* Animated glow ring on hover */}
      <div
        style={{
          position: "absolute",
          inset: "-1px",
          borderRadius: "18px",
          background: isActive
            ? plan.featured
              ? "linear-gradient(135deg, rgba(56,189,248,0.10) 0%, rgba(0,120,212,0.08) 100%)"
              : "linear-gradient(135deg, rgba(0,120,212,0.07) 0%, rgba(56,189,248,0.04) 100%)"
            : "transparent",
          transition: "all 0.4s ease",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Content above glow overlay */}
      <div className="relative flex flex-col flex-1" style={{ zIndex: 1 }}>
        {/* Popular badge */}
        {plan.badge && (
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-bold text-white px-4 py-1 rounded-full whitespace-nowrap"
            style={{
              background: isActive
                ? "linear-gradient(90deg, #0078D4 0%, #38BDF8 100%)"
                : "#0078D4",
              fontFamily: "Syne, sans-serif",
              fontSize: "10px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              boxShadow: isActive ? "0 0 18px rgba(56,189,248,0.6)" : "none",
              transition: "all 0.4s ease",
            }}
          >
            {plan.badge}
          </div>
        )}

        {/* Tier */}
        <div
          className="text-xs font-semibold uppercase tracking-widest mb-2.5"
          style={{ color: "#8BA3C4", fontFamily: "Syne, sans-serif" }}
        >
          {plan.tier}
        </div>

        {/* Price */}
        <div
          className="font-black leading-none text-white mb-1"
          style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(32px,4vw,46px)" }}
        >
          {plan.price ? (
            <>
              <sup style={{ fontSize: "18px", verticalAlign: "super" }}>$</sup>
              {plan.price}
            </>
          ) : (
            plan.customLabel
          )}
        </div>
        <div className="text-xs mb-5" style={{ color: "#8BA3C4" }}>
          {plan.period}
        </div>

        {/* Divider */}
        <div
          className="mb-5"
          style={{
            height: "1px",
            background: isActive
              ? "linear-gradient(90deg, transparent, rgba(0,120,212,0.5), transparent)"
              : "rgba(0,120,212,0.16)",
            transition: "all 0.4s ease",
          }}
        />

        {/* Feature list */}
        <ul className="flex flex-col gap-2.5 mb-8 flex-1 list-none m-0 p-0">
          {plan.features.map((f, i) => (
            <li
              key={i}
              className="flex items-center gap-2.5 text-sm"
              style={{
                color: f.on ? "#8BA3C4" : "rgba(139,163,196,0.3)",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              <span
                className="text-xs font-bold flex-shrink-0"
                style={{
                  color: f.on ? (isActive ? "#38BDF8" : "#38BDF8") : "#8BA3C4",
                  opacity: f.on ? 1 : 0.3,
                  textShadow: f.on && isActive ? "0 0 8px rgba(56,189,248,0.8)" : "none",
                  transition: "text-shadow 0.3s ease",
                }}
              >
                {f.on ? "✓" : "–"}
              </span>
              {f.text}
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          className="w-full py-3 rounded-lg text-sm font-semibold cursor-pointer"
          style={{
            fontFamily: "Syne, sans-serif",
            letterSpacing: "0.02em",
            background: plan.ctaStyle === "solid"
              ? isActive
                ? "linear-gradient(90deg, #0078D4 0%, #1a9fd4 100%)"
                : "#0078D4"
              : "transparent",
            border: plan.ctaStyle === "solid"
              ? "none"
              : `1px solid ${isActive ? "#0078D4" : "rgba(0,120,212,0.3)"}`,
            color: plan.ctaStyle === "solid" ? "#fff" : isActive ? "#fff" : "#E2E8F0",
            boxShadow: isActive
              ? plan.ctaStyle === "solid"
                ? "0 0 24px rgba(0,120,212,0.55), 0 8px 22px rgba(0,120,212,0.35)"
                : "0 0 16px rgba(0,120,212,0.35)"
              : "none",
            transition: "all 0.35s ease",
          }}
          onClick={() => setModalOpen(true)}
        >
          {plan.cta}
        </button>
      </div>
    </div>
  );
}

export default function PricingSection() {
  const sectionRef = useRef(null);
  const visible = useInView(sectionRef, 0.1);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
      <section
        id="pricing"
        ref={sectionRef}
        style={{
          background: "#060F1E",
          padding: "clamp(60px, 8vw, 100px) clamp(16px, 6vw, 80px)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
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
              Transparent Pricing
            </span>
            <div className="h-px w-5" style={{ background: "#38BDF8" }} />
          </div>

          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(28px, 5vw, 50px)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              marginBottom: "12px",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(18px)",
              transition: "all 0.65s ease 0.08s",
            }}
          >
            <span className="text-white">Choose Your </span>
            <span
              style={{
                background: "linear-gradient(135deg,#fff 0%,#38BDF8 60%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Cloud Plan
            </span>
          </h2>

          <p
            className="text-sm font-light"
            style={{
              color: "#8BA3C4",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(14px)",
              transition: "all 0.65s ease 0.15s",
            }}
          >
            No hidden fees. Scale up or down anytime.
          </p>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "clamp(12px, 2vw, 18px)",
            alignItems: "start",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {PLANS.map((plan, i) => (
            <div
              key={i}
              style={{
                /* Push Business card down on large screens for visual hierarchy */
                marginTop: plan.featured ? "0" : "0",
                paddingTop: plan.featured ? "0" : "0",
              }}
            >
              {/* Badge spacer so badge doesn't clip */}
              <div style={{ paddingTop: plan.badge ? "16px" : "0" }}>
                <PlanCard
                  plan={plan}
                  index={i}
                  visible={visible}
                  setModalOpen={setModalOpen}
                />

              </div>
            </div>
          ))}
        </div>
      </section>
      <Form
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}