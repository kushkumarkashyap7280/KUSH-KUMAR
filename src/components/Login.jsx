import { useState } from "react";
import { useAdmin } from "../context/AdminContext";

export default function Login() {
  const { login, dispatch } = useAdmin();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      dispatch({ type: "TOGGLE_LOGIN" }); // close login after success
    } catch (err) {
      const msg = err?.message || "Login failed";
      alert(msg);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
