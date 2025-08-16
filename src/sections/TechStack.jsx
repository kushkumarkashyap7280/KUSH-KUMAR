import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import TitleHeader from "../components/TitleHeader";
import { skillsGroups } from "../constants";

const TechStack = () => {
  // Animate the tech cards in the skills section
  useGSAP(() => {
    // This animation is triggered when the user scrolls to the #skills wrapper
    // The animation starts when the top of the wrapper is at the center of the screen
    // The animation is staggered, meaning each card will animate in sequence
    // The animation ease is set to "power2.inOut", which is a slow-in fast-out ease
    gsap.fromTo(
      ".tech-card",
      {
        // Initial values
        y: 50, // Move the cards down by 50px
        opacity: 0, // Set the opacity to 0
      },
      {
        // Final values
        y: 0, // Move the cards back to the top
        opacity: 1, // Set the opacity to 1
        duration: 1, // Duration of the animation
        ease: "power2.inOut", // Ease of the animation
        stagger: 0.2, // Stagger the animation by 0.2 seconds
        scrollTrigger: {
          trigger: "#skills", // Trigger the animation when the user scrolls to the #skills wrapper
          start: "top center", // Start the animation when the top of the wrapper is at the center of the screen
        },
      }
    );
  });

  // helpers for colored outline glow from hex brand colors
  const hexToRgb = (hex) => {
    if (!hex) return [255, 255, 255];
    const clean = hex.replace('#', '');
    const bigint = parseInt(clean.length === 3
      ? clean.split('').map((c) => c + c).join('')
      : clean, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };
  const toRgba = (hex, a) => {
    const [r, g, b] = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  return (
    <div id="skills" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="How I Can Contribute & My Key Skills"
          sub="🤝 What I Bring to the Table"
        />
        <div className="tech-grid items-stretch">
          {skillsGroups.map((group, index) => {
            const brand = group.headerIcon?.color || "#FFFFFF";
            const glow = toRgba(brand, 0.18);
            const borderCol = toRgba(brand, 0.25);
            return (
              <div
                key={index}
                className="card-border tech-card overflow-hidden group rounded-lg p-0 h-full min-h-[260px] md:min-h-[300px] transition-transform duration-300 will-change-transform hover:-translate-y-1 border"
                style={{ boxShadow: `0 0 24px 2px ${glow}`, borderColor: borderCol }}
              >
              <div className="tech-card-animated-bg" />
              <div className="tech-card-content w-full h-full flex flex-col">
                <div className="w-full px-6 pt-6 pb-2 min-h-[52px]">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {group.headerIcon?.Icon ? (
                      <group.headerIcon.Icon
                        style={{ color: group.headerIcon.color || undefined }}
                        className="shrink-0 transition-transform duration-300 group-hover:rotate-6"
                      />
                    ) : null}
                    <span>{group.title}</span>
                  </h3>
                </div>
                <div className="w-full px-8 pb-6 pt-3 flex-1 overflow-y-auto">
                  <ul className="space-y-2 text-white/80 pr-2">
                    {group.items.map((item, i) => {
                      const isObj = typeof item === "object" && item !== null;
                      if (!isObj) {
                        return (
                          <li key={i} className="leading-relaxed hover:text-white transition-colors">
                            {item}
                          </li>
                        );
                      }
                      const Icon = item.Icon;
                      return (
                        <li
                          key={i}
                          className="leading-relaxed hover:text-white transition-all duration-200 hover:translate-x-0.5"
                        >
                          <span className="inline-flex items-center gap-2">
                            {Icon ? (
                              <Icon style={{ color: item.color || undefined }} className="shrink-0" />
                            ) : null}
                            <span>{item.label}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TechStack;
