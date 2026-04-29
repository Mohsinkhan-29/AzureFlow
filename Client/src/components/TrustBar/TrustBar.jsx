import React from "react";

const BRANDS = [
  "Ic Consultancy",
  "Accenture",
  "Deloitte",
  "Infosys",
  "NovaTech",
  "PwC Digital",
  "CapGemini",
  "Wipro Cloud",
  "HCL Technologies",
  "Tata Consultancy",
];

// Duplicate for seamless infinite loop
const TRACK = [...BRANDS, ...BRANDS];

export default function TrustBar() {
  return (
    <div
      className="relative w-full overflow-hidden flex flex-col sm:flex-row items-start sm:items-center py-7 px-6 sm:px-16 gap-4 sm:gap-0"
      style={{
        background: "#020B18",
        borderTop: "1px solid rgba(0,120,212,0.12)",
        borderBottom: "1px solid rgba(0,120,212,0.12)",
      }}
    >
      {/* FIXED LEFT LABEL */}
      <div className="relative z-20 flex items-center bg-[#020B18] w-full sm:w-auto justify-start px-0 sm:px-6">
        <span
          className="text-xs font-semibold tracking-widest uppercase whitespace-nowrap"
          style={{
            color: "#8BA3C4",
            fontFamily: "Syne, sans-serif",
          }}
        >
          Trusted By
        </span>

        <div
          className="w-px h-4 mx-4"
          style={{ background: "rgba(0,120,212,0.25)" }}
        />
      </div>

      {/* SCROLL AREA */}
      <div className="relative flex-1 w-full overflow-hidden">

        {/* LEFT FADE */}
        <div
          className="absolute left-0 top-0 bottom-0 z-10 w-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(2,11,24,1) 0%, rgba(2,11,24,0) 100%)",
          }}
        />

        {/* RIGHT FADE */}
        <div
          className="absolute right-0 top-0 bottom-0 z-10 w-40 pointer-events-none"
          style={{
            background:
              "linear-gradient(-90deg, rgba(2,11,24,1) 0%, rgba(2,11,24,0) 100%)",
          }}
        />

        {/* MARQUEE TRACK */}
        <div
          className="flex items-center gap-11 w-max"
          style={{
            animation: "marquee 28s linear infinite",
          }}
        >
          {TRACK.map((brand, i) => (
            <span
              key={i}
              className="text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-colors duration-300 cursor-default"
              style={{
                fontFamily: "Syne, sans-serif",
                color: "rgba(139,163,196,0.45)",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "rgba(56,189,248,0.85)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(139,163,196,0.45)")
              }
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* ANIMATION */}
      <style>{`
    @keyframes marquee {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
  `}</style>
    </div>

  );
}