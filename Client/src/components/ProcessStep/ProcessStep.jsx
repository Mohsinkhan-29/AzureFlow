import { useState, useRef, useEffect } from "react";

/* ─── Data ───────────────────────────────────────── */
const STEPS = [
  {
    num: "01",
    title: "Assessment",
    desc: "We audit your infrastructure, map dependencies, and identify migration complexity.",
    color: "#0078D4",
  },
  {
    num: "02",
    title: "Planning",
    desc: "Architecture blueprints, cost models, and a phased timeline aligned to your goals.",
    color: "#38BDF8",
  },
  {
    num: "03",
    title: "Migration",
    desc: "Zero-downtime migration with parallel running systems and rollback protocols.",
    color: "#38BDF8",
  },
  {
    num: "04",
    title: "Optimization",
    desc: "Continuous monitoring, auto-scaling, and monthly cost optimization reporting.",
    color: "#0078D4",
  },
];

/* ─── Timing ─────────────────────────────────────── */
const CIRCLE = 80;
const HALF = CIRCLE / 2;

const CIRCLE_DWELL = 600;
const LINE_TRAVEL = 900;
const TOTAL_LOOP =
  CIRCLE_DWELL * STEPS.length +
  LINE_TRAVEL * (STEPS.length - 1);

/* ─── Pulse Logic ───────────────────────────────── */
function getPulseState(elapsed) {
  let t = elapsed % TOTAL_LOOP;
  for (let i = 0; i < STEPS.length; i++) {
    if (t < CIRCLE_DWELL) return { type: "circle", index: i, progress: t / CIRCLE_DWELL };
    t -= CIRCLE_DWELL;
    if (i < STEPS.length - 1) {
      if (t < LINE_TRAVEL) return { type: "line", index: i, progress: t / LINE_TRAVEL };
      t -= LINE_TRAVEL;
    }
  }
}

/* ─── Hooks ─────────────────────────────────────── */
function useLoop(running) {
  const [t, setT] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now();
    const loop = (now) => {
      setT((now - startRef.current) % TOTAL_LOOP);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);

  return t;
}

function useInView(ref) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setV(true);
    });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return v;
}

/* ─── Circle ────────────────────────────────────── */
function Circle({ step, index, pulse }) {
  const active = pulse?.type === "circle" && pulse.index === index;
  const glow = active ? pulse.progress : 0;

  return (
    <div style={{ width: CIRCLE, height: CIRCLE }} className="relative z-10 flex-shrink-0">
      <div
        style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: "1px solid #38BDF8", opacity: glow,
          transform: `scale(${1 + glow * 0.25})`,
        }}
      />
      <div
        style={{
          width: "100%", height: "100%", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#081426", border: "1px solid rgba(56,189,248,0.3)",
          boxShadow: active ? `0 0 ${20 * glow}px rgba(56,189,248,0.6)` : "none",
        }}
      >
        <span style={{
          color: "#38BDF8", 
          fontFamily: "Syne, sans-serif",
          fontSize: "22px",
          fontWeight: 800,
        }}>{step.num}</span>
      </div>
    </div>
  );
}

/* ─── Desktop Line (FIXED) ──────────────────────── */
function DesktopLine({ index, pulse }) {
  const active = pulse?.type === "line" && pulse.index === index;
  const progress = active ? pulse.progress : 0;

  return (
    <div style={{ position: "relative", flex: 1, height: CIRCLE, display: "flex", alignItems: "center" }}>
      <div style={{ width: "100%", height: 2, background: "rgba(56,189,248,0.15)", position: "relative" }}>
        {active && (
          <div
            style={{
              position: "absolute",
              left: `${progress * 100}%`,
              transform: "translateX(-50%)",
              width: 20, height: 4,
              background: "#38BDF8", borderRadius: 2,
              boxShadow: "0 0 10px #38BDF8",
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Component ─────────────────────────────────── */
export default function ProcessSteps() {
  const sectionref = useRef(null);
  const visible = useInView(sectionref);
  const t = useLoop(visible);
  const pulse = visible ? getPulseState(t) : null;

  return (
    <section id="process" ref={sectionref} className="bg-[#020B18] py-24 px-20">
      <div className="text-center mb-16">
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
            How It Works
          </span>
          <div className="h-px w-5" style={{ background: "#38BDF8" }} />
        </div>

        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(36px,4vw,58px)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            color: "#fff",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(18px)",
            transition: "all 0.65s ease 0.08s",
          }}
        >
          From{" "}
          <span
            style={{
              background: "linear-gradient(135deg,#fff 0%,#38BDF8 60%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Zero to Cloud
          </span>
          <br />
          in 4 Steps
        </h2>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block max-w-5xl mx-auto">

        {/* Circles + Lines interleaved in one flex row */}
        <div className="flex items-center">
          {STEPS.map((s, i) => (
            <>
              <div key={`circle-${i}`} className="flex flex-col items-center flex-shrink-0">
                <Circle step={s} index={i} pulse={pulse} />
              </div>
              {i < STEPS.length - 1 && (
                <DesktopLine key={`line-${i}`} index={i} pulse={pulse} />
              )}
            </>
          ))}
        </div>

        {/* Labels row — mirrors circle positions */}
        <div className="flex items-start mt-4">
          {STEPS.map((s, i) => (
            <>
              <div
                key={`label-${i}`}
                style={{ width: CIRCLE , flexShrink: 0 }}
                className="flex flex-col items-center"
              >
                <h3 className="text-white text-base font-bold text-center  mb-3" style={{
                  fontFamily: "Syne, sans-serif",
                }}>{s.title}</h3>
                <p className="text-sm text-slate-400 text-center mt-1 leading-relaxed font-light"
                  style={{
                    minWidth: "180px",
                    lineHeight: "1.7",
                  }}>
                  {s.desc}</p>
              </div>
              {i < STEPS.length - 1 && <div key={`spacer-${i}`} className="flex-1" />}
            </>
          ))}
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden relative max-w-md mx-auto">
        <div
          style={{
            position: "absolute", left: HALF, top: 0, bottom: 0,
            width: 2, background: "rgba(56,189,248,0.2)",
          }}
        />
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-start gap-6 mb-12 relative">
            <Circle step={s} index={i} pulse={pulse} />
            <div className="pt-2">
              <h3 className="text-white text-sm font-bold">{s.title}</h3>
              <p className="text-xs text-slate-400">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}