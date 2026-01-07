import React, { useEffect, useState } from "react";
import "../assets/style/Notification.css";
import TopBar from "../components/TopBar";
import { CircleCheckBig, Trash2, User } from "lucide-react";
import CustomTable from "../components/CustomTable";
import { ConfirmModal } from "../components/CustomComponents";
import { notifications } from "../services/NotificationHelper";
import { toast } from "sonner";

const Notifications = () => {
  const [isDeleted, setIsDeleted] = useState(null);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(2);
  const limit = 10;

  const handlePageChange = () => {};

  const handleDeleted = () => {
    console.log(`${isDeleted} ---> Notification deleted successfully`);
    toast.success("Notification deleted successfully");
    setIsDeleted(null)
  };

  const notificationsColumns = [
    {
      name: "User",
      row: (n) => (
        <div className="notification-user-container">
          <div className="notification-user-profile-container">
            {n?.profileImage ? (
              <img src={n?.profileImage} alt="profileImage" />
            ) : (
              <User />
            )}
          </div>
          <div className="notification-user-info-container">
            <strong>{n?.name}</strong>
            <p>{n?.email}</p>
          </div>
        </div>
      ),
    },
    {
      name: "Title",
      row: (n) => (
        <>
          <strong>{n?.title}</strong>
          <p>{n?.message}</p>
        </>
      ),
    },
    {
      name: "Time",
      row: (n) => n?.time,
    },
    {
      name: "Actions",
      bothClass: "customers-table-action",
      width: "8%",
      row: (n) => (
        <div className="category-action-btns-container">
          <button
            onClick={() => {
              setIsDeleted(n?.id);
            }}
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
        title="Notifications"
        subTitle="Manage your platform efficiently and effectively"
      />
      <div className="customers-table-card">
        <div className="notification-header">
          <h3 className="customers-section-title">All Notifications</h3>
          <div className="notification-header-action-btns">
            <button className="notification-header-action-btn">
              <span>
                <CircleCheckBig size={15} />
              </span>
              Mark All as Read
            </button>
            <button className="notification-header-action-btn">
              <span>
                <Trash2 size={15} />
              </span>
              Clear All
            </button>
          </div>
        </div>
        <CustomTable
          data={notifications}
          columns={notificationsColumns}
          show={`Showing 1–10 of ${notifications?.length} Notifications`}
          lastPage={lastPage}
          page={page}
          handlePageChange={handlePageChange}
        />
        {isDeleted && (
          <ConfirmModal
            title="Delete Notification"
            description={`Are you sure you want to delete this notification? This action cannot be undone.`}
            danger={true}
            confirmBtn="Delete"
            onClose={() => {
              setIsDeleted(null);
            }}
            onSubmit={handleDeleted}
          />
        )}
      </div>
    </div>
  );
};

export default Notifications;
