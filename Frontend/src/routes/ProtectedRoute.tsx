import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";

export default function ProtectedRoute() {
  const isAuthed = useSelector((state: RootState) => state.user.isAuthenticated);
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
