import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useState } from "react";
import { FaMapMarkerAlt, FaBuilding, FaBriefcase } from "react-icons/fa";
import TitleHeader from "../components/TitleHeader";
import GlowCard from "../components/GlowCard";
import { getPublicExperiences } from "../apis/experiences";
import { toExpCardsFromApiResponse } from "../utils/experience";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  // State must be declared before hooks that depend on it
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useGSAP(() => {
    // Loop through each timeline card and animate them in
    // as the user scrolls to each card
    gsap.utils.toArray(".timeline-card").forEach((card) => {
      // Animate the card coming in from the left and fade in
      gsap.fromTo(
        card,
        {
          xPercent: -100,
          opacity: 0,
        },
        {
          xPercent: 0,
          opacity: 1,
          transformOrigin: "left left",
          duration: 1,
          ease: "power2.inOut",
          immediateRender: false,
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
          },
        }
      );
    });

    // Animate the timeline height as the user scrolls only if present
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

    // Loop through each expText element and animate them in
    // as the user scrolls to each text element
    gsap.utils.toArray(".expText").forEach((text) => {
      // Animate the text opacity from 0 to 1
      gsap.fromTo(
        text,
        {
          opacity: 0,
          xPercent: 0,
        },
        {
          opacity: 1,
          xPercent: 0,
          duration: 1,
          ease: "power2.inOut",
          immediateRender: false,
          scrollTrigger: {
            trigger: text,
            start: "top 60%",
          },
        }
      );
    }, "<"); // position parameter - insert at the start of the animation
  }, [loading]);

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

  // Ensure ScrollTrigger recalculates after items render
  useEffect(() => {
    try {
      ScrollTrigger.refresh();
    } catch (e) {
      console.error("[Experience] ScrollTrigger.refresh failed", e);
    }
  }, [items]);

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
          <div className="relative z-50 xl:space-y-32 space-y-10">
            {(loading ? [] : list).map((card) => (
              <div key={card.title} className="exp-card-wrapper timeline-card">
                <div className="xl:w-2/6">
                  <GlowCard>
                    <div className="flex items-center justify-center p-3 min-h-[160px]">
                      {card.imgPath ? (
                        <img
                          src={card.imgPath}
                          alt={card.title || "Experience"}
                          className="w-[95%] h-[95%] object-contain"
                        />
                      ) : (
                        <FaMapMarkerAlt className="text-4xl text-white/80" />
                      )}
                    </div>
                  </GlowCard>
                </div>
                <div className="xl:w-4/6">
                  <div className="flex items-start">
                    <div className="timeline-wrapper">
                      <div className="timeline" />
                      <div className="gradient-line w-1 h-full z-40" aria-hidden="true" />
                    </div>
                    <div className="expText flex xl:gap-20 md:gap-10 gap-5 relative z-20">
                      <div className="timeline-logo group">
                        <div className="flex items-center justify-center rounded-full w-12 h-12 border border-white/20 bg-gradient-to-br from-cyan-400/20 via-fuchsia-400/20 to-purple-500/20 transition-all duration-300 group-hover:from-cyan-400/40 group-hover:via-fuchsia-400/40 group-hover:to-purple-500/40">
                          <FaBriefcase
                            title="Experience"
                            className="text-white text-xl transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                      </div>
                      <div>
                        <h1 className="font-semibold text-3xl">{card.title}</h1>
                        {(card.company || card.location) && (
                          <p className="mt-2 text-white/70 flex items-center gap-4 text-sm">
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
                        <p className="my-5 text-white-50">
                          🗓️&nbsp;{card.date}
                        </p>
                        {Array.isArray(card.tags) && card.tags.length > 0 && (
                          <div className="mt-2 mb-4 flex flex-wrap gap-2">
                            {card.tags.map((tag, i) => (
                              <span
                                key={`${tag}-${i}`}
                                className="text-xs px-2 py-0.5 rounded-full border border-white/15 bg-gradient-to-r from-white/5 to-transparent text-white/80"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-[#839CB5] italic">
                          Responsibilities
                        </p>
                        <ul className="list-disc ms-5 mt-5 flex flex-col gap-5 text-white-50">
                          {card.responsibilities.map(
                            (responsibility, index) => (
                              <li key={index} className="text-lg">
                                {responsibility}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
