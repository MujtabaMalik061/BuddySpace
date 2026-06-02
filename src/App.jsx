import { Routes, Route, Navigate } from "react-router-dom";
import "./assets/style/Style.css";
import "./assets/style/MediaText.css";
import { ProtectedRoute, PublicRoute } from "./routes/Route.jsx";
import Login from "./auth/Login.jsx";
import SignUp from "./auth/SignUp.jsx";
import ForgetPassword from "./auth/ForgetPassword.jsx";
import AppLayout from "./layout/AppLayout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import WorkSpaces from "./pages/WorkSpaces.jsx";
import WorkSpaceDetails from "./components/WorkSpaceDetails.jsx";
import Chats from "./pages/Chats.jsx";
import Collections from "./pages/Collections.jsx";
import CollectionDetails from "./components/CollectionDetails.jsx";
import Members from "./pages/Members.jsx";
import Settings from "./pages/Settings.jsx";
import WorkSpaceSettings from "./components/WorkSpaceSettings.jsx";
import CreateWorkSpace from "./components/CreateWorkSpace.jsx";
import Coreblocks from "./pages/Coreblocks.jsx";
import CoreBlockDetails from "./components/CoreBlockDetails.jsx";
import { onMessageListener, initMessaging } from "dev-push-notification";
import { Push_Notification_Api } from "./services/Constants.js";
import TestingPage from "./pages/TestingPage.jsx";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    initMessaging(Push_Notification_Api);
    const unsubscribe = onMessageListener(async (payload) => {
      const { title, body, image } = payload.notification;
      const link = payload.data?.clickUrl || "/";
      const registration = await navigator.serviceWorker.ready;
      registration.showNotification(title, {
        body,
        icon: image,
        data: { clickUrl: link },
      });
    }, Push_Notification_Api);

    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<PublicRoute />}>
        <Route path="/signin" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/workspaces" element={<WorkSpaces />} />
          <Route path="/create-workspace" element={<CreateWorkSpace />} />
          <Route
            path="/workspace/:workspaceId"
            element={<WorkSpaceDetails />}
          />
          <Route path="/chat" element={<Chats />} />
          <Route path="/collections" element={<Collections />} />
          <Route
            path="/collection/:collectionId"
            element={<CollectionDetails />}
          />
          <Route path="/coreblocks" element={<Coreblocks />} />
          <Route
            path="/coreblock/:coreblockId"
            element={<CoreBlockDetails />}
          />
          <Route path="/members" element={<Members />} />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/workspace-settings/:workspaceId"
            element={<WorkSpaceSettings />}
          />
        </Route>
      </Route>
      <Route path="/testing" element={<TestingPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
