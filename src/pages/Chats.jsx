import { useEffect, useRef, useState } from "react";
import "../assets/style/Chat.css";
import { Smile, Paperclip, SendHorizontal } from "lucide-react";
import TopBar from "../components/TopBar";
import Loader from "../components/Loader";
import { listenToChatMessages, sendChatMessage } from "../services/ChatHelper";
import { useAuth } from "../context/AuthContext";
import { format, isToday, isYesterday } from "date-fns";

const Chat = () => {
  const { currentUser } = useAuth();

  const storedWorkspace = JSON.parse(localStorage.getItem("selectedWorkspace"));
  const selectedWorkSpaceId =
    storedWorkspace?.workspaceId || storedWorkspace?.id;

  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
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

                      <span className="chat-message-time">
                        {msg.createdAt?.toDate().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}

          <div ref={endRef} />
        </div>

        <form className="chat-input-bar" onSubmit={handleSendMessage}>
          <button type="button" className="chat-icon-btn">
            <Paperclip size={18} />
          </button>

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
