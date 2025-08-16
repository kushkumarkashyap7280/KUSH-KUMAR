import { abilities } from "../constants";
import * as FM from "framer-motion";

const FeatureCards = () => (
  <div className="w-full padding-x-lg">
    <div className="mx-auto grid-3-cols">
      {abilities.map(({ Icon, color, title, desc }) => (
        <FM.motion.div
          key={title}
          className="card-border rounded-xl p-8 flex flex-col gap-4"
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <FM.motion.div
            className="size-14 flex items-center justify-center rounded-xl bg-white/5"
            style={{ boxShadow: `0 8px 22px ${color}55`, border: `1px solid ${color}55` }}
            whileHover={{ rotate: 6, scale: 1.05 }}
          >
            {Icon ? <Icon size={28} color={color} /> : null}
          </FM.motion.div>
          <h3 className="text-white text-2xl font-semibold mt-2">{title}</h3>
          <p className="text-white-50 text-lg">{desc}</p>
        </FM.motion.div>
      ))}
    </div>
  </div>
);

export default FeatureCards;