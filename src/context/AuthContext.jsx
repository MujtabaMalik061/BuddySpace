import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../utils/FirebaseConfig";
import { handleFtechWorkSpaces } from "../services/WorkSpaceHelper";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [workSpaces, setWorkSpaces] = useState([]);
  const [selectedWorkSpace, setSelectedWorkSpace] = useState(null);
  const [correctWorkSpace, setCorrectWorkSpace] = useState(true);
  const [workSpacesLoader, setWorkSpacesLoader] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          setCurrentUser(null);
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, "Users"),
          where("authId", "==", user.uid),
        );
        const snap = await getDocs(q);

        if (!snap.empty) {
          setCurrentUser({
            docId: snap.docs[0].id,
            uid: user.uid,
            ...snap.docs[0].data(),
          });
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Auth error:", err);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    fetchWorkSpaces();
  }, [currentUser]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const fetchWorkSpaces = async () => {
    setWorkSpacesLoader(true);
    try {
      const data = await handleFtechWorkSpaces("private", currentUser.id);
      setWorkSpaces(data || []);
      if (!data || data.length === 0) {
        setSelectedWorkSpace(null);
        localStorage.removeItem("selectedWorkspace");
        setCorrectWorkSpace(false);
        return;
      }

      const stored = localStorage.getItem("selectedWorkspace");
      if (stored) {
        const parsed = JSON.parse(stored);
        const exists = data.find((ws) => ws.id === parsed.id);
        setSelectedWorkSpace(exists || data[0]);
        if (exists) {
          setCorrectWorkSpace(true);
        } else {
          setCorrectWorkSpace(false);
        }
      } else {
        setSelectedWorkSpace(data[0]);
        localStorage.setItem("selectedWorkspace", JSON.stringify(data[0]));
      }
    } catch (err) {
      console.error("Workspace fetch error:", err);
    } finally {
      setWorkSpacesLoader(false);
    }
  };

  const changeWorkspace = (workspace) => {
    if (!workspace) return;
    setSelectedWorkSpace(workspace);
    localStorage.setItem("selectedWorkspace", JSON.stringify(workspace));
    window.location.reload();
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setWorkSpaces([]);
    setSelectedWorkSpace(null);
    localStorage.removeItem("selectedWorkspace");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        workSpaces,
        selectedWorkSpace,
        correctWorkSpace,
        workSpacesLoader,
        changeWorkspace,
        fetchWorkSpaces,
        logout,
        isOnline,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
