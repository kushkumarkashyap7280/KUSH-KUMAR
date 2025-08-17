import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useLoader } from "../context";

/**
 * Loader overlay tied to LoaderContext, using animated icons.
 * Drop <LoaderOverlay/> once near the root and control with useLoader().start()/stop().
 */
export default function LoaderOverlay({ message = "Loading..." }) {
  const { loading } = useLoader();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  if (!loading) return null;

  return createPortal(
    <div className="loader-overlay" role="status" aria-live="polite" aria-busy={loading}>
      <div className="loader-card">
        <div className="dots" aria-hidden>
          <span className="dot d1"/>
          <span className="dot d2"/>
          <span className="dot d3"/>
          <span className="dot d4"/>
        </div>
        <div className="label">{message}</div>
      </div>
      <style>{`
        .loader-overlay {
          position: fixed; inset: 0; z-index: 9999;
          display: grid; place-items: center;
          background: transparent; /* glass: transparent layer */
          backdrop-filter: blur(10px) saturate(140%);
          -webkit-backdrop-filter: blur(10px) saturate(140%);
        }
        .loader-card {
          background: transparent; /* no card background */
          border: none; /* no boundary */
          border-radius: 0;
          padding: 0;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          box-shadow: none;
        }
        .dots { display: flex; align-items: center; gap: 10px; height: 22px; }
        .dot {
          width: 8px; height: 8px; border-radius: 999px;
          background: var(--accent, #6c6cff);
          transform-origin: 50% 50%;
          animation: bounce 1.1s ease-in-out infinite;
          filter: drop-shadow(0 2px 6px rgba(108,108,255,0.45));
        }
        .d1 { animation-delay: 0s; }
        .d2 { animation-delay: .12s; }
        .d3 { animation-delay: .24s; }
        .d4 { animation-delay: .36s; }
        .label { color: var(--text, #e6e6f0); font-size: 14px; opacity: 0.9; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: .9; }
          50% { transform: translateY(-10px); opacity: 1; }
        }
        @media (max-width: 480px) {
          .loader-card { padding: 18px; border-radius: 14px; }
        }
      `}</style>
    </div>,
    document.body
  );
}
