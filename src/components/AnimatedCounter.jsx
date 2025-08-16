import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { FaStar, FaBook, FaUserFriends, FaUserPlus, FaCodeBranch, FaSquare } from "react-icons/fa";
import { SiGithub, SiLeetcode } from "react-icons/si";

gsap.registerPlugin(ScrollTrigger);

const USERNAME = "kushkumarkashyap7280";

const AnimatedCounter = () => {
  const counterRef = useRef(null);
  const centerRef = useRef(null);
  const [lc, setLc] = useState({ easy: 0, medium: 0, hard: 0, total: 0, acceptanceRate: 0, ranking: 0 });
  const [gh, setGh] = useState({ repos: 0, followers: 0, following: 0, gists: 0, stars: 0 });

  // shared helper
  const hexToRgba = (hex, a = 0.18) => {
    const h = (hex || '').toString().replace('#', '');
    const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h.padEnd(6, '0');
    const bigint = parseInt(full, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  // Reusable 3D Tilt Card (mouse + touch via Pointer Events)
  const TiltCard = ({ children, tint }) => {
    const ref = useRef(null);
    const rafId = useRef(0);

    const applyTilt = (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX ?? 0;
      const y = e.clientY ?? 0;
      const px = (x - rect.left) / rect.width; // 0..1
      const py = (y - rect.top) / rect.height; // 0..1
      const isTouch = e.pointerType === 'touch';
      const maxX = isTouch ? 6 : 12; // reduce intensity on touch
      const maxY = isTouch ? 7 : 14;
      const rotX = (0.5 - py) * maxX; // tilt up/down
      const rotY = (px - 0.5) * maxY; // tilt left/right
      el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    };

    const onPointerMove = (e) => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => applyTilt(e));
    };

    const reset = () => {
      const el = ref.current;
      if (!el) return;
      el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    };

    const onPointerLeave = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      reset();
    };

    const onPointerDown = () => {
      const el = ref.current;
      if (!el) return;
      el.style.transition = "transform 80ms ease-out";
      el.style.transform += " scale(0.995)";
    };

    const onPointerUp = () => {
      const el = ref.current;
      if (!el) return;
      el.style.transition = "transform 140ms ease-out";
      // remove scale but keep rotation
      const current = el.style.transform || "";
      el.style.transform = current.replace(/\s?scale\([^)]*\)/, "");
    };

    return (
      <div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className="select-none rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] relative overflow-hidden transition-transform duration-200 will-change-transform"
        style={{ transform: "perspective(900px)", transformStyle: "preserve-3d" }}
      >
        {/* animated gradient border */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden" aria-hidden>
          <div className="absolute -inset-[40%] opacity-70 bg-[conic-gradient(at_20%_20%,#22d3ee_0deg,#3b82f6_120deg,#a78bfa_240deg,#22d3ee_360deg)] animate-[spin_6s_linear_infinite]" />
        </div>

        {/* glass surface to cover inside (creates the thin border) */}
        <div
          className="absolute inset-[1.5px] rounded-[1rem] bg-zinc-900/80 backdrop-blur-md [--glass:linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02))] [background-image:var(--glass)]"
          style={{ backgroundColor: tint ? hexToRgba(tint, 0.06) : undefined, borderColor: tint ? hexToRgba(tint, 0.18) : undefined }}
        />

        {/* subtle gradient glow */}
        <div className="pointer-events-none absolute -inset-1 opacity-25" aria-hidden>
          <div className="w-full h-full bg-[radial-gradient(120px_120px_at_20%_10%,rgba(56,189,248,0.18),transparent),radial-gradient(160px_160px_at_80%_90%,rgba(59,130,246,0.14),transparent)]" />
        </div>

        {/* content */}
        <div className="relative p-5 sm:p-6 md:p-8">{children}</div>
      </div>
    );
  };

  // Fetch directly from LeetCode stats API
  useEffect(() => {
    const fetchLC = async () => {
      try {
        const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${encodeURIComponent(USERNAME)}`);
        if (!res.ok) throw new Error("LeetCode stats fetch failed");
        const d = await res.json();
        setLc({
          easy: Number(d?.easySolved) || 0,
          medium: Number(d?.mediumSolved) || 0,
          hard: Number(d?.hardSolved) || 0,
          total: Number(d?.totalSolved) || 0,
          acceptanceRate: Number(d?.acceptanceRate) || 0,
          ranking: Number(d?.ranking) || 0,
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchLC();
  }, []);

  // Fetch GitHub basic profile and stars
  useEffect(() => {
    const fetchGH = async () => {
      try {
        const u = await fetch(`https://api.github.com/users/${encodeURIComponent(USERNAME)}`);
        if (!u.ok) throw new Error("GitHub user fetch failed");
        const ud = await u.json();

        // Fetch first page of repos to estimate stars
        const r = await fetch(`https://api.github.com/users/${encodeURIComponent(USERNAME)}/repos?per_page=100&sort=updated`);
        let stars = 0;
        if (r.ok) {
          const repos = await r.json();
          stars = Array.isArray(repos) ? repos.reduce((sum, repo) => sum + (Number(repo?.stargazers_count) || 0), 0) : 0;
        }

        setGh({
          repos: Number(ud?.public_repos) || 0,
          followers: Number(ud?.followers) || 0,
          following: Number(ud?.following) || 0,
          gists: Number(ud?.public_gists) || 0,
          stars,
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchGH();
  }, []);

  const total = lc.total || (lc.easy + lc.medium + lc.hard);

  // Animate center number
  useGSAP(() => {
    if (!centerRef.current) return;
    const el = centerRef.current;
    gsap.set(el, { innerText: "0" });
    gsap.to(el, {
      innerText: total,
      duration: 1.6,
      ease: "power2.out",
      snap: { innerText: 1 },
      scrollTrigger: { trigger: "#counter", start: "top center" },
    });
  }, [total]);

  // Donut geometry
  const R = 60; // radius
  const C = 2 * Math.PI * R; // circumference
  const e = lc.easy;
  const m = lc.medium;
  const h = lc.hard;
  const sum = Math.max(e + m + h, 1);
  const segE = (e / sum) * C;
  const segM = (m / sum) * C;
  const segH = (h / sum) * C;

  return (
    <div id="counter" ref={counterRef} className="padding-x-lg xl:mt-0 mt-32">
      <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Donut */}
        <TiltCard>
          <div className="flex items-center justify-center">
            <div className="w-56 h-56 sm:w-60 sm:h-60 md:w-64 md:h-64 lg:w-72 lg:h-72">
              <svg width="100%" height="100%" viewBox="0 0 200 200">
                {/* Track */}
                <circle cx="100" cy="100" r={R} fill="none" stroke="#27272a" strokeWidth="14" />
                {/* Segments: start at top (rotate -90) */}
                <g transform="rotate(-90 100 100)">
                  {/* Easy - green */}
                  <circle
                    cx="100" cy="100" r={R} fill="none"
                    stroke="#22c55e" strokeWidth="14"
                    strokeDasharray={`${segE} ${C - segE}`}
                    strokeDashoffset={0}
                    strokeLinecap="round"
                  />
                  {/* Medium - amber, offset by Easy */}
                  <circle
                    cx="100" cy="100" r={R} fill="none"
                    stroke="#f59e0b" strokeWidth="14"
                    strokeDasharray={`${segM} ${C - segM}`}
                    strokeDashoffset={-segE}
                    strokeLinecap="round"
                  />
                  {/* Hard - red, offset by Easy+Medium */}
                  <circle
                    cx="100" cy="100" r={R} fill="none"
                    stroke="#ef4444" strokeWidth="14"
                    strokeDasharray={`${segH} ${C - segH}`}
                    strokeDashoffset={-(segE + segM)}
                    strokeLinecap="round"
                  />
                </g>
                {/* Center total */}
                <g>
                  <text ref={centerRef} x="100" y="94" textAnchor="middle" className="fill-white" style={{ fontSize: 28, fontWeight: 700 }}>
                    0
                  </text>
                  <text x="100" y="117" textAnchor="middle" className="fill-white/70" style={{ fontSize: 12 }}>
                    Solved
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </TiltCard>

        {/* Legend & meta */}
        <TiltCard tint="#0ea5e9">
          <div className="flex flex-col justify-center gap-3">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2" style={{ backgroundColor: hexToRgba('#22c55e', 0.14), border: `1px solid ${hexToRgba('#22c55e', 0.35)}` }}>
              <FaSquare size={12} color="#22c55e" />
              <span className="text-white/80">Easy</span>
              <span className="ml-auto text-white font-semibold">{e}</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg px-3 py-2" style={{ backgroundColor: hexToRgba('#f59e0b', 0.14), border: `1px solid ${hexToRgba('#f59e0b', 0.35)}` }}>
              <FaSquare size={12} color="#f59e0b" />
              <span className="text-white/80">Medium</span>
              <span className="ml-auto text-white font-semibold">{m}</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg px-3 py-2" style={{ backgroundColor: hexToRgba('#ef4444', 0.14), border: `1px solid ${hexToRgba('#ef4444', 0.35)}` }}>
              <FaSquare size={12} color="#ef4444" />
              <span className="text-white/80">Hard</span>
              <span className="ml-auto text-white font-semibold">{h}</span>
            </div>
            <div className="h-px bg-white/10 my-1" />
            <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: hexToRgba('#06b6d4', 0.12), border: `1px solid ${hexToRgba('#06b6d4', 0.30)}` }}>
              <FaSquare size={12} color="#06b6d4" />
              <span className="text-white/80">Acceptance</span>
              <span className="ml-auto text-white font-medium">{lc.acceptanceRate}%</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: hexToRgba('#38bdf8', 0.12), border: `1px solid ${hexToRgba('#38bdf8', 0.30)}` }}>
              <FaSquare size={12} color="#38bdf8" />
              <span className="text-white/80">Ranking</span>
              <span className="ml-auto text-white font-medium">#{lc.ranking}</span>
            </div>
            <div className="flex items-center">
              <SiLeetcode className="text-amber-400" />
              <a className="ml-auto text-sky-400 hover:underline" href={`https://leetcode.com/${USERNAME}/`} target="_blank" rel="noreferrer noopener">
                {USERNAME}
              </a>
            </div>
          </div>
        </TiltCard>
      </div>
      {/* Stats row: GitHub + LeetCode */}
      <div className="mx-auto max-w-5xl mt-6 md:mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Helper local components inline */}
        {(() => {
          const RectIcon = ({ color = '#22d3ee' }) => (
            <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0" aria-hidden>
              <rect x="2" y="2" width="12" height="12" rx="2" fill={color} />
            </svg>
          );

          const hexToRgba = (hex, a = 0.18) => {
            const h = hex.replace('#', '');
            const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return `rgba(${r}, ${g}, ${b}, ${a})`;
          };

          const StatPill = ({ label, value, color, bg = false, Icon }) => (
            <div
              className="relative rounded-xl border px-3 py-2 flex items-center gap-2 text-white/90 transition backdrop-blur-md"
              style={{
                backgroundColor: bg ? hexToRgba(color, 0.16) : 'rgba(255,255,255,0.05)',
                borderColor: bg ? hexToRgba(color, 0.35) : 'rgba(255,255,255,0.10)'
              }}
              title={String(value)}
            >
              {Icon ? <Icon size={14} color={color} className="shrink-0" /> : <RectIcon color={color} />}
              <span className="text-xs text-white/80">{label}</span>
              <span className="ml-auto text-sm font-semibold text-white">{value}</span>
            </div>
          );

          const pills = [
            // GitHub
            { label: 'Repos', value: gh.repos, color: '#60a5fa', Icon: SiGithub },
            { label: 'Followers', value: gh.followers, color: '#34d399', Icon: SiGithub },
            { label: 'Following', value: gh.following, color: '#fbbf24', Icon: SiGithub },
            { label: 'Gists', value: gh.gists, color: '#a78bfa', Icon: SiGithub },
            { label: 'Stars', value: gh.stars, color: '#f472b6', Icon: SiGithub },
            // LeetCode
            { label: 'Easy', value: lc.easy, color: '#22c55e', bg: true, Icon: SiLeetcode },
            { label: 'Medium', value: lc.medium, color: '#f59e0b', bg: true, Icon: SiLeetcode },
            { label: 'Hard', value: lc.hard, color: '#ef4444', bg: true, Icon: SiLeetcode },
            { label: 'Total', value: total, color: '#38bdf8', bg: true, Icon: SiLeetcode },
            { label: 'Acc %', value: `${lc.acceptanceRate}%`, color: '#06b6d4', bg: true, Icon: SiLeetcode },
          ];

          return pills.map((p, i) => (
            <StatPill key={`${p.label}-${i}`} label={p.label} value={p.value} color={p.color} bg={p.bg} Icon={p.Icon} />
          ));
        })()}
      </div>
    </div>
  );
};

export default AnimatedCounter;
