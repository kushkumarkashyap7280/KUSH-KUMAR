import { logoIconsList } from "../constants";
import * as FM from "framer-motion";

const LogoIcon = ({ icon }) => {
  const { Icon, color, name } = icon;
  if (!Icon) return null;
  const glow = `${color}55`; // soft glow with alpha
  return (
    <FM.motion.div
      className="flex-none flex-center marquee-item cursor-pointer"
      whileHover={{ scale: 1.15, rotate: 4 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      style={{ filter: `drop-shadow(0 6px 14px ${glow})` }}
    >
      <Icon title={name} color={color} size={44} />
    </FM.motion.div>
  );
};

const LogoShowcase = () => (
  <div className="md:my-20 my-10 relative">
    <div className="gradient-edge" />
    <div className="gradient-edge" />

    <div className="marquee h-52">
      <div className="marquee-box md:gap-12 gap-5">
        {logoIconsList.map((icon, index) => (
          <LogoIcon key={index} icon={icon} />
        ))}

        {logoIconsList.map((icon, index) => (
          <LogoIcon key={index} icon={icon} />
        ))}
      </div>
    </div>
  </div>
);

export default LogoShowcase;
