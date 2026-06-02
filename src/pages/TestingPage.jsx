import React, { useState } from "react";
import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig";
import {
  handleGetToken,
  requestPermission,
} from "../utils/extensions/Notification.extensions.js";
import { Push_Notification_Api } from "../services/Constants.js";
import { sendNotification } from "dev-push-notification";
import { toast } from "sonner";

const TestingPage = () => {
  const [loading, setLoading] = useState("");
  const [token, setToken] = useState(null);
  const [mail, setMail] = useState("");

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
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/send-mail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: mail,
          subject: "Test Email",
          html: `
            <h2>Hello!</h2>
            <p>This is a test email from BuddySpace.</p>
          `,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success("Mail sent successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to send mail");
    } finally {
      setLoading("");
    }
  };

  return (
    <div>
      <button onClick={RemoveALLTokens}>
        {loading === "removealltokens"
          ? "All users tokens removing..."
          : "Remove token from all users"}
      </button>
      <button onClick={requestPermission}>requestPermission</button>
      <button disabled={loading} onClick={storeToken}>
        {loading === "getToken" ? "Getting..." : "Get token"}
      </button>
      <p>{token}</p>
      <button disabled={loading} onClick={handleSendPush}>
        {loading === "sendPush" ? "sending..." : "Send Push"}
      </button>

      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          placeholder="email"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
        />
        <button onClick={handleSendMail}>Send Mail</button>
      </div>
    </div>
  );
};

export default TestingPage;
