import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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

  useEffect(() => {
    // create an event listener for when the user scrolls
    const handleScroll = () => {
      // check if the user has scrolled down at least 10px
      // if so, set the state to true
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    // add the event listener to the window
    window.addEventListener("scroll", handleScroll);

    // cleanup the event listener when the component is unmounted
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
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
            {navLinks.map(({ link, name }) => (
              <li key={name} className="group">
                <a href={link}>
                  <span>{name}</span>
                  <span className="underline" />
                </a>
              </li>
            ))}
          </ul>
          <motion.a
            href="#contact"
            className="contact-btn p-3 group"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
          >
            <div className="inner">
              <span>Contact me</span>
            </div>
          </motion.a>
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
              {navLinks.map(({ link, name }) => (
                <a
                  key={name}
                  href={link}
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors py-3 px-4 text-white-50 text-sm font-medium"
                >
                  {name}
                </a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="w-full rounded-xl border border-white/10 bg-white text-black text-center py-3 px-4 font-semibold"
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                Contact me
              </motion.a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default NavBar;
