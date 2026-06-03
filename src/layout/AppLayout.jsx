import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import { useAuth } from "../context/AuthContext";
import Offline from "../components/Offline";
import AllowIosPush from "../components/Allow.iosPush";

const AppLayout = () => {
  const { isOnline } = useAuth();

  return (
    <>
      <AllowIosPush />
      {isOnline ? (
        <div className="app-container">
          <SideBar />
          <div className="main-content">
            <Outlet />
          </div>
        </div>
      ) : (
        <Offline />
      )}
    </>
  );
};

export default AppLayout;
