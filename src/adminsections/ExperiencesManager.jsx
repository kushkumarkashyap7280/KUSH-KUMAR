import React, { useEffect, useMemo, useState, useCallback, memo } from "react";
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

function ExperiencesManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [pending, setPending] = useState({}); // id -> { published }
  const [savingPending, setSavingPending] = useState(false);

  const isEdit = useMemo(() => Boolean(editingId), [editingId]);

  const getNextOrder = useCallback(() => {
    const nums = (items || [])
      .map((it) => Number(it?.order))
      .filter((n) => Number.isFinite(n));
    const max = nums.length ? Math.max(...nums) : 0;
    return max + 1;
  }, [items]);

  const load = useCallback(async () => {
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
      setPending({}); // clear staged changes on reload
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load experiences");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const effectivePublished = useCallback(
    (it) =>
      Object.prototype.hasOwnProperty.call(pending, it._id)
        ? !!pending[it._id]?.published
        : !!it.published,
    [pending]
  );

  const hasPending = useMemo(() => Object.keys(pending).length > 0, [pending]);

  const togglePublishedStage = useCallback((it) => {
    const current = effectivePublished(it);
    const nextVal = !current;
    setPending((prev) => {
      const orig = !!it.published;
      const newEntry = { ...prev, [it._id]: { published: nextVal } };
      if (nextVal === orig) {
        delete newEntry[it._id];
      }
      return { ...newEntry };
    });
  }, [effectivePublished]);

  const savePending = useCallback(async () => {
    if (!hasPending) return;
    setSavingPending(true);
    try {
      const entries = Object.entries(pending);
      await toast.promise(
        Promise.all(entries.map(([id, change]) => updateExperience(id, change))),
        {
          loading: "Saving changes…",
          success: "Changes saved",
          error: (err) => err?.response?.data?.message || err?.message || "Failed to save changes",
        }
      );
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to save changes");
    } finally {
      setSavingPending(false);
    }
  }, [hasPending, pending, load]);

  const discardPending = useCallback(() => setPending({}), []);

  const resetForm = useCallback(() => {
    setForm({ ...emptyForm, order: getNextOrder() });
    setLogoFile(null);
    setProgress(0);
    setShowForm(true);
  }, [getNextOrder]);

  const startCreate = useCallback(() => {
    setEditingId(null);
    resetForm();
    setShowForm(true);
  }, [resetForm]);

  const startEdit = useCallback((it) => {
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
      order: Number.isFinite(Number(it.order)) ? Number(it.order) : getNextOrder(),
      published: !!it.published,
    });
    setLogoFile(null);
    setProgress(0);
    setShowForm(true);
  }, [getNextOrder]);

  const onSubmit = useCallback(async (e) => {
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

      if (logoFile) fd.append("logo", logoFile);

      const config = (logoFile)
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
  }, [isEdit, form, logoFile, editingId, load, resetForm]);

  const onDelete = useCallback(async (id) => {
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
  }, [load]);

  const onCancel = useCallback(() => {
    setEditingId(null);
    resetForm();
    setShowForm(false);
  }, [resetForm]);

  const rows = useMemo(() => items, [items]);

  return (
    <section id="experiences" className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/90 backdrop-blur scroll-mt-24">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Experiences</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={savePending}
            disabled={!hasPending || savingPending}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs border ${hasPending ? "bg-white text-black border-white/10 hover:bg-white/90" : "bg-white/10 text-white/60 border-white/10 cursor-not-allowed"}`}
          >
            <FiSave /> {savingPending ? "Saving…" : "Save Changes"}
          </button>
          {hasPending && (
            <button onClick={discardPending} className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15">
              <FiX /> Discard
            </button>
          )}
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
            ) : rows.length === 0 ? (
              <tr><td className="px-3 py-3 text-white/70" colSpan={8}>No experiences yet.</td></tr>
            ) : (
              rows.map((it) => (
                <tr key={it._id} className="odd:bg-white/0 even:bg-white/[0.03]">
                  <td className="px-3 py-2">{it.role}</td>
                  <td className="px-3 py-2">{it.company}</td>
                  <td className="px-3 py-2">{it.startDate?.substring(0,10) || ""}</td>
                  <td className="px-3 py-2">{it.current ? "Present" : (it.endDate?.substring(0,10) || "")}</td>
                  <td className="px-3 py-2">{it.current ? "Yes" : "No"}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => togglePublishedStage(it)}
                      disabled={savingPending}
                      className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] border ${effectivePublished(it) ? "bg-emerald-600/20 border-emerald-400/30 text-emerald-200 hover:bg-emerald-600/25" : "bg-white/10 border-white/15 text-white/80 hover:bg-white/15"}`}
                      title={effectivePublished(it) ? "Click to mark as Unpublished (staged)" : "Click to mark as Published (staged)"}
                    >
                      {effectivePublished(it) ? "Published" : "Unpublished"}
                      {Object.prototype.hasOwnProperty.call(pending, it._id) && <span className="ml-1 text-[10px] opacity-70">(staged)</span>}
                    </button>
                  </td>
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

          <div className="sm:col-span-2">
            <span className="block text-xs text-white/70 mb-1">Logo</span>
            <label className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15 cursor-pointer">
              <FiUpload />
              <span>Select Logo</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e)=> setLogoFile(e.target.files?.[0] || null)} />
            </label>
            {logoFile && <div className="mt-1 text:[11px] text-white/70">{logoFile.name}</div>}
          </div>

          {submitting && (logoFile) && (
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

export default memo(ExperiencesManager);
