import { useEffect, useState } from "react";
import "../assets/style/Collections.css";
import {
  Plus,
  MessageCircle,
  ExternalLink,
  Image,
  X,
  Link,
} from "lucide-react";
import TopBar from "../components/TopBar";
import Loader from "../components/Loader";
import { useNavigate } from "react-router";
import {
  addCollectionItem,
  listenCollectionsByWorkspace,
} from "../services/CollectionsHelper";
import { useAuth } from "../context/AuthContext";

const initialItems = [
  {
    id: 1,
    title: "Crash Landing on You",
    description:
      "A South Korean billionaire heiress accidentally paraglides into North Korea.",
    thumbnail:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400",
    link: "https://netflix.com",
    comments: 12,
  },
  {
    id: 2,
    title: "Goblin",
    description:
      "A modern-day guardian angel must find a human bride to end his immortal life.",
    thumbnail:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
    link: "https://netflix.com",
    comments: 8,
  },
];

const Collections = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const selectedWorkspace = JSON.parse(
    localStorage.getItem("selectedWorkspace")
  );
  const workSpaceId = selectedWorkspace?.id;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
    link: "",
  });

  useEffect(() => {
    if (!workSpaceId) return;

    const unsub = listenCollectionsByWorkspace(
      workSpaceId,
      setItems,
      setLoading
    );

    return () => unsub && unsub();
  }, [workSpaceId]);

  const addItem = async () => {
    if (!form.title.trim() || !workSpaceId) return;
    setAddLoading(true);
    try {
      const data = {
        title: form.title,
        description: form.description,
        thumbnail:
          form.thumbnail ||
          "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400",
        link: form.link,
        comments: [],
        createdBy: currentUser?.id,
        workSpaceId,
      };

      await addCollectionItem(data);

      setForm({ title: "", description: "", thumbnail: "", link: "" });
      setShowModal(false);
    } catch (err) {
      console.error("Add collection item error:", err);
    } finally {
      setAddLoading(false);
    }
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
        {loading ? (
          <Loader style={{ height: "60vh", width: "100%" }} />
        ) : items?.length > 0 ? (
          <div className="collection-grid">
            {items.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  navigate(`/collection/${item?.id}`);
                }}
                className="collection-card"
              >
                <div className="collection-thumb">
                  <img src={item.thumbnail} alt={item.title} />
                </div>

                <div className="collection-body">
                  <h3 className="collection-card-title">{item.title}</h3>
                  <p className="collection-card-desc">{item.description}</p>

                  <div className="collection-card-actions">
                    <button className="collection-comments-btn">
                      <MessageCircle size={14} />
                      {item?.comments?.length || 0}
                    </button>

                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="collection-link-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">No any collection found.</div>
        )}

        {showModal && (
          <div className="collection-modal-backdrop">
            <div className="collection-modal">
              <div className="collection-modal-header">
                <h3>Add New Item</h3>
                <button
                  className="collection-modal-header-close-btn"
                  onClick={() => setShowModal(false)}
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
                  value={form.thumbnail}
                  onChange={(e) =>
                    setForm({ ...form, thumbnail: e.target.value })
                  }
                />
              </div>

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
                  onClick={() => setShowModal(false)}
                  disabled={addLoading}
                >
                  Cancel
                </button>
                <button
                  disabled={addLoading}
                  className="collection-btn-primary"
                  onClick={addItem}
                >
                  {addLoading ? <Loader color="#fff" size="16" /> : "Save Item"}
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
