import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import type { ReactElement } from "react";

export default function GuestRoute({ children }: { children: ReactElement }) {
  const isAuthed = useSelector((state: RootState) => state.user.isAuthenticated);

  if (isAuthed) {
    return <Navigate to="/" replace />;
  }

  return children;
}
