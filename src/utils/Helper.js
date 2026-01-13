import { doc, getDoc } from "firebase/firestore";
import { db } from "./FirebaseConfig";
import { formatDistanceToNow } from "date-fns";

export const generateCustomId = async (collectionName) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  const docRef = doc(db, collectionName, result);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return generateCustomId(collectionName);
  }
  return result;
};

export const ProfileByName = (fullName) => {
  if (!fullName || typeof fullName !== "string") return "N/A";

  const trimmed = fullName.trim();

  if (!trimmed) return "N/A";

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }
  const firstInitial = parts[0][0].toUpperCase();
  const lastInitial = parts[parts.length - 1][0].toUpperCase();

  return firstInitial + lastInitial;
};

export const formateDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp.seconds * 1000);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatAgo = (timestamp) => {
  if (!timestamp) return "";

  const date =
    typeof timestamp?.toDate === "function"
      ? timestamp.toDate()
      : new Date(timestamp);

  const diff = Date.now() - date.getTime();

  if (diff < 60 * 1000) return "just now";

  return formatDistanceToNow(date, { addSuffix: true });
};

export const getUserNameById = async (userId) => {
  try {
    const userRef = doc(db, "Users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    return userSnap.data().fullName;
  } catch (error) {
    console.error("Error fetching user name:", error);
    return null;
  }
};

export const getUserDetailsById = async (userId) => {
  try {
    const userRef = doc(db, "Users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    return {
      id: userSnap.id,
      ...userSnap.data(),
    };
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};
