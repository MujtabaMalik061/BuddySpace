import { useEffect, useRef, useState } from "react";
import "../assets/style/Chat.css";
import { Check, SendHorizontal, SquarePen, Trash2 } from "lucide-react";
import TopBar from "../components/TopBar";
import Loader from "../components/Loader";
import {
  handleDeleteChatMessage,
  handleEditChatMessage,
  listenToChatMessages,
  sendChatMessage,
} from "../services/ChatHelper";
import { useAuth } from "../context/AuthContext";
import { format, isToday, isYesterday } from "date-fns";
import { toast } from "sonner";

const Chat = () => {
  const { currentUser } = useAuth();
  const storedWorkspace = JSON.parse(localStorage.getItem("selectedWorkspace"));
  const selectedWorkSpaceId =
    storedWorkspace?.workspaceId || storedWorkspace?.id;
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editMsg, setEditMsg] = useState(null);
  const [editvalue, setEditValue] = useState("");
  const endRef = useRef(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    item: null,
  });

  useEffect(() => {
    if (!loading && messages.length > 0) {
      const container = document.querySelector(".chat-messages");

      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [loading]);

  useEffect(() => {
    if (!loading && messages.length > 0) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!selectedWorkSpaceId || !currentUser) return;

    const unsubscribe = listenToChatMessages(
      selectedWorkSpaceId,
      currentUser.id,
      setMessages,
      setLoading
    );

    return () => unsubscribe();
  }, [selectedWorkSpaceId, currentUser]);

  useEffect(() => {
    const closeMenu = () =>
      setContextMenu({ visible: false, x: 0, y: 0, item: null });
    window.addEventListener("mousedown", closeMenu);
    window.addEventListener("scroll", closeMenu);
    const chatContainer = document.querySelector(".chat-messages");
    if (chatContainer) {
      chatContainer.addEventListener("scroll", closeMenu);
    }
    return () => {
      window.removeEventListener("mousedown", closeMenu);
      window.removeEventListener("scroll", closeMenu);
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", closeMenu);
      }
    };
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;

    try {
      await sendChatMessage(selectedWorkSpaceId, currentUser.id, value);
      setValue("");
    } catch (err) {
      console.error("Send message error:", err);
    }
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

  const groupMessagesByDate = (msgs) => {
    const grouped = {};
    msgs.forEach((msg) => {
      const dateObj = msg.createdAt?.toDate();
      if (!dateObj) return;

      let label = "";
      if (isToday(dateObj)) label = "Today";
      else if (isYesterday(dateObj)) label = "Yesterday";
      else label = format(dateObj, "dd/MM/yyyy");

      if (!grouped[label]) grouped[label] = [];
      grouped[label].push(msg);
    });
    return grouped;
  };

  const handleUpdateMessage = (msg) => {
    setEditValue(msg?.message || "");
    setEditMsg(msg);
    setIsEdit(true);
  };

  const handleCloseUpdateMessage = () => {
    setEditValue("");
    setEditMsg(null);
    setIsEdit(false);
  };

  const handleEditMessage = async (e) => {
    e.preventDefault();

    if (!editvalue.trim() || !editMsg) return;

    try {
      await handleEditChatMessage(isEdit, {
        newMsg: editvalue || "",
        editMsg,
        workspaceId: selectedWorkSpaceId,
      });

      toast.success("Message updated successfully");
      handleCloseUpdateMessage();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update Message");
    }
  };

  const handleDeleteMessage = async (megId) => {
    if (!megId) return toast.error("Message not found.");
    await handleDeleteChatMessage(megId, selectedWorkSpaceId);
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <>
      <TopBar title="Chat" />
      <div className="chat-root">
        <div className="chat-header">
          <div>
            <h2 className="chat-title">
              {storedWorkspace?.name || "Workspace Chat"}
            </h2>
            <span className="chat-subtitle">
              {loading ? "Loading..." : `${messages.length} messages`}
            </span>
          </div>
        </div>

        <div className="chat-messages padd-10-20">
          {loading && <Loader />}

          {!loading &&
            Object.keys(groupedMessages).map((dateLabel) => (
              <div key={dateLabel}>
                <div className="chat-messages-date-container">
                  <div className="chat-messages-date font-10-12">
                    {dateLabel}
                  </div>
                </div>

                {groupedMessages[dateLabel].map((msg) => (
                  <div
                    key={msg.id}
                    className={`chat-message ${
                      msg.isOwn ? "chat-message-own" : ""
                    }`}
                    onContextMenu={(e) => handleRightClick(e, msg)}
                  >
                    {!msg.isOwn && (
                      <div className="chat-message-avatar">
                        {msg.user
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </div>
                    )}

                    <div className="chat-message-body">
                      {!msg.isOwn && (
                        <span className="chat-message-user">{msg.user}</span>
                      )}

                      <div className="chat-message-bubble">{msg.message}</div>
                      <div className="chat-message-foot">
                        <span className="chat-message-time">
                          {msg.createdAt?.toDate().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                        {msg?.isEdited && (
                          <span className="chat-message-edit-label">
                            Edited
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          <div ref={endRef} />
        </div>
        {isEdit && (
          <div onClick={handleCloseUpdateMessage} className="msg-edit-overlay">
            <form
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="chat-input-bar"
              onSubmit={handleEditMessage}
            >
              <input
                value={editvalue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="Type a message..."
                className="chat-input"
              />

              <button type="submit" className="icon chat-send-btn">
                <Check size={18} />
              </button>
            </form>
          </div>
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
                  handleUpdateMessage(contextMenu.item);
                  setContextMenu({ visible: false });
                }}
              >
                <span className="icon">
                  <SquarePen size={14} />
                </span>
                Edit Message
              </div>

              <div
                className="collection-card-menu-item danger"
                onClick={() => {
                  handleDeleteMessage(contextMenu.item.id);
                  setContextMenu({ visible: false });
                }}
              >
                <span className="icon">
                  <Trash2 size={14} />
                </span>
                Delete Message
              </div>
            </div>
          )}
        <form className="chat-input-bar" onSubmit={handleSendMessage}>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type a message..."
            className="chat-input"
          />

          <button type="submit" className="icon chat-send-btn">
            <SendHorizontal size={18} />
          </button>
        </form>
      </div>
    </>
  );
};

export default Chat;
