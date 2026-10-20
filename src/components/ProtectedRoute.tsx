import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

// only logged-in users can see the pages inside
function ProtectedRoute() {
  const currentUser = useAppSelector((state) => state.user.currentUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;