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
  Codesandbox,
  RefreshCcw,
} from "lucide-react";
import "../assets/style/SideBar.css";
import { IMAGES, SidebarMenuItems } from "../services/Constants";
import { useLocation, useNavigate } from "react-router";
import LogoutModel from "../auth/LogoutModel";
import { useAuth } from "../context/AuthContext";

const SideBar = () => {
  const { selectedWorkSpace, correctWorkSpace } = useAuth();
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
      case "Codesandbox":
        return <Codesandbox className="sidebar-icon" />;
      case "Users":
        return <Users className="sidebar-icon" />;
      case "Settings":
        return <Settings className="sidebar-icon" />;
      default:
        return null;
    }
  };

  const isDevMode = (correctWorkSpace && selectedWorkSpace?.isDevMode) || false;

  const filteredSidebarItems = SidebarMenuItems.filter((item) => {
    if (item.name === "CoreBlocks") {
      return isDevMode;
    }
    return true;
  });

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
        <div className="topbar-action-container">
          <button
            onClick={() => window.location.reload()}
            className="refresh-btn show-mobile-400 padd-duo-10-14-and-14-28 font-12-16"
          >
            <span className="icon">
              <RefreshCcw size={16} className="icon-12-16" />
            </span>
            Refresh
          </button>
          <button
            onClick={() => {
              setIsSideBar(!isSideBar);
            }}
            className="mobile-topbar-menu-btn"
          >
            <Menu />
          </button>
        </div>
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
          {filteredSidebarItems.map((item, index) => {
            const isActive = (item) => {
              if (location.pathname === item.activeAt) return true;
              if (!item.startsWith) return false;

              return item.startsWith.some((path) =>
                location.pathname.startsWith(path),
              );
            };

            return (
              <div
                key={index}
                onClick={() => {
                  navigate(item.route);
                  setIsSideBar(false);
                }}
                className={`sidebar-item ${
                  isActive(item) ? "sidebar-item-active" : ""
                }`}
              >
                {iconComponent(item.icon)}
                <span className="sidebar-label">{item.name}</span>
              </div>
            );
          })}
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
