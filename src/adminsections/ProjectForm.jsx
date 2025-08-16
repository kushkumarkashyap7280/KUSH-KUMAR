import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { createProject, updateProject } from "../apis/projects";

function toArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  const s = String(val).trim();
  if (!s) return [];
  if ((s.startsWith("[") && s.endsWith("]")) || (s.startsWith("\n[") && s.trim().endsWith("]"))) {
    try {
      const parsed = JSON.parse(s);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // fallthrough to delimiter parsing
    }
  }
  return s
    .split(/\r?\n|,/) // newline or comma
    .map((x) => x.trim())
    .filter(Boolean);
}

function formatArray(val) {
  if (!val) return "";
  if (typeof val === "string") return val;
  try {
    return JSON.stringify(val, null, 2);
  } catch {
    return String(val);
  }
}

export default function ProjectForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    slug: initial?.slug || "",
    description: initial?.description || "",
    techStack: formatArray(initial?.techStack) || "",
    features: formatArray(initial?.features) || "",
    outcome: initial?.outcome || "",
    repoUrl: initial?.repoUrl || "",
    demoUrl: initial?.demoUrl || "",
    featured: !!initial?.featured,
    status: initial?.status || "planned",
    order: initial?.order ?? "",
    published: initial?.published ?? true,
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canSave = useMemo(() => form.title && form.slug, [form.title, form.slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      // required
      fd.append("title", form.title);
      fd.append("slug", form.slug);
      // optional text fields
      if (form.description) fd.append("description", form.description);
      if (form.outcome) fd.append("outcome", form.outcome);
      if (form.repoUrl) fd.append("repoUrl", form.repoUrl);
      if (form.demoUrl) fd.append("demoUrl", form.demoUrl);
      // arrays
      const tech = toArray(form.techStack);
      const feats = toArray(form.features);
      tech.forEach((v, i) => fd.append(`techStack[${i}]`, v));
      feats.forEach((v, i) => fd.append(`features[${i}]`, v));
      // flags and numbers
      fd.append("featured", String(!!form.featured));
      fd.append("status", form.status || "planned");
      if (form.order !== "") fd.append("order", String(form.order));
      fd.append("published", String(!!form.published));
      // files
      if (thumbnail) fd.append("thumbnail", thumbnail);
      if (images && images.length) {
        for (const img of images) fd.append("images", img);
      }

      const res = initial?._id
        ? await updateProject(initial._id, fd)
        : await createProject(fd);

      const saved = res.data?.data?.project;
      onSaved?.(saved);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-5 text-white shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{initial ? "Edit Project" : "New Project"}</h3>
          <button type="button" onClick={() => onCancel?.()} className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600">
            Close
          </button>
        </div>

        {error && <div className="mb-3 rounded-md border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-white/70">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 p-2" required />
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/70">Slug</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} className="w-full rounded-lg border border-white/10 bg-white/5 p-2" required />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-white/70">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 p-2" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-white/70">Tech Stack (JSON array or comma/line separated)</label>
            <textarea rows={2} value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 p-2" placeholder='["react", "node", "mongodb"]' />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-white/70">Features (JSON array or comma/line separated)</label>
            <textarea rows={3} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 p-2" placeholder='[
  "Implemented authentication",
  "Responsive UI",
  "Unit tests"
]' />
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/70">Outcome</label>
            <input value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 p-2" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/70">Repository URL</label>
            <input type="url" value={form.repoUrl} onChange={(e) => setForm({ ...form, repoUrl: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 p-2" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/70">Demo URL</label>
            <input type="url" value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 p-2" />
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/70">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 p-2">
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/70">Order</label>
            <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 p-2" placeholder="1" />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input id="featured" type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            <label htmlFor="featured" className="text-sm">Featured</label>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input id="published" type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            <label htmlFor="published" className="text-sm">Published</label>
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/70">Thumbnail</label>
            <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/70">Images (multiple)</label>
            <input multiple type="file" accept="image/*" onChange={(e) => setImages(Array.from(e.target.files || []))} />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button type="button" onClick={() => onCancel?.()} className="rounded-lg bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600">Cancel</button>
          <button type="submit" disabled={!canSave || saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? "Saving..." : initial ? "Save Changes" : "Create"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
