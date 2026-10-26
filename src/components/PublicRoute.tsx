import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

// logged-in users are sent away from login and register
function PublicRoute() {
  const currentUser = useAppSelector((state) => state.user.currentUser);

  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default PublicRoute;