import React, { useEffect, useMemo, useState } from "react";
import { FiPlus, FiSave, FiEdit2, FiTrash2, FiUpload, FiX, FiRefreshCw } from "react-icons/fi";
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../apis/projects";
import { toast } from "sonner";
import { confirmToast } from "../components/ConfirmToast";

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  techStack: "",
  features: "",
  outcome: "",
  repoUrl: "",
  demoUrl: "",
  status: "in_progress",
  order: 0,
  published: true,
};

export default function ProjectsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [imagesFiles, setImagesFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [pending, setPending] = useState({}); // id -> { published }
  const [savingPending, setSavingPending] = useState(false);

  const isEdit = useMemo(() => Boolean(editingId), [editingId]);

  const getNextOrder = () => {
    const nums = (items || [])
      .map((it) => Number(it?.order))
      .filter((n) => Number.isFinite(n));
    const max = nums.length ? Math.max(...nums) : 0;
    return max + 1;
  };

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const req = listProjects();
      toast.promise(req, {
        loading: "Loading projects…",
        success: "Projects loaded",
        error: (e) => e?.response?.data?.message || "Failed to load projects",
      });
      const res = await req;
      setItems(res.data.data.items || []);
      setPending({}); // clear any staged changes on full reload
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const effectivePublished = (it) =>
    Object.prototype.hasOwnProperty.call(pending, it._id)
      ? !!pending[it._id]?.published
      : !!it.published;

  const hasPending = useMemo(() => Object.keys(pending).length > 0, [pending]);

  const togglePublishedStage = (it) => {
    const current = effectivePublished(it);
    const nextVal = !current;
    setPending((prev) => {
      const orig = !!it.published;
      const newEntry = { ...prev, [it._id]: { published: nextVal } };
      // If staged value equals original, remove from pending
      if (nextVal === orig) {
        delete newEntry[it._id];
      }
      return { ...newEntry };
    });
  };

  const savePending = async () => {
    if (!hasPending) return;
    setSavingPending(true);
    try {
      const entries = Object.entries(pending);
      await toast.promise(
        Promise.all(entries.map(([id, change]) => updateProject(id, change))),
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
  };

  const discardPending = () => setPending({});

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({ ...emptyForm, order: getNextOrder() });
    setThumbnailFile(null);
    setImagesFiles([]);
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
      title: it.title || "",
      slug: it.slug || "",
      description: it.description || "",
      techStack: Array.isArray(it.techStack) ? it.techStack.join(", ") : "",
      features: Array.isArray(it.features) ? it.features.join(", ") : "",
      outcome: it.outcome || "",
      repoUrl: it.repoUrl || "",
      demoUrl: it.demoUrl || "",
      status: it.status || "in_progress",
      order: Number.isFinite(Number(it.order)) ? Number(it.order) : getNextOrder(),
      published: !!it.published,
    });
    setThumbnailFile(null);
    setImagesFiles([]);
    setProgress(0);
    setShowForm(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setProgress(0);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("slug", form.slug);
      if (form.description) fd.append("description", form.description);
      // arrays as repeated fields
      const tech = (form.techStack || "").split(",").map((s)=>s.trim()).filter(Boolean);
      const feats = (form.features || "").split(",").map((s)=>s.trim()).filter(Boolean);
      tech.forEach((t)=> fd.append("techStack", t));
      feats.forEach((f)=> fd.append("features", f));
      if (form.outcome) fd.append("outcome", form.outcome);
      if (form.repoUrl) fd.append("repoUrl", form.repoUrl);
      if (form.demoUrl) fd.append("demoUrl", form.demoUrl);
      fd.append("status", form.status || "in_progress");
      fd.append("order", String(Number(form.order) || 0));
      fd.append("published", String(!!form.published));

      if (thumbnailFile) fd.append("thumbnail", thumbnailFile);
      if (Array.isArray(imagesFiles) && imagesFiles.length) {
        imagesFiles.forEach((f) => fd.append("images", f));
      }

      const sendConfig = (thumbnailFile || (imagesFiles && imagesFiles.length))
        ? {
            onUploadProgress: (evt) => {
              if (!evt.total) return;
              setProgress(Math.round((evt.loaded * 100) / evt.total));
            },
          }
        : {};

      await toast.promise(
        isEdit ? updateProject(editingId, fd, sendConfig) : createProject(fd, sendConfig),
        {
          loading: isEdit ? "Updating project…" : "Creating project…",
          success: isEdit ? "Project updated" : "Project created",
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
    const ok = await confirmToast({ title: "Delete this project?", description: "This action cannot be undone." });
    if (!ok) return;
    try {
      await toast.promise(
        deleteProject(id),
        {
          loading: "Deleting project…",
          success: "Project deleted",
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
    <section id="projects" className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/90 backdrop-blur scroll-mt-24">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Projects</h2>
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
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Slug</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Published</th>
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-3 py-3" colSpan={6}>Loading…</td></tr>
            ) : error ? (
              <tr><td className="px-3 py-3 text-red-300" colSpan={6}>{error}</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="px-3 py-3 text-white/70" colSpan={6}>No projects yet.</td></tr>
            ) : (
              items.map((it) => (
                <tr key={it._id} className="odd:bg-white/0 even:bg-white/[0.03]">
                  <td className="px-3 py-2">{it.title}</td>
                  <td className="px-3 py-2">{it.slug}</td>
                  <td className="px-3 py-2">{it.status}</td>
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
          <h3 className="font-medium text-sm">{isEdit ? "Edit Project" : "Create Project"}</h3>
          {isEdit && (
            <button onClick={onCancel} className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15"><FiX /> Cancel</button>
          )}
        </div>
        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-xs">
            <span className="mb-1 block text-white/70">Title</span>
            <input className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} required />
          </label>
          <label className="text-xs">
            <span className="mb-1 block text-white/70">Slug</span>
            <input className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={form.slug} onChange={(e)=>setForm({...form, slug:e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")})} required />
          </label>
          <label className="text-xs sm:col-span-2">
            <span className="mb-1 block text-white/70">Description</span>
            <textarea rows={3} className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} />
          </label>
          <label className="text-xs sm:col-span-2">
            <span className="mb-1 block text-white/70">Tech Stack (comma separated; enums enforced server-side)</span>
            <input className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={form.techStack} onChange={(e)=>setForm({...form, techStack:e.target.value})} placeholder="react, node, mongodb" />
          </label>
          <label className="text-xs sm:col-span-2">
            <span className="mb-1 block text-white/70">Features (comma separated)</span>
            <input className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={form.features} onChange={(e)=>setForm({...form, features:e.target.value})} />
          </label>
          <label className="text-xs sm:col-span-2">
            <span className="mb-1 block text-white/70">Outcome</span>
            <textarea rows={2} className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={form.outcome} onChange={(e)=>setForm({...form, outcome:e.target.value})} />
          </label>
          <label className="text-xs">
            <span className="mb-1 block text-white/70">Repository URL</span>
            <input className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={form.repoUrl} onChange={(e)=>setForm({...form, repoUrl:e.target.value})} />
          </label>
          <label className="text-xs">
            <span className="mb-1 block text-white/70">Demo URL</span>
            <input className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={form.demoUrl} onChange={(e)=>setForm({...form, demoUrl:e.target.value})} />
          </label>
          <label className="text-xs">
            <span className="mb-1 block text-white/70">Order</span>
            <input type="number" className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={form.order} onChange={(e)=>setForm({...form, order:e.target.value})} />
          </label>
          <label className="text-xs">
            <span className="mb-1 block text-white/70">Status</span>
            <select className="w-full rounded bg-black/40 border border-white/20 px-3 py-2 text-sm text-white" value={form.status} onChange={(e)=>setForm({...form, status:e.target.value})}>
              <option value="in_progress">in_progress</option>
              <option value="completed">completed</option>
            </select>
          </label>
          <label className="text-xs inline-flex items-center gap-2">
            <input type="checkbox" checked={form.published} onChange={(e)=>setForm({...form, published:e.target.checked})} />
            <span>Published</span>
          </label>

          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="block text-xs text-white/70 mb-1">Thumbnail</span>
              <label className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15 cursor-pointer">
                <FiUpload />
                <span>Select Thumbnail</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e)=> setThumbnailFile(e.target.files?.[0] || null)} />
              </label>
              {thumbnailFile && <div className="mt-1 text-[11px] text-white/70">{thumbnailFile.name}</div>}
            </div>
            <div>
              <span className="block text-xs text-white/70 mb-1">Images (multiple)</span>
              <label className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15 cursor-pointer">
                <FiUpload />
                <span>Select Images</span>
                <input multiple type="file" accept="image/*" className="hidden" onChange={(e)=> setImagesFiles(Array.from(e.target.files || []))} />
              </label>
              {imagesFiles?.length > 0 && <div className="mt-1 text-[11px] text-white/70">{imagesFiles.length} files selected</div>}
            </div>
          </div>

          {submitting && (thumbnailFile || (imagesFiles && imagesFiles.length)) && (
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
