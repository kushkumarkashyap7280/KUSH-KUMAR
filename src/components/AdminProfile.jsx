import React, { useEffect, useMemo, useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { FiEdit2, FiSave, FiX, FiUpload, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "sonner";
import { confirmToast } from "./ConfirmToast";

export default function AdminProfile() {
  const { user, update } = useAdmin();
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const initial = useMemo(() => ({
    Fname: user?.Fname || "",
    Lname: user?.Lname || "",
    email: user?.email || "",
    resume: user?.resume || "",
    avatar: user?.avatar || "",
    description: user?.description || "",
  }), [user]);

  const [form, setForm] = useState(initial);
  const [avatarFile, setAvatarFile] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // Keep form in sync if user changes (e.g., after refresh or update)
  useEffect(() => {
    setForm(initial);
    setNewPassword("");
    setConfirmPassword("");
  }, [initial]);

  // Qualifications editor (local only; API accepts full array, not returned by /me)
  const [qualifications, setQualifications] = useState([]);
  const [editingQualIndex, setEditingQualIndex] = useState(-1);

  // Initialize qualifications from user if available (e.g., when provided by another endpoint or after update)
  useEffect(() => {
    const source = user?.qualification;
    if (Array.isArray(source)) {
      setQualifications(
        source.map((q) => ({
          instituteLink: q?.instituteLink || "",
          mediaUrl: q?.mediaUrl || "",
          mediaType: q?.mediaType || "svg",
          title: q?.title || "",
          desc: q?.desc || "",
          // UI uses comma string; backend expects array
          skills: Array.isArray(q?.skills) ? q.skills.join(", ") : (q?.skills || ""),
          // Normalize date to yyyy-mm-dd for input[type=date]
          from: q?.from ? String(q.from).slice(0, 10) : "",
          to: q?.to ? String(q.to).slice(0, 10) : "",
          isPublished: Boolean(q?.isPublished),
          _id: q?._id,
        }))
      );
    }
  }, [user?.qualification]);

  const handleField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const addQualification = () => {
    setQualifications((q) => [
      ...q,
      {
        instituteLink: "",
        mediaUrl: "",
        mediaType: "svg", // enum: svg | image
        title: "",
        desc: "",
        skills: "", // comma separated input, will split
        from: "",
        to: "",
        isPublished: false,
      },
    ]);
  };

  const updateQualification = (idx, key, val) => {
    setQualifications((arr) => arr.map((q, i) => (i === idx ? { ...q, [key]: val } : q)));
  };

  const removeQualification = (idx) => {
    setQualifications((arr) => arr.filter((_, i) => i !== idx));
  };

  const startEditQualification = (idx) => setEditingQualIndex(idx);
  const cancelEditQualification = () => setEditingQualIndex(-1);

  // Save only qualifications (without other profile fields)
  const saveQualifications = async () => {
    if (!Array.isArray(qualifications)) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      const payloadQual = qualifications.map((q) => ({
        instituteLink: q?.instituteLink || "",
        mediaUrl: q?.mediaUrl || undefined,
        mediaType: q?.mediaType || undefined,
        title: q?.title || "",
        desc: q?.desc?.trim() ? q.desc.trim() : undefined,
        skills: typeof q?.skills === "string"
          ? q.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : Array.isArray(q?.skills) ? q.skills : [],
        from: q?.from || undefined,
        to: q?.to || undefined,
        isPublished: Boolean(q?.isPublished),
        _id: q?._id,
      }));
      fd.append("qualification", JSON.stringify(payloadQual));

      const req = update(fd);
      toast.promise(req, {
        loading: "Saving qualifications…",
        success: "Qualifications saved",
        error: (err) => err?.response?.data?.message || err?.message || "Failed to save qualifications",
      });
      await req;
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to save qualifications");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Validate password fields if provided
      if (newPassword || confirmPassword) {
        if (newPassword.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        if (newPassword !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
      }
      const fd = new FormData();
      if (form.Fname) fd.append("Fname", form.Fname);
      if (typeof form.Lname === "string") fd.append("Lname", form.Lname);
      if (form.email) fd.append("email", form.email);
      if (typeof form.description === "string") fd.append("description", form.description);
      if (form.resume) fd.append("resume", form.resume); // server accepts resume or resumeUrl
      if (avatarFile) fd.append("avatar", avatarFile);
      if (newPassword) fd.append("password", newPassword);

      // Send qualifications as JSON array under key 'qualification' (server expects this exact field)
      if (Array.isArray(qualifications) && qualifications.length > 0) {
        const payloadQual = qualifications.map((q) => ({
          instituteLink: q?.instituteLink || "",
          mediaUrl: q?.mediaUrl || undefined,
          mediaType: q?.mediaType || undefined,
          title: q?.title || "",
          desc: q?.desc?.trim() ? q.desc.trim() : undefined,
          skills: typeof q?.skills === "string"
            ? q.skills.split(",").map((s) => s.trim()).filter(Boolean)
            : Array.isArray(q?.skills) ? q.skills : [],
          from: q?.from || undefined,
          to: q?.to || undefined,
          isPublished: Boolean(q?.isPublished),
          _id: q?._id,
        }));
        fd.append("qualification", JSON.stringify(payloadQual));
      }
      // If uploading a file, wire onUploadProgress to show progress
      const config = avatarFile
        ? {
            onUploadProgress: (evt) => {
              if (!evt.total) return;
              const percent = Math.round((evt.loaded * 100) / evt.total);
              setUploadProgress(percent);
            },
          }
        : {};

      const req = update(fd, config);
      toast.promise(req, {
        loading: "Updating profile…",
        success: "Profile updated",
        error: (err) => err?.response?.data?.message || err?.message || "Failed to update",
      });
      await req;
      setEditing(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to update");
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  const onCancel = () => {
    setForm(initial);
    setAvatarFile(null);
    setUploadProgress(0);
    setQualifications([]);
    setNewPassword("");
    setConfirmPassword("");
    setShowNewPwd(false);
    setShowConfirmPwd(false);
    setEditing(false);
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 text-white/90 backdrop-blur">
      {/* Header Card */}
      <div className="mb-5 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={avatarFile ? URL.createObjectURL(avatarFile) : (form.avatar || user?.avatar || "")}
              alt="avatar"
              className="size-20 sm:size-24 rounded-full object-cover ring-2 ring-white/10"
            />
            {editing && (
              <label className="absolute bottom-0 right-0 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-2 py-1 text-[10px] hover:bg-black/70 cursor-pointer">
                <FiUpload />
                <span>Change</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setAvatarFile(file);
                  }}
                />
              </label>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">Admin Profile</h2>
            <p className="text-xs text-white/70 mt-1">Manage your name, email, avatar and resume link.</p>
          </div>
        </div>
        {user && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white text-black px-3 py-2 text-xs font-semibold hover:bg-white/90"
          >
            <FiEdit2 /> Edit Profile
          </button>
        )}
      </div>

      {!user && <div className="text-sm text-white/70">Please log in to view profile details.</div>}

      {user && !editing && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="text-white/60">Name</div>
            <div className="mt-0.5">{[user.Fname, user.Lname].filter(Boolean).join(" ") || "—"}</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="text-white/60">Email</div>
            <div className="mt-0.5">{user.email || "—"}</div>
          </div>
          <div className="sm:col-span-2 rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="text-white/60">Description</div>
            <div className="mt-0.5 whitespace-pre-wrap break-words">{user.description || "—"}</div>
          </div>
          <div className="sm:col-span-2 rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="text-white/60">Resume URL</div>
            <div className="mt-0.5 break-all">
              {user.resume ? (
                <a href={user.resume} target="_blank" rel="noreferrer" className="underline">
                  {user.resume}
                </a>
              ) : (
                "—"
              )}
            </div>
          </div>
        </div>
      )}

      {/* Read-only Qualifications below admin details */}
      {user && !editing && (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium">Qualifications</h3>
          </div>
          {Array.isArray(user.qualification) && user.qualification.filter((q) => q && q.isPublished).length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-white/10 text-white/70">
                  <tr>
                    <th className="px-3 py-2">Title</th>
                    <th className="px-3 py-2">From</th>
                    <th className="px-3 py-2">To</th>
                  </tr>
                </thead>
                <tbody>
                  {user.qualification
                    .filter((q) => q && q.isPublished)
                    .map((q, idx) => (
                      <tr key={q._id || idx} className="odd:bg-white/0 even:bg-white/[0.03]">
                        <td className="px-3 py-2">{q.title || "—"}</td>
                        <td className="px-3 py-2">{q.from ? String(q.from).slice(0,10) : "—"}</td>
                        <td className="px-3 py-2">{q.to ? String(q.to).slice(0,10) : "—"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-xs text-white/60">No published qualifications yet.</div>
          )}
        </div>
      )}

      {user && editing && (
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="text-xs">
              <span className="block mb-1 text-white/70">First Name</span>
              <input
                className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 text-sm"
                value={form.Fname}
                onChange={(e) => handleField("Fname", e.target.value)}
                required
              />
            </label>
            <label className="text-xs">
              <span className="block mb-1 text-white/70">Last Name</span>
              <input
                className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 text-sm"
                value={form.Lname}
                onChange={(e) => handleField("Lname", e.target.value)}
              />
            </label>
            <label className="text-xs sm:col-span-2">
              <span className="block mb-1 text-white/70">Email</span>
              <input
                type="email"
                className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 text-sm"
                value={form.email}
                onChange={(e) => handleField("email", e.target.value)}
                required
              />
            </label>
            <label className="text-xs relative">
              <span className="block mb-1 text-white/70">New Password</span>
              <input
                type={showNewPwd ? "text" : "password"}
                className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 pr-9 text-sm"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current"
              />
              <button
                type="button"
                onClick={() => setShowNewPwd((v) => !v)}
                className="absolute right-2 bottom-2.5 text-white/70 hover:text-white"
                aria-label={showNewPwd ? "Hide password" : "Show password"}
              >
                {showNewPwd ? <FiEyeOff /> : <FiEye />}
              </button>
            </label>
            <label className="text-xs relative">
              <span className="block mb-1 text-white/70">Confirm Password</span>
              <input
                type={showConfirmPwd ? "text" : "password"}
                className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 pr-9 text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPwd((v) => !v)}
                className="absolute right-2 bottom-2.5 text-white/70 hover:text-white"
                aria-label={showConfirmPwd ? "Hide password" : "Show password"}
              >
                {showConfirmPwd ? <FiEyeOff /> : <FiEye />}
              </button>
            </label>
            <label className="text-xs sm:col-span-2">
              <span className="block mb-1 text-white/70">Description</span>
              <textarea
                rows={3}
                placeholder="Short bio or headline..."
                className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 text-sm"
                value={form.description}
                onChange={(e) => handleField("description", e.target.value)}
              />
            </label>
            <label className="text-xs sm:col-span-2">
              <span className="block mb-1 text-white/70">Resume URL</span>
              <input
                type="url"
                placeholder="https://..."
                className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 text-sm"
                value={form.resume}
                onChange={(e) => handleField("resume", e.target.value)}
              />
            </label>
          </div>

          <div className="space-y-2">
            <span className="block text-xs text-white/70">Avatar</span>
            <div className="flex items-center gap-3">
              {(avatarFile || form.avatar) && (
                <img src={avatarFile ? URL.createObjectURL(avatarFile) : form.avatar} alt="avatar" className="size-12 rounded-full object-cover" />
              )}
              <label className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15 cursor-pointer">
                <FiUpload />
                <span>{avatarFile ? "Change" : "Upload"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setAvatarFile(file);
                  }}
                />
              </label>
              {avatarFile && (
                <button type="button" onClick={() => setAvatarFile(null)} className="text-xs rounded-md border border-white/10 px-2 py-1 hover:bg-white/10">
                  <FiX />
                </button>
              )}
            </div>
            {submitting && avatarFile && (
              <div className="mt-2">
                <div className="h-2 w-full rounded bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-white/80"
                    style={{ width: `${uploadProgress}%`, transition: "width 120ms ease" }}
                  />
                </div>
                <div className="mt-1 text-[11px] text-white/70">Uploading avatar… {uploadProgress}%</div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Qualifications</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={addQualification}
                  className="text-xs rounded-md border border-white/10 bg-gradient-to-r from-indigo-400/30 to-pink-400/30 px-3 py-1 hover:from-indigo-400/40 hover:to-pink-400/40"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={saveQualifications}
                  disabled={submitting || qualifications.length === 0}
                  className="text-xs rounded-md border border-white/10 bg-white/10 px-3 py-1 hover:bg-white/15 disabled:opacity-60"
                >
                  Save Qualifications
                </button>
              </div>
            </div>

            {qualifications.length === 0 && (
              <div className="text-xs text-white/60">(Optional) Add qualification entries to update.</div>
            )}

            {/* Simple list like ExperiencesManager */}
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-white/10 text-white/70">
                  <tr>
                    <th className="px-3 py-2">Title</th>
                    <th className="px-3 py-2">From</th>
                    <th className="px-3 py-2">To</th>
                    <th className="px-3 py-2">Published</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {qualifications.length === 0 ? (
                    <tr><td className="px-3 py-3 text-white/70" colSpan={5}>No qualifications yet.</td></tr>
                  ) : (
                    qualifications.map((q, idx) => (
                      <tr key={idx} className="odd:bg-white/0 even:bg-white/[0.03]">
                        <td className="px-3 py-2">{q.title || "—"}</td>
                        <td className="px-3 py-2">{q.from || ""}</td>
                        <td className="px-3 py-2">{q.to || ""}</td>
                        <td className="px-3 py-2">{q.isPublished ? "Yes" : "No"}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => startEditQualification(idx)} className="inline-flex items-center gap-1 rounded border border-white/10 px-2 py-1 text-[11px] hover:bg-white/10"><FiEdit2 /> Edit</button>
                            <button type="button" onClick={() => updateQualification(idx, "isPublished", !q.isPublished)} className="inline-flex items-center gap-1 rounded border border-white/10 px-2 py-1 text-[11px] hover:bg-white/10">{q.isPublished ? "Unpublish" : "Publish"}</button>
                            <button
                              type="button"
                              onClick={async () => {
                                const ok = await confirmToast({ title: "Delete this qualification?", description: "This removes it from the list. Click Save Qualifications to persist." });
                                if (!ok) return;
                                removeQualification(idx);
                                toast.success("Qualification removed (not yet saved)");
                              }}
                              className="inline-flex items-center gap-1 rounded border border-white/10 px-2 py-1 text-[11px] text-red-300 hover:bg-white/10"
                            >
                              <FiTrash2 /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Inline edit form */}
            {editingQualIndex >= 0 && (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-medium text-sm">Edit Qualification</h4>
                  <button type="button" onClick={cancelEditQualification} className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15"><FiX /> Close</button>
                </div>
                {(() => {
                  const q = qualifications[editingQualIndex] || {};
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="text-xs">
                        <span className="mb-1 block text-white/70">Title</span>
                        <input className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={q.title || ""} onChange={(e)=>updateQualification(editingQualIndex, "title", e.target.value)} />
                      </label>
                      <label className="text-xs">
                        <span className="mb-1 block text-white/70">Institute Link</span>
                        <input className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={q.instituteLink || ""} onChange={(e)=>updateQualification(editingQualIndex, "instituteLink", e.target.value)} />
                      </label>
                      <label className="text-xs">
                        <span className="mb-1 block text-white/70">Media URL</span>
                        <input className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={q.mediaUrl || ""} onChange={(e)=>updateQualification(editingQualIndex, "mediaUrl", e.target.value)} />
                      </label>
                      <label className="text-xs">
                        <span className="mb-1 block text-white/70">Media Type</span>
                        <select className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={q.mediaType || "svg"} onChange={(e)=>updateQualification(editingQualIndex, "mediaType", e.target.value)}>
                          <option value="svg">SVG</option>
                          <option value="image">Image</option>
                        </select>
                      </label>
                      <label className="text-xs sm:col-span-2">
                        <span className="mb-1 block text-white/70">Description</span>
                        <textarea rows={3} className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={q.desc || ""} onChange={(e)=>updateQualification(editingQualIndex, "desc", e.target.value)} />
                      </label>
                      <label className="text-xs sm:col-span-2">
                        <span className="mb-1 block text-white/70">Skills (comma separated)</span>
                        <input className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={q.skills || ""} onChange={(e)=>updateQualification(editingQualIndex, "skills", e.target.value)} />
                      </label>
                      <label className="text-xs">
                        <span className="mb-1 block text-white/70">From</span>
                        <input type="date" className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={q.from || ""} onChange={(e)=>updateQualification(editingQualIndex, "from", e.target.value)} />
                      </label>
                      <label className="text-xs">
                        <span className="mb-1 block text-white/70">To</span>
                        <input type="date" className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 text-sm" value={q.to || ""} onChange={(e)=>updateQualification(editingQualIndex, "to", e.target.value)} />
                      </label>
                      <label className="text-xs inline-flex items-center gap-2">
                        <input type="checkbox" checked={!!q.isPublished} onChange={(e)=>updateQualification(editingQualIndex, "isPublished", e.target.checked)} />
                        <span>Published</span>
                      </label>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white text-black px-4 py-2 text-xs font-semibold hover:bg-white/90 disabled:opacity-70"
            >
              <FiSave /> {submitting ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={onCancel} className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 py-2 text-xs hover:bg-white/15">
              <FiX /> Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
