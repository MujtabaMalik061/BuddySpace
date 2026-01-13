import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/FirebaseConfig";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export const ProtectedRoute = () => {
  const { correctWorkSpace } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading)
    return <Loader size="80" style={{ height: "100vh", width: "100vw" }} />;

  if (!user) return <Navigate to="/signin" replace />;

if (
  !correctWorkSpace &&
  location.pathname !== "/workspaces" &&
  location.pathname !== "/settings"
) {
  toast.info("Please select a workspace first");
  return <Navigate to="/workspaces" replace />;
}

  return <Outlet />;
};
export const PublicRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading)
    return <Loader size="80" style={{ height: "100vh", width: "100vw" }} />;

  return user ? <Navigate to="/workspaces" replace /> : <Outlet />;
};
