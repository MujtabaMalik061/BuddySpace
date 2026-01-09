import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/FirebaseConfig";
import Loader from "../components/Loader";

export const ProtectedRoute = () => {
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

  return user ? <Outlet /> : <Navigate to="/signin" replace />;
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
