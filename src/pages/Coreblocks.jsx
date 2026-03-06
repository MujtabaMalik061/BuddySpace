import React, { useEffect, useState, useRef } from "react";
import "../assets/style/Coreblocks.css";
import TopBar from "../components/TopBar";
import { Editor } from "@monaco-editor/react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Plus, X, Image, ImageUp, MessageCircle, SquarePen, Trash2 } from "lucide-react";
import Loader from "../components/Loader";
import {
  addCoreBlockItem,
  listenCoreBlockByWorkspace,
  loadMoreCoreBlocks,
  handleDeleteCoreBlockItem,
  handleEditCoreBlockItem,
} from "../services/CoreBlocksHelper";
import { detectLanguage, IMAGES } from "../services/Constants";
import { SearchInput, Selector } from "../components/CustomComponents";
import { useDebounce } from "../utils/hooks/useDebounce";

const Coreblocks = () => {
  const navigate = useNavigate();
  const { imageMode } = useTheme();
  const { currentUser, selectedWorkSpace, workSpacesLoader } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState([]);
  const workSpaceId = selectedWorkSpace?.id;
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(null);
  const fileInputRef = useRef(null);
  const [localImageFile, setLocalImageFile] = useState(null);
  const [thumbnailLink, setThumbnailLink] = useState("");

  // pagination
  const [lastDoc, setLastDoc] = useState(null);
  const [lastIndex, setLastIndex] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    thumbnail: thumbnailLink,
  });

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    item: null,
  });

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (!workSpaceId) return setLoading(false);

    setItems([]);
    setLastDoc(null);
    setLastIndex(false);

    const unsub = listenCoreBlockByWorkspace(
      workSpaceId,
      debouncedSearch.trim(),
      setItems,
      setLastDoc,
      setLastIndex,
      setLoading,
    );

    return () => unsub && unsub();
  }, [workSpaceId, debouncedSearch]);

  useEffect(() => {
    const closeMenu = () =>
      setContextMenu({ visible: false, x: 0, y: 0, item: null });

    const scrollableContainers = document.querySelectorAll(
      ".collection-root, .collection-grid",
    );

    window.addEventListener("mousedown", closeMenu);
    window.addEventListener("scroll", closeMenu);

    scrollableContainers.forEach((c) =>
      c.addEventListener("scroll", closeMenu),
    );

    return () => {
      window.removeEventListener("mousedown", closeMenu);
      window.removeEventListener("scroll", closeMenu);
      scrollableContainers.forEach((c) =>
        c.removeEventListener("scroll", closeMenu),
      );
    };
  }, []);

  const addItem = async () => {
    if (!form.title.trim() || !workSpaceId) return;

    setAddLoading(true);

    try {
      let finalThumbnail = thumbnailLink;
      if (localImageFile) {
        const formData = new FormData();
        formData.append("image", localImageFile);
        formData.append("workspaceId", workSpaceId);

        const res = await fetch(
          `${import.meta.env.VITE_IMAGE_BACKEND}/addImage`,
          { method: "POST", body: formData },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        finalThumbnail = data.url;
      }

      const data = {
        title: form.title,
        content: content,
        thumbnail: finalThumbnail,
        comments: [],
        createdBy: currentUser?.id,
        createdAt: new Date(), 
        workSpaceId,
      };

      await addCoreBlockItem(data);
      setForm({ title: "" });
      setContent([]);
      setThumbnailLink("");
      setLocalImageFile(null);
      setShowModal(false);
    } catch (err) {
      console.error("Add coreblock item error:", err);
      toast.error("Failed to save item");
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemoveContent = (index) => {
    const updatedContent = content.filter((item) => item.index !== index);
    setContent(updatedContent);
  };

  const handleEditItem = (item) => {
    setIsEdit(item.id);
    setForm({
      title: item.title,
    });
    setContent(item?.content)
    setThumbnailLink(item.thumbnail);
    setLocalImageFile(null);
    setShowModal(true);
  };

  const updateItem = async () => {
    if (!isEdit || !form.title.trim()) return;

    setAddLoading(true);

    try {
      let finalThumbnail = thumbnailLink;
      if (localImageFile) {
        const formData = new FormData();
        formData.append("image", localImageFile);
        formData.append("workspaceId", workSpaceId);

        const res = await fetch(
          `${import.meta.env.VITE_IMAGE_BACKEND}/addImage`,
          { method: "POST", body: formData },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        finalThumbnail = data.url;
      }

      await handleEditCoreBlockItem(isEdit, {
        title: form.title,
        content: content,
        thumbnail: finalThumbnail,
      });

      toast.success("Item updated successfully");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update item");
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!itemId) return toast.error("Item not found.");
    await handleDeleteCoreBlockItem(itemId);
  };

  const onClose = () => {
    setForm({ title: "", thumbnail: "" });
    setThumbnailLink("");
    setLocalImageFile(null);
    setIsEdit(null);
    setShowModal(false);
  };

  const handleRightClick = (e, item) => {
    e.preventDefault();

    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      item,
    });
  };

  const handleLoadMore = () => {
    loadMoreCoreBlocks(
      workSpaceId,
      debouncedSearch.trim(),
      lastDoc,
      setItems,
      setLastDoc,
      setLastIndex,
      setLoadMoreLoading,
    );
  };

  useEffect(() => {
    if (!workSpacesLoader && !selectedWorkSpace?.isDevMode) {
      toast.error("This route is allowed only in development mode.");
      navigate("/workspaces", { replace: true });
    }
  }, [selectedWorkSpace, navigate]);

  if (workSpacesLoader) return(
    <>
    <Loader/>
    </>
  );

  if (!selectedWorkSpace?.isDevMode) return null;
  return (
    <>
      <TopBar title="Coreblocks" />
      <div className="collection-root">
        <div className="collection-header">
          <div>
            <h1 className="collection-title">Coreblocks</h1>
            <p className="collection-subtitle">
              Browse and manage your saved blocks
            </p>
          </div>

          <button
            className="collection-add-btn"
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} />
            Add Block
          </button>
        </div>
        <SearchInput
          value={search}
          setValue={setSearch}
          placeholder="Search coreblocks..."
          margin="20px 0"
        />
        {loading ? (
          <Loader style={{ height: "60vh", width: "100%" }} />
        ) : items?.length > 0 ? (
          <>
            <div className="collection-grid">
              {items.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      navigate(`/coreblock/${item?.id}`);
                    }}
                    className="collection-card"
                    onContextMenu={(e) => handleRightClick(e, item)}
                  >
                    <div className="collection-thumb">
                      <img
                        style={{ objectFit: imageMode }}
                        src={item.thumbnail || IMAGES.FallBackImage}
                        alt={item.title}
                      />
                    </div>

                    <div className="collection-body">
                      <h3 className="collection-card-title">{item.title}</h3>

                      <div className="collection-card-actions">
                        <button className="collection-comments-btn">
                          <MessageCircle size={14} />
                          {item?.comments?.length || 0}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {(loadMoreLoading || !lastIndex) && items?.length > 0 && (
              <div className="load-more-container">
                {loadMoreLoading ? (
                  <Loader style={{ height: "150px", width: "100%" }} />
                ) : !lastIndex ? (
                  <button onClick={handleLoadMore} className="load-more-btn">
                    Load More
                  </button>
                ) : null}
              </div>
            )}
          </>
        ) : (
          <div className="no-data">No any coreblock found.</div>
        )}
      </div>
      {contextMenu.visible &&
        contextMenu.item?.createdBy === currentUser?.id && (
          <div
            className="collection-card-menu-container"
            style={{
              position: "fixed",
              top: contextMenu.y,
              left: contextMenu.x,
              zIndex: 9999,
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div
              className="collection-card-menu-item success"
              onClick={() => {
                handleEditItem(contextMenu.item);
                setContextMenu({ visible: false });
              }}
            >
              <span className="icon">
                <SquarePen size={14} />
              </span>
              Edit Item
            </div>

            <div
              className="collection-card-menu-item danger"
              onClick={() => {
                handleDeleteItem(contextMenu.item.id);
                setContextMenu({ visible: false });
              }}
            >
              <span className="icon">
                <Trash2 size={14} />
              </span>
              Delete Item
            </div>
          </div>
        )}
      {showModal && (
        <div className="collection-modal-backdrop">
          <div className="collection-modal">
            <div className="collection-modal-header">
              <h3>{isEdit ? "Edit Item" : "Add New Item"}</h3>
              <button
                className="collection-modal-header-close-btn"
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </div>

            <label className="collection-label">Title</label>
            <input
              className="collection-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <label className="collection-label">Thumbnail URL</label>
            <div className="collection-input-icon">
              <Image size={16} />
              <input
                className="collection-input"
                style={{ paddingRight: "24px" }}
                value={thumbnailLink}
                onChange={(e) => setThumbnailLink(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setLocalImageFile(file);
                  const previewUrl = URL.createObjectURL(file);
                  setThumbnailLink(previewUrl);
                }}
              />

              {thumbnailLink.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "17px",
                    right: "4px",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setThumbnailLink("");
                  }}
                  className="icon"
                >
                  <X size={16} />
                </span>
              )}
            </div>

            {thumbnailLink ? (
              <label className="collection-add-Image-label">
                <img src={thumbnailLink} alt="Preview" />
              </label>
            ) : (
              <label
                className="collection-add-Image-label"
                onClick={() => fileInputRef.current.click()}
              >
                <span className="icon">
                  <ImageUp />
                </span>
                Upload locally
              </label>
            )}
            <CustomInput content={content} setContent={setContent} />
            {content?.length > 0 && (
              <div className="coreblock-selected-content-container">
                {content?.map((item) => (
                  <div className="coreblock-selected-content" key={item.index}>
                    <p className="coreblock-selected-content-value elepsis">
                      {item.value}
                    </p>
                    <span className="coreblock-selected-content-tag">
                      ({item.tag})
                    </span>
                    <span
                      onClick={() => handleRemoveContent(item.index)}
                      className="coreblock-selected-content-remove"
                    >
                      <X size={12} />
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="collection-modal-actions">
              <button
                className="collection-btn-secondary"
                onClick={onClose}
                disabled={addLoading}
              >
                Cancel
              </button>
              <button
                disabled={addLoading}
                className="collection-btn-primary"
                style={{ width: isEdit ? "105px" : "" }}
                onClick={isEdit ? updateItem : addItem}
              >
                {addLoading ? (
                  <Loader color="#fff" size="16" />
                ) : isEdit ? (
                  "Update Item"
                ) : (
                  "Save Item"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Coreblocks;

const CustomInput = ({ content, setContent }) => {
  const { theme } = useTheme();
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");
  const [tag, setTage] = useState("h2");

  useEffect(() => {
    setValue("");
    setLabel("");
  }, [tag]);

  const handleAdd = () => {
    if (tag === "c") {
      if (!label.trim() || !value.trim()) {
        toast.error("Both Label and Value are required for Code block.");
        return;
      }
    } else {
      if (!value.trim()) {
        toast.error("Value is required.");
        return;
      }
    }
    const nextIndex =
      content.length > 0 ? content[content.length - 1].index + 1 : 0;

    const newBlock = { index: nextIndex, tag, label, value };

    setContent([...content, newBlock]);

    setValue("");
    setLabel("");
  };

  return (
    <div className="coreblock-input-container">
      <div className="settings-transfer-owner-field">
        <Selector
          filter={tag}
          setFilter={setTage}
          options={[
            { label: "Heading", filter: "h2" },
            { label: "SubHeading", filter: "h4" },
            { label: "Para", filter: "p" },
            { label: "Code", filter: "c" },
          ]}
        />
      </div>

      {tag === "p" ? (
        <textarea
          className="collection-textarea"
          placeholder="Enter your Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : tag === "c" ? (
        <div className="coreblock-code-container">
          <input
            className="collection-input"
            placeholder="Enter Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <Editor
            height="200px"
            defaultLanguage="javascript"
            value={value}
            theme={theme === "dark" ? "vs-dark" : "vs"}
            onChange={(val) => setValue(val)}
            options={{
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
      ) : (
        <input
          className="collection-input"
          placeholder="Enter your Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )}

      <button
        style={{ width: "100%", marginTop: "3px", justifyContent: "center" }}
        className="collection-add-btn"
        onClick={handleAdd}
      >
        <span className="icon">
          <Plus size={16} />
        </span>
        Add Block
      </button>
    </div>
  );
};
