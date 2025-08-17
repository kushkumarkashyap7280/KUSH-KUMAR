import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useState } from "react";
import { FaGraduationCap, FaLink } from "react-icons/fa";
import TitleHeader from "../components/TitleHeader";
import GlowCard from "../components/GlowCard";
import { getAdminStatus } from "../apis/admin";

gsap.registerPlugin(ScrollTrigger);

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

  useGSAP(() => {
    gsap.utils.toArray(".timeline-card").forEach((card) => {
      gsap.from(card, {
        xPercent: -100,
        opacity: 0,
        transformOrigin: "left left",
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: { trigger: card, start: "top 80%" },
      });
    });

    // Animate the timeline height only if a .timeline element exists
    const tlEl = document.querySelector('.timeline');
    if (tlEl) {
      gsap.to(tlEl, {
        transformOrigin: "bottom bottom",
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: tlEl,
          start: "top center",
          end: "70% center",
          onUpdate: (self) => {
            gsap.to(tlEl, { scaleY: 1 - self.progress });
          },
        },
      });
    }

    gsap.utils.toArray(".expText").forEach((text) => {
      gsap.from(text, {
        opacity: 0,
        xPercent: 0,
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: { trigger: text, start: "top 60%" },
      });
    }, "<");
  }, [loading]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getAdminStatus();
        const q = res?.data?.data?.admin?.qualification || [];
        const mapped = q.map((it, i) => ({
          id: `${it.title}-${i}`,
          title: it.title,
          desc: it.desc,
          instituteLink: it.instituteLink,
          mediaUrl: it.mediaUrl,
          mediaType: it.mediaType,
          skills: Array.isArray(it.skills) ? it.skills : [],
          from: formatDate(it.from),
          to: formatDate(it.to),
        }));
        if (mounted) setItems(mapped);
      } catch (err) {
        if (mounted) setError("Failed to load qualifications." + err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);


  const list = useMemo(() => items, [items]);

  return (
    <section id="qualifications" className="flex-center md:mt-40 mt-20 section-padding xl:px-0">
      <div className="w-full h-full md:px-20 px-5">
        <TitleHeader
          title="Qualifications & Education"
          sub="🎓 My Learning Roadmap"
        />
        <div className="mt-32 relative">
          <div className="relative z-50 xl:space-y-32 space-y-10">
            {(loading ? [] : list).map((card) => (
              <div key={card.id} className="exp-card-wrapper timeline-card">
                <div className="xl:w-2/6">
                  <GlowCard>
                    <div className="flex items-center justify-center p-6 min-h-[120px]">
                      {card.mediaUrl ? (
                        <img
                          src={card.mediaUrl}
                          alt={card.title}
                          className="max-h-24 object-contain"
                        />
                      ) : (
                        <FaGraduationCap className="text-4xl text-white/80" />
                      )}
                    </div>
                  </GlowCard>
                </div>
                <div className="xl:w-4/6">
                  <div className="flex items-start">
                    <div className="timeline-wrapper">
                      <div className="timeline" />
                      <div className="gradient-line w-1 h-full" />
                    </div>
                    <div className="expText flex xl:gap-20 md:gap-10 gap-5 relative z-20">
                      <div className="timeline-logo group">
                        <div className="flex items-center justify-center rounded-full w-12 h-12 border border-white/20 bg-gradient-to-br from-cyan-400/20 via-fuchsia-400/20 to-purple-500/20 transition-all duration-300 group-hover:from-cyan-400/40 group-hover:via-fuchsia-400/40 group-hover:to-purple-500/40">
                          <FaGraduationCap
                            title="Qualification"
                            className="text-white text-xl transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                      </div>
                      <div>
                        <h1 className="font-semibold text-3xl">{card.title}</h1>
                        {(card.from || card.to) && (
                          <p className="my-3 text-white/70 text-sm">
                            🗓️ {card.from} - {card.to}
                          </p>
                        )}
                        {card.desc && (
                          <p className="text-white-50 mb-4">{card.desc}</p>
                        )}
                        {Array.isArray(card.skills) && card.skills.length > 0 && (
                          <div className="mt-2 mb-4 flex flex-wrap gap-2">
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
                            className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm"
                          >
                            <FaLink className="opacity-80" /> Visit Institute
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
