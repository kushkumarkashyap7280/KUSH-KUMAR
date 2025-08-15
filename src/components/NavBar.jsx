import { useState, useEffect } from "react";

import { navLinks } from "../constants";

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
      <div className="inner">
        <a href="#hero" className="logo">
          KUSH KUMAR
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
          <a href="#contact" className="contact-btn p-3 group">
            <div className="inner">
              <span>Contact me</span>
            </div>
          </a>
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
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="w-full rounded-xl border border-white/10 bg-white text-black text-center py-3 px-4 font-semibold"
              >
                Contact me
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default NavBar;
