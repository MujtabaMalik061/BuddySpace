import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Expand, ExternalLink, Shrink, User } from "lucide-react";
import TopBar from "./TopBar";
import { BackBtn, CommentsArea } from "./CustomComponents";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig";
import Loader from "./Loader";
import { useAuth } from "../context/AuthContext";
import { addCommentToCollection } from "../services/CollectionsHelper";
import { getUsersMapByIds } from "../services/WorkSpaceSettingsHelper";
import { IMAGES } from "../services/Constants";
import { getUserNameById } from "../utils/Helper";

const CollectionDetails = () => {
  const { collectionId } = useParams();
  const { currentUser } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [imagePosition, setImagePosition] = useState("cover");

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
        const creatorName = await getUserNameById(data.createdBy || "");
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
          creatorName,
          comments: enrichedComments,
        });

        setLoading(false);
      },
      (error) => {
        console.error("Realtime fetch error:", error);
        setLoading(false);
      },
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

  const normalizedLink =
    item?.link?.startsWith("http://") || item?.link?.startsWith("https://")
      ? item?.link
      : `https://${item?.link}`;

  return (
    <>
      <TopBar title="Collection Details" />

      <div className="collection-details-root padd-12-24">
        <div className="collection-details-header">
          <BackBtn title="Back to collections" onBack="/collections" />
        </div>

        <div className="collection-details-card">
          <div className="collection-details-image-container">
            <div className="collection-details-image-fit-container">
              <span
                onClick={() => setImagePosition("cover")}
                className={
                  imagePosition === "cover"
                    ? "collection-details-image-fit-active icon "
                    : "icon"
                }
              >
                <Expand size={18} />
              </span>
              <span
                onClick={() => setImagePosition("contain")}
                className={
                  imagePosition === "contain"
                    ? "collection-details-image-fit-active icon "
                    : "icon"
                }
              >
                <Shrink size={18} />
              </span>
            </div>
            <img
              style={{ objectFit: imagePosition }}
              src={item.thumbnail || IMAGES.FallBackImage}
              alt={item.title}
              className="collection-details-image"
            />
          </div>

          <div className="collection-details-body padd-10-20">
            <h1 className="collection-details-title font-15-20">
              {item.title}
            </h1>
            <p className="collection-details-description font-12-16">
              {item.description}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {item?.creatorName && (
                <p className="collection-details-createdby font-12-16">
                  <strong className="icon" style={{ marginRight: "4px" }}>
                    <User size={14} color="var(--text-primary)" />
                  </strong>
                  By: {item.creatorName}
                </p>
              )}
              {item?.link && (
                <a
                  href={normalizedLink}
                  target="_blank"
                  className="collection-details-watch padd-duo-6-10-and-14-10"
                >
                  <ExternalLink size={16} />
                  Watch Now
                </a>
              )}
            </div>
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
