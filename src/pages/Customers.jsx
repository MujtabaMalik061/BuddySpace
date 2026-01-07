import React, { useEffect, useState } from "react";
import "../assets/style/Customers.css";
import TopBar from "../components/TopBar";
import Loader from "../components/Loader";
import { Users, CircleCheckBig, CircleX, Eye, Ban } from "lucide-react";
import {
  StatesCard,
  Tabs,
  SearchInput,
  Selector,
  EllipsisSelector,
  ConfirmModal,
} from "../components/CustomComponents";
import {
  StatesCounts,
  customers,
  pendingApproval,
} from "../services/CustomersHelper";
import CustomTable from "../components/CustomTable";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Customers = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("allcustomers");
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [stateFilter, setStateFilter] = useState("All States");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [isSuspend, setIsSuspend] = useState(null);
  const [isBanned, setIsBanned] = useState(null);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(2);
  const limit = 10;

  const handlePageChange = () => {};

  const handleSuspend = () => {
    console.log(`${isSuspend} ---> Customer Sespend successfully`);
    toast.success("Customer Sespend successfully");
    setIsSuspend(null);
  };
  const handleBanned = () => {
    console.log(`${isBanned} ---> Customer Banned successfully`);
    toast.success("Customer Banned successfully");
    setIsBanned(null)
  };

  const customersColumns = [
    {
      name: "Customer",
      row: (c) => (
        <>
          <strong>{c?.name}</strong>
          <p>{c?.email}</p>
        </>
      ),
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
      name: "Location",
      row: (c) => c?.location,
    },
    {
      name: "Join Date",
      row: (c) => c?.joinDate,
    },
    {
      name: "Jobs Posted",
      row: (c) => (
        <>
          {c?.jobsPosted}{" "}
          <span
            style={{ color: "#6A7282", fontSize: "clamp(12px, 2vw, 14px)" }}
          >
            ({c?.jobsCompleted} completed)
          </span>
        </>
      ),
    },
    {
      name: "Actions",
      bothClass: "customers-table-action",
      row: (c) =>
        statusLoading === c?.userId ? (
          <Loader size="12" style={{ height: 18, width: 18 }} />
        ) : (
          <EllipsisSelector
            options={[
              {
                label: "View Details",
                icon: Eye,
                action: () => navigate(`/customer-details/${c?.userId}`),
              },
              {
                label: "Suspend Customer",
                icon: CircleX,
                action: () => setIsSuspend(c?.userId),
              },
              {
                label: "Ban Customer",
                icon: Ban,
                action: () => setIsBanned(c?.userId),
              },
            ]}
          />
        ),
    },
  ];

  const approvalColumns = [
    {
      name: "Customer",
      row: (r) => (
        <>
          <strong>{r?.name}</strong>
          <p>{r?.email}</p>
        </>
      ),
    },
    {
      name: "Location",
      row: (r) => r?.location,
    },
    {
      name: "Phone",
      row: (r) => r?.phoneNumber,
    },
    {
      name: "Actions",
      bothClass: "customers-table-action",
      row: (r) => (
        <div className="request-action-btns">
          <button className="request-approve-btn request-action-btn">
            <span>
              <CircleCheckBig size={16} />
            </span>
            Approve
          </button>
          <button className="request-reject-btn request-action-btn">
            <span>
              <CircleX size={16} />
            </span>
            Reject
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="customers-page">
      <TopBar
        title="All Customers"
        subTitle="Manage your platform efficiently and effectively"
      />
      <div className="customers-stats-row">
        <StatesCard
          iconBg="#2B7FFF"
          title="Total Customers"
          value={StatesCounts?.TotalCustomers}
          icon={Users}
        />
        <StatesCard
          iconBg="#00C950"
          title="Active Customers"
          value={StatesCounts?.ActiveCustomers}
          icon={CircleCheckBig}
        />
        <StatesCard
          iconBg="#F0B100"
          title="Pending Approval"
          value={StatesCounts?.PendingApproval}
          icon={CircleX}
        />
        <StatesCard
          iconBg="#AD46FF"
          title="This Month"
          stringValue={`+${StatesCounts?.ThisMonth}`}
          icon={Users}
        />
      </div>
      <Tabs
        activeTab={tab}
        setActiveTab={setTab}
        tabs={[
          { label: "All Customers", filter: "allcustomers", count: 0 },
          { label: "Pending Approval", filter: "pendingapproval", count: 3 },
        ]}
      />
      {tab === "allcustomers" ? (
        <div className="customers-table-card">
          <h3 className="customers-section-title">All Customers</h3>
          <div className="customers-filters">
            <SearchInput
              value={search}
              setValue={setSearch}
              placeholder="Search customers..."
            />

            <Selector
              disabled={loading}
              filter={statusFilter}
              setFilter={setStatusFilter}
              position="left"
              options={[
                { label: "All Status", filter: "All Status" },
                { label: "Active", filter: "Active" },
                { label: "Pending", filter: "Pending" },
                { label: "Suspended", filter: "Suspended" },
                { label: "Banned", filter: "Banned" },
              ]}
            />
            <Selector
              disabled={loading}
              filter={stateFilter}
              setFilter={setStateFilter}
              position="left"
              options={[
                { label: "All States", filter: "All States" },
                { label: "California", filter: "California" },
                { label: "Texas", filter: "Texas" },
                { label: "Florida", filter: "Florida" },
                { label: "Washington", filter: "Washington" },
              ]}
            />
            <Selector
              disabled={loading}
              filter={cityFilter}
              setFilter={setCityFilter}
              position="left"
              options={[
                { label: "All Cities", filter: "All Cities" },
                { label: "Los Angeles", filter: "Los Angeles" },
                { label: "San Francisco", filter: "San Francisco" },
                { label: "San Diego", filter: "San Diego" },
                { label: "Austin", filter: "Austin" },
              ]}
            />
          </div>
          <CustomTable
            data={customers}
            columns={customersColumns}
            show={`Showing 1–7 of ${StatesCounts?.TotalCustomers} customers`}
            lastPage={lastPage}
            page={page}
            handlePageChange={handlePageChange}
          />
        </div>
      ) : (
        <div className="customers-table-card">
          <h3 className="customers-section-title">
            Pending Customer Approvals
          </h3>
          <CustomTable
            data={pendingApproval}
            columns={approvalColumns}
            show={`Showing 1–7 of ${StatesCounts?.PendingApproval} pending Approvals`}
            lastPage={lastPage}
            page={page}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
      {isSuspend && (
        <ConfirmModal
          title="Suspend Customer"
          description={`Are you sure you want to suspend this customer? This action can be reversed later.`}
          onClose={() => {
            setIsSuspend(null);
          }}
          onSubmit={handleSuspend}
        />
      )}
      {isBanned && (
        <ConfirmModal
          title="Ban Customer"
          description={`Are you sure you want to ban this customer? This action can be permanent.`}
          danger={true}
          onClose={() => {
            setIsBanned(null);
          }}
          onSubmit={handleBanned}
        />
      )}
    </div>
  );
};

export default Customers;
