import "../assets/style/TopBar.css";
import { Selector } from "./CustomComponents";
import { useAuth } from "../context/AuthContext";

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
  );
};

export default TopBar;
