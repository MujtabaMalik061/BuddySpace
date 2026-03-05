import { db } from "../utils/FirebaseConfig";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  where,
  Timestamp,
  updateDoc,
  arrayUnion,
  deleteDoc,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { generateCustomId } from "../utils/Helper";
import { toast } from "sonner";
import { limit as PAGE_SIZE } from "../services/Constants";

export const addCoreBlockItem = async (data) => {
  const customId = await generateCustomId("CoreBlocks");

  const ref = doc(db, "CoreBlocks", customId);

  await setDoc(ref, {
    ...data,
    lowerTitle: data?.title?.toLowerCase(),
    id: customId,
    createdAt: Timestamp.now(),
  });

  return customId;
};

export const listenCoreBlockByWorkspace = (
  workSpaceId,
  search,
  setItems,
  setLastDoc,
  setLastIndex,
  setLoading,
) => {
  if (!workSpaceId) return;

  setLoading(true);

  let q;

  if (search) {
    q = query(
      collection(db, "CoreBlocks"),
      where("workSpaceId", "==", workSpaceId),
      orderBy("lowerTitle"),
      where("lowerTitle", ">=", search.toLowerCase()),
      where("lowerTitle", "<=", search.toLowerCase() + "\uf8ff"),
      limit(PAGE_SIZE),
    );
  } else {
    q = query(
      collection(db, "CoreBlocks"),
      where("workSpaceId", "==", workSpaceId),
      orderBy("createdAt", "desc"),
      limit(PAGE_SIZE),
    );
  }

  const unsub = onSnapshot(q, (snap) => {
    const docs = snap.docs;

    setItems(
      docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })),
    );

    setLastDoc(docs[docs.length - 1] || null);
    setLastIndex(docs.length < PAGE_SIZE);
    setLoading(false);
  });

  return unsub;
};

export const loadMoreCoreBlocks = async (
  workSpaceId,
  search,
  lastDoc,
  setItems,
  setLastDoc,
  setLastIndex,
  setLoadMoreLoading,
) => {
  if (!lastDoc) {
    setLastIndex(true);
    return;
  }

  setLoadMoreLoading(true);

  let q;

  if (search) {
    q = query(
      collection(db, "CoreBlocks"),
      where("workSpaceId", "==", workSpaceId),
      orderBy("lowerTitle"),
      where("lowerTitle", ">=", search.toLowerCase()),
      where("lowerTitle", "<=", search.toLowerCase() + "\uf8ff"),
      startAfter(lastDoc),
      limit(PAGE_SIZE),
    );
  } else {
    q = query(
      collection(db, "CoreBlocks"),
      where("workSpaceId", "==", workSpaceId),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(PAGE_SIZE),
    );
  }

  const snap = await getDocs(q);
  const docs = snap.docs;

  setItems((prev) => [
    ...prev,
    ...docs.map((d) => ({ id: d.id, ...d.data() })),
  ]);

  setLastDoc(docs[docs.length - 1] || null);
  setLastIndex(docs.length < PAGE_SIZE);
  setLoadMoreLoading(false);
};

export const addCommentToCoreBlock = async (coreBlockId, currentUser, comment) => {
  if (!coreBlockId || !currentUser || !comment.trim()) return;

  const collectionRef = doc(db, "CoreBlocks", coreBlockId);

  try {
    await updateDoc(collectionRef, {
      comments: arrayUnion({
        createdBy: {
          id: currentUser.id,
          name: currentUser.fullName,
        },
        comment: comment.trim(),
        createdAt: Timestamp.now(),
      }),
    });
    console.log("Comment added successfully!");
  } catch (error) {
    console.error("Failed to add comment:", error);
    throw error;
  }
};

export const handleEditCoreBlockItem = async (itemId, data) => {
  if (!itemId) return;

  try {
    const ref = doc(db, "CoreBlocks", itemId);

    await updateDoc(ref, {
      ...data,
      lowerTitle: data?.title?.toLowerCase(),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Edit coreBlock error:", error);
    throw error;
  }
};

export const handleDeleteCoreBlockItem = async (itemId) => {
  if (!itemId) return;
  try {
    const ref = doc(db, "CoreBlocks", itemId);
    await deleteDoc(ref);
    toast.success("CoreBlock item deleted successfully");
    console.log("CoreBlock deleted successfully");
  } catch (error) {
    console.error("Delete CoreBlock error:", error);
    toast.error("Failed to delete CoreBlock item");
  }
};