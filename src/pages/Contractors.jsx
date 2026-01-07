import React, { useEffect, useState } from "react";
import "../assets/style/Contractors.css";
import TopBar from "../components/TopBar";
import Loader from "../components/Loader";
import {
  UserCheck,
  Briefcase,
  CircleCheckBig,
  CircleX,
  Eye,
  Ban,
  Star,
} from "lucide-react";
import {
  StatesCard,
  Tabs,
  SearchInput,
  Selector,
  EllipsisSelector,
  ConfirmModal,
} from "../components/CustomComponents";
import CustomTable from "../components/CustomTable";
import {
  StatesCounts,
  contractors,
  pendingVerification,
} from "../services/ContractorsHelper";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Contractors = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("allcontractors");
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [specialtiesFilter, setSpecialtiesFilter] = useState("All Specialties");
  const [stateFilter, setStateFilter] = useState("All States");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [isSuspend, setIsSuspend] = useState(null);
  const [isBanned, setIsBanned] = useState(null);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(2);
  const limit = 10;

  const handlePageChange = () => {};

  const handleSuspend = () => {
    console.log(`${isSuspend} ---> Contractor Sespend successfully`);
    toast.success("Contractor Sespend successfully");
    setIsSuspend(null)
  };

  const handleBanned = () => {
    console.log(`${isBanned} ---> Contractor Banned successfully`);
    toast.success("Contractor Banned successfully");
    setIsBanned(null)
  };

  const contractorColumns = [
    {
      name: "Contractor",
      row: (c) => (
        <>
          <strong>{c?.name}</strong>
          <p>{c?.email}</p>
        </>
      ),
    },
    {
      name: "Specialty",
      row: (c) => (
        <span className="customers-status customers-specialty-status">
          {c?.Specialty}
        </span>
      ),
    },
    {
      name: "Status",
      row: (c) => (
        <span
          className={`customers-status customers-status-${c?.status?.toLowerCase()}`}
        >
          {c?.status}
        </span>
      ),
    },
    {
      name: "Verification",
      row: (c) => (
        <span
          className={`customers-status customers-verification-status-${c?.Verification}`}
        >
          {c?.Verification}
        </span>
      ),
    },
    {
      name: "Join Date",
      row: (c) => c?.joinDate,
    },
    {
      name: "Jobs",
      row: (c) => (
        <>
          {c?.totalJobs}{" "}
          <span style={{ color: "#6A7282" }}>({c?.jobsActive} active)</span>
        </>
      ),
    },
    {
      name: "Rating",
      width: "9%",
      row: (c) => (
        <>
          <span style={{ marginRight: "2px" }}>
            <Star color="#ffe200" fill="#ffe200" size={14} />
          </span>
          {c?.Rating || 0}
        </>
      ),
    },
    {
      name: "Actions",
      width: "9%",
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
                action: () => navigate(`/contractor-details/${c?.userId}`),
              },
              {
                label: "Suspend Contractor",
                icon: CircleX,
                action: () => setIsSuspend(c?.userId),
              },
              {
                label: "Ban Contractor",
                icon: Ban,
                action: () => setIsBanned(c?.userId),
              },
            ]}
          />
        ),
    },
  ];

  const pendingVerificationColumns = [
    {
      name: "Contractor",
      row: (r) => (
        <>
          <strong>{r?.name}</strong>
          <p>{r?.email}</p>
        </>
      ),
    },
    {
      name: "License Type",
      width:"20%",
      row: (r) => (
        <span className="customers-status customers-specialty-status">
          {r?.LicenseType}
        </span>
      ),
    },
    {
      name: "License Number",
      row: (r) => r?.LicenseNumber,
    },
    {
      name: "State",
      row: (r) => r?.State,
    },
    {
      name: "Expiry Date",
      row: (r) => r?.ExpiryDate,
    },
    {
      name: "Actions",
      width:"25%",
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
        title="All Contractors"
        subTitle="Manage your platform efficiently and effectively"
      />
      <div className="customers-stats-row">
        <StatesCard
          iconBg="#2B7FFF"
          title="Total Contractors"
          value={StatesCounts?.TotalContractors}
          icon={UserCheck}
        />
        <StatesCard
          iconBg="#00C950"
          title="Active Contractors"
          value={StatesCounts?.ActiveContractors}
          icon={CircleCheckBig}
        />
        <StatesCard
          iconBg="#F0B100"
          title="Pending Verification"
          value={StatesCounts?.PendingVerification}
          icon={CircleX}
        />
        <StatesCard
          iconBg="#AD46FF"
          title="Active Jobs"
          value={StatesCounts?.ActiveJobs}
          icon={Briefcase}
        />
      </div>
      <Tabs
        activeTab={tab}
        setActiveTab={setTab}
        tabs={[
          { label: "All Contractors", filter: "allcontractors", count: 0 },
          {
            label: "Pending Verification",
            filter: "pendingverification",
            count: 3,
          },
        ]}
      />
      {tab === "allcontractors" ? (
        <div className="customers-table-card">
          <h3 className="customers-section-title">All Contractors</h3>
          <div className="customers-filters">
            <SearchInput
              value={search}
              setValue={setSearch}
              placeholder="Search contractors..."
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
              filter={specialtiesFilter}
              setFilter={setSpecialtiesFilter}
              position="left"
              options={[
                { label: "All Specialties", filter: "All Specialties" },
                { label: "Plumbing", filter: "Plumbing" },
                { label: "Electrical", filter: "Electrical" },
                { label: "HVAC", filter: "HVAC" },
                { label: "Carpentry", filter: "Carpentry" },
                { label: "Painting", filter: "Painting" },
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
            data={contractors}
            columns={contractorColumns}
            show={`Showing 1–7 of ${StatesCounts?.TotalContractors} Contractors`}
            lastPage={lastPage}
            page={page}
            handlePageChange={handlePageChange}
          />
        </div>
      ) : (
        <div className="customers-table-card">
          <h3 className="customers-section-title">
            Pending License Verifications
          </h3>

          <CustomTable
            data={pendingVerification}
            columns={pendingVerificationColumns}
            show={`Showing 1–7 of ${StatesCounts?.PendingVerification} pending verification`}
            lastPage={lastPage}
            page={page}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
      {isSuspend && (
        <ConfirmModal
          title="Suspend Contractor"
          description={`Are you sure you want to suspend this contractor? This action can be reversed later.`}
          onClose={() => {
            setIsSuspend(null);
          }}
          onSubmit={handleSuspend}
        />
      )}
      {isBanned && (
        <ConfirmModal
          title="Ban Contractor"
          description={`Are you sure you want to ban this contractor? This action can be permanent.`}
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

export default Contractors;
