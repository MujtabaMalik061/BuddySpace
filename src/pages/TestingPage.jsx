import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig";
import {
  handleGetToken,
  requestPermission,
} from "../utils/extensions/Notification.extensions.js";
import { Push_Notification_Api } from "../services/Constants.js";
import { sendNotification, sendMail } from "dev-push-notification";
import { toast } from "sonner";

const TestingPage = () => {
  const [loading, setLoading] = useState("");
  const [token, setToken] = useState(null);
  const [mail, setMail] = useState("");
  const [customToken, setCustomToken] = useState("");

  useEffect(() => {
    setToken(customToken);
  }, [customToken]);

  const storeToken = async () => {
    setLoading("getToken");
    try {
      await Notification.requestPermission();
      const tokenRes = await handleGetToken();
      setToken(tokenRes);
      toast.success("Token stored");
    } catch (err) {
      console.error("Failed to get fcm:", err);
      toast.error("Failed to get fcm:", err);
    } finally {
      setLoading("");
    }
  };

  const handleSendPush = async () => {
    setLoading("sendPush");
    try {
      console.log("Sending push to token:", token);
      const push = await sendNotification({
        apiKey: Push_Notification_Api,
        title: "Test",
        body: "testing push",
        icon: "https://unicodetech-two.vercel.app/SiteIcon.png",
        fcmTokens: [token],
      });
      console.log("Push notification sent:", push);
    } catch (err) {
      console.error("Failed to send push:", err);
      toast.error("Failed to send push:", err);
    } finally {
      setLoading("");
    }
  };

  const RemoveALLTokens = async () => {
    try {
      setLoading("removealltokens");
      const userIndexRef = collection(db, "UserIndex");
      const snap = await getDocs(userIndexRef);
      let batch = writeBatch(db);
      let count = 0;
      for (const userDoc of snap.docs) {
        const user = userDoc.data();

        const { collection: userCollection, docId } = user;

        if (!userCollection || !docId) continue;
        const userIndexDocRef = doc(db, "UserIndex", userDoc.id);
        batch.update(userIndexDocRef, {
          fcmTokens: [],
        });
        count++;
        const mainUserRef = doc(db, userCollection, docId);
        batch.update(mainUserRef, {
          fcmTokens: [],
        });
        count++;
        if (count >= 450) {
          await batch.commit();
          batch = writeBatch(db);
          count = 0;
        }
      }
      if (count > 0) {
        await batch.commit();
      }

      console.log("All FCM tokens removed successfully");
    } catch (err) {
      console.error("Failed to removeAllTokens:", err);
    } finally {
      setLoading("");
    }
  };

  const handleSendMail = async () => {
    try {
      setLoading("sendMail");
      const res = await sendMail({
        apiKey: Push_Notification_Api,
        from: "Buddy Space",
        mails: ["moonawan0071@gmail.com", "malikmoon.developer061@gmail.com"],
        subject: "Welcome Email",
        htmlContent: `
    <h1>Hello!</h1>
    <p>Welcome to our platform.</p>
  `,
      });

      console.log("response from mail api:", res);

      toast.success("Mail sent successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to send mail");
    } finally {
      setLoading("");
    }
  };

  const handleAddFieldsToAllUsers = async () => {
    try {
      setLoading("addFields");

      const snapshot = await getDocs(collection(db, "Users"));

      const batch = writeBatch(db);

      snapshot.docs.forEach((docSnap) => {
        batch.update(docSnap.ref, {
          activityNotification: "off",
          chatNotifications: false,
          commentNotifications: false,
        });
      });

      await batch.commit();

      console.log(
        `Updated ${snapshot.docs.length} user documents successfully`,
      );
    } catch (error) {
      console.error("Error updating users:", error);
    } finally {
      setLoading("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
        gap: "10px",
        padding: "10px",
        flexWrap: "wrap",
      }}
    >
      <button
        className="refresh-btn hide-mobile-400 padd-duo-10-14-and-14-28 font-12-16"
        onClick={handleAddFieldsToAllUsers}
      >
        {loading === "addFields"
          ? "Adding fields..."
          : "Add fields to all users"}
      </button>
      <button
        className="refresh-btn hide-mobile-400 padd-duo-10-14-and-14-28 font-12-16"
        onClick={RemoveALLTokens}
      >
        {loading === "removealltokens"
          ? "All users tokens removing..."
          : "Remove token from all users"}
      </button>

      <button
        className="refresh-btn hide-mobile-400 padd-duo-10-14-and-14-28 font-12-16"
        onClick={requestPermission}
      >
        requestPermission
      </button>
      <button
        className="refresh-btn hide-mobile-400 padd-duo-10-14-and-14-28 font-12-16"
        disabled={loading}
        onClick={storeToken}
      >
        {loading === "getToken" ? "Getting..." : "Get token"}
      </button>
      <p>{token}</p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            boxShadow: "var(--shadow-hover-sm)",
            borderRadius: "8px",
            borderTop: "none",
          }}
          className="chat-input-bar"
        >
          <input
            type="text"
            className="chat-input"
            placeholder="Add custom token for push"
            value={customToken}
            onChange={(e) => setCustomToken(e.target.value)}
          />
          <button
            // icon chat-send-btn
            className="refresh-btn hide-mobile-400 padd-duo-10-14-and-14-28 font-12-16"
            disabled={loading}
            onClick={handleSendPush}
          >
            {loading === "sendPush" ? "sending..." : "Send Push"}
          </button>
        </div>
        <div
          style={{
            boxShadow: "var(--shadow-hover-sm)",
            borderRadius: "8px",
            borderTop: "none",
          }}
          className="chat-input-bar"
        >
          <input
            className="chat-input"
            placeholder="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          />
          <button
            className="refresh-btn hide-mobile-400 padd-duo-10-14-and-14-28 font-12-16"
            onClick={handleSendMail}
          >
            Send Mail
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestingPage;
