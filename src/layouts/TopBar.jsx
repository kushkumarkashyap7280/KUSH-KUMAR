import React from "react";
import { useAdmin } from "../context/AdminContext";
import { FiMail, FiLogOut } from "react-icons/fi";

export default function TopBar() {
  const { user, logout } = useAdmin();

  const email = user?.email || "youremail@gmail.com";
  const nameInitial = (user?.name || email || "?").charAt(0).toUpperCase();
  const avatar = user?.avatar || user?.photoUrl || null;

  return (
    <header className="navbar scrolled">
      <div className="inner flex items-center">
        {/* Left: Small brand to mirror public navbar */}
        <div className="flex-1 flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-sm font-bold">
            AD
          </span>
          <span className="text-sm font-semibold text-white/80">Admin</span>
        </div>

        {/* Center: Title */}
        <div className="flex-1 flex justify-center">
          <div className="text-sm md:text-base font-semibold tracking-wide text-white/90">
            Admin Dashboard
          </div>
        </div>

        {/* Right: User chip + Logout */}
        <div className="flex-1 flex items-center justify-end gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2.5 py-1.5">
            {avatar ? (
              <img
                src={avatar}
                alt="avatar"
                className="size-7 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="size-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">
                {nameInitial}
              </div>
            )}
            <span className="hidden sm:flex items-center gap-1 text-xs md:text-sm text-white/80">
              <FiMail className="opacity-80" />
              {email}
            </span>
          </div>
          {user && (
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white text-black px-3 py-1.5 text-xs font-semibold hover:bg-white/90 active:scale-95"
            >
              <FiLogOut />
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
