import React, { useEffect } from "react";
import { useAdmin } from "../context/AdminContext";

import TopBar from "./TopBar";

import AdminProfile from "../components/AdminProfile";
import ExperiencesManager from "../adminsections/ExperiencesManager";
import ProjectsManager from "../adminsections/ProjectsManager";
import PostsManager from "../adminsections/PostsManager";
import ContactsManager from "../adminsections/ContactsManager";
import AdminFooter from "../sections/AdminFooter";
import GlowCard from "../components/GlowCard";
import AuthDebugger from "../components/AuthDebugger";

export default function AdminLayout() {
  const { user } = useAdmin();

  // Keyboard shortcuts: Alt+1..5 to navigate to anchored sections
  useEffect(() => {
    const map = {
      "1": "#profile",
      "2": "#experiences",
      "3": "#projects",
      "4": "#posts",
      "5": "#contacts",
    };

    const onKeyDown = (e) => {
      if (!e.altKey) return;
      const target = map[e.key];
      if (!target) return;
      e.preventDefault();
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      {/* Top Bar */}
      <TopBar />

      {/* Add Auth Debugger component */}
      <AuthDebugger />

      {/* Content - stacked sections like public layout */}
      <main className="mx-auto w-full max-w-7xl px-4 pt-24 md:pt-28 pb-8 sm:px-6">
        {user ? (
          <div className="space-y-8">
            <section id="profile" className="scroll-mt-24">
              <AdminProfile />
            </section>
            <section id="experiences" className="scroll-mt-24">
              <div className="mb-2 text-sm text-white/80">Experiences (Alt+2)</div>
              <GlowCard>
                <ExperiencesManager />
              </GlowCard>
            </section>
            <section id="projects" className="scroll-mt-24">
              <div className="mb-2 text-sm text-white/80">Projects (Alt+3)</div>
              <GlowCard>
                <ProjectsManager />
              </GlowCard>
            </section>
            <section id="posts" className="scroll-mt-24">
              <div className="mb-2 text-sm text-white/80">Posts (Alt+4)</div>
              <GlowCard>
                <PostsManager />
              </GlowCard>
            </section>
            <section id="contacts" className="scroll-mt-24">
              <div className="mb-2 text-sm text-white/80">Contacts (Alt+5)</div>
              <GlowCard>
                <ContactsManager />
              </GlowCard>
            </section>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/80 backdrop-blur">
            <div className="mb-2 text-lg font-semibold">Admin access required</div>
            <div className="text-sm">Please log in to continue.</div>
          </div>
        )}
      </main>
      {/* Floating quick links footer */}
      <AdminFooter />
    </div>
  );
}