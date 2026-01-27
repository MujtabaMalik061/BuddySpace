import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../utils/FirebaseConfig";
import { handleFtechWorkSpaces } from "../services/WorkSpaceHelper";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [correctWorkSpace, setCorrectWorkSpace] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const checkWorkspace = async () => {
      if (!currentUser) return;

      const workSpaces = await handleFtechWorkSpaces("private", currentUser.id);
      const storedWorkspace = JSON.parse(
        localStorage.getItem("selectedWorkspace"),
      );

      if (
        storedWorkspace &&
        workSpaces.some((ws) => ws.id === storedWorkspace.workspaceId)
      ) {
        setCorrectWorkSpace(true);
      } else {
        setCorrectWorkSpace(false);
      }
    };

    checkWorkspace();
    const handleStorageChange = () => checkWorkspace();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentUser]);

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
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const userData = {
            docId: docSnap.id,
            uid: user.uid,
            ...docSnap.data(),
          };
          setCurrentUser(userData);
        } else {
          console.warn("No Firestore user found for:", user.uid);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("AuthContext error:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

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

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        logout,
        isOnline,
        correctWorkSpace,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
