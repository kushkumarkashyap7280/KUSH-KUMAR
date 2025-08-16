import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  listExperiences,
  deleteExperience,
  updateExperience,
} from "../apis/experiences";
import ExperienceForm from "./ExperienceForm";

export default function ExperiencesManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const sorted = useMemo(
    () => [...items].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)).reverse(),
    [items]
  );

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await listExperiences();
      setItems(res.data?.data?.items || res.data?.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load experiences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("Delete this experience?")) return;
    try {
      await deleteExperience(id);
      setItems((s) => s.filter((x) => x._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Delete failed");
    }
  };

  const onTogglePublish = async (row) => {
    try {
      const res = await updateExperience(row._id, { published: !row.published });
      const updated = res.data?.data?.experience || row;
      setItems((s) => s.map((x) => (x._id === row._id ? updated : x)));
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Update failed");
    }
  };

  const onNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  const onEdit = (row) => {
    setEditing(row);
    setShowForm(true);
  };

  const onSaved = (saved) => {
    setShowForm(false);
    setEditing(null);
    if (!saved) return;
    setItems((s) => {
      const exists = s.some((x) => x._id === saved._id);
      return exists ? s.map((x) => (x._id === saved._id ? saved : x)) : [saved, ...s];
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <motion.h2
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xl font-semibold"
        >
          Experiences
        </motion.h2>
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={onNew}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          New Experience
        </motion.button>
      </div>

      {error && (
        <div className="rounded-md border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-white/70">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {sorted.map((row, i) => (
            <motion.div
              key={row._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * i }}
              whileHover={{ scale: 1.01 }}
              className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur"
            >
              {/* subtle glow orbs */}
              <div className="pointer-events-none absolute -top-10 -left-10 h-16 w-16 rounded-full bg-blue-500/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-10 -right-10 h-16 w-16 rounded-full bg-rose-500/10 blur-2xl" />
              <div className="flex items-start gap-3">
                {row.logoPath ? (
                  <img
                    src={row.logoPath}
                    alt={row.company}
                    className="h-12 w-12 rounded-lg border border-white/10 object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white/60">
                    {row.company?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-sm font-semibold">
                      {row.role} · <span className="text-white/80">{row.company}</span>
                    </div>
                    <span className="text-xs text-white/60">{row.location || ""}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/60">
                    <span>Order: {row.order ?? "-"}</span>
                    {row.current && <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-200">Current</span>}
                    {row.published ? (
                      <span className="rounded bg-blue-500/20 px-2 py-0.5 text-blue-200">Published</span>
                    ) : (
                      <span className="rounded bg-slate-500/20 px-2 py-0.5 text-slate-200">Draft</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 line-clamp-2 text-sm text-white/70">{row.review}</div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => onTogglePublish(row)}
                  className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs hover:bg-slate-600"
                >
                  {row.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => onEdit(row)}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(row._id)}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-xs hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showForm && (
        <ExperienceForm
          initial={editing}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}
