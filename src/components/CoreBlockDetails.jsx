import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Code2, Copy, Expand, Shrink, User } from "lucide-react";
import TopBar from "./TopBar";
import { BackBtn, CommentsArea } from "./CustomComponents";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig";
import Loader from "./Loader";
import { useAuth } from "../context/AuthContext";
import { addCommentToCoreBlock } from "../services/CoreBlocksHelper";
import { getUsersMapByIds } from "../services/WorkSpaceSettingsHelper";
import { IMAGES } from "../services/Constants";
import { getUserNameById } from "../utils/Helper";
import { useTheme } from "../context/ThemeContext";
import { Editor } from "@monaco-editor/react";
import { toast } from "sonner";

const CoreBlockDetails = () => {
  const navigate = useNavigate();
  const { setImageMode, imageMode, theme } = useTheme();
  const { coreblockId } = useParams();
  const { currentUser, selectedWorkSpace, workSpacesLoader } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!workSpacesLoader && !selectedWorkSpace?.isDevMode) {
      toast.error("This route is allowed only in development mode.");
      navigate("/workspaces", { replace: true });
    }
  }, [selectedWorkSpace, navigate]);

  useEffect(() => {
    if (!coreblockId) return;

    setLoading(true);
    const ref = doc(db, "CoreBlocks", coreblockId);

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
  }, [coreblockId]);

  if (loading || workSpacesLoader) {
    return (
      <>
        <TopBar title="CoreBock Details" />
        <div className="collection-details-root">
          <div className="collection-details-header">
            <BackBtn title="Back to coreblocks" onBack="/coreblocks" />
          </div>
          <Loader style={{ height: "60vh", width: "100%" }} />
        </div>
      </>
    );
  }

  if (!item) {
    return (
      <>
        <TopBar title="CoreBock Details" />
        <div className="collection-details-root">coreblock not found</div>
      </>
    );
  }

  const handleCopy = (code) => {
    if (!code) return;
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success("Code copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy code:", err);
        toast.error("Failed to copy code");
      });
  };

  const getContentCode = (item) => {
    if (item.tag === "h2") {
      return (
        <h2 className="coreblock-details-heading font-14-18">{item.value}</h2>
      );
    } else if (item.tag === "h4") {
      return (
        <h4 className="coreblock-details-subheading font-12-16">
          {item.value}
        </h4>
      );
    } else if (item.tag === "c") {
      return (
        <div className="coreblock-details-code-section">
          <div className="coreblock-details-code-header">
            <div className="coreblock-details-code-header-label elepsis">
              <span className="icon">
                <Code2 size={14} />
              </span>
              {item.label}
            </div>
            <button
              onClick={() => handleCopy(item.value)}
              className="coreblock-details-code-copy-btn"
            >
              <span className="icon">
                <Copy size={14} />
              </span>
              Copy
            </button>
          </div>
          <div className="coreblock-code-container">
            <Editor
              height="200px"
              defaultLanguage="javascript"
              value={item.value}
              theme={theme === "dark" ? "vs-dark" : "vs"}
              options={{
                readOnly: true,
                padding: { top: 10, bottom: 10 },
                lineNumbersMinChars: 2,
                lineNumbers: "on",
                minimap: { enabled: false },
                overviewRulerLanes: 0,
                scrollBeyondLastLine: false,
                renderLineHighlight: "none",
              }}
            />
          </div>
        </div>
      );
    } else if (item.tag === "p") {
      return (
        <p className="collection-details-description font-12-16">
          {item.value}
        </p>
      );
    }
  };

  return (
    <>
      <TopBar title="CoreBock Details" />
      <div className="collection-details-root padd-12-24">
        <div className="collection-details-header">
          <BackBtn title="Back to coreblocks" onBack="/coreblocks" />
        </div>

        <div className="collection-details-card">
          <div className="collection-details-image-container">
            <div className="collection-details-image-fit-container">
              <span
                onClick={() => setImageMode("cover")}
                className={
                  imageMode === "cover"
                    ? "collection-details-image-fit-active icon "
                    : "icon"
                }
              >
                <Expand size={18} />
              </span>
              <span
                onClick={() => setImageMode("contain")}
                className={
                  imageMode === "contain"
                    ? "collection-details-image-fit-active icon "
                    : "icon"
                }
              >
                <Shrink size={18} />
              </span>
            </div>
            <img
              style={{ objectFit: imageMode }}
              src={item.thumbnail || IMAGES.FallBackImage}
              alt={item.title}
              className="collection-details-image"
            />
          </div>

          <div className="collection-details-body padd-10-20">
            <h1 className="collection-details-title font-15-20">
              {item.title}
            </h1>
            {item?.content?.length > 0 && (
              <div className="coreblock-content-container">
                {item?.content?.map((block) => (
                  <React.Fragment
                    key={block.index || block.label || block.value}
                  >
                    {getContentCode(block)}
                  </React.Fragment>
                ))}
              </div>
            )}
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
            </div>
          </div>
        </div>

        <CommentsArea
          comments={item?.comments}
          setComment={setComment}
          comment={comment}
          AtSubmit={() =>
            addCommentToCoreBlock(coreblockId, currentUser, comment)
          }
        />
      </div>
    </>
  );
};

export default CoreBlockDetails;
