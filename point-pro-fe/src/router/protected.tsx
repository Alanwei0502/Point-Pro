import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector, useSocket } from "~/hooks";
import { NameSpace } from "~/types";
import { getToken } from "~/utils";

export const ProtectedRoute = () => {
  const location = useLocation();

  const isAuthenticated = useAppSelector(({ auth }) => auth.isAuthenticated);

  const token = getToken();

  useSocket({ ns: NameSpace.admin });

  return (isAuthenticated || token) && location.pathname !== "/admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/admin" state={{ from: location }} replace />
  );
};
