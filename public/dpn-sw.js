importScripts(
  "https://www.gstatic.com/firebasejs/10.3.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.3.0/firebase-messaging-compat.js",
);

const API_LINK = "https://buddy-space.vercel.app";

const decodeConfig = (encoded) => atob(encoded);

const encodeConfig = {
  apiKey: "QUl6YVN5QWJkTXZLcWx0dV9tTjRtUHJQVUstTVlJTEZsSjhudW04",
  authDomain: "cHVzaG5vdGlmaWNhdGlvbi1hOTkwNS5maXJlYmFzZWFwcC5jb20=",
  projectId: "cHVzaG5vdGlmaWNhdGlvbi1hOTkwNQ==",
  storageBucket: "cHVzaG5vdGlmaWNhdGlvbi1hOTkwNS5maXJlYmFzZXN0b3JhZ2UuYXBw",
  messagingSenderId: "NzkyMjkyNDUxOTU5",
  appId: "MTo3OTIyOTI0NTE5NTk6d2ViOjQ4ZGM5OGU0ODA0YzIwMGE5ZWM4NzI=",
  measurementId: "Ry0wNTMwQ1NMOUw5TA==",
};

firebase.initializeApp({
  apiKey: decodeConfig(encodeConfig.apiKey),
  authDomain: decodeConfig(encodeConfig.authDomain),
  projectId: decodeConfig(encodeConfig.projectId),
  storageBucket: decodeConfig(encodeConfig.storageBucket),
  messagingSenderId: decodeConfig(encodeConfig.messagingSenderId),
  appId: decodeConfig(encodeConfig.appId),
  measurementId: decodeConfig(encodeConfig.measurementId),
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message:", payload);

  const {
    title = "Notification",
    body = "",
    image = "",
    clickUrl = "/",
  } = payload.data || {};

  self.registration.showNotification(title, {
    body,
    icon: image,
    badge: image,
    data: {
      clickUrl,
    },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  let clickUrl = event.notification.data?.clickUrl || "/";

  if (!clickUrl.startsWith("http")) {
    clickUrl = new URL(clickUrl, API_LINK).href;
  }

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url === clickUrl && "focus" in client) {
            return client.focus();
          }
        }

        return clients.openWindow(clickUrl);
      })
      .catch((err) => {
        console.error("Notification click error:", err);

        return clients.openWindow(API_LINK);
      }),
  );
});
