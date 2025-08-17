import React, { useEffect, useMemo, useState } from "react";
import { FiRefreshCw, FiFilter, FiTrash2 } from "react-icons/fi";
import { listContacts, deleteContact } from "../apis/contacts";
import { toast } from "sonner";
import { confirmToast } from "../components/ConfirmToast";

export default function ContactsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [last1Day, setLast1Day] = useState(true);

  const params = useMemo(() => (last1Day ? { lastDays: 1 } : {}), [last1Day]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const req = listContacts(params);
      toast.promise(req, {
        loading: "Loading contacts…",
        success: "Contacts loaded",
        error: (e) => e?.response?.data?.message || "Failed to load contacts",
      });
      const res = await req;
      setItems(res.data.data.items || []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [last1Day]);

  const onDelete = async (id) => {
    if (!id) return;
    const ok = await confirmToast({ title: "Delete this contact?", description: "This action cannot be undone." });
    if (!ok) return;
    try {
      await toast.promise(
        deleteContact(id),
        {
          loading: "Deleting contact…",
          success: "Contact deleted",
          error: (err) => err?.response?.data?.message || err?.message || "Delete failed",
        }
      );
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Delete failed");
    }
  };

  const fmt = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <section id="contacts" className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/90 backdrop-blur scroll-mt-24">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          Contacts
          <span className="text-xs rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-white/80">
            {items?.length ?? 0}
          </span>
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLast1Day((v) => !v)}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15"
            title="Toggle All vs Last 1 Day"
          >
            <FiFilter /> {last1Day ? "Last 1 Day" : "All"}
          </button>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15"
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-white/10 text-white/70">
            <tr>
              <th className="px-3 py-2">When</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Topic</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Message</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-3 py-3" colSpan={7}>Loading…</td></tr>
            ) : error ? (
              <tr><td className="px-3 py-3 text-red-300" colSpan={7}>{error}</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="px-3 py-3 text-white/70" colSpan={7}>No contacts found.</td></tr>
            ) : (
              items.map((it) => (
                <tr key={it._id} className="odd:bg-white/0 even:bg-white/[0.03] align-top">
                  <td className="px-3 py-2 whitespace-nowrap">{fmt(it.createdAt)}</td>
                  <td className="px-3 py-2">{it.name || "—"}</td>
                  <td className="px-3 py-2"><a className="underline" href={`mailto:${it.email}`}>{it.email}</a></td>
                  <td className="px-3 py-2">{it.topic || "—"}</td>
                  <td className="px-3 py-2">{it.type}</td>
                  <td className="px-3 py-2 max-w-[420px]">
                    <div className="line-clamp-3 whitespace-pre-wrap text-white/80">{it.message}</div>
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => onDelete(it._id)} className="inline-flex items-center gap-1 rounded border border-white/10 px-2 py-1 text-[11px] text-red-300 hover:bg-white/10"><FiTrash2 /> Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
