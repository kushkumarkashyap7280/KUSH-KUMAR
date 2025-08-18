import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FaMapMarkerAlt, FaBuilding, FaBriefcase } from "react-icons/fa";
import TitleHeader from "../components/TitleHeader";
import { getPublicExperiences } from "../apis/experiences";
import { toExpCardsFromApiResponse } from "../utils/experience";
import "./qualifications.css";

const Experience = () => {
  // State must be declared before hooks that depend on it
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Framer Motion handles entry animations

  // Fetch experiences from API and map to expCards shape

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getPublicExperiences();
        const cards = toExpCardsFromApiResponse(res);
        if (mounted) setItems(cards);
      } catch (err) {
        if (import.meta.env.DEV) console.error("[Experience] getPublicExperiences failed", err);
        if (mounted) setError("Failed to load experiences.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const list = useMemo(() => items, [items]);

  // No ScrollTrigger; using viewport on motion instead

  // Hide the section entirely if there are no published experiences
  if (!loading && !error && list.length === 0) {
    return null;
  }

  return (
    <section
      id="experience"
      className="flex-center md:mt-40 mt-20 section-padding xl:px-0"
    >
      <div className="w-full h-full md:px-20 px-5">
        <TitleHeader
          title="Professional Work Experience"
          sub="💼 My Career Overview"
        />
        <div className="mt-32 relative">
          {/* Leftmost rainbow line and padded content */}
          <div className="pointer-events-none absolute left-4 md:left-6 top-0 bottom-0 w-[3px] md:w-1 bg-gradient-to-b from-fuchsia-400 via-cyan-400 to-purple-500 opacity-80 rounded-full z-0" />
          <div className="relative z-10 space-y-10 xl:space-y-14 overflow-visible pl-12 md:pl-16">
            {(loading ? [] : list).map((card, idx) => (
              <motion.div
                key={card.title}
                className="timeline-card relative bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-5 md:p-6 glow-card"
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.div
                  className="flex flex-col md:flex-row items-center md:items-start md:text-left gap-5 md:gap-8 w-full overflow-visible"
                  animate={{ y: [0, -4, 0, 4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Avatar / logo with glow and rung */}
                  <div className="relative flex-none self-center md:self-start z-10">
                    <span className="pointer-events-none absolute top-1/2 -translate-y-1/2 h-[2px] w-8 md:w-14 bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-purple-500 right-full -translate-x-1 md:-translate-x-2 opacity-90 rounded-full z-0" />
                    <div className="glow-ring rounded-full p-0.5">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border border-white/30 bg-black/20 flex items-center justify-center">
                        {card.logoPath ? (
                          <img src={card.logoPath} alt={card.title || "Experience"} className="w-[90%] h-[90%] object-contain" />
                        ) : (
                          <FaBriefcase className="text-white/80 text-xl md:text-2xl" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="expText flex-1 w-full py-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="font-semibold text-xl md:text-2xl">{card.title}</h1>
                      {card.current && (
                        <span className="inline-flex items-center rounded-full border border-green-400/30 bg-green-400/10 px-2 py-0.5 text-[11px] uppercase tracking-wide text-green-300">
                          Current
                        </span>
                      )}
                    </div>
                    {(card.company || card.location) && (
                      <p className="mt-2 text-white/70 flex items-center gap-4 text-xs md:text-sm flex-wrap">
                        {card.company && (
                          <span className="inline-flex items-center gap-2">
                            <FaBuilding className="opacity-80" /> {card.company}
                          </span>
                        )}
                        {card.location && (
                          <span className="inline-flex items-center gap-2">
                            <FaMapMarkerAlt className="opacity-80" /> {card.location}
                          </span>
                        )}
                      </p>
                    )}
                    <p className="my-3 md:my-4 text-white/70 text-xs md:text-sm">🗓️ {card.date}</p>
                    {Array.isArray(card.tags) && card.tags.length > 0 && (
                      <div className="mt-1 mb-3 flex flex-wrap gap-2">
                        {card.tags.map((tag, i) => (
                          <span key={`${tag}-${i}`} className="text-xs px-2 py-0.5 rounded-full border border-white/15 bg-gradient-to-r from-white/5 to-transparent text-white/80">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-[#839CB5] italic">Responsibilities</p>
                    <ul className="list-disc ms-5 mt-3 md:mt-4 flex flex-col gap-2 md:gap-3 text-white/70">
                      {card.responsibilities.map((responsibility, index) => (
                        <li key={index} className="text-sm md:text-base">
                          {responsibility}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            ))}
            {!loading && list.length === 0 && !error && (
              <p className="text-white-50">No published experiences yet.</p>
            )}
            {error && (
              <p className="text-red-400">{error}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
