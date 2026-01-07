import React from "react";
import {
  Ban,
  Briefcase,
  Calendar,
  CircleAlert,
  CircleCheck,
  Clock,
  DollarSign,
  Eye,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShieldBan,
  Star,
} from "lucide-react";
import TopBar from "./TopBar";
import {
  ratingStars,
  StatesCard,
  GoBackBtn,
  ProfileImage,
} from "./CustomComponents";
import { customerDetailData } from "../services/CustomersHelper";
import { useNavigate } from "react-router";

const CustomerDetails = () => {
  const navigate = useNavigate();

  return (
    <div className="customer-detail-container">
      <GoBackBtn title="Back to All Customer" onBack="/customers" />
      <TopBar
        title="Customer Detail"
        subTitle="Manage your platform efficiently and effectively"
      />
      <div className="customer-detail-header">
          <ProfileImage
            Image={customerDetailData?.ProfileImage}
            value={customerDetailData?.initials}
            className="customer-detail-header-profile"
          />
        <div className="customer-detail-info">
          <div className="customer-detail-top">
            <div className="customer-detail-title">
              <h2 className="customer-detail-name">
                {customerDetailData.name}
              </h2>

              <span className="status-badge active">
                {customerDetailData.status}
              </span>

              {customerDetailData?.verified ? (
                <span className="verified-badge">
                  <Shield size={14} />
                  Verified
                </span>
              ) : (
                <span className="verified-badge unverified">
                  <ShieldBan size={14} />
                  Unverified
                </span>
              )}
            </div>

            <div className="customer-detail-actions">
              <button className="btn-warning">
                <span className="icon">
                  <Ban size={16} />
                </span>
                Suspend
              </button>

              <button className="btn-danger">
                <span className="icon">
                  <Ban size={16} />
                </span>
                Ban
              </button>
            </div>
          </div>

          <div className="customer-detail-meta-list">
            <p className="customer-detail-meta">
              <Mail size={16} />
              {customerDetailData.email}
            </p>

            <p className="customer-detail-meta">
              <Phone size={16} />
              {customerDetailData.phone}
            </p>

            <p className="customer-detail-meta">
              <MapPin size={16} />
              {customerDetailData.location}
            </p>

            <p className="customer-detail-meta">
              <Calendar size={16} />
              Joined {customerDetailData.joined}
            </p>
          </div>
        </div>
      </div>

      <div className="customer-detail-stats">
        <StatesCard
          iconBg="#0265A1"
          title="Total Jobs"
          value={8}
          icon={Briefcase}
        />
        <StatesCard iconBg="#F29C2C" title="Active" value={2} icon={Clock} />
        <StatesCard
          iconBg="#00A63E"
          title="Completed"
          value={5}
          icon={CircleCheck}
        />
        <StatesCard
          iconBg="#00A63E"
          title="Total Spent"
          stringValue={"$45,200"}
          icon={DollarSign}
        />
        <StatesCard
          iconBg="#FDC700"
          title="Avg Rating"
          value={4.8}
          icon={Star}
        />
      </div>

      <div className="customer-detail-jobs">
        <div className="customer-detail-tabs">
          <div className="customer-detail-tab active">
            Job History <span>(5)</span>
          </div>
        </div>
        {customerDetailData.jobs.map((job, index) => (
          <div className="customer-detail-job-card" key={index}>
            <div className="customer-detail-job-card-left">
              <div className="customer-detail-job-header">
                <h3 className="customer-detail-job-title">{job.title}</h3>
                <span
                  className={`customer-detail-job-status customer-detail-${job.status
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`}
                >
                  <span>
                    {job?.status === "Open" ? (
                      <CircleAlert size={14} />
                    ) : job?.status === "Completed" ? (
                      <CircleCheck size={14} />
                    ) : (
                      <Clock size={14} />
                    )}
                  </span>
                  {job.status}
                </span>
              </div>
              <div className="customer-detail-job-badges">
                <span className="customer-detail-job-badge">
                  Budget
                  <span>{job.budget}</span>
                </span>
                <span className="customer-detail-job-badge">
                  Posted
                  <span>{job.posted}</span>
                </span>

                {job.bids && (
                  <span className="customer-detail-job-badge">
                    Bids
                    <span>{job.bids}</span>
                  </span>
                )}
                {job.contractor && (
                  <span className="customer-detail-job-badge">
                    Contractor
                    <span>{job.contractor}</span>
                  </span>
                )}
                {job.finalAmount && (
                  <span className="customer-detail-job-badge">
                    Final Amount
                    <span>{job.finalAmount}</span>
                  </span>
                )}
              </div>
              {job.review && (
                <div className="customer-detail-job-review">
                  <div className="customer-detail-job-review-rating-container">
                    <span className="customer-detail-job-review-rating">
                      {ratingStars(job?.rating)}
                    </span>
                    <span>Customer Review</span>
                  </div>
                  <span>“{job.review}”</span>
                </div>
              )}
            </div>
            <div className="customer-detail-job-card-right">
              <button
                onClick={() => {
                  navigate(`/customer/job-details/${job?.id}`);
                }}
                className="customer-detail-job-view-btn"
              >
                <span className="icon">
                  <Eye size={18} />
                </span>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDetails;
