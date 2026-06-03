import React, { useEffect, useMemo, useRef, useState } from "react";
import "../assets/style/CustomComponents.css";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  SendHorizonal,
  SquarePen,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router";
import Loader from "./Loader";
import { formatAgo, formateDate } from "../utils/Helper";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { createPortal } from "react-dom";

export const Selector = ({
  disabled = false,
  filter,
  setFilter,
  options,
  position = "right",
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const selectorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sortedOptions = useMemo(() => {
    if (!options || !filter) return options;

    const selected = options.find((opt) => opt.filter === filter);
    const others = options.filter((opt) => opt.filter !== filter);

    return selected ? [selected, ...others] : options;
  }, [options, filter]);

  const selectedOption = options?.find((option) => option.filter === filter);

  return (
    <div
      ref={selectorRef}
      onClick={() => setIsFilterOpen(!isFilterOpen)}
      disabled={disabled}
      className={`customers-filter-container ${disabled ? "disabled" : ""}`}
    >
      <div className="customers-filter-selector">
        <span className="elepsis">{selectedOption?.label || filter}</span>
        <span className="icon">
          {isFilterOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
        </span>
      </div>
      {isFilterOpen && (
        <div
          className={`customers-filter-selection-container ${
            position === "left"
              ? "customers-filter-selection-container-left"
              : ""
          }`}
        >
          {sortedOptions &&
            sortedOptions.map((option, index) => {
              const isActive = option?.filter === filter;
              return (
                <button
                  key={index}
                  disabled={isActive}
                  onClick={() => {
                    setFilter(option?.filter);
                    setIsFilterOpen(false);
                  }}
                  className={`customers-filter-item ${
                    isActive ? "active" : ""
                  }`}
                >
                  {isActive && (
                    <span>
                      <Check size={13} />
                    </span>
                  )}
                  {option?.label}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
};

export const IconSelector = ({
  disabled = false,
  icon: Icon,
  options,
  position = "right",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={selectorRef}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
      }}
      className="ellipsisSelector-filter-container"
    >
      <div className="ellipsisSelector-filter-selector">{Icon}</div>

      {isOpen && (
        <div
          className={`ellipsisSelector-filter-selection-container ${
            position === "left"
              ? "customers-filter-selection-container-left"
              : ""
          }`}
        >
          {options?.map((option, index) => {
            const Icon = option.icon;
            return (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  option?.action();
                  setIsOpen(false);
                }}
                className="ellipsisSelector-filter-item"
              >
                {Icon && <Icon size={13} />}
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const SearchInput = ({
  disabled = false,
  value,
  setValue,
  placeholder = "Search...",
  margin = "",
}) => {
  return (
    <div className="customers-search-box" style={{ margin }}>
      <Search className="customers-search-icon" />
      <input
        disabled={disabled}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        placeholder={placeholder}
        className="customers-search-input"
      />
    </div>
  );
};

export const Tabs = ({ activeTab, setActiveTab, tabs }) => {
  const spacing = 8;

  const calculateActiveWidthAndLocation = (tabs, activeTab) => {
    if (!tabs?.length) return { width: "0%", left: "0%" };

    const width = 100 / tabs.length;
    const activeIndex = tabs.findIndex((t) => t.filter === activeTab);
    if (activeIndex === -1) return null;

    return {
      width: `calc(${width}% - ${spacing * 2}px)`,
      left: `calc(${width * activeIndex}% + ${spacing}px)`,
    };
  };

  const activePosition = calculateActiveWidthAndLocation(tabs, activeTab);

  return (
    <div className="customers-tabs mar-b-20-40">
      {activePosition && (
        <div
          style={{
            width: activePosition.width,
            left: activePosition.left,
          }}
          className="customers-tab-active-indicator"
        ></div>
      )}

      {tabs?.map((tab, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(tab.filter)}
          className={`elepsis customers-tab font-12-16 ${
            activeTab === tab.filter ? "active" : ""
          }`}
          style={{
            width: activePosition.width,
            color: activeTab === tab.filter ? "#fff" : "",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export const BackBtn = ({ title = "", onBack = "" }) => {
  const navigate = useNavigate();

  return (
    <div className="back-btn-container mar-b-14-20">
      <button
        onClick={() => {
          navigate(onBack);
        }}
        className="padd-duo-6-10-and-14-10"
      >
        <span className="icon">
          <ArrowLeft />
        </span>
        {title}
      </button>
    </div>
  );
};

export const CommentsArea = ({
  comments = [],
  setComment = () => {},
  comment = "",
  AtSubmit = async () => {},
  onUpdateComment = async () => {},
  onDeleteComment = async () => {},
}) => {
  const { currentUser } = useAuth();

  const [isComment, setIsComment] = useState(false);
  const [isCommentActive, setIsCommentActive] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);

  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    item: null,
  });

  useEffect(() => {
    const handleClick = () => {
      setContextMenu({
        visible: false,
        x: 0,
        y: 0,
        item: null,
      });
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  const closeContextMenu = () => {
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
      item: null,
    });
  };

  const handleCommentContextMenu = (e, comment) => {
    e.preventDefault();

    const ownerId =
      comment?.createdBy?.id ||
      comment?.createdBy?._id ||
      comment?.createdBy?.uid;

    const currentUserId =
      currentUser?.id || currentUser?._id || currentUser?.uid;

    if (ownerId !== currentUserId) return;

    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      item: comment,
    });
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.commentId);
    setEditText(comment.comment);
    closeContextMenu();
  };

  const handleDeleteComment = async (id) => {
    try {
      await onDeleteComment(id);
      toast.success("Comment deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete comment");
    }
  };

  const handleSaveEdit = async (id) => {
    if (!editText.trim()) {
      return toast.error("Comment is required");
    }
    try {
      await onUpdateComment(id, editText);
      setEditingComment(null);
      setEditText("");
      toast.success("Comment updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update comment");
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      return toast.error("Comment is required");
    }

    setIsCommentActive(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsCommentLoading(true);

    try {
      await AtSubmit();

      setComment("");

      toast.success("Comment added successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    } finally {
      setIsCommentLoading(false);
      setIsCommentActive(false);
      setIsComment(false);
    }
  };

  return (
    <div className="workspace-detail-card mar-t-20-40 padd-10-20">
      <div className="workspace-detail-comment-header-container">
        <div className="workspace-detail-comment-header">
          <h3>Comments</h3>

          <button
            onClick={() => setIsComment(!isComment)}
            className="comment-post-btn"
          >
            Post
            <span className="icon">
              {isComment ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </span>
          </button>
        </div>

        {isComment && (
          <div className="write-comment-container">
            <div className="settings-field">
              <label className="settings-label">Write a Comment</label>

              <textarea
                className="settings-textarea"
                placeholder="Write your Comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <button
              onClick={handleSubmit}
              className={`${isCommentActive ? "active" : ""} comment-send-btn`}
              disabled={isCommentLoading || isCommentActive}
            >
              {isCommentLoading ? (
                <Loader color="#fff" size="24" />
              ) : (
                <>
                  Send Comment
                  <span className="icon">
                    <SendHorizonal />
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="workspace-detail-comments-container mar-t-20-40">
        {comments?.length > 0 ? (
          [...comments]
            .sort(
              (a, b) =>
                (b?.createdAt?.seconds || 0) - (a?.createdAt?.seconds || 0),
            )
            .map((comment, index) => (
              <div
                key={comment.id || index}
                className="workspace-comment-card padd-duo-6-10-and-8-12 mar-b-8-12"
                onContextMenu={(e) => handleCommentContextMenu(e, comment)}
              >
                <div className="workspace-comment-header">
                  <strong className="font-12-16">
                    {comment.createdBy?.fullName ||
                      comment.createdBy?.name ||
                      "Anonymous"}
                  </strong>

                  <span className="workspace-comment-date font-10-12">
                    {formatAgo(comment?.createdAt)}
                  </span>
                </div>

                {editingComment === comment.commentId ? (
                  <>
                    <textarea
                      style={{ width: "100%" }}
                      className="settings-textarea"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />

                    <div className="collection-modal-actions">
                      <button
                        className="collection-btn-secondary"
                        onClick={() => {
                          setEditingComment(null);
                          setEditText("");
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="collection-btn-primary"
                        onClick={() => handleSaveEdit(comment.commentId)}
                      >
                        Save
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="workspace-comment-body font-10-12">
                    {comment.comment}
                  </p>
                )}
              </div>
            ))
        ) : (
          <p className="no-data">No Comments found.</p>
        )}
      </div>

      {contextMenu.visible &&
        createPortal(
          <div
            className="collection-card-menu-container"
            style={{
              position: "fixed",
              top: contextMenu.y,
              left: contextMenu.x,
              zIndex: 999999,
            }}
          >
            <div
              className="collection-card-menu-item success"
              onClick={() => handleEditComment(contextMenu.item)}
            >
              <span className="icon">
                <SquarePen size={14} />
              </span>
              Edit Comment
            </div>

            <div
              className="collection-card-menu-item danger"
              onClick={async () => {
                await handleDeleteComment(contextMenu.item.commentId);
                closeContextMenu();
              }}
            >
              <span className="icon">
                <Trash2 size={14} />
              </span>
              Delete Comment
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};