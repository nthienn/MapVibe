import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { loading, user, isLoggedIn } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const isAdmin = user?.roles?.some((role) => role.name === "ADMIN");

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
