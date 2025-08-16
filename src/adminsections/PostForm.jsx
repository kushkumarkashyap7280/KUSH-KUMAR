import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { createPost, updatePost } from "../apis/posts";

function toArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  const s = String(val).trim();
  if (!s) return [];
  if (s.startsWith("[") && s.endsWith("]")) {
    try {
      const parsed = JSON.parse(s);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // fallthrough
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

export default function PostForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState({
    platform: initial?.platform || "",
    title: initial?.title || "",
    link: initial?.link || "",
    excerpt: initial?.excerpt || "",
    tags: formatArray(initial?.tags) || "",
    order: initial?.order ?? "",
    published: initial?.published ?? true,
  });
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canSave = useMemo(() => form.platform && form.title && form.link, [form.platform, form.title, form.link]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("platform", form.platform);
      fd.append("title", form.title);
      fd.append("link", form.link);
      if (form.excerpt) fd.append("excerpt", form.excerpt);
      const tags = toArray(form.tags);
      tags.forEach((v, i) => fd.append(`tags[${i}]`, v));
      if (form.order !== "") fd.append("order", String(form.order));
      fd.append("published", String(!!form.published));
      if (image) fd.append("image", image);

      const res = initial?._id ? await updatePost(initial._id, fd) : await createPost(fd);
      const saved = res.data?.data?.post;
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
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-5 text-white shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{initial ? "Edit Post" : "New Post"}</h3>
          <button type="button" onClick={() => onCancel?.()} className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600">
            Close
          </button>
        </div>

        {error && <div className="mb-3 rounded-md border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}

        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-white/70">Platform</label>
              <input value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 p-2" required />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/70">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 p-2" required />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/70">Link</label>
            <input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 p-2" required />
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/70">Excerpt</label>
            <textarea rows={3} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 p-2" />
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/70">Tags (JSON array or comma/line separated)</label>
            <textarea rows={2} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 p-2" placeholder='["react", "blog"]' />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-white/70">Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 p-2" placeholder="1" />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input id="published" type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              <label htmlFor="published" className="text-sm">Published</label>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/70">Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
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
