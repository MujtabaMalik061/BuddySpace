import React from "react";
import "../assets/style/TopBar.css";

const TopBar = ({ title = "", subTitle = "" }) => {
  return (
    <div className="dashboard-header">
      <h1 className="dashboard-title">{title}</h1>
      <p className="dashboard-subtitle">{subTitle}</p>
    </div>
  );
};

export default TopBar;
