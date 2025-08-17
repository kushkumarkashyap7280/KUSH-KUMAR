import React, { useEffect, useMemo, useState } from "react";
import { FiPlus, FiSave, FiEdit2, FiTrash2, FiUpload, FiX, FiRefreshCw } from "react-icons/fi";
import {
  listExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../apis/experiences";
import { toast } from "sonner";
import { confirmToast } from "../components/ConfirmToast";

const emptyForm = {
  role: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  responsibilities: "",
  tags: "",
  review: "",
  order: 0,
  published: true,
};

export default function ExperiencesManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const isEdit = useMemo(() => Boolean(editingId), [editingId]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const req = listExperiences();
      toast.promise(req, {
        loading: "Loading experiences…",
        success: "Experiences loaded",
        error: (e) => e?.response?.data?.message || "Failed to load experiences",
      });
      const res = await req;
      setItems(res.data.data.items || []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load experiences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setLogoFile(null);
    setProgress(0);
    setShowForm(true);
  };

  const startCreate = () => {
    setEditingId(null);
    resetForm();
    setShowForm(true);
  };

  const startEdit = (it) => {
    setEditingId(it._id);
    setForm({
      role: it.role || "",
      company: it.company || "",
      location: it.location || "",
      startDate: it.startDate ? it.startDate.substring(0, 10) : "",
      endDate: it.endDate ? it.endDate.substring(0, 10) : "",
      current: !!it.current,
      responsibilities: Array.isArray(it.responsibilities) ? it.responsibilities.join(", ") : "",
      tags: Array.isArray(it.tags) ? it.tags.join(", ") : "",
      review: it.review || "",
      order: typeof it.order === "number" ? it.order : 0,
      published: !!it.published,
    });
    setImageFile(null);
    setLogoFile(null);
    setProgress(0);
    setShowForm(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setProgress(0);
    try {
      const fd = new FormData();
      fd.append("role", form.role);
      fd.append("company", form.company);
      if (form.location) fd.append("location", form.location);
      if (form.startDate) fd.append("startDate", form.startDate);
      if (form.endDate) fd.append("endDate", form.endDate);
      fd.append("current", String(!!form.current));
      if (form.review) fd.append("review", form.review);
      fd.append("order", String(Number(form.order) || 0));
      fd.append("published", String(!!form.published));
      // arrays
      const resp = (form.responsibilities || "").split(",").map((s) => s.trim()).filter(Boolean);
      const tags = (form.tags || "").split(",").map((s) => s.trim()).filter(Boolean);
      resp.forEach((r) => fd.append("responsibilities", r));
      tags.forEach((t) => fd.append("tags", t));

      if (imageFile) fd.append("image", imageFile);
      if (logoFile) fd.append("logo", logoFile);

      const config = (imageFile || logoFile)
        ? {
            onUploadProgress: (evt) => {
              if (!evt.total) return;
              setProgress(Math.round((evt.loaded * 100) / evt.total));
            },
          }
        : {};

      await toast.promise(
        isEdit ? updateExperience(editingId, fd, config) : createExperience(fd, config),
        {
          loading: isEdit ? "Updating experience…" : "Creating experience…",
          success: isEdit ? "Experience updated" : "Experience created",
          error: (err) => err?.response?.data?.message || err?.message || "Failed to save",
        }
      );
      await load();
      setEditingId(null);
      resetForm();
      setShowForm(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to save");
    } finally {
      setSubmitting(false);
      setProgress(0);
    }
  };

  const onDelete = async (id) => {
    const ok = await confirmToast({ title: "Delete this experience?", description: "This action cannot be undone." });
    if (!ok) return;
    try {
      await toast.promise(
        deleteExperience(id),
        {
          loading: "Deleting experience…",
          success: "Experience deleted",
          error: (err) => err?.response?.data?.message || err?.message || "Delete failed",
        }
      );
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Delete failed");
    }
  };

  const onCancel = () => {
    setEditingId(null);
    resetForm();
    setShowForm(false);
  };

  return (
    <section id="experiences" className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/90 backdrop-blur scroll-mt-24">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Experiences</h2>
        <div className="flex items-center gap-2">
          <button onClick={load} className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15">
            <FiRefreshCw /> Refresh
          </button>
          <button onClick={startCreate} className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15">
            <FiPlus /> New
          </button>
          {showForm && !isEdit && (
            <button onClick={() => { resetForm(); setShowForm(false); }} className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15">
              <FiX /> Hide Form
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-white/10 text-white/70">
            <tr>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Company</th>
              <th className="px-3 py-2">Start</th>
              <th className="px-3 py-2">End</th>
              <th className="px-3 py-2">Current</th>
              <th className="px-3 py-2">Published</th>
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-3 py-3" colSpan={8}>Loading…</td></tr>
            ) : error ? (
              <tr><td className="px-3 py-3 text-red-300" colSpan={8}>{error}</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="px-3 py-3 text-white/70" colSpan={8}>No experiences yet.</td></tr>
            ) : (
              items.map((it) => (
                <tr key={it._id} className="odd:bg-white/0 even:bg-white/[0.03]">
                  <td className="px-3 py-2">{it.role}</td>
                  <td className="px-3 py-2">{it.company}</td>
                  <td className="px-3 py-2">{it.startDate?.substring(0,10) || ""}</td>
                  <td className="px-3 py-2">{it.current ? "Present" : (it.endDate?.substring(0,10) || "")}</td>
                  <td className="px-3 py-2">{it.current ? "Yes" : "No"}</td>
                  <td className="px-3 py-2">{it.published ? "Yes" : "No"}</td>
                  <td className="px-3 py-2">{it.order ?? 0}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(it)} className="inline-flex items-center gap-1 rounded border border-white/10 px-2 py-1 text-[11px] hover:bg-white/10"><FiEdit2 /> Edit</button>
                      <button onClick={() => onDelete(it._id)} className="inline-flex items-center gap-1 rounded border border-white/10 px-2 py-1 text-[11px] text-red-300 hover:bg-white/10"><FiTrash2 /> Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-medium text-sm">{isEdit ? "Edit Experience" : "Create Experience"}</h3>
          {isEdit && (
            <button onClick={onCancel} className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15"><FiX /> Cancel</button>
          )}
        </div>
        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-xs">
            <span className="mb-1 block text-white/70">Role</span>
            <input className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={form.role} onChange={(e)=>setForm({...form, role:e.target.value})} required />
          </label>
          <label className="text-xs">
            <span className="mb-1 block text-white/70">Company</span>
            <input className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={form.company} onChange={(e)=>setForm({...form, company:e.target.value})} required />
          </label>
          <label className="text-xs">
            <span className="mb-1 block text-white/70">Location</span>
            <input className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={form.location} onChange={(e)=>setForm({...form, location:e.target.value})} />
          </label>
          <label className="text-xs">
            <span className="mb-1 block text-white/70">Start Date</span>
            <input type="date" className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={form.startDate} onChange={(e)=>setForm({...form, startDate:e.target.value})} required />
          </label>
          <label className="text-xs">
            <span className="mb-1 block text-white/70">End Date</span>
            <input type="date" className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={form.endDate} onChange={(e)=>setForm({...form, endDate:e.target.value})} disabled={form.current} />
          </label>
          <label className="text-xs inline-flex items-center gap-2">
            <input type="checkbox" checked={form.current} onChange={(e)=>setForm({...form, current:e.target.checked, endDate: e.target.checked ? "" : form.endDate})} />
            <span>Current</span>
          </label>
          <label className="text-xs sm:col-span-2">
            <span className="mb-1 block text-white/70">Responsibilities (comma separated)</span>
            <input className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={form.responsibilities} onChange={(e)=>setForm({...form, responsibilities:e.target.value})} />
          </label>
          <label className="text-xs sm:col-span-2">
            <span className="mb-1 block text-white/70">Tags (comma separated)</span>
            <input className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={form.tags} onChange={(e)=>setForm({...form, tags:e.target.value})} />
          </label>
          <label className="text-xs sm:col-span-2">
            <span className="mb-1 block text-white/70">Review</span>
            <textarea rows={3} className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={form.review} onChange={(e)=>setForm({...form, review:e.target.value})} />
          </label>
          <label className="text-xs">
            <span className="mb-1 block text-white/70">Order</span>
            <input type="number" className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={form.order} onChange={(e)=>setForm({...form, order:e.target.value})} />
          </label>
          <label className="text-xs inline-flex items-center gap-2">
            <input type="checkbox" checked={form.published} onChange={(e)=>setForm({...form, published:e.target.checked})} />
            <span>Published</span>
          </label>

          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="block text-xs text-white/70 mb-1">Image</span>
              <label className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15 cursor-pointer">
                <FiUpload />
                <span>Select Image</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e)=> setImageFile(e.target.files?.[0] || null)} />
              </label>
              {imageFile && <div className="mt-1 text-[11px] text-white/70">{imageFile.name}</div>}
            </div>
            <div>
              <span className="block text-xs text-white/70 mb-1">Logo</span>
              <label className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15 cursor-pointer">
                <FiUpload />
                <span>Select Logo</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e)=> setLogoFile(e.target.files?.[0] || null)} />
              </label>
              {logoFile && <div className="mt-1 text-[11px] text-white/70">{logoFile.name}</div>}
            </div>
          </div>

          {submitting && (imageFile || logoFile) && (
            <div className="sm:col-span-2">
              <div className="h-2 w-full rounded bg-white/10 overflow-hidden">
                <div className="h-full bg-white/80" style={{ width: `${progress}%`, transition: "width 120ms ease" }} />
              </div>
              <div className="mt-1 text-[11px] text-white/70">Uploading… {progress}%</div>
            </div>
          )}

          <div className="sm:col-span-2 flex items-center gap-2 pt-2">
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white text-black px-4 py-2 text-xs font-semibold hover:bg-white/90 disabled:opacity-70">
              <FiSave /> {submitting ? "Saving…" : isEdit ? "Update" : "Create"}
            </button>
            {isEdit && (
              <button type="button" onClick={onCancel} className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 py-2 text-xs hover:bg-white/15">
                <FiX /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      )}
    </section>
  );
}
