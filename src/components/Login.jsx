import { useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { toast } from "sonner";
import { motion as m, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiLogIn, FiX } from "react-icons/fi";

export default function Login() {
  const { login, dispatch } = useAdmin();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await toast.promise(
        login(form),
        {
          loading: "Signing in…",
          success: "Logged in",
          error: (err) => err?.response?.data?.message || err?.message || "Login failed",
        }
      );
      dispatch({ type: "TOGGLE_LOGIN" }); // close login after success
    } catch {
      // toast.promise already handled error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <m.div
        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <m.form
          onSubmit={handleSubmit}
          className="relative w-[92vw] max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-white to-white/90 p-6 text-black shadow-2xl"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <button
            type="button"
            onClick={() => dispatch({ type: "TOGGLE_LOGIN" })}
            className="absolute right-3 top-3 inline-flex items-center justify-center rounded-md border border-black/10 bg-black/5 p-2 text-black/70 hover:bg-black/10"
            aria-label="Close"
          >
            <FiX />
          </button>

          <h2 className="text-xl font-semibold mb-5">Admin Login</h2>

          <label className="mb-3 block text-sm">
            <span className="sr-only">Email</span>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 inline-flex items-center text-black/50">
                <FiMail />
              </span>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-black/20 bg-white px-9 py-2 outline-none placeholder:text-black/40 focus:border-black/40"
                required
              />
            </div>
          </label>

          <label className="mb-5 block text-sm">
            <span className="sr-only">Password</span>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 inline-flex items-center text-black/50">
                <FiLock />
              </span>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-lg border border-black/20 bg-white px-9 py-2 outline-none placeholder:text-black/40 focus:border-black/40"
                required
              />
            </div>
          </label>

          <m.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 font-medium text-white hover:bg-black/90 disabled:opacity-70"
          >
            <FiLogIn /> {loading ? "Signing in…" : "Login"}
          </m.button>
        </m.form>
      </m.div>
    </AnimatePresence>
  );
}
