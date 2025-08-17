import React from "react";
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi";

export default function QualificationCard({
  q,
  idx,
  isEditing,
  onTogglePublish,
  onEdit,
  onCancelEdit,
  onDelete,
  onChange,
  readOnly = false,
}) {
  const chipSkills = (Array.isArray(q.skills) ? q.skills : (q.skills || "").split(","))
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean);
  const gradient = idx % 3 === 0
    ? "from-fuchsia-500/10 to-blue-500/10"
    : idx % 3 === 1
    ? "from-emerald-500/10 to-cyan-500/10"
    : "from-amber-500/10 to-rose-500/10";

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br ${gradient} p-3 transition transform hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]`}
    >
      {/* Top controls (hidden in read-only mode) */}
      {!readOnly && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-white/70">Published</span>
            <button
              type="button"
              onClick={onTogglePublish}
              className={`relative h-5 w-9 rounded-full transition-colors ${q.isPublished ? "bg-green-500/80" : "bg-white/20"}`}
              aria-pressed={q.isPublished}
              title="Toggle publish"
            >
              <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${q.isPublished ? "translate-x-4" : "translate-x-0"}`} />
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {isEditing ? (
              <button type="button" onClick={onCancelEdit} className="rounded border border-white/10 px-2 py-1 hover:bg-white/10"><FiX /> Cancel</button>
            ) : (
              <button type="button" onClick={onEdit} className="rounded border border-white/10 px-2 py-1 hover:bg-white/10"><FiEdit2 /> Edit</button>
            )}
            <button type="button" onClick={onDelete} className="rounded border border-white/10 px-2 py-1 text-red-300 hover:bg-white/10"><FiTrash2 /> Delete</button>
          </div>
        </div>
      )}

      {/* Media preview */}
      {q.mediaUrl && (
        <div className="mb-2 overflow-hidden rounded-lg border border-white/10 bg-black/20">
          <img src={q.mediaUrl} alt={q.title || "media"} className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
        </div>
      )}

      {/* Content */}
      {readOnly || !isEditing ? (
        <div>
          <div className="text-sm font-semibold">{q.title || "Untitled"}</div>
          <div className="mt-1 text-[11px] text-white/70 break-all">
            {q.instituteLink ? (
              <a href={q.instituteLink} target="_blank" rel="noreferrer" className="underline">{q.instituteLink}</a>
            ) : (
              <span className="text-white/50">No institute link</span>
            )}
          </div>
          <div className="mt-1 text-[11px] text-white/70 flex items-center gap-2">
            <span>{q.from || "—"}</span>
            <span>→</span>
            <span>{q.to || "Present"}</span>
          </div>
          {chipSkills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {chipSkills.map((s, i) => (
                <span key={i} className="rounded-full bg-white/10 border border-white/10 px-2 py-0.5 text-[10px]">{s}</span>
              ))}
            </div>
          )}
          {q.desc && <p className="mt-2 text-xs text-white/80">{q.desc}</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          <input className="rounded bg-white/10 border border-white/10 px-2 py-1 text-xs" placeholder="Title" value={q.title} onChange={(e) => onChange("title", e.target.value)} />
          <input className="rounded bg-white/10 border border-white/10 px-2 py-1 text-xs" placeholder="Institute Link" value={q.instituteLink} onChange={(e) => onChange("instituteLink", e.target.value)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input className="rounded bg-white/10 border border-white/10 px-2 py-1 text-xs" placeholder="Media URL" value={q.mediaUrl} onChange={(e) => onChange("mediaUrl", e.target.value)} />
            <select className="rounded bg-white/10 border border-white/10 px-2 py-1 text-xs" value={q.mediaType} onChange={(e) => onChange("mediaType", e.target.value)}>
              <option value="svg">svg</option>
              <option value="image">image</option>
            </select>
          </div>
          <input className="rounded bg-white/10 border border-white/10 px-2 py-1 text-xs" placeholder="Skills (comma separated)" value={q.skills} onChange={(e) => onChange("skills", e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <input type="date" className="rounded bg-white/10 border border-white/10 px-2 py-1 text-xs" value={q.from} onChange={(e) => onChange("from", e.target.value)} />
            <input type="date" className="rounded bg-white/10 border border-white/10 px-2 py-1 text-xs" value={q.to} onChange={(e) => onChange("to", e.target.value)} />
          </div>
          <textarea className="w-full rounded bg-white/10 border border-white/10 px-2 py-1 text-xs" placeholder="Description" rows={2} value={q.desc} onChange={(e) => onChange("desc", e.target.value)} />
        </div>
      )}
    </div>
  );
}
