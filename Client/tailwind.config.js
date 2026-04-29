/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // ── COLORS ──────────────────────────────────────────────────────────────
      // Usage:  bg-az        text-az-light      border-az-glow
      colors: {
        az: {
          DEFAULT: "#0078D4",   // bg-az
          2:       "#1a8fe8",   // bg-az-2  (hover shade)
          light:   "#38BDF8",   // bg-az-light  (accent / sky)
          glow:    "rgba(0,120,212,0.25)",  // bg-az-glow
        },
        navy: {
          DEFAULT: "#020B18",   // bg-navy  (deepest bg)
          2:       "#060F1E",   // bg-navy-2
        },
        card: {
          DEFAULT: "#0A1628",   // bg-card
          2:       "#0D1F38",   // bg-card-2
        },
        border: {
          DEFAULT: "rgba(0,120,212,0.18)",   // border-border
          2:       "rgba(56,189,248,0.12)",  // border-border-2
        },
        // Text shades
        brand: {
          text:    "#E2E8F0",   // text-brand-text
          muted:   "#8BA3C4",   // text-brand-muted
          accent:  "#38BDF8",   // text-brand-accent  (same as az-light)
        },
      },

      // ── FONTS ───────────────────────────────────────────────────────────────
      // Usage:  font-display    font-body
      fontFamily: {
        display: ["Syne", "sans-serif"],   // font-display  →  headings, labels, numbers
        body:    ["DM Sans", "sans-serif"],// font-body     →  body text, paragraphs
      },

      // ── BACKGROUND IMAGES (gradients as utilities) ───────────────────────
      // Usage:  bg-hero-gradient    bg-glow-right
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg,#ffffff 0%,#38BDF8 55%)",
        "glow-right":
          "radial-gradient(ellipse,rgba(0,120,212,0.14) 0%,transparent 70%)",
        "glow-left":
          "radial-gradient(ellipse,rgba(56,189,248,0.06) 0%,transparent 70%)",
        "grid-overlay":
          "linear-gradient(rgba(0,120,212,0.05) 1px,transparent 1px)," +
          "linear-gradient(90deg,rgba(0,120,212,0.05) 1px,transparent 1px)",
        "cap-card-left":
          "linear-gradient(135deg,rgba(0,120,212,0.06) 0%,rgba(56,189,248,0.04) 100%)",
      },

      // ── BOX SHADOWS ──────────────────────────────────────────────────────
      // Usage:  shadow-az     shadow-az-lg
      boxShadow: {
        az:    "0 6px 20px rgba(0,120,212,0.25)",
        "az-lg": "0 14px 36px rgba(0,120,212,0.4)",
      },

      // ── BORDER RADIUS ────────────────────────────────────────────────────
      borderRadius: {
        "2xl": "16px",   // already in Tailwind, shown for reference
        "3xl": "20px",
      },

    },
  },
  plugins: [],
};


// ─────────────────────────────────────────────────────────────────────────────
// USAGE EXAMPLES AFTER CONFIG
//
//   <h1 className="font-display font-black text-white">Scale Smarter</h1>
//   <p  className="font-body font-light text-brand-muted">Description...</p>
//
//   <div className="bg-navy text-brand-text border border-border rounded-2xl">
//     <div className="bg-card-2 border border-border-2">...</div>
//   </div>
//
//   <button className="bg-az hover:bg-az-2 shadow-az text-white font-display">
//     Get Started
//   </button>
//
//   <span className="text-brand-accent">Azure Cloud</span>  ← sky blue
//
//   <div className="bg-grid-overlay bg-[size:60px_60px]" />   ← grid bg
// ─────────────────────────────────────────────────────────────────────────────
      
