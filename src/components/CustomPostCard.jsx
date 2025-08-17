import { useMemo } from "react";
import { SiX, SiLinkedin, SiYoutube, SiInstagram, SiFacebook } from "react-icons/si";
import { FaHeart, FaRegComment, FaShare, FaExternalLinkAlt } from "react-icons/fa";

const PLATFORM_STYLES = {
  // X / Twitter
  x: { color: "#1D9BF0", Icon: SiX, label: "X" },
  "x.com": { color: "#1D9BF0", Icon: SiX, label: "X" },
  "twitter.com": { color: "#1D9BF0", Icon: SiX, label: "X" },
  twitter: { color: "#1D9BF0", Icon: SiX, label: "X" },

  // LinkedIn
  "linkedin.com": { color: "#0A66C2", Icon: SiLinkedin, label: "LinkedIn" },
  linkedin: { color: "#0A66C2", Icon: SiLinkedin, label: "LinkedIn" },

  // YouTube
  "youtube.com": { color: "#FF0000", Icon: SiYoutube, label: "YouTube" },
  "youtu.be": { color: "#FF0000", Icon: SiYoutube, label: "YouTube" },
  youtube: { color: "#FF0000", Icon: SiYoutube, label: "YouTube" },

  // Instagram
  "instagram.com": { color: "#E1306C", Icon: SiInstagram, label: "Instagram" },
  instagram: { color: "#E1306C", Icon: SiInstagram, label: "Instagram" },

  // Facebook
  "facebook.com": { color: "#1877F2", Icon: SiFacebook, label: "Facebook" },
  "fb.com": { color: "#1877F2", Icon: SiFacebook, label: "Facebook" },
  facebook: { color: "#1877F2", Icon: SiFacebook, label: "Facebook" },

  // Fallback
  default: { color: "#94A3B8", Icon: null, label: "Web" },
};

const getDomain = (url) => {
  try {
    const u = new URL(url);
    return u.hostname.replace("www.", "");
  } catch {
    return "";
  }
};

const timeAgo = (iso) => {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d`;
  const wk = Math.floor(day / 7);
  if (wk < 4) return `${wk}w`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo}mo`;
  const yr = Math.floor(day / 365);
  return `${yr}y`;
};

const CustomPostCard = ({ post }) => {
  const domain = useMemo(() => (post?.link ? getDomain(post.link) : (post?.platform || "")), [post]);
  const style = PLATFORM_STYLES[post?.platform] || PLATFORM_STYLES[domain] || PLATFORM_STYLES.default;
  const platformKey = (post?.platform || domain || "default").toLowerCase();
  const isVisualFirst = platformKey.includes("instagram") || platformKey.includes("youtube");
  const hasOuterLink = Boolean(post?.published && post?.link);

  // Respect isPublished/published at component level
  if (post && post.published === false) {
    return null;
  }

  const Header = (
    <div className="flex items-center justify-between px-4 md:px-5 pt-3 md:pt-4">
      <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
        <div
          className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white/90 shrink-0"
          style={{ backgroundColor: `${style.color}30`, color: style.color }}
        >
          {style.Icon ? <style.Icon className="text-[14px] md:text-[18px]" /> : <span className="text-[10px] md:text-xs">{style.label[0]}</span>}
        </div>
        <div className="leading-tight min-w-0">
          <div className="flex items-center gap-2 text-xs md:text-sm min-w-0">
            <span className="font-semibold truncate max-w-[9rem] md:max-w-none">{style.label}</span>
            <span className="text-white/40 flex-shrink-0">· {timeAgo(post?.createdAt)}</span>
          </div>
          {domain ? (
            <div className="text-[10px] md:text-xs text-white/50 truncate max-w-[12rem] md:max-w-none">{domain}</div>
          ) : null}
        </div>
      </div>
      {post?.link ? (
        <FaExternalLinkAlt className="text-white/50 text-xs md:text-sm flex-shrink-0" />
      ) : null}
    </div>
  );

  const Media = post?.image ? (
    <div className={`w-full ${platformKey.includes("instagram") ? "aspect-square" : "aspect-video"} bg-black/20 overflow-hidden`}>
      <img
        src={post.image}
        alt={post.title || "post-image"}
        className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
        loading="lazy"
      />
    </div>
  ) : null;

  const Body = (
    <div className="px-4 md:px-5 py-3 md:py-4 flex flex-col gap-1.5 md:gap-2 min-w-0">
      {post?.title ? (
        <p className="text-[14px] md:text-[15px] leading-relaxed whitespace-pre-line break-words">
          {post.title}
        </p>
      ) : null}
      {post?.excerpt ? (
        <p className="text-white/70 text-[13px] md:text-[14px] leading-relaxed break-words">{post.excerpt}</p>
      ) : null}
      {Array.isArray(post?.tags) && post.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 md:gap-2 mt-1">
          {post.tags.map((t, i) => (
            <span
              key={i}
              className="text-[10px] md:text-[11px] px-1.5 md:px-2 py-0.5 rounded-full border border-white/10 text-white/70"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );

  const Actions = (
    <div className="px-4 md:px-5 pb-3 md:pb-4 pt-1 flex items-center justify-between text-white/60">
      <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm">
        <button className="inline-flex items-center gap-1.5 md:gap-2 hover:text-white transition-colors" aria-label="Like">
          <FaHeart className="text-sm md:text-base" />
          <span className="hidden xs:inline">Like</span>
        </button>
        <button className="inline-flex items-center gap-1.5 md:gap-2 hover:text-white transition-colors" aria-label="Comment">
          <FaRegComment className="text-sm md:text-base" />
          <span className="hidden xs:inline">Comment</span>
        </button>
        <button className="inline-flex items-center gap-1.5 md:gap-2 hover:text-white transition-colors" aria-label="Share">
          <FaShare className="text-sm md:text-base" />
          <span className="hidden xs:inline">Share</span>
        </button>
      </div>
      {post?.link ? (
        hasOuterLink ? (
          <span className="text-xs md:text-sm" style={{ color: style.color }} aria-label="Open in new tab">
            Open
          </span>
        ) : (
          <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm hover:text-white" style={{ color: style.color }}>
            Open
          </a>
        )
      ) : null}
    </div>
  );

  const CardInner = (
    <div
      className="group card card-border rounded-xl overflow-hidden flex flex-col h-full bg-white/5 backdrop-blur-sm"
      style={{ borderColor: `${style.color}40`, boxShadow: `0 0 22px 1px ${style.color}2e` }}
    >
      {Header}
      {isVisualFirst ? (
        <>
          {Media}
          {Body}
        </>
      ) : (
        <>
          {Body}
          {Media}
        </>
      )}
      {Actions}
    </div>
  );

  if (hasOuterLink) {
    return (
      <a href={post.link} target="_blank" rel="noopener noreferrer" className="block group">
        {CardInner}
      </a>
    );
  }
  return CardInner;
};

export default CustomPostCard;
