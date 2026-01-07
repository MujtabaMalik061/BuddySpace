import React from "react";

const CategoriesModal = ({ onClose, categoryData, onSubmit }) => {
  const [categoryName, setCategoryName] = React.useState(
    categoryData?.category || ""
  );
  const [subcategories, setSubcategories] = React.useState(
    categoryData?.subcategories?.join(", ") || ""
  );
  const [isActive, setIsActive] = React.useState(
    categoryData?.status === "Active" || true
  );

  const handleSubmit = () => {
    const formattedData = {
      ...categoryData,
      category: categoryName,
      subcategories: subcategories.split(",").map((s) => s.trim()),
      status: isActive ? "Active" : "Inactive",
    };
    onSubmit(formattedData);
    onClose();
  };

  return (
    <div className="categoriesModal-overlay">
      <div className="categoriesModal-container">
        <button
          className="categoriesModal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="categoriesModal-title">
          {categoryData ? "Edit Category" : "Add New Category"}
        </h2>
        <p className="categoriesModal-subtitle">
          {categoryData
            ? "Update this service category for your platform"
            : "Create a new service category for your platform"}
        </p>

        <div className="categoriesModal-field">
          <label className="categoriesModal-label">Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="e.g., Plumbing"
            className="categoriesModal-input"
          />
        </div>

        <div className="categoriesModal-field">
          <label className="categoriesModal-label">Subcategories</label>
          <textarea
            rows="3"
            value={subcategories}
            onChange={(e) => setSubcategories(e.target.value)}
            placeholder="Enter subcategories separated by commas (e.g., Pipe Repair, Drain Cleaning)"
            className="categoriesModal-textarea"
          />
          <span className="categoriesModal-helper">
            Separate multiple subcategories with commas
          </span>
        </div>

        <div className="categoriesModal-status">
          <div>
            <p className="categoriesModal-statusTitle">Active Status</p>
            <p className="categoriesModal-statusText">
              Inactive categories won't be visible to users
            </p>
          </div>

          <label className="categoriesModal-switch">
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
            <span className="categoriesModal-slider"></span>
          </label>
        </div>

        <div className="categoriesModal-actions">
          <button
            className="categoriesModal-btn categoriesModal-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="categoriesModal-btn categoriesModal-submit"
            onClick={handleSubmit}
          >
            {categoryData ? "Update Category" : "Create Category"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriesModal;
