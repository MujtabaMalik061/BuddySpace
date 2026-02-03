import { useEffect, useRef, useState } from "react";
import "../assets/style/Collections.css";
import {
  Plus,
  MessageCircle,
  ExternalLink,
  Image,
  X,
  Link,
  ImageUp,
  Trash2,
  SquarePen,
} from "lucide-react";
import TopBar from "../components/TopBar";
import Loader from "../components/Loader";
import { useNavigate } from "react-router";
import {
  addCollectionItem,
  listenCollectionsByWorkspace,
  loadMoreCollections,
  handleDeleteCollectionItem,
  handleEditCollectionItem,
} from "../services/CollectionsHelper";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { IMAGES } from "../services/Constants";
import { SearchInput } from "../components/CustomComponents";
import { useDebounce } from "../utils/hooks/useDebounce";

const Collections = () => {
  const navigate = useNavigate();
  const { currentUser, selectedWorkSpace } = useAuth();
  const workSpaceId = selectedWorkSpace?.id;
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
    description: "",
    thumbnail: thumbnailLink,
    link: "",
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

    const unsub = listenCollectionsByWorkspace(
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
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        finalThumbnail = data.url;
      }

      const data = {
        title: form.title,
        description: form.description,
        thumbnail: finalThumbnail,
        link: form.link,
        comments: [],
        createdBy: currentUser?.id,
        workSpaceId,
      };

      await addCollectionItem(data);
      setForm({ title: "", description: "", thumbnail: "", link: "" });
      setThumbnailLink("");
      setLocalImageFile(null);
      setShowModal(false);
    } catch (err) {
      console.error("Add collection item error:", err);
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditItem = (item) => {
    setIsEdit(item.id);
    setForm({
      title: item.title,
      description: item.description,
      link: item.link,
    });
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

      await handleEditCollectionItem(isEdit, {
        title: form.title,
        description: form.description,
        link: form.link,
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
    await handleDeleteCollectionItem(itemId);
  };

  const onClose = () => {
    setForm({ title: "", description: "", link: "" });
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
    loadMoreCollections(
      workSpaceId,
      debouncedSearch.trim(),
      lastDoc,
      setItems,
      setLastDoc,
      setLastIndex,
      setLoadMoreLoading,
    );
  };

  return (
    <>
      <TopBar title="Collections" />
      <div className="collection-root">
        <div className="collection-header">
          <div>
            <h1 className="collection-title">Collections</h1>
            <p className="collection-subtitle">
              Browse and manage your saved items
            </p>
          </div>

          <button
            className="collection-add-btn"
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>
        <SearchInput
          value={search}
          setValue={setSearch}
          placeholder="Search collections..."
          margin="20px 0"
        />
        {loading ? (
          <Loader style={{ height: "60vh", width: "100%" }} />
        ) : items?.length > 0 ? (
          <>
            <div className="collection-grid">
              {items.map((item, index) => {
                const normalizedLink =
                  item?.link?.startsWith("http://") ||
                  item?.link?.startsWith("https://")
                    ? item?.link
                    : `https://${item?.link}`;
                return (
                  <div
                    key={index}
                    onClick={() => {
                      navigate(`/collection/${item?.id}`);
                    }}
                    className="collection-card"
                    onContextMenu={(e) => handleRightClick(e, item)}
                  >
                    <div className="collection-thumb">
                      <img
                        src={item.thumbnail || IMAGES.FallBackImage}
                        alt={item.title}
                      />
                    </div>

                    <div className="collection-body">
                      <h3 className="collection-card-title">{item.title}</h3>
                      <p className="collection-card-desc">{item.description}</p>

                      <div className="collection-card-actions">
                        <button className="collection-comments-btn">
                          <MessageCircle size={14} />
                          {item?.comments?.length || 0}
                        </button>
                        {item?.link && (
                          <a
                            href={normalizedLink}
                            target="_blank"
                            className="collection-link-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
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
          <div className="no-data">No any collection found.</div>
        )}
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

              <label className="collection-label">Description</label>
              <textarea
                className="collection-textarea"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <label className="collection-label">External Link</label>
              <div className="collection-input-icon">
                <Link size={16} />
                <input
                  className="collection-input"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                />
              </div>

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
      </div>
    </>
  );
};

export default Collections;
