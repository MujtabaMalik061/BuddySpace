import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";

const AppLayout = () => {
  const [isHalfSideBar, setIsHalfSideBar] = useState(true);

  return (
    <div className="app-container">
      <SideBar
        isHalfSideBar={isHalfSideBar}
        setIsHalfSideBar={setIsHalfSideBar}
      />
      <div className={`main-content ${isHalfSideBar ? "main-content-half-sidebar" : ""}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
