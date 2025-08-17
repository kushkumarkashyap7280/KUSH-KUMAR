import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FiUser, FiBriefcase, FiLayers, FiFileText, FiMail } from "react-icons/fi";

const adminLinks = [
  { name: "Profile", href: "#profile", color: "#6366f1", Icon: FiUser },
  { name: "Experiences", href: "#experiences", color: "#22d3ee", Icon: FiBriefcase },
  { name: "Projects", href: "#projects", color: "#34d399", Icon: FiLayers },
  { name: "Posts", href: "#posts", color: "#f59e0b", Icon: FiFileText },
  { name: "Contacts", href: "#contacts", color: "#f43f5e", Icon: FiMail },
];

export default function AdminFooter() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-2 md:bottom-4 z-50 flex justify-center pb-[env(safe-area-inset-bottom)]">
      <div
        className="pointer-events-auto flex items-center gap-1 sm:gap-2 rounded-full border border-white/10 bg-slate-900/80 px-1 py-0.5 shadow-2xl backdrop-blur sm:px-3 sm:py-2 max-w-[92vw] overflow-x-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {adminLinks.map((s, idx) => (
          <div key={idx} className="relative">
            <Motion.a
              href={s.href}
              title={s.name}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              whileHover={{
                scale: 1.08,
                backgroundColor: s.color,
                boxShadow: `0 0 0 2px rgba(255,255,255,0.15), 0 8px 22px ${s.color}55, 0 0 22px ${s.color}66`,
              }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex h-7 px-3 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-colors sm:h-10 sm:px-4 text-xs sm:text-sm"
              style={{ color: "#ffffff" }}
            >
              <Motion.span
                initial={false}
                animate={{ scale: hovered === idx ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
              >
                {s.Icon && <s.Icon className="text-[12px] sm:text-sm" />}
                <span>{s.name}</span>
              </Motion.span>
            </Motion.a>
            <AnimatePresence>
              {hovered === idx && (
                <Motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 350, damping: 24, mass: 0.4 }}
                  className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-[11px] text-white shadow-lg backdrop-blur-sm hidden sm:block"
                >
                  {s.name}
                </Motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
