import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

import AnimatedCounter from "../components/AnimatedCounter";
import ThreeImageCard from "../components/ThreeImageCard";
import { words } from "../constants";
 



const Hero = () => {
  const cardRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ".hero-text h1",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power2.inOut" }
    );
  });

  const handleMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const pointX = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const pointY = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    const x = (pointX / rect.width) * 2 - 1; // -1 .. 1
    const y = (pointY / rect.height) * 2 - 1;
    const rotX = -(y * 8); // tilt up/down
    const rotY = x * 8; // tilt left/right
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;

    // Compute angle for animated border to follow pointer
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const angleRad = Math.atan2(pointY - cy, pointX - cx);
    const angleDeg = angleRad * (180 / Math.PI);
    card.style.setProperty("--angle", `${angleDeg}deg`);

    // Dynamic 3D glow/shadow reacting to tilt
    const glowX = -rotY * 1.5;
    const glowY = rotX * 1.5;
    card.style.boxShadow = `${glowX}px ${glowY}px 30px rgba(239,68,68,0.25), 0 8px 24px rgba(0,0,0,0.35)`;
  };

  const handleLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    card.style.removeProperty("--angle");
    card.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
  };

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute top-0 left-0 z-10">
        <img src="/images/bg.png" alt="" />
      </div>

      <div className="hero-layout flex-col-reverse md:flex-row md:items-center">
        {/* LEFT: Hero Content */}
        <header className="flex flex-col items-center text-center justify-center w-full md:w-full md:px-20 px-5 mx-auto max-w-3xl md:max-w-4xl">
          <div className="flex flex-col gap-6 md:gap-7">
            <div className="hero-text">
              {/* Line 1: static intro */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-[1.15]">I am a</h1>

              {/* Line 2: animated words */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-[1.15]">
                <span className="slide">
                  <h2  className="wrapper text-center">
                    {words.map((word, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 sm:gap-2 md:gap-3 pb-1 md:pb-2"
                      >
                        {(() => {
                          const Icon = word.icon;
                          return (
                            <Icon className={`xl:text-[3rem] md:text-[2.25rem] text-[1.25rem] ${word.color}`} />
                          );
                        })()}
                        <span className={`font-semibold ${word.color}`}>{word.text}</span>
                      </span>
                    ))}
                  </h2>
                </span>
              </h1>

              {/* Line 3: closing statement */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">Let&apos;s create world</h1>
            </div>

           
          </div>
    
        </header>

        {/* RIGHT: Image area (red themed), simplified for mobile stacking */}
        <figure className="w-full flex justify-center px-5 sm:px-0">
          <div
            ref={cardRef}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            onTouchStart={handleMove}
            onTouchMove={handleMove}
            onTouchEnd={handleLeave}
            className="group card-3d relative w-full mx-auto max-w-[320px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-[480px] rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/5] max-h-[60vh] md:max-h-[50vh] will-change-transform transition-transform duration-300 ease-out"
            style={{ transform: "perspective(900px)" }}
          >
            {/* Glowing red orbs for depth */}
            <div className="absolute -top-12 -left-12 w-20 h-20 rounded-full bg-red-600/30 blur-2xl orb-pulse" />
            <div className="absolute -bottom-10 -right-10 w-20 h-20 rounded-full bg-rose-500/20 blur-2xl orb-pulse" style={{ animationDelay: "0.35s" }} />
            {/* 3D interactive picture */}
            <ThreeImageCard src="https://avatars.githubusercontent.com/u/180039518?v=4" />
            {/* Red tint overlay for cohesive theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-red-500/20 to-transparent mix-blend-multiply pointer-events-none" />
            {/* Soft vignette for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>
        </figure>
      </div>

      <AnimatedCounter />
    </section>
  );
};

export default Hero;
