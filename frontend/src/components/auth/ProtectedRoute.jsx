import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AppLayout from "../layout/AppLayout";

const ProtectedRoute = () => {
  const {isAuthenticated, loading} = useAuth();
   

  if (loading) {
    return <div>Loading... </div>;
  }

  return isAuthenticated ? (
    <AppLayout>
       <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;