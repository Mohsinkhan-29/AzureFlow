import { useEffect, useState, useRef } from "react";
import Form from "../Form/Form";


// ─── Data ─────────────────────────────────────────────────────────────────────
const BARS = [
    { h: 45, color: "#0078D4" },
    { h: 62, color: "#38BDF8" },
    { h: 38, color: "#0078D4" },
    { h: 78, color: "#38BDF8" },
    { h: 55, color: "#0078D4" },
    { h: 88, color: "#38BDF8" },
    { h: 70, color: "#7C3AED" },
];

const REGIONS = [
    { name: "East US", pct: 88, color: "#0078D4" },
    { name: "West Europe", pct: 65, color: "#38BDF8" },
    { name: "Southeast Asia", pct: 42, color: "#7C3AED" },
];

const METRICS = [
    { label: "Uptime", countTo: null, staticVal: "99.99%", suffix: "", prefix: "", sup: "↑", supColor: "#4ADE80" },
    { label: "Nodes", countTo: 2847, staticVal: null, suffix: "", prefix: "", sup: null },
    { label: "Cost Saved", countTo: 42, staticVal: null, suffix: "k", prefix: "$", sup: null },
];

// Only the 3rd gradient line cycles — lines 1 & 2 stay static
const HEADLINE_PHRASES = [
    "Cloud Solutions",
    "Zero Downtime Infra",
    "Serverless Scale",
    "Enterprise Security",
    "Cloud Architecture",
    "Cost Optimisation",
];

const TYPE_SPEED = 65;
const DELETE_SPEED = 35;
const HOLD_MS = 2000;

// ─── Typewriter cycle hook ────────────────────────────────────────────────────
function useTypewriterCycle(phrases) {
    const [text, setText] = useState("");
    const [isTyping, setIsTyping] = useState(true);
    const phraseIdx = useRef(0);
    const charIdx = useRef(0);
    // use a ref for the timeout so we can always clear it
    const timerRef = useRef(null);

    useEffect(() => {
        function tick() {
            const current = phrases[phraseIdx.current];

            setIsTyping(prev => {
                // We read the latest state via the functional updater but we
                // don't actually want to change it here — we just need to read it.
                // Return the same value and do work as a side-effect.
                return prev;
            });

            // We schedule the next step directly without relying on state re-renders
            // for the timing loop — keeps it clean and avoids stale closures.
        }

        // Clear any existing timer on every effect run
        if (timerRef.current) clearTimeout(timerRef.current);

        function schedule() {
            const current = phrases[phraseIdx.current];

            if (isTyping) {
                charIdx.current += 1;
                setText(current.slice(0, charIdx.current));

                if (charIdx.current >= current.length) {
                    // Fully typed — hold, then flip to deleting
                    timerRef.current = setTimeout(() => {
                        setIsTyping(false);
                    }, HOLD_MS);
                } else {
                    timerRef.current = setTimeout(schedule, TYPE_SPEED);
                }
            } else {
                charIdx.current -= 1;
                setText(current.slice(0, charIdx.current));

                if (charIdx.current <= 0) {
                    // Fully deleted — move to next phrase, flip to typing
                    phraseIdx.current = (phraseIdx.current + 1) % phrases.length;
                    timerRef.current = setTimeout(() => {
                        setIsTyping(true);
                    }, TYPE_SPEED);
                } else {
                    timerRef.current = setTimeout(schedule, DELETE_SPEED);
                }
            }
        }

        timerRef.current = setTimeout(schedule, TYPE_SPEED);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTyping]);

    return text;
}

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target, duration, triggered) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!triggered || target === null) return;
        let start = null;
        const raf = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.floor(eased * target));
            if (p < 1) requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
    }, [triggered, target, duration]);
    return val;
}

// ─── Metric card ──────────────────────────────────────────────────────────────
function MetricCard({ metric, triggered }) {
    const count = useCountUp(metric.countTo, 1600, triggered);
    const display = metric.staticVal
        ? metric.staticVal
        : `${metric.prefix}${count.toLocaleString()}${metric.suffix}`;

    return (
        <div
            className="rounded-lg p-3.5"
            style={{
                background: "#0D1F38",
                border: "1px solid rgba(56,189,248,0.12)",
            }}
        >
            <div
                className="md:text-xs text-[8px] uppercase tracking-wider mb-2"
                style={{ color: "#8BA3C4" }}
            >
                {metric.label}
            </div>

            <div
                className="font-black text-white md:text-lg text-xs leading-tight flex items-baseline gap-1"
                style={{ fontFamily: "Syne, sans-serif" }}
            >
                {display}

                {metric.sup && (
                    <sup
                        className="text-[10px] md:text-xs"
                        style={{ color: metric.supColor }}
                    >
                        {metric.sup}
                    </sup>
                )}
            </div>
        </div>

    );
}

// ─── Bar ─────────────────────────────────────────────────────────────────────
function Bar({ targetH, color, delay, triggered }) {
    const [h, setH] = useState(0);
    useEffect(() => {
        if (!triggered) return;
        const t = setTimeout(() => setH(targetH), delay);
        return () => clearTimeout(t);
    }, [triggered, targetH, delay]);

    return (
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", height: "100%" }}>
            <div style={{
                width: "100%", height: `${h}%`, background: color, borderRadius: "3px 3px 0 0",
                transition: "height 0.7s cubic-bezier(0.34,1.1,0.64,1)",
            }} />
        </div>
    );
}

// ─── Progress line ────────────────────────────────────────────────────────────
function ProgressLine({ pct, color, delay, triggered }) {
    const [w, setW] = useState(0);
    useEffect(() => {
        if (!triggered) return;
        const t = setTimeout(() => setW(pct), delay);
        return () => clearTimeout(t);
    }, [triggered, pct, delay]);

    return (
        <div className="flex-1 rounded-full overflow-hidden" style={{ height: "3px", background: "rgba(255,255,255,0.07)" }}>
            <div style={{
                height: "100%", width: `${w}%`, background: color, borderRadius: "9999px",
                transition: "width 0.9s cubic-bezier(0.34,1,0.64,1)",
            }} />
        </div>
    );
}

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

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
    const dashRef = useRef(null);
    const [triggered, setTriggered] = useState(false);
    const phraseText = useTypewriterCycle(HEADLINE_PHRASES);
    const [modalOpen, setModalOpen] = useState(false);
    const sectionRef = useRef(null);
    const visible = useInView(sectionRef, 0.1);

    // Longest phrase reserves space so the layout never shifts
    const longestPhrase = HEADLINE_PHRASES.reduce((a, b) => b.length > a.length ? b : a, "");

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setTriggered(true); },
            { threshold: 0.1 }
        );
        if (dashRef.current) obs.observe(dashRef.current);
        return () => obs.disconnect();
    }, []);

    return (
        <>
            <style>{`
                @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
                .tw-cursor {
                    display: inline-block;
                    width: 3px;
                    height: 0.82em;
                    background: #38BDF8;
                    margin-left: 3px;
                    vertical-align: middle;
                    border-radius: 1px;
                    animation: blink 0.7s step-end infinite;
                    flex-shrink: 0;
                }
            `}</style>

            <section
                id="Home"
                ref={sectionRef}
                className="pt-20 md:pt-40 lg:pt-28 relative flex items-center overflow-hidden"
                style={{ background: "#020B18", paddingBottom: "60px", minHeight: "100vh" }}
            >
                {/* Grid */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,120,212,0.05) 1px,transparent 1px)," +
                        "linear-gradient(90deg,rgba(0,120,212,0.05) 1px,transparent 1px)",
                    backgroundSize: "60px 60px",
                }} />

                {/* Glows */}
                <div className="absolute -top-32 -right-20 w-[700px] h-[700px] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(ellipse,rgba(0,120,212,0.14) 0%,transparent 70%)" }} />
                <div className="absolute bottom-0 -left-10 w-[500px] h-[500px] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(ellipse,rgba(56,189,248,0.06) 0%,transparent 70%)" }} />

                <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">


                    {/* ── LEFT ── */}
                    <div className="w-full lg:w-auto text-center lg:text-left" style={{ maxWidth: "600px" }}>

                        <div
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-8"
                            style={{ border: "1px solid rgba(0,120,212,0.22)", background: "rgba(0,120,212,0.08)", color: "#38BDF8" }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                            Microsoft Azure Certified Partner
                        </div>

                        <h1
                            className="text-xl md:text-3xl lg:text-3xl tracking-tight font-black leading-none text-white mb-6
             text-center lg:text-left
             mx-auto lg:mx-0
             max-w-2xl"
                            style={{ fontFamily: "Syne, sans-serif" }}
                        >
                            {/* Static lines */}
                            <span className="block">Scale Smarter</span>
                            <span className="block">with Azure</span>

                            {/* Animated line wrapper */}
                            <span className="block relative">

                                {/* Ghost (locks height, prevents layout shift) */}
                                <span
                                    aria-hidden="true"
                                    className="block invisible whitespace-nowrap"
                                >
                                    {longestPhrase}
                                </span>

                                {/* Animated text */}
                                <span
                                    className="absolute inset-0 flex items-center justify-center lg:justify-start w-full"
                                >
                                    <span
                                        className="inline-block whitespace-nowrap text-center lg:text-left"
                                        style={{
                                            background: "linear-gradient(135deg,#ffffff 0%,#38BDF8 55%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text",
                                        }}
                                    >
                                        {phraseText}
                                    </span>

                                    <span className="tw-cursor" />
                                </span>
                            </span>
                        </h1>


                        <p className="text-base leading-relaxed mb-10 font-light mx-auto lg:mx-0"
                            style={{ color: "#8BA3C4", maxWidth: "460px" }}>
                            Secure, scalable, and cost-efficient cloud infrastructure tailored for modern enterprises. Zero downtime. Maximum performance.
                        </p>

                        <div className="flex gap-3 justify-center lg:justify-start flex-wrap">
                            <button
                                className="px-7 py-3.5 rounded-lg text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
                                style={{ fontFamily: "Syne, sans-serif", background: "#0078D4" }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 14px 36px rgba(0,120,212,0.4)"}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                                onClick={() => setModalOpen(true)}
                            >
                                Get Free Consultation →
                            </button>
                            <button
                                className="px-7 py-3.5 rounded-lg text-sm font-medium text-slate-200 transition-all duration-300"
                                style={{ fontFamily: "Syne, sans-serif", background: "transparent", border: "1px solid rgba(0,120,212,0.22)" }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = "#0078D4"; e.currentTarget.style.background = "rgba(0,120,212,0.08)"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,120,212,0.22)"; e.currentTarget.style.background = "transparent"; }}
                            >
                                View Demo
                            </button>
                        </div>
                    </div>

                    {/* ── RIGHT — Dashboard ── */}
                    <div ref={dashRef} className="relative w-full lg:flex-shrink-0" style={{ maxWidth: "520px" }}>
                        <div className="rounded-2xl p-4 sm:p-6" style={{ background: "#0A1628", border: "1px solid rgba(0,120,212,0.18)" }}>

                            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                                <span className="text-xs font-semibold tracking-widest uppercase"
                                    style={{ color: "#8BA3C4", fontFamily: "Syne, sans-serif" }}>
                                    Infrastructure Overview
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-green-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    All systems operational
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-4">
                                {METRICS.map((m, i) => <MetricCard key={i} metric={m} triggered={triggered} />)}
                            </div>

                            <div className="rounded-lg p-3 sm:p-4 mb-3"
                                style={{ background: "#0D1F38", border: "1px solid rgba(56,189,248,0.12)" }}>
                                <div className="text-xs uppercase tracking-wider mb-4" style={{ color: "#8BA3C4" }}>
                                    Resource Usage — Last 7 Days
                                </div>
                                <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "80px", width: "100%" }}>
                                    {BARS.map((b, i) => <Bar key={i} targetH={b.h} color={b.color} delay={i * 90} triggered={triggered} />)}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                {REGIONS.map((r, i) => (
                                    <div key={i} className="flex items-center gap-3 text-xs">
                                        <span className="flex-shrink-0 w-28" style={{ color: "#8BA3C4" }}>{r.name}</span>
                                        <ProgressLine pct={r.pct} color={r.color} delay={500 + i * 150} triggered={triggered} />
                                        <span className="flex-shrink-0 w-8 text-right font-semibold text-white"
                                            style={{ fontFamily: "Syne, sans-serif" }}>
                                            {r.pct}%
                                        </span>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>

                </div>
            </section>
            <Form
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </>
    );
}