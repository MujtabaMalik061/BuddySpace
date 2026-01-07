import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";

const AppLayout = () => {
  return (
    <div className="app-container">
      <SideBar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
