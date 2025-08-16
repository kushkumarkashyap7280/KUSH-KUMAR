import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { createExperience, updateExperience } from "../apis/experiences";

function toArray(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (typeof input === "string") {
    const s = input.trim();
    // try JSON first
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const v = JSON.parse(s);
        if (Array.isArray(v)) return v;
      } catch {
        // not valid JSON array; will fall back to delimiter-based parse below
      }
    }
    // fallback: split by newlines or commas
    return s
      .split(/\r?\n|,/) // newline or comma
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return [];
}

function formatArrayField(arr) {
  if (!arr) return "";
  if (typeof arr === "string") return arr;
  try {
    return JSON.stringify(arr, null, 2);
  } catch {
    return String(arr);
  }
}

export default function ExperienceForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState({
    role: initial?.role || "",
    company: initial?.company || "",
    location: initial?.location || "",
    startDate: initial?.startDate ? new Date(initial.startDate).toISOString().slice(0, 10) : "",
    endDate: initial?.endDate ? new Date(initial.endDate).toISOString().slice(0, 10) : "",
    current: !!initial?.current,
    responsibilities: formatArrayField(initial?.responsibilities) || "",
    tags: formatArrayField(initial?.tags) || "",
    review: initial?.review || "",
    order: initial?.order ?? "",
    published: !!initial?.published,
  });
  const [image, setImage] = useState(null);
  const [logo, setLogo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // when toggling 'current', clear endDate inline in the checkbox handler below

  const canSave = useMemo(() => form.role && form.company && form.startDate, [form.role, form.company, form.startDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSave) return;

    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      // required/basic fields
      fd.append("role", form.role);
      fd.append("company", form.company);
      if (form.location) fd.append("location", form.location);
      fd.append("startDate", form.startDate);
      if (!form.current && form.endDate) fd.append("endDate", form.endDate);
      fd.append("current", String(!!form.current));
      // arrays
      const resp = toArray(form.responsibilities);
      const tags = toArray(form.tags);
      resp.forEach((v, i) => fd.append(`responsibilities[${i}]`, v));
      tags.forEach((v, i) => fd.append(`tags[${i}]`, v));
      // misc
      if (form.review) fd.append("review", form.review);
      if (form.order !== "") fd.append("order", String(form.order));
      fd.append("published", String(!!form.published));
      // files
      if (image) fd.append("image", image);
      if (logo) fd.append("logo", logo);

      const res = initial?._id
        ? await updateExperience(initial._id, fd)
        : await createExperience(fd);

      const saved = res.data?.data?.experience;
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
          <h3 className="text-lg font-semibold">{initial ? "Edit Experience" : "New Experience"}</h3>
          <button
            type="button"
            onClick={() => onCancel?.()}
            className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600"
          >
            Close
          </button>
        </div>

        {error && (
          <div className="mb-3 rounded-md border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-white/70">Role</label>
            <input
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 p-2"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/70">Company</label>
            <input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 p-2"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/70">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 p-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/70">Start Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 p-2"
              required
            />
          </div>
          {!form.current && (
            <div>
              <label className="mb-1 block text-xs text-white/70">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-2"
              />
            </div>
          )}
          <div className="flex items-center gap-2 pt-6">
            <input
              id="current"
              type="checkbox"
              checked={form.current}
              onChange={(e) => setForm({ ...form, current: e.target.checked })}
            />
            <label htmlFor="current" className="text-sm">Current Role</label>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-white/70">Responsibilities (JSON array, comma- or line-separated also ok)</label>
            <textarea
              rows={4}
              value={form.responsibilities}
              onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 p-2"
              placeholder='[
  "Developed and maintained user-facing features.",
  "Collaborated with UI/UX designers."
]'
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-white/70">Tags (JSON array or comma/line separated)</label>
            <textarea
              rows={2}
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 p-2"
              placeholder='["react", "javascript", "performance"]'
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-white/70">Review</label>
            <textarea
              rows={2}
              value={form.review}
              onChange={(e) => setForm({ ...form, review: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 p-2"
              placeholder='"Excellent collaboration and strong technical delivery."'
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/70">Order</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 p-2"
              placeholder="1"
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              id="published"
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            <label htmlFor="published" className="text-sm">Published</label>
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/70">Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/70">Logo</label>
            <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] || null)} />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onCancel?.()}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSave || saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : initial ? "Save Changes" : "Create"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
