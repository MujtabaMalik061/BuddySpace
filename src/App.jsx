import { Routes, Route, Navigate } from "react-router-dom";
import "./assets/style/Style.css";
import "./assets/style/MediaText.css";
import AppLayout from "./layout/AppLayout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import { ProtectedRoute, PublicRoute } from "./routes/Route.jsx";
import Login from "./auth/Login.jsx";
import SignUp from "./auth/SignUp.jsx";
import ForgetPassword from "./auth/ForgetPassword.jsx";
import Settings from "./pages/Settings.jsx"
import Members from "./pages/Members.jsx";

const App = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/signin" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/workspaces" element={<DashBoard />} />
          <Route path="/workspace/:id" element={<DashBoard />} />
          <Route path="/chat" element={<DashBoard />} />
          <Route path="/collections" element={<DashBoard />} />
          <Route path="/collection/:id" element={<DashBoard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="/" element={<LandingPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
