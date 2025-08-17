import { useState, useEffect, useRef } from "react";
import { motion as m, useReducedMotion } from "framer-motion";

import { navLinks } from "../constants";

// Typing logo with optional instant rendering (for roll-up duplicate)
const TypingLogo = ({ instant = false }) => {
  const name = "KUSH KUMAR";
  const [subIndex, setSubIndex] = useState(instant ? name.length : 0);
  const [cursorOn, setCursorOn] = useState(!instant);

  // Blink cursor only when not instant
  useEffect(() => {
    if (instant) return;
    const blink = setInterval(() => setCursorOn((v) => !v), 500);
    return () => clearInterval(blink);
  }, [instant]);

  // Typing progression only when not instant
  useEffect(() => {
    if (instant) return;
    if (subIndex < name.length) {
      const t = setTimeout(() => setSubIndex((s) => s + 1), 90);
      return () => clearTimeout(t);
    }
  }, [instant, subIndex, name.length]);

  return (
    <span className="inline-flex items-center gap-1 font-semibold tracking-wide">
      <span>{name.substring(0, subIndex)}</span>
      <span aria-hidden className="text-white/80" style={{ opacity: cursorOn ? 1 : 0 }}>
        |
      </span>
    </span>
  );
};

const NavBar = () => {
  // track if the user has scrolled down the page
  const [scrolled, setScrolled] = useState(false);
  // mobile menu open/close
  const [mobileOpen, setMobileOpen] = useState(false);
  // active section id for scrollspy
  const [activeId, setActiveId] = useState("");
  const reduceMotion = useReducedMotion();
  // auto-hide on scroll down
  const [hideNav, setHideNav] = useState(false);
  const lastYRef = useRef(0);
  const mobileOpenRef = useRef(false);
  const MotionA = m.a;

  useEffect(() => {
    // create an event listener for when the user scrolls
    const handleScroll = () => {
      // check if the user has scrolled down at least 10px
      // if so, set the state to true
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);

      // auto-hide on scroll down, show on scroll up
      const y = window.scrollY;
      const goingDown = y > lastYRef.current;
      setHideNav(goingDown && y > 80 && !mobileOpenRef.current);
      lastYRef.current = y;
    };

    // add the event listener to the window
    window.addEventListener("scroll", handleScroll, { passive: true });

    // cleanup the event listener when the component is unmounted
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scrollspy: highlight active link based on section visibility
  useEffect(() => {
    const ids = navLinks
      .map((n) => (n.link || "").startsWith("#") ? (n.link || "").slice(1) : null)
      .filter(Boolean);
    if (ids.length === 0) return;

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the most visible entry
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          setActiveId(visible.target.id);
        }
      },
      {
        root: null,
        // activate when 50% of the section is in view, with top offset
        threshold: [0.25, 0.5, 0.75],
        rootMargin: "-20% 0px -40% 0px",
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile menu is open and close with Escape
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prev || "";
    }

    const onKey = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  // keep a ref in sync for scroll handler without adding deps
  useEffect(() => {
    mobileOpenRef.current = mobileOpen;
  }, [mobileOpen]);

  // Smooth scroll with offset so content isn't hidden behind navbar
  const handleAnchorClick = (e, link) => {
    if (!link || !link.startsWith("#")) return;
    e.preventDefault();
    const id = link.slice(1);
    const el = document.getElementById(id);
    if (!el) return;

    const header = document.querySelector("header.navbar");
    const offset = header ? header.offsetHeight : 0;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetY = rect.top + scrollTop - Math.max(8, offset + 8); // small gap

    window.scrollTo({ top: targetY, behavior: reduceMotion ? "auto" : "smooth" });
    setActiveId(id);
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <header
      className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}
      style={{ transform: hideNav ? "translateY(-100%)" : "translateY(0)", transition: "transform 300ms ease" }}
    >
      {/* Local styles for glass-friendly shimmer + roll-up effect */}
      <style>{`
        /* Glass-friendly shimmer: keep text color, sweep a translucent gloss overlay */
        .shimmer-wrap { position: relative; display: inline-block; }
        .shimmer-wrap::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%);
          transform: translateX(-150%);
          opacity: 0;
          pointer-events: none;
          mix-blend-mode: screen;
          filter: blur(0.5px);
        }
        .logo:hover .shimmer-wrap::after { opacity: 1; animation: gloss-move 1.4s linear; }
        @keyframes gloss-move { to { transform: translateX(150%); } }
        /* Roll-up effect */
        .rollup { display: inline-block; height: 1em; overflow: hidden; line-height: 1; }
        .rollup-inner { display: block; transform: translateY(0%); transition: transform 350ms ease; }
        .rollup-line { display: block; }
        .logo:hover .rollup-inner { transform: translateY(-100%); }
      `}</style>
      <div className="inner">
        <a href="#hero" className="logo group relative inline-block">
          <span className="rollup">
            <span className="rollup-inner">
              <span className="rollup-line shimmer-wrap"><TypingLogo /></span>
              <span className="rollup-line shimmer-wrap"><TypingLogo instant /></span>
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="desktop">
          <ul>
            {navLinks.map(({ link, name }) => {
              const id = (link || "").startsWith("#") ? (link || "").slice(1) : "";
              const isActive = id && id === activeId;
              return (
                <li key={name} className="group">
                  <a href={link} onClick={(e) => handleAnchorClick(e, link)} aria-current={isActive ? "page" : undefined}>
                    <span className={isActive ? "text-white" : undefined}>{name}</span>
                    <span className={`underline ${isActive ? "opacity-100 scale-x-100" : ""}`} />
                  </a>
                </li>
              );
            })}
          </ul>
          <MotionA
            href="#contact"
            className="contact-btn p-3 group"
            whileHover={reduceMotion ? undefined : { scale: 1.03 }}
            whileTap={reduceMotion ? undefined : { scale: 0.94 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
          >
            <div className="inner">
              <span>Contact me</span>
            </div>
          </MotionA>
        </nav>

        {/* Mobile actions */}
        <div className="lg:hidden flex items-center">
          <button
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="size-10 flex items-center justify-center rounded-lg border border-white/20 bg-white/10 backdrop-blur-md active:scale-95"
          >
            <span className="sr-only">Menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile grid menu */}
      {mobileOpen && (
        <div className="lg:hidden w-full px-5 md:px-20">
          <div className="mt-3 rounded-2xl border border-white/15 bg-black/30 backdrop-blur-xl shadow-lg shadow-black/30 overflow-hidden">
            <nav className="p-4 grid grid-cols-1 gap-3">
              {navLinks.map(({ link, name }) => {
                const id = (link || "").startsWith("#") ? (link || "").slice(1) : "";
                const isActive = id && id === activeId;
                return (
                  <a
                    key={name}
                    href={link}
                    onClick={(e) => handleAnchorClick(e, link)}
                    aria-current={isActive ? "page" : undefined}
                    className={`w-full rounded-xl border border-white/10 transition-colors py-3 px-4 text-sm font-medium ${
                      isActive ? "bg-white text-black" : "bg-white/5 hover:bg-white/10 text-white-50"
                    }`}
                  >
                    {name}
                  </a>
                );
              })}
              <MotionA
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="w-full rounded-xl border border-white/10 bg-white text-black text-center py-3 px-4 font-semibold"
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                Contact me
              </MotionA>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default NavBar;
