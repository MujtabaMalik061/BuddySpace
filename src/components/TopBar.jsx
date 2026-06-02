import "../assets/style/TopBar.css";
import { Selector } from "./CustomComponents";
import { useAuth } from "../context/AuthContext";
import { RefreshCcw } from "lucide-react";

const TopBar = ({ title = "" }) => {
  const {
    workSpaces,
    selectedWorkSpace,
    changeWorkspace,
    loading,
    workSpacesLoader,
  } = useAuth();

  const hasWorkSpaces = workSpaces.length > 0;

  const selectorOptions = hasWorkSpaces
    ? workSpaces.map((ws) => ({
        label: ws.name,
        filter: ws.name,
      }))
    : [{ label: "No workspace found", filter: "No workspace found" }];

  const handleFilterChange = (value) => {
    const workspace = workSpaces.find((ws) => ws.name === value);
    if (workspace) {
      changeWorkspace(workspace);
    }
  };

  return (
    <div className="topbar-container">
      <h3>{title}</h3>
      <div className="topbar-action-container">
        <button
          onClick={() => window.location.reload()}
          className="refresh-btn hide-mobile-400 padd-duo-10-14-and-14-28 font-12-16"
        >
          <span className="icon">
            <RefreshCcw size={16} className="icon-12-16" />
          </span>
          Refresh
        </button>

        <Selector
          disabled={loading || workSpacesLoader || !hasWorkSpaces}
          filter={
            workSpacesLoader
              ? "Searching..."
              : hasWorkSpaces
                ? selectedWorkSpace?.name || ""
                : "No workspace found"
          }
          setFilter={handleFilterChange}
          options={selectorOptions}
        />
      </div>
    </div>
  );
};

export default TopBar;
