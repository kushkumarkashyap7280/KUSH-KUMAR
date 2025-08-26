import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FaGraduationCap, FaLink } from "react-icons/fa";
import TitleHeader from "../components/TitleHeader";
import { getAdminStatus } from "../apis/admin";
import "./qualifications.css";

function formatDate(d) {
  try {
    if (!d) return "Present";
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return String(d);
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short" });
  } catch {
    return String(d);
  }
}

const Qualifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // no GSAP; framer-motion handles entry animations

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getAdminStatus();
        console.log("Full API response:", res?.data);
        const q = res?.data?.data?.admin?.qualification || [];
        console.log("Qualifications from API:", q);

        // Filter for published qualifications only (double check server filtering)
        const publishedOnly = q.filter(it => it && it.isPublished !== false);
        console.log("Published qualifications:", publishedOnly);

        const mapped = publishedOnly.map((it, i) => ({
          id: `${it.title || 'untitled'}-${i}`,
          title: it.title || '',
          desc: it.desc || '',
          instituteLink: it.instituteLink || '',
          mediaUrl: it.mediaUrl || '',
          mediaType: it.mediaType || '',
          skills: Array.isArray(it.skills) ? it.skills : [],
          from: formatDate(it.from),
          to: formatDate(it.to),
          isPublished: it.isPublished,
        }));
        console.log("Mapped qualifications:", mapped);
        if (mounted) setItems(mapped);
      } catch (err) {
        console.error("Error loading qualifications:", err);
        if (mounted) setError("Failed to load qualifications: " + (err?.message || err));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);


  const list = useMemo(() => items.sort((a, b) => b.id.localeCompare(a.id)), [items]);

  return (
    <section id="qualifications" className="flex-center md:mt-40 mt-20 section-padding xl:px-0">
      <div className="w-full h-full md:px-20 px-5">
        <TitleHeader
          title="Qualifications & Education"
          sub="🎓 My Learning Roadmap"
        />
        <div className="mt-32 relative">
          {/* Rainbow path line fixed at far left, behind content (leftmost) */}
          <div className="pointer-events-none absolute left-4 md:left-6 top-0 bottom-0 w-[3px] md:w-1 bg-gradient-to-b from-fuchsia-400 via-cyan-400 to-purple-500 opacity-80 rounded-full z-0" />
          <div className="relative z-10 space-y-6 md:space-y-8 overflow-visible pl-12 md:pl-16">
            {(loading ? [] : list).map((card, idx) => (
              <motion.div
                key={card.id}
                className="timeline-card relative flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-4 md:gap-6 bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 glow-card"
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.div
                  className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-4 md:gap-6 w-full overflow-visible"
                  animate={{ y: [0, -4, 0, 4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {card.mediaUrl ? (
                    <div className="relative flex-none self-center md:self-start z-10">
                      {/* Horizontal rung connecting to the vertical rainbow line (stops before avatar) */}
                      <span className="pointer-events-none absolute top-1/2 -translate-y-1/2 h-[2px] w-8 md:w-14 bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-purple-500 right-full -translate-x-1 md:-translate-x-2 opacity-90 rounded-full z-0" />
                      <div className="glow-ring rounded-full p-0.5 z-20">
                        <img
                          src={card.mediaUrl}
                          alt={card.title}
                          className="flex-none shrink-0 self-center md:self-start w-16 h-16 md:w-20 md:h-20 object-cover border border-white/30 rounded-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex-none self-center md:self-start z-10">
                      {/* Horizontal rung connecting to the vertical rainbow line (stops before avatar) */}
                      <span className="pointer-events-none absolute top-1/2 -translate-y-1/2 h-[2px] w-8 md:w-14 bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-purple-500 right-full -translate-x-1 md:-translate-x-2 opacity-90 rounded-full z-0" />
                      <div className="glow-ring rounded-full p-0.5 z-20">
                        <div
                          className="flex-none shrink-0 self-center md:self-start w-16 h-16 md:w-20 md:h-20 border border-white/30 rounded-full overflow-hidden flex items-center justify-center"
                        >
                          <FaGraduationCap className="text-white/80 text-xl md:text-2xl" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="expText flex-1 w-full py-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="font-semibold text-lg md:text-2xl">{card.title}</h1>
                      {idx === 0 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-500/20 border border-green-400/30 text-green-300 font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    {(card.from || card.to) && (
                      <p className="my-2 text-white/70 text-xs md:text-sm">
                        🗓️ {card.from} - {card.to}
                      </p>
                    )}
                    {card.desc && (
                      <p className="text-white/70 text-xs md:text-sm mb-3 max-h-16 overflow-hidden md:max-h-none">{card.desc}</p>
                    )}
                    {Array.isArray(card.skills) && card.skills.length > 0 && (
                      <div className="mt-1 mb-3 flex flex-wrap gap-2">
                        {card.skills.map((tag, i) => (
                          <span
                            key={`${tag}-${i}`}
                            className="text-xs px-2 py-0.5 rounded-full border border-white/15 bg-gradient-to-r from-white/5 to-transparent text-white/80"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {card.instituteLink && (
                      <a
                        href={card.instituteLink}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-xs md:text-sm"
                      >
                        <FaLink className="opacity-80" /> Visit Institute
                      </a>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
            {!loading && list.length === 0 && !error && (
              <p className="text-white-50">No published qualifications yet.</p>
            )}
            {error && <p className="text-red-400">{error}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Qualifications;
