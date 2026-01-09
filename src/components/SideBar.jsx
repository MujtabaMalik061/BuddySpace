import React, { useState } from "react";
import {
  LayoutGrid,
  Users,
  LogOut,
  X,
  Menu,
  FolderOpen,
  MessageCircle,
  Library,
  Settings,
} from "lucide-react";
import "../assets/style/SideBar.css";
import { IMAGES, SidebarMenuItems } from "../services/Constants";
import { useLocation, useNavigate } from "react-router";
import LogoutModel from "../auth/LogoutModel";
import { useAuth } from "../context/AuthContext";

const SideBar = () => {
  const {logout} =useAuth()
  const navigate = useNavigate();
  const location = useLocation();
  const [isSideBar, setIsSideBar] = useState(false);
  const [isLogout, setIsLogout] = useState(false);

  const iconComponent = (iconName) => {
    switch (iconName) {
      case "LayoutGrid":
        return <LayoutGrid className="sidebar-icon" />;
      case "FolderOpen":
        return <FolderOpen className="sidebar-icon" />;
      case "MessageCircle":
        return <MessageCircle className="sidebar-icon" />;
      case "Library":
        return <Library className="sidebar-icon" />;
      case "Users":
        return <Users className="sidebar-icon" />;
      case "Settings":
        return <Settings className="sidebar-icon" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="mobile-topbar-container">
        <img
          onClick={() => {
            navigate("/");
          }}
          src={IMAGES.SiteLogo}
          alt="TaskHive Logo"
          className="sidebar-logo"
        />
        <button
          onClick={() => {
            setIsSideBar(!isSideBar);
          }}
        >
          <Menu />
        </button>
      </div>
      <aside
        className={`sidebar-container ${!isSideBar ? "sidebar-closed" : ""}`}
      >
        <div className="sidebar-header">
          <div className="landing-page-navbar-logo">
            <img
              src={IMAGES.SiteLogo}
              alt="TaskHive Logo"
              className="sidebar-logo"
            />
            <h3>
              Buddy
              <span>Space</span>
            </h3>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={() => {
              setIsSideBar(false);
            }}
          >
            <X />
          </button>
        </div>

        <div className="sidebar-divider" />

        <nav className="sidebar-menu">
          {SidebarMenuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                navigate(item.route);
                setIsSideBar(false);
              }}
              className={`sidebar-item ${
                location.pathname === item.activeAt ||
                (item.startsWith &&
                  location.pathname.startsWith(item.startsWith))
                  ? "sidebar-item-active"
                  : ""
              }`}
            >
              {iconComponent(item.icon)}
              <span className="sidebar-label">{item.name}</span>
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button
            onClick={() => {
              setIsLogout(true);
            }}
            className="sidebar-logout-btn"
          >
            <span>
              <LogOut />
            </span>
            Logout
          </button>
        </div>
        {isLogout && <LogoutModel onClose={() => setIsLogout(false)} />}
      </aside>
    </>
  );
};

export default SideBar;
