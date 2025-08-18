import { lazy, Suspense, useEffect, useState } from "react";
import { AdminProvider, useAdmin } from "./context/AdminContext";
import { LoaderProvider, useLoader } from "./context";
import Loader from "./components/Loader";

const PublicLayout = lazy(() => import("./layouts/PublicLayout"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const Login = lazy(() => import("./components/Login"));
const CustomCursor = lazy(() => import("./components/CustomCursor"));

function AppContent() {
  const { user, loading, showLogin } = useAdmin();
  const { start, stop } = useLoader();

  // Drive global loader from admin loading state
  useEffect(() => {
    if (loading) start();
    else stop();
  }, [loading, start, stop]);

  // While data is loading, render nothing and let the overlay loader show
  if (loading) return null;

  return (
    <Suspense fallback={null}>
      {showLogin ? <Login /> : user ? <AdminLayout /> : <PublicLayout />}
    </Suspense>
  );
}

export default function App() {
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    // Enable custom cursor only on devices likely to be laptops/desktops
    const mq = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    const update = () => setShowCursor(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <LoaderProvider>
      <AdminProvider>
        {/* Background removed as requested */}
        {showCursor && (
          <Suspense fallback={null}>
            <CustomCursor />
          </Suspense>
        )}
        <AppContent />
        <Loader />
      </AdminProvider>
    </LoaderProvider>
  );
}

