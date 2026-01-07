import React, { useState } from "react";
import {
  LayoutGrid,
  Users,
  Briefcase,
  Bell,
  LogOut,
  X,
  Menu,
  Flag,
  FolderTree,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "../assets/style/SideBar.css";
import { IMAGES, SidebarMenuItems } from "../services/Constants";
import { useLocation, useNavigate } from "react-router";
import Logout from "../auth/Logout";

const SideBar = ({ isHalfSideBar, setIsHalfSideBar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSideBar, setIsSideBar] = useState(false);
  const [isLogout, setIsLogout] = useState(false);

  const iconComponent = (iconName) => {
    switch (iconName) {
      case "LayoutGrid":
        return <LayoutGrid className="sidebar-icon" />;
      case "Users":
        return <Users className="sidebar-icon" />;
      case "Briefcase":
        return <Briefcase className="sidebar-icon" />;
      case "Flag":
        return <Flag className="sidebar-icon" />;
      case "FolderTree":
        return <FolderTree className="sidebar-icon" />;
      case "Bell":
        return <Bell className="sidebar-icon" />;
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
        className={`sidebar-container desktop-sidebar-container ${
          isHalfSideBar ? "sidebar-desktop-closed" : ""
        }`}
      >
        <div
          style={{ justifyContent: isHalfSideBar ? "center" : "" }}
          className="sidebar-header"
        >
          {!isHalfSideBar && (
            <div>
              <img
                src={IMAGES.SiteLogoWithText}
                alt="TaskHive Logo"
                className="sidebar-logo"
              />
            </div>
          )}
          <button
            className="sidebar-close-btn"
            onClick={() => {
              setIsHalfSideBar(!isHalfSideBar);
            }}
          >
            <span className={isHalfSideBar ? "right-arrow" : "left-arrow"}>
              {isHalfSideBar ? (
                <ChevronRight size={26} />
              ) : (
                <ChevronLeft size={26} />
              )}
            </span>
          </button>
        </div>

        <div className="sidebar-divider" />

        <nav
          style={{ padding: isHalfSideBar ? "12px 8px" : "" }}
          className="sidebar-menu"
        >
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
                  item.startsWith.some((path) =>
                    location.pathname.startsWith(path)
                  ))
                  ? "sidebar-item-active"
                  : ""
              }`}
            >
              {iconComponent(item.icon)}
              {!isHalfSideBar && (
                <span className="sidebar-label">{item.name}</span>
              )}
            </div>
          ))}
        </nav>
        <div
          style={{ padding: isHalfSideBar ? "12px 8px" : "" }}
          className="sidebar-footer"
        >
          <button
            onClick={() => {
              setIsLogout(true);
            }}
            className="sidebar-logout-btn"
            style={{ justifyContent: isHalfSideBar ? "center" : "" }}
          >
            <span>
              <LogOut />
            </span>
            {!isHalfSideBar && "Logout"}
          </button>
        </div>
        {isLogout && <Logout onClose={() => setIsLogout(false)} />}
      </aside>
      <aside
        className={`sidebar-container mobile-sidebar-container ${
          !isSideBar ? "sidebar-closed" : ""
        }`}
      >
        <div className="sidebar-header">
          <div>
            <img
              src={IMAGES.SiteLogoWithText}
              alt="TaskHive Logo"
              className="sidebar-logo"
            />
          </div>
          <button
            className="sidebar-close-btn"
            onClick={() => {
              setIsSideBar(!isSideBar);
            }}
          >
            <span>
              <X size={26} />
            </span>
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
                  item.startsWith.some((path) =>
                    location.pathname.startsWith(path)
                  ))
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
        {isLogout && <Logout onClose={() => setIsLogout(false)} />}
      </aside>
    </>
  );
};

export default SideBar;
