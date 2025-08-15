import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ThreeImageCard = ({ src, size = 400, mobileSize = 250 }) => {
  const [effectiveSize, setEffectiveSize] = useState(size);

  useEffect(() => {
    const updateSize = () => {
      const isMobile = window.matchMedia("(max-width: 640px)").matches;
      setEffectiveSize(isMobile ? mobileSize : size);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [size, mobileSize]);

  return (
    <motion.div
      whileHover={{ rotateY: 10, rotateX: 5, scale: 1.05 }}
      className="relative mx-auto  p-4 rounded-full overflow-hidden"
      style={{ width: effectiveSize, height: effectiveSize }}
    >
      {/* Glowing animated border */}
      <div className="absolute inset-0 rounded-full border-2 border-white/20 shadow-[0_0_30px_#0ff] animate-pulse" />

      {/* Inner blurred glow */}
      <div className="absolute inset-0 rounded-full bg-white/10 blur-sm" />

      {/* Profile image */}
      <img
        src={src}
        alt="Profile"
        className="relative w-full h-full rounded-full object-cover border-[3px] border-white/30"
      />

      {/* Optional: subtle floating overlay effect */}
      <motion.div
        className="absolute inset-0 rounded-full border-[1px] border-white/10 pointer-events-none"
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
      />
    </motion.div>
  );
};

export default ThreeImageCard;
