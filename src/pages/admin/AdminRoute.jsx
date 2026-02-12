import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const role = localStorage.getItem("role");

  // If NOT admin → redirect to home
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // If admin → allow access
  return <Outlet />;
}
