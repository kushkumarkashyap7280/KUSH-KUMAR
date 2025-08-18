import { useEffect, useState } from "react";
import { getPublicProjects } from "../apis/projects";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

const AppShowcase = () => {
  const [projects, setProjects] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTech, setFilterTech] = useState("");
  const [visible, setVisible] = useState(3);

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

  const filtered = (projects || [])
    .filter((p) => p?.published === true)
    .filter((p) => (filterStatus === "all" ? true : p?.status === filterStatus))
    .filter((p) => {
      if (!filterTech.trim()) return true;
      const q = filterTech.trim().toLowerCase();
      const stack = Array.isArray(p?.techStack) ? p.techStack.map((t) => String(t).toLowerCase()) : [];
      return stack.some((t) => t.includes(q));
    })
    .sort((a, b) => {
      const aOn = Number(a?.order);
      const bOn = Number(b?.order);
      const ao = Number.isFinite(aOn) ? aOn : Number.MAX_SAFE_INTEGER;
      const bo = Number.isFinite(bOn) ? bOn : Number.MAX_SAFE_INTEGER;
      if (ao !== bo) return ao - bo;
      const ac = a?.createdAt instanceof Date ? a.createdAt.getTime() : 0;
      const bc = b?.createdAt instanceof Date ? b.createdAt.getTime() : 0;
      return bc - ac; // newer first when order ties
    });

  const visibleItems = filtered.slice(0, visible);

  // If there are no published projects at all from API, hide the entire section
  const publishedCount = (projects || []).filter((p) => p?.published === true).length;
  if (publishedCount === 0) return null;

  return (
    <section id="work" className="relative p-6">
      {/* Filters */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs text-white/70">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setVisible(3);
            }}
            className="rounded-md border border-white/20 bg-black/40 px-2 py-1 text-sm text-white"
          >
            <option value="all">All</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-white/70">Tech</label>
          <input
            value={filterTech}
            onChange={(e) => {
              setFilterTech(e.target.value);
              setVisible(3);
            }}
            placeholder="e.g. react, mern"
            className="w-44 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-sm text-white placeholder-white/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            No projects match the selected filters.
          </div>
        ) : (
        visibleItems.map((p, idx) => (
          <article
            key={p?._id || idx}
            className="group rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-300 shadow-sm hover:shadow-md"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/10">
              {/* Published badge */}
              {p?.published === true && (
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

              {/* Status and Tech Stack badges */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {p?.status && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 border border-white/15 capitalize">
                    {String(p.status).replace(/_/g, ' ')}
                  </span>
                )}
                {Array.isArray(p?.techStack) && p.techStack.length > 0 && (
                  p.techStack.map((t, i) => (
                    <span key={`${t}-${i}`} className="text-[11px] px-2 py-0.5 rounded-full border border-white/10 text-white/80">
                      {t}
                    </span>
                  ))
                )}
              </div>

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
        ))
        )}
      </div>

      {/* Show more / less */}
      <div className="mt-6 flex justify-center">
        {visible < filtered.length ? (
          <button
            onClick={() => setVisible((v) => v + 3)}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 border border-white/10"
          >
            Show more
          </button>
        ) : filtered.length > 3 ? (
          <button
            onClick={() => setVisible(3)}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 border border-white/10"
          >
            Show less
          </button>
        ) : null}
      </div>
    </section>
  );
};

export default AppShowcase;
