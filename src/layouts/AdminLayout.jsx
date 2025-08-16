import React, { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useAdmin } from "../context/AdminContext";
import ExperiencesManager from "../adminsections/ExperiencesManager";
import ProjectsManager from "../adminsections/ProjectsManager";
import PostsManager from "../adminsections/PostsManager";
import ContactsManager from "../adminsections/ContactsManager";
import Login from "../components/Login";
import AdminProfile from "../components/AdminProfile";



function SpinningKnot() {
  // simple animated 3D object
  const ref = React.useRef();
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.2;
      ref.current.rotation.y += delta * 0.3;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <torusKnotGeometry args={[1.2, 0.35, 128, 32]} />
      <meshStandardMaterial color="#60a5fa" metalness={0.3} roughness={0.2} />
    </mesh>
  );
}

const AdminLayout = () => {
  const { user, logout, showLogin, dispatch } = useAdmin();
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-900 text-white">
      {/* Three.js background */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Suspense fallback={null}>
            <SpinningKnot />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Header */}
      <header className="backdrop-blur-md/30 border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold tracking-tight"
          >
            Admin Dashboard
          </motion.h1>
          <div className="flex items-center gap-3">
            {user?.avatar && (
              <img
                src={user.avatar}
                alt={user.Fname}
                className="h-10 w-10 rounded-full border border-white/20 object-cover"
              />
            )}
            <div className="text-right">
              <div className="text-sm font-semibold">
                {user ? (
                  <>
                    {user.Fname} {user.Lname}
                  </>
                ) : (
                  "Not logged in"
                )}
              </div>
              <div className="text-xs text-white/70">{user?.email || ""}</div>
            </div>
            {user ? (
              <button
                onClick={logout}
                className="ml-2 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400/60"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch({ type: "TOGGLE_LOGIN" })}
                  className="ml-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowSignup(true)}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  Signup
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content: compose all admin sections similar to PublicLayout */}
      <main className="mx-auto max-w-7xl px-6 py-8 space-y-10">
        {user ? (
          <>
            <AdminProfile />
            <ExperiencesManager />
            <ProjectsManager />
            <PostsManager />
            <ContactsManager />
          </>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/80">
            <div className="mb-2 text-lg font-semibold">Admin access required</div>
            <div className="text-sm">Press Ctrl + Shift + K or click the Login button to sign in, or Signup to create an account.</div>
          </div>
        )}
      </main>

      {/* Login overlay */}
      {(showLogin || !user) && <Login />}
      {showSignup && <AdminSignup onClose={() => setShowSignup(false)} />}
    </div>
  );
};

export default AdminLayout;