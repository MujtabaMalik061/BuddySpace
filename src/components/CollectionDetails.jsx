import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import TopBar from "./TopBar";
import { BackBtn, CommentsArea } from "./CustomComponents";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig";
import Loader from "./Loader";
import { useAuth } from "../context/AuthContext";
import { addCommentToCollection } from "../services/CollectionsHelper";
import { getUsersMapByIds } from "../services/WorkSpaceSettingsHelper";

const CollectionDetails = () => {
  const { collectionId } = useParams();
  const { currentUser } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!collectionId) return;

    setLoading(true);
    const ref = doc(db, "Collections", collectionId);

    const unsub = onSnapshot(
      ref,
      async (snap) => {
        if (!snap.exists()) {
          setItem(null);
          setLoading(false);
          return;
        }

        const data = snap.data();
        const comments = data.comments || [];
        const userIds = comments.map((c) => c.createdBy?.id).filter(Boolean);
        const usersMap = await getUsersMapByIds(userIds);
        const enrichedComments = comments.map((comment) => ({
          ...comment,
          createdBy: {
            ...comment.createdBy,
            fullName: usersMap[comment.createdBy.id] || comment.createdBy.name,
          },
        }));

        setItem({
          id: snap.id,
          ...data,
          comments: enrichedComments,
        });

        setLoading(false);
      },
      (error) => {
        console.error("Realtime fetch error:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [collectionId]);
  

  if (loading) {
    return (
      <>
        <TopBar title="Collection Details" />
        <div className="collection-details-root">
          <div className="collection-details-header">
            <BackBtn title="Back to collections" onBack="/collections" />
          </div>
          <Loader style={{ height: "60vh", width: "100%" }} />
        </div>
      </>
    );
  }

  if (!item) {
    return (
      <>
        <TopBar title="Collection Details" />
        <div className="collection-details-root">Collection not found</div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Collection Details" />

      <div className="collection-details-root padd-12-24">
        <div className="collection-details-header">
          <BackBtn title="Back to collections" onBack="/collections" />
        </div>

        <div className="collection-details-card">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="collection-details-image"
          />

          <div className="collection-details-body padd-10-20">
            <h1 className="collection-details-title font-15-20">
              {item.title}
            </h1>
            <p className="collection-details-description font-12-16">
              {item.description}
            </p>

            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="collection-details-watch padd-duo-6-10-and-14-10"
              >
                <ExternalLink size={16} />
                Watch Now
              </a>
            )}
          </div>
        </div>

        <CommentsArea
          comments={item?.comments}
          setComment={setComment}
          comment={comment}
          AtSubmit={() =>
            addCommentToCollection(collectionId, currentUser, comment)
          }
        />
      </div>
    </>
  );
};

export default CollectionDetails;
