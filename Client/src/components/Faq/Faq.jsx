import { useState, useRef, useEffect } from "react";

const FAQS = [
  {
    q: "How long does a typical Azure migration take?",
    a: "Small workloads (under 20 VMs) typically take 2–4 weeks. Medium enterprise environments take 6–10 weeks. Large-scale migrations can take 3–6 months — all with zero-downtime guarantees.",
  },
  {
    q: "Do you support hybrid cloud and multi-cloud architectures?",
    a: "Yes. We specialize in Azure-centric hybrid architectures using Azure Arc for on-premises and multi-cloud management. We can also integrate with AWS and GCP workloads through Azure's native connectors.",
  },
  {
    q: "What compliance standards do you support?",
    a: "We deliver compliant architectures for ISO 27001, SOC 2 Type II, GDPR, HIPAA, and PCI-DSS. Azure's 100+ certifications are leveraged through proper configuration and documentation.",
  },
  {
    q: "Is there a lock-in contract?",
    a: "No long-term lock-in. Monthly plans can be cancelled with 30 days notice. Annual plans include a pro-rated refund policy. We earn your business every month through results, not contracts.",
  },
  {
    q: "What does your 24×7 support actually look like?",
    a: "Business and Enterprise clients get a dedicated Slack channel, a named cloud engineer on call, and a 15-minute SLA for P1 incidents with PagerDuty integration.",
  },
];

function useInView(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold });

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return visible;
}

/* ---------------- TYPEWRITER HOOK ---------------- */
function useTypewriter(text, speed = 12, trigger = true) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!trigger) {
      setDisplayed("");
      return;
    }

    let i = 0;
    setDisplayed("");

    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));

      if (i >= text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, trigger]);

  return displayed;
}

/* ---------------- FAQ ITEM ---------------- */
function FAQItem({ faq, index, isOpen, onToggle, visible }) {
  const typedAnswer = useTypewriter(faq.a, 10, isOpen);

  return (
    <div
      style={{
        background: isOpen ? "#0D1F38" : "#0A1628",
        borderBottom: "1px solid rgba(0,120,212,0.1)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.5s ease ${index * 70}ms, transform 0.5s ease ${index * 70}ms`,
      }}
    >
      {/* Question */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px clamp(16px, 3vw, 26px)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontSize: "clamp(13px, 1.5vw, 15px)",
            fontWeight: 600,
            color: isOpen ? "#fff" : "#E2E8F0",
          }}
        >
          {faq.q}
        </span>

        <div
          style={{
            width: 28,
            height: 28,
            display: "grid",
            placeItems: "center",
            borderRadius: 6,
            background: isOpen ? "rgba(0,120,212,0.2)" : "rgba(0,120,212,0.08)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "all 0.3s ease",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 6" fill="none">
            <path
              d="M1 1l4 4 4-4"
              stroke={isOpen ? "#38BDF8" : "#8BA3C4"}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </button>

      {/* Answer */}
      <div
        style={{
          maxHeight: isOpen ? 220 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s ease",
        }}
      >
        <div
          style={{
            padding: "0 clamp(16px, 3vw, 26px) 18px",
            marginLeft: "clamp(10px, 2vw, 26px)",
            borderLeft: "2px solid rgba(0,120,212,0.3)",
            color: "#8BA3C4",
            fontSize: "clamp(12px, 1.4vw, 14px)",
            lineHeight: 1.7,
          }}
        >
          {typedAnswer}
        </div>
      </div>
    </div>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function FAQSection() {
  const sectionRef = useRef(null);
  const visible = useInView(sectionRef, 0.1);
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) =>
    setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section
      id="faq"
      ref={sectionRef}
      style={{
        background: "#060F1E",
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 6vw, 80px)",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 50px)",
            fontWeight: 800,
            color: "#fff",
          }}
        >
          Common{" "}
          <span style={{ color: "#38BDF8" }}>Questions</span>
        </h2>
      </div>

      {/* FAQ */}
      <div
        style={{
          maxWidth: 780,
          margin: "0 auto",
          border: "1px solid rgba(0,120,212,0.14)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {FAQS.map((faq, i) => (
          <FAQItem
            key={i}
            faq={faq}
            index={i}
            isOpen={openIndex === i}
            onToggle={() => toggle(i)}
            visible={visible}
          />
        ))}
      </div>
    </section>
  );
}
