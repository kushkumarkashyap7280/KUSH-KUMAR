import { AdminProvider, useAdmin } from "./context/AdminContext";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./components/Login";
import CustomCursor from "./components/CustomCursor";

function AppContent() {
  const { user, loading, showLogin } = useAdmin();

  if (loading) return <div>Loading...</div>;

  if (showLogin) return <Login />;

  return user ? <AdminLayout /> : <PublicLayout />;
}

export default function App() {
  return (
    <AdminProvider>
      <CustomCursor />
      <AppContent />
    </AdminProvider>
  );
}
