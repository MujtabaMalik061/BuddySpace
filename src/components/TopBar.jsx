import React, { useEffect, useState } from "react";
import "../assets/style/TopBar.css";
import { Selector } from "./CustomComponents";
import { handleFtechWorkSpaces } from "../services/WorkSpaceHelper";
import { useAuth } from "../context/AuthContext";

const TopBar = ({ title = "" }) => {
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [workSpaces, setWorkSpaces] = useState([]);
  const [selectedWorkSpace, setSelectedWorkSpace] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    fetchMyWorkSpaces();
  }, [currentUser]);

  const fetchMyWorkSpaces = async () => {
    try {
      setLoading(true);

      const data = await handleFtechWorkSpaces("private", currentUser?.id);
      setWorkSpaces(data);

      if (data.length === 0) return;

      const storedWorkspace = localStorage.getItem("selectedWorkspace");
      if (!storedWorkspace) {
        const firstWorkspace = data[0];

        setSelectedWorkSpace(firstWorkspace.name);
        localStorage.setItem(
          "selectedWorkspace",
          JSON.stringify(firstWorkspace)
        );
      } else {
        const parsed = JSON.parse(storedWorkspace);
        setSelectedWorkSpace(parsed.name);
      }
    } catch (err) {
      console.error("TopBar workspace fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const hasWorkSpaces = workSpaces.length > 0;

  const selectorOptions = hasWorkSpaces
    ? workSpaces.map((ws) => ({
        label: ws.name,
        filter: ws.name,
      }))
    : [{ label: "No workspace found", filter: "No workspace found" }];

  const selectorFilter = hasWorkSpaces
    ? selectedWorkSpace
    : "No workspace found";

  const handleFilterChange = (value) => {
    if (!hasWorkSpaces) return;
    setSelectedWorkSpace(value);
    const selected = workSpaces.find((w) => w.name === value);
    if (selected) {
      localStorage.setItem("selectedWorkspace", JSON.stringify(selected));
    }
    window.location.reload();
  };

  return (
    <div className="topbar-container">
      <h3>{title}</h3>
      <Selector
        disabled={loading || !hasWorkSpaces}
        filter={selectorFilter}
        setFilter={handleFilterChange}
        position="left"
        options={selectorOptions}
      />
    </div>
  );
};

export default TopBar;
