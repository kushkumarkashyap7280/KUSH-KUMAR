import { useEffect, useState } from "react";
import { getPublicProjects } from "../apis/projects";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

const AppShowcase = () => {
  const [projects, setProjects] = useState([]);

  // Fetch public projects on mount
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await getPublicProjects();
        const payload = res?.data?.data?.items || res?.data?.items || res?.data?.data || res?.data || [];
        const arr = Array.isArray(payload) ? payload : [];
        const normalize = (v) => ({
          _id: v?._id?.$oid || v?._id || undefined,
          order: v?.order?.$numberInt ? Number(v.order.$numberInt) : (v?.order?.$numberLong ? Number(v.order.$numberLong) : v?.order),
          createdAt: v?.createdAt?.$date?.$numberLong ? new Date(Number(v.createdAt.$date.$numberLong)) : (v?.createdAt?.$date ? new Date(v.createdAt.$date) : (v?.createdAt ? new Date(v.createdAt) : undefined)),
          updatedAt: v?.updatedAt?.$date?.$numberLong ? new Date(Number(v.updatedAt.$date.$numberLong)) : (v?.updatedAt?.$date ? new Date(v.updatedAt.$date) : (v?.updatedAt ? new Date(v.updatedAt) : undefined)),
          ...v,
        });
        const items = arr.map(normalize);
        if (active) setProjects(items);
      } catch (e) {
        console.error("Failed to load projects", e?.message || e);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="work" className="relative p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {(projects || []).filter(p => p?.isPublished==true).map((p, idx) => (
          <article
            key={p?._id || idx}
            className="group rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-300 shadow-sm hover:shadow-md"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/10">
              {/* Published badge */}
              {p?.isPublished==true && (
                <span className="absolute top-2 left-2 z-10 rounded-md bg-emerald-500/90 text-white text-[11px] font-medium px-2 py-1 shadow">
                  Published
                </span>
              )}
              <img
                src={p?.thumbnail || p?.images?.[0] || "/images/project2.png"}
                alt={p?.title || "Project"}
                className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>

            <div className="p-4 text-white">
              <h3 className="text-lg font-semibold line-clamp-1">{p?.title || 'Untitled Project'}</h3>
              {p?.description && (
                <p className="mt-1 text-sm text-white/80 line-clamp-2">{p.description}</p>
              )}

              <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                {p?.demoUrl && (
                  <a
                    href={p.demoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
                  >
                    <FaExternalLinkAlt />
                    <span>Live Demo</span>
                  </a>
                )}
                {p?.repoUrl && (
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-black/70 text-white border border-white/20 text-sm font-medium hover:bg-black/60 transition-colors"
                  >
                    <FaGithub />
                    <span>Source</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AppShowcase;
