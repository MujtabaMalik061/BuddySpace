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
      (snap) => {
        if (!snap.exists()) {
          console.error("Collection not found");
          setItem(null);
          setLoading(false);
          return;
        }

        setItem({ id: snap.id, ...snap.data() });
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

      <div className="collection-details-root">
        <div className="collection-details-header">
          <BackBtn title="Back to collections" onBack="/collections" />
        </div>

        <div className="collection-details-card">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="collection-details-image"
          />

          <div className="collection-details-body">
            <h1 className="collection-details-title">{item.title}</h1>
            <p className="collection-details-description">{item.description}</p>

            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="collection-details-watch"
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
