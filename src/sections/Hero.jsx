import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import AnimatedCounter from "../components/AnimatedCounter";
import ThreeImageCard from "../components/ThreeImageCard";
import { words } from "../constants";
import { getAdminStatus } from "../apis/admin";
import { toast } from "sonner";

 // Typing effect for the animated words line
const TypingWords = () => {
  const [index, setIndex] = useState(0); // which word
  const [subIndex, setSubIndex] = useState(0); // how many chars shown
  const [deleting, setDeleting] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);

  const current = words[index % words.length];
  const text = current.text;

  // Blink the cursor
  useEffect(() => {
    const blink = setInterval(() => setCursorOn((v) => !v), 500);
    return () => clearInterval(blink);
  }, []);

  // Typing / deleting logic
  useEffect(() => {
    const atEnd = subIndex === text.length;
    const atStart = subIndex === 0;

    // speed tuning
    const typingSpeed = 80;
    const deletingSpeed = 50;
    const pauseAtEnd = 1000;
    const pauseAtStart = 400;

    let timeout = typingSpeed;

    if (!deleting && atEnd) {
      // pause, then start deleting
      timeout = pauseAtEnd;
    } else if (deleting && atStart) {
      // move to next word
      timeout = pauseAtStart;
    } else {
      timeout = deleting ? deletingSpeed : typingSpeed;
    }

    const t = setTimeout(() => {
      if (!deleting) {
        if (atEnd) {
          setDeleting(true);
        } else {
          setSubIndex((s) => s + 1);
        }
      } else {
        if (atStart) {
          setDeleting(false);
          setIndex((i) => (i + 1) % words.length);
        } else {
          setSubIndex((s) => s - 1);
        }
      }
    }, timeout);

    return () => clearTimeout(t);
  }, [subIndex, deleting, index, text]);

  const Icon = current.icon;

  return (
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-[1.15] flex items-center justify-center gap-2">
      {/* Icon */}
      <Icon className={`xl:text-[3rem] md:text-[2.25rem] text-[1.25rem] ${current.color}`} />
      {/* Typed text */}
      <span className={`font-semibold ${current.color}`}>
        {text.substring(0, subIndex)}
      </span>
      {/* Blinking vertical bar cursor */}
      <motion.span
        aria-hidden
        className={`${current.color} select-none`}
        animate={{ opacity: cursorOn ? 1 : 0.15 }}
        transition={{ duration: 0.2 }}
      >
        |
      </motion.span>
    </h1>
  );
};

const Hero = () => {
  const cardRef = useRef(null);
  const [admin, setAdmin] = useState(null);

  // Convert Google Drive file URLs to direct download links
  const toDriveDownload = (url) => {
    if (!url || typeof url !== "string") return url;
    try {
      // Pattern 1: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
      const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)\//i);
      if (fileMatch && fileMatch[1]) {
        const id = fileMatch[1];
        return `https://drive.google.com/uc?export=download&id=${id}`;
      }
      // Pattern 2: https://drive.google.com/open?id=FILE_ID or any URL with ?id=FILE_ID
      const u = new URL(url);
      const idParam = u.searchParams.get("id");
      if (/drive\.google\.com/i.test(u.hostname) && idParam) {
        return `https://drive.google.com/uc?export=download&id=${idParam}`;
      }
      // Pattern 3: already a uc?export=download link -> ensure export=download
      if (/drive\.google\.com\/uc/i.test(url)) {
        const u2 = new URL(url);
        u2.searchParams.set("export", "download");
        return u2.toString();
      }
    } catch {
      // If URL parsing fails, fall back to original URL
      return url;
    }
    return url;
  };

  useGSAP(() => {
    gsap.fromTo(
      ".hero-text h1",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power2.inOut" }
    );
  });

  // Load public admin profile (avatar, name, resume)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getAdminStatus();
        const data = res?.data?.data?.admin;
        if (mounted && data) setAdmin(data);
      } catch {
        // ignore, keep defaults
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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

  // No custom click handler needed; anchor will open admin.resume directly

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

              {/* Line 2: typing animated words */}
              <TypingWords />

              {/* Line 3: closing statement */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">Let&apos;s create world</h1>
              {/* Name from public admin profile */}
              {admin && (
                <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl font-semibold text-white/90">
                  {admin.Fname} {admin.Lname}
                </h2>
              )}
              {/* Short description/bio from public admin profile */}
              {admin?.description && (
                <p className="mt-2 text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto whitespace-pre-wrap">
                  {admin.description}
                </p>
              )}
            </div>

            {/* Download resume button */}
            {admin && (
              <div className="flex justify-center">
                <a
                  href={admin?.resume ? toDriveDownload(admin.resume) : "#"}
                  // Open in the same tab; Drive uc?export=download will trigger download
                  download="resume.pdf"
                  onClick={(e) => {
                    if (!admin?.resume) {
                      e.preventDefault();
                      toast.error("Resume not available");
                      return;
                    }
                    e.preventDefault();
                    toast.success("Starting resume download...");
                    const href = toDriveDownload(admin.resume);
                    window.location.href = href;
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white shadow hover:bg-red-700 transition-colors"
                >
                  Download Resume
                </a>
              </div>
            )}
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
            <ThreeImageCard src={admin?.avatar || "https://avatars.githubusercontent.com/u/180039518?v=4"} />
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
