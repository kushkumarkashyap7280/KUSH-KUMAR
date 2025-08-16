import React, { useState } from "react";
import { useAdmin } from "../context/AdminContext";

export default function AdminProfile() {
  const { user, update } = useAdmin();
  const [form, setForm] = useState({
    Fname: user?.Fname || "",
    Lname: user?.Lname || "",
    email: user?.email || "",
  });
  const [avatar, setAvatar] = useState(null);
  const [resume, setResume] = useState(user?.resume || user?.resumeUrl || "");
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let payload;
      if (avatar) {
        // If uploading a new avatar, use FormData
        payload = new FormData();
        if (form.Fname) payload.append("Fname", form.Fname);
        if (form.Lname) payload.append("Lname", form.Lname);
        if (form.email) payload.append("email", form.email);
        payload.append("avatar", avatar);
        if (resume) payload.append("resume", resume); // resume URL as text field
      } else {
        // Otherwise, send JSON body
        payload = {
          ...(form.Fname ? { Fname: form.Fname } : {}),
          ...(form.Lname ? { Lname: form.Lname } : {}),
          ...(form.email ? { email: form.email } : {}),
          ...(resume ? { resume } : {}),
        };
      }
      await update(payload);
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-5">
      <h3 className="mb-3 text-lg font-semibold">Profile</h3>
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-white/70">First Name</label>
          <input
            value={form.Fname}
            onChange={(e) => setForm({ ...form, Fname: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 p-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/70">Last Name</label>
          <input
            value={form.Lname}
            onChange={(e) => setForm({ ...form, Lname: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 p-2"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs text-white/70">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 p-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/70">Avatar</label>
          <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] || null)} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/70">Resume URL</label>
          <input
            type="url"
            placeholder="https://drive.google.com/file/d/FILE_ID/view?usp=sharing"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 p-2"
          />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </section>
  );
}
