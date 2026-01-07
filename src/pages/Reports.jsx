import React, { useState } from "react";
import "../assets/style/Reports.css";
import TopBar from "../components/TopBar";
import Loader from "../components/Loader";
import { Eye, TriangleAlert } from "lucide-react";
import { Tabs } from "../components/CustomComponents";
import CustomTable from "../components/CustomTable";
import ReviewDetailsModel from "../components/ReviewDetailsModal";
import {
  StatesCounts,
  reports,
  filterReportsByTab,
  reportDetails,
} from "../services/ReportsHelper";

const Reports = () => {
  const [tab, setTab] = useState("pending");
  const [review, setReview] = useState(null);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(2);
  const limit = 10;

  const handlePageChange = () => {};

  const reportedUsersColumns = [
    {
      name: "Reported User",
      row: (r) => <span>{r?.ReportedUser}</span>,
    },
    {
      name: "Reported By",
      row: (r) => <span>{r?.ReportedBy}</span>,
    },
    {
      name: "Reason",
      row: (r) => (
        <div>
          <span style={{ fontSize: 0, marginRight: 4 }}>
            <TriangleAlert color="red" size={13} />
          </span>
          {r?.Type}
        </div>
      ),
    },
    {
      name: "Date",
      row: (r) => <span>{r?.joinDate}</span>,
    },
    {
      name: "Job ID",
      row: (r) => <span>{r?.jobId}</span>,
    },
    {
      name: "Actions",
      bothClass: "customers-table-action",
      row: (r) => (
        <button
          onClick={() => {
            setReview(reportDetails);
            // setReview(r);
          }}
          className="report-action-btn"
        >
          <span>
            <Eye />
          </span>
          Review
        </button>
      ),
    },
  ];

  const filteredReports = filterReportsByTab(reports, tab);

  return (
    <div className="customers-page">
      <TopBar
        title="Reports"
        subTitle="Manage your platform efficiently and effectively"
      />
      <div className="customers-table-card">
        <h3 className="customers-section-title">User Reports & Complaints</h3>
        <Tabs
          activeTab={tab}
          setActiveTab={setTab}
          tabs={[
            { label: "Pending", filter: "pending", count: 5 },
            { label: "Resolved", filter: "resolved", count: 0 },
            { label: "Dismissed", filter: "dismissed", count: 0 },
          ]}
        />
        <CustomTable
          data={filteredReports}
          columns={reportedUsersColumns}
          show={`Showing 1–7 of ${
            tab === "pending"
              ? StatesCounts?.PendingReports
              : tab === "resolved"
              ? StatesCounts?.ResolvedReports
              : StatesCounts?.DismissedReports
          } Reports`}
          lastPage={lastPage}
          page={page}
          handlePageChange={handlePageChange}
        />
      </div>
      {review && (
        <ReviewDetailsModel
          data={review}
          onClose={() => {
            setReview(null);
          }}
        />
      )}
    </div>
  );
};

export default Reports;
