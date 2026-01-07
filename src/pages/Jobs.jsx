import React, { useState } from "react";
import "../assets/style/Jobs.css";
import TopBar from "../components/TopBar";
import Loader from "../components/Loader";
import {
  Wrench,
  CircleAlert,
  Clock,
  CircleCheck,
  Eye,
  User,
  MapPin,
  DollarSign,
  Calendar,
} from "lucide-react";
import {
  JobsStatesCard,
  Tabs,
  SearchInput,
  Selector,
  CustomPagination,
} from "../components/CustomComponents";
import { StatesCounts, jobs } from "../services/JobHelper";
import { useNavigate } from "react-router";

const Jobs = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("alljobs");
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All States");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(2);
  const limit = 10;

  const handlePageChange = () => {};

  return (
    <div className="customers-page">
      <TopBar
        title="All Jobs"
        subTitle="Manage your platform efficiently and effectively"
      />
      <div className="customers-stats-row">
        <JobsStatesCard
          iconBg="linear-gradient(180deg, #0265A1 0%, #0288D1 100%)"
          color="#00A63E"
          title="Total Jobs"
          value={StatesCounts?.TotalJobs}
          icon={Wrench}
          subTitle="All jobs in system"
        />
        <JobsStatesCard
          iconBg="#2B7FFF"
          color="#2B7FFF"
          title="Open Jobs"
          value={StatesCounts?.OpenJobs}
          icon={CircleAlert}
          subTitle="Awaiting bids"
        />
        <JobsStatesCard
          iconBg="#F29C2C"
          color="#F29C2C"
          title="In Progress"
          value={StatesCounts?.InProgress}
          icon={Clock}
          subTitle="Currently active"
        />
        <JobsStatesCard
          iconBg="#00C950"
          color="#00C950"
          title="Completed"
          value={StatesCounts?.Completed}
          icon={CircleCheck}
          subTitle="Successfully finished"
        />
      </div>
      <div className="customers-table-card">
        <div className="job-header">
          <div className="job-header-left">
            <div className="job-header-left-title">
              <span>
                <Wrench size={16} />
              </span>
              <h3>All Jobs</h3>
            </div>
            <p>View and manage all jobs on the platform</p>
          </div>
          <div className="job-header-right">
            <SearchInput
              value={search}
              setValue={setSearch}
              placeholder="Search jobs..."
            />
          </div>
        </div>
        <div className="job-filters">
          <div className="job-filters-left">
            <Tabs
              activeTab={tab}
              setActiveTab={setTab}
              tabs={[
                { label: "All Jobs", filter: "alljobs", count: 10 },
                { label: "Open", filter: "open", count: 4 },
                { label: "In Progress", filter: "inprogress", count: 3 },
                { label: "Completed", filter: "completed", count: 3 },
              ]}
            />
          </div>
          <div className="job-filters-right">
            <Selector
              disabled={loading}
              filter={stateFilter}
              setFilter={setStateFilter}
              position="left"
              options={[
                { label: "All States", filter: "All States" },
                { label: "Arizona", filter: "Arizona" },
                { label: "California", filter: "California" },
                { label: "Colorado", filter: "Colorado" },
                { label: "Florida", filter: "Florida" },
                { label: "Massachusetts", filter: "Massachusetts" },
                { label: "Oregon", filter: "Oregon" },
                { label: "Texas", filter: "Texas" },
                { label: "Washington", filter: "Washington" },
              ]}
            />
          </div>
        </div>
        <div className="jobs-list-container">
          {jobs?.map((job, index) => (
            <div key={index} className="jobs-card">
              <div className="jobs-card-left">
                <div className="jobs-header">
                  <h3 className="jobs-title">{job.title}</h3>
                  <span className={`jobs-status jobs-${job.statusType}`}>
                    <span style={{ fontSize: "0px", marginRight: "3px" }}>
                      {job?.statusType === "open" ? (
                        <CircleAlert size={12} />
                      ) : job?.statusType === "progress" ? (
                        <Clock size={12} />
                      ) : (
                        <CircleCheck size={12} />
                      )}
                    </span>
                    {job.status}
                  </span>
                </div>

                <p className="jobs-description">{job.description}</p>

                <div className="jobs-info-row">
                  <div className="jobs-info-container">
                    <span className="icon">
                      <User color="#90A1B9" size={18} />
                    </span>
                    <div className="jobs-info">
                      <span className="jobs-label">Customer</span>
                      <span className="jobs-value">{job.customer}</span>
                    </div>
                  </div>

                  {job.contractor && (
                    <div className="jobs-info-container">
                      <span className="icon">
                        <Wrench color="#90A1B9" size={18} />
                      </span>
                      <div className="jobs-info">
                        <span className="jobs-label">Contractor</span>
                        <span className="jobs-value">{job.contractor}</span>
                      </div>
                    </div>
                  )}

                  <div className="jobs-info-container">
                    <span className="icon">
                      <DollarSign color="#90A1B9" size={18} />
                    </span>
                    <div className="jobs-info">
                      <span className="jobs-label">Budget</span>
                      <span className="jobs-value">{job.budget}</span>
                    </div>
                  </div>

                  <div className="jobs-info-container">
                    <span className="icon">
                      <MapPin color="#90A1B9" size={18} />
                    </span>
                    <div className="jobs-info">
                      <span className="jobs-label">Location</span>
                      <span className="jobs-value">{job.location}</span>
                    </div>
                  </div>
                </div>

                <div className="jobs-footer">
                  <span className="jobs-date">
                    <span style={{ fontSize: "0px", marginRight: "4px" }}>
                      <Calendar color="#90A1B9" size={12} />
                    </span>
                    Posted: {job.posted}
                  </span>
                  {job.completed && (
                    <div className="jobs-completed-footer">
                      <span style={{ fontSize: "0px", marginRight: "4px" }}>
                        <CircleCheck color="#00C950" size={12} />
                      </span>
                      Completed: {job.completed}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      navigate(`/job-details/${job?.id}`);
                    }}
                    className="jobs-details-btn"
                  >
                    <span>
                      <Eye size={16}/>
                    </span>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <CustomPagination
          show={`Showing 1–7 of ${StatesCounts?.TotalContractors} Contractors`}
          lastPage={lastPage}
          page={page}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Jobs;
