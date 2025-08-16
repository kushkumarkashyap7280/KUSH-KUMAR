import { useEffect, useMemo, useState } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [visible, setVisible] = useState(false);

  const isTouchDevice = useMemo(() =>
    typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0),
  []);

  useEffect(() => {
    if (isTouchDevice) return; // skip on touch devices

    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };
    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    // Hide native cursor globally
    const prevHtmlCursor = document.documentElement.style.cursor;
    const prevBodyCursor = document.body.style.cursor;
    document.documentElement.style.cursor = 'none';
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      document.documentElement.style.cursor = prevHtmlCursor;
      document.body.style.cursor = prevBodyCursor;
    };
  }, [visible, isTouchDevice]);

  if (isTouchDevice) return null;

  // Brand-ish colors (red head like Hero section)
  const headColor = 'rgba(239,68,68,0.9)'; // red-500
  const tailColor = 'rgba(239,68,68,0.25)';

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[10000]"
      style={{ contain: 'layout style paint' }}
    >
      <div
        className="-translate-x-1/2 -translate-y-1/2 will-change-transform transition-opacity duration-150"
        style={{
          position: 'absolute',
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          opacity: visible ? 1 : 0,
        }}
      >
        {/* Outer soft glow */}
        <div
          className="rounded-full blur-md"
          style={{
            width: 36,
            height: 36,
            background: `radial-gradient(circle, rgba(255,255,255,0.6) 0%, ${headColor} 40%, ${tailColor} 85%, rgba(255,255,255,0) 100%)`,
            boxShadow: `0 0 28px ${headColor}`,
            mixBlendMode: 'screen',
          }}
        />
        {/* Inner ring */}
        <div
          className="rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 14,
            height: 14,
            border: '2px solid rgba(255,255,255,0.9)',
            boxShadow: `0 0 14px rgba(255,255,255,0.6)`,
          }}
        />
      </div>
    </div>
  );
}
