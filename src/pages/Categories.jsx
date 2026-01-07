import React, { useState } from "react";
import "../assets/style/Categories.css";
import TopBar from "../components/TopBar";
import Loader from "../components/Loader";
import { FolderTree, Plus, SquarePen, Trash2 } from "lucide-react";
import CustomTable from "../components/CustomTable";
import { categories } from "../services/CategoriesHelper";
import CategoriesModal from "../components/AddCategoriesModal";
import { toast } from "sonner";
import { ConfirmModal } from "../components/CustomComponents";

const Categories = () => {
  const [isAdd, setIsAdd] = useState(false);
  const [isDeleted, setIsDeleted] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(2);
  const limit = 10;

  const handlePageChange = () => {};

  const handleDeleted = () => {
    console.log(`${isDeleted} ---> Category deleted successfully`);
    toast.success("Category deleted successfully");
    setIsDeleted(null);
  };

  const handleEdit = (id) => {
    const categoryToEdit = categories.find((c) => c.id === id);
    setEditingCategory(categoryToEdit);
  };

  const categoriesColumns = [
    {
      name: "Category",
      tdClass: "category-td",
      row: (c) => (
        <div>
          <span style={{ marginRight: "4px" }}>
            <FolderTree color="#155DFC" size={14} />
          </span>
          {c?.category}
        </div>
      ),
    },
    {
      name: "Subcategories",
      width: "20%",
      row: (c) => (
        <div className="sub-category-container">
          {c?.subcategories?.slice(0, 1).map((sub, i) => (
            <span key={i} className="sub-category">
              {sub}
            </span>
          ))}
          {c?.subcategories?.length > 1 && (
            <span className="sub-category">+{c.subcategories.length - 1}</span>
          )}
        </div>
      ),
    },
    {
      name: "Active Jobs",
      row: (c) => c?.activeJobs,
    },
    {
      name: "Contractors",
      row: (c) => c?.contractors,
    },
    {
      name: "Status",
      row: (c) => (
        <span
          className={`customers-status customers-status-${
            c?.status === "Active" ? "active" : "suspended"
          }`}
        >
          {c?.status}
        </span>
      ),
    },
    {
      name: "Actions",
      bothClass: "customers-table-action",
      width: "10%",
      row: (c) => (
        <div className="category-action-btns-container">
          <button
            onClick={() => handleEdit(c?.id)}
            className="category-action-edit"
          >
            <SquarePen size={15} />
          </button>
          <button
            onClick={() => setIsDeleted(c)}
            className="category-action-delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="customers-page">
      <TopBar
        title="Categories"
        subTitle="Manage your platform efficiently and effectively"
      />
      <div className="customers-table-card">
        <div className="categories-header">
          <h3 className="customers-section-title">Service Categories</h3>
          <button
            onClick={() => {
              setIsAdd(true);
            }}
            className="header-add-categories-btn"
          >
            <span>
              <Plus size={16} />
            </span>
            Add Category
          </button>
        </div>
        <CustomTable
          data={categories}
          columns={categoriesColumns}
          show={`Showing 1–7 of ${categories?.length || 0} categories`}
          lastPage={lastPage}
          page={page}
          handlePageChange={handlePageChange}
        />
      </div>
      {isAdd && (
        <CategoriesModal
          onClose={() => setIsAdd(false)}
          onSubmit={(data) => {
            console.log("New Category Data:", data);
            setIsAdd(false);
          }}
        />
      )}

      {editingCategory && (
        <CategoriesModal
          categoryData={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSubmit={(updatedData) => {
            console.log("Updated Category Data:", updatedData);
            setEditingCategory(null);
          }}
        />
      )}

      {isDeleted && (
        <ConfirmModal
          title="Delete Category"
          description={`Are you sure you want to delete this category? This action cannot be undone.`}
          danger={true}
          confirmBtn="Delete Category"
          onClose={() => {
            setIsDeleted(null);
          }}
          onSubmit={handleDeleted}
        />
      )}
    </div>
  );
};

export default Categories;
