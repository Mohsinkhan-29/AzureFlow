import { useState, useEffect } from "react";
import Azure from "../../assets/Azure-A.png"
import Form from "../Form/Form";

const NAV_LINKS = [
  { label: "Home", href: "#Home" },
  { label: "Services", href: "#Services" },
  { label: "Process", href: "#process" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Clients", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];





export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Darken background on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight active section via IntersectionObserver
  useEffect(() => {
    const sections = NAV_LINKS.map(l => document.querySelector(l.href)).filter(Boolean);
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveLink("#" + e.target.id);
        });
      },
      { threshold: 0.35 }
    );
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);



  const handleNav = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: "smooth" });
  };


  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[201] flex md:flex-col md:gap-2 lg:flex-row items-center justify-between 
              py-2 px-14 md:py-4 md:px-20 
              transition-all duration-300 backdrop-blur-xl border-b border-[rgba(0,120,212,0.18)]
              ${scrolled
          ? "bg-[rgba(2,11,24,0.97)]"
          : "bg-[rgba(2,11,24,0.9)]"
        }`}
      >
        {/* ── Logo ── */}
        <a
          href="#"
          className="flex items-center gap-2.5 no-underline"
          style={{ textDecoration: "none" }}
        >
          <div className="grid place-items-center flex-shrink-0 transition-transform duration-300 hover:scale-105 w-[40px] h-[40px] md:w-[60px] md:h-[60px] rounded-[8px] bg-[#0078D4]">

            <div>
              <img src={Azure} alt="Azure" className="w-[30px] h-[30px] md:w-[40px] md:h-[40px]" />
            </div>
          </div>
          <span
            className="text-lg md:text-3xl font-black text-white text-wrap"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Azure Services
          </span>
        </a>

        {/* ── Desktop nav links ── */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0 ">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = activeLink === href;
            return (
              <li key={label}>
                <button
                  onClick={() => handleNav(href)}
                  className="relative text-sm transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    color: isActive ? "#fff" : "#8BA3C4",
                    outline: "none",
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "#8BA3C4"; }}
                >
                  {label}
                  {/* Active underline dot */}
                  {isActive && (
                    <span
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full"
                      style={{ width: "4px", height: "4px", background: "#0078D4" }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* ── CTA buttons ── */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* <button
            className="text-sm transition-all duration-200 cursor-pointer"
            style={{
              padding: "8px 18px",
              background: "transparent",
              border: "1px solid rgba(0,120,212,0.22)",
              borderRadius: "7px",
              color: "#8BA3C4",
              fontFamily: "DM Sans, sans-serif",
              cursor: "pointer",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "#0078D4";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "rgba(0,120,212,0.22)";
              e.currentTarget.style.color = "#8BA3C4";
            }}
          >
            Sign In
          </button> */}

          <button
            className="text-sm font-semibold text-white transition-all duration-200 cursor-pointer"
            style={{
              padding: "8px 18px",
              background: "#0078D4",
              border: "none",
              borderRadius: "7px",
              fontFamily: "Syne, sans-serif",
              cursor: "pointer",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#1a8fe8";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,120,212,0.35)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#0078D4";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
            onClick={() => setModalOpen(true)}
          >
            Get Started →
          </button>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="flex md:hidden flex-col justify-center items-center gap-1.5 cursor-pointer bg-transparent border-none p-2"
          onClick={() => setMenuOpen(o => !o)}
          style={{ outline: "none" }}
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="block rounded-full transition-all duration-300"
              style={{
                width: "22px",
                height: "2px",
                background: "#8BA3C4",
                transform:
                  menuOpen && i === 0 ? "translateY(7px) rotate(45deg)" :
                    menuOpen && i === 2 ? "translateY(-7px) rotate(-45deg)" :
                      menuOpen && i === 1 ? "scaleX(0)" : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </nav>

      {/* ── Mobile menu drawer ── */}
      <div
        className="fixed top-0 left-0 right-0 bottom-0 z-[200] md:hidden flex flex-col pt-24 px-8 pb-8"
        style={{
          background: "rgba(2,11,24,0.98)",
          backdropFilter: "blur(20px)",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          borderTop: "1px solid rgba(0,120,212,0.14)",
        }}
      >
        <ul className="list-none m-0 p-0 flex flex-col gap-1 mb-8">
          {NAV_LINKS.map(({ label, href }, i) => (
            <li key={label}>
              <button
                onClick={() => handleNav(href)}
                className="w-full text-left text-base font-semibold py-3.5 px-4 rounded-lg transition-all duration-200 cursor-pointer bg-transparent border-none"
                style={{
                  fontFamily: "Syne, sans-serif",
                  color: activeLink === href ? "#fff" : "#8BA3C4",
                  background: activeLink === href ? "rgba(0,120,212,0.1)" : "transparent",
                  borderLeft: activeLink === href ? "2px solid #0078D4" : "2px solid transparent",
                  transitionDelay: menuOpen ? `${i * 100}ms` : "0ms",
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "translateX(0)" : "translateX(20px)",
                  transition: `all 0.3s ease ${i * 40}ms`,
                  outline: "none",
                }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 mt-auto">
          {/* <button
            className="w-full py-3 text-sm font-medium rounded-lg transition-all duration-200"
            style={{
              background: "transparent",
              border: "1px solid rgba(0,120,212,0.25)",
              color: "#8BA3C4",
              fontFamily: "DM Sans, sans-serif",
              cursor: "pointer",
            }}
          >
            Sign In
          </button> */}
          <button
            className="w-full py-3 text-sm font-semibold text-white rounded-lg"
            style={{
              background: "#0078D4",
              border: "none",
              fontFamily: "Syne, sans-serif",
              cursor: "pointer",
            }}
            onClick={() => setModalOpen(true)}
          >
            Get Started →
          </button>
        </div>
      </div>
      <Form
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

    </>
  );
}