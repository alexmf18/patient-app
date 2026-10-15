import { createBrowserRouter, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AppLayout from "./components/AppLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PatientListPage from "./pages/PatientListPage";
import PatientFormPage from "./pages/PatientFormPage";
import PatientDetailPage from "./pages/PatientDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import Logo from "./components/Logo";

function SessionCheck() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-tray" role="status">
      <Logo />
      <p className="text-sm text-ink-3">Comprobando tu sesión…</p>
    </div>
  );
}

function ProtectedRoute() {
  const { isAuthenticated, checking } = useAuth();
  const location = useLocation();
  if (checking) return <SessionCheck />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return <AppLayout />;
}

function PublicRoute() {
  const { isAuthenticated, checking } = useAuth();
  const location = useLocation();
  if (checking) return <SessionCheck />;
  if (isAuthenticated) return <Navigate to={location.state?.from?.pathname || "/dashboard"} replace />;
  return <Outlet />;
}

function CatchAll() {
  const { isAuthenticated, checking } = useAuth();
  if (checking) return <SessionCheck />;
  return isAuthenticated ? (
    <AppLayout>
      <NotFoundPage />
    </AppLayout>
  ) : (
    <NotFoundPage standalone />
  );
}

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/patients", element: <PatientListPage /> },
      { path: "/patients/new", element: <PatientFormPage /> },
      { path: "/patients/:id", element: <PatientDetailPage /> },
      { path: "/patients/:id/edit", element: <PatientFormPage /> },
    ],
  },
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "*", element: <CatchAll /> },
]);
