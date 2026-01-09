import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Send, Heart } from "lucide-react";
import TopBar from "./TopBar";
import { BackBtn } from "./CustomComponents";

const item = {
  id: 1,
  title: "Crash Landing on You",
  description:
    "A South Korean billionaire heiress accidentally paraglides into North Korea, where she meets a North Korean army officer who decides to hide and protect her.",
  thumbnail:
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
  link: "https://netflix.com",
};

const initialComments = [
  {
    id: 1,
    user: "Sarah Chen",
    content:
      "This drama is absolutely amazing! The chemistry between the leads is unreal.",
    timestamp: "2 days ago",
    likes: 15,
  },
  {
    id: 2,
    user: "Mike Johnson",
    content: "The supporting characters really made this show special.",
    timestamp: "1 day ago",
    likes: 8,
  },
];

const CollectionDetails = () => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");

  const addComment = () => {
    if (!newComment.trim()) return;

    setComments([
      ...comments,
      {
        id: comments.length + 1,
        user: "You",
        content: newComment,
        timestamp: "Just now",
        likes: 0,
      },
    ]);
    setNewComment("");
  };

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

            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="collection-details-watch"
            >
              <ExternalLink size={16} />
              Watch Now
            </a>
          </div>
        </div>

        <div className="collection-details-comments">
          <h2 className="collection-details-comments-title">
            Comments ({comments.length})
          </h2>

          <div className="collection-details-add-comment">
            <div className="collection-details-avatar">Y</div>

            <div className="collection-details-comment-box">
              <textarea
                className="collection-details-textarea"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />

              <button
                className="collection-details-post-btn"
                onClick={addComment}
                disabled={!newComment.trim()}
              >
                <Send size={14} />
                Post
              </button>
            </div>
          </div>

          {/* Comment List */}
          <div className="collection-details-comment-list">
            {comments.map((c) => (
              <div key={c.id} className="collection-details-comment">
                <div className="collection-details-avatar">
                  {c.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div className="collection-details-comment-content">
                  <div className="collection-details-comment-meta">
                    <span className="collection-details-user">{c.user}</span>
                    <span className="collection-details-time">
                      {c.timestamp}
                    </span>
                  </div>

                  <p className="collection-details-text">{c.content}</p>

                  <button className="collection-details-like-btn">
                    <Heart size={14} />
                    {c.likes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionDetails;
