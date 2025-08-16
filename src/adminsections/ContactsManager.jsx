import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { listContacts } from "../apis/contacts";

export default function ContactsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await listContacts();
      setItems(res.data?.data?.items || res.data?.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }
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
          Contacts
        </motion.h2>
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={refresh}
          className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600"
        >
          Refresh
        </motion.button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-md border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200"
        >
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className="text-white/70">Loading...</div>
      ) : items.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/60">
          No contacts yet.
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="overflow-hidden rounded-xl border border-white/10"
        >
          {items.map((c) => (
            <motion.div
              key={c._id}
              variants={item}
              whileHover={{ scale: 1.01 }}
              className="grid gap-3 bg-white/5 p-4 md:grid-cols-5 border-b border-white/10 last:border-b-0 relative"
            >
              {/* subtle glow orbs */}
              <div className="pointer-events-none absolute -top-10 -left-10 h-16 w-16 rounded-full bg-blue-500/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-10 -right-10 h-16 w-16 rounded-full bg-rose-500/10 blur-2xl" />

              <div className="md:col-span-2">
                <div className="text-sm font-semibold">{c.name || "Anonymous"}</div>
                <div className="text-xs text-white/70">{c.email}</div>
                <div className="mt-1 text-xs text-white/60">{new Date(c.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-white/60">Topic</div>
                <div className="text-sm">{c.topic || "—"}</div>
                <div className="mt-1 text-xs uppercase text-white/60">Type</div>
                <div className="text-sm">{c.type || "other"}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-xs uppercase text-white/60">Message</div>
                <div className="whitespace-pre-wrap text-sm text-white/90">{c.message}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
