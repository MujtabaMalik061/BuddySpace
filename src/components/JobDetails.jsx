import React, { useState } from "react";
import TopBar from "./TopBar";
import {
  GoBackBtn,
  ProfileImage,
  ratingStars,
} from "./CustomComponents";
import { jobDetailData } from "../services/JobHelper";
import { useLocation } from "react-router-dom";
import {
  Award,
  Calendar,
  CircleAlert,
  CircleCheck,
  Clock,
  DollarSign,
  FileText,
  Mail,
  MapPin,
  Phone,
  Star,
  User,
  Wrench,
} from "lucide-react";

const JobDetails = () => {
  const status = "Open";

  const filteredJobs = jobDetailData.filter(
    (item) => item.job.status === status
  );

  const [firstJob] = filteredJobs || [];

  const { job, customer, timeline, bids, contractor } = firstJob;

  const isOpen = job.status === "Open";
  const isInProgress = job.status === "In Progress";
  const isCompleted = job.status === "Completed";

  const BackSuggest = () => {
    const { pathname } = useLocation();

    if (pathname.startsWith("/customer/job-details")) {
      return {
        title: "Back to Customer",
        onBack: -1,
      };
    }

    if (pathname.startsWith("/contractor/job-details")) {
      return {
        title: "Back to Contractor",
        onBack: -1,
      };
    }

    return {
      title: "Back to All Jobs",
      onBack: "/jobs",
    };
  };

  const backConfig = BackSuggest();

  return (
    <div className="customer-detail-container">
      <GoBackBtn title={backConfig.title} onBack={backConfig.onBack} />
      <div
        style={{
          display: "flex",
          alignItems: "start",
          justifyContent: "space-between",
        }}
      >
        <TopBar
          title="Job Detail"
          subTitle="Manage your platform efficiently and effectively"
        />
      </div>

      <div className="job-detail-grid">
        <div className="job-detail-right-panel">
          <div className="job-detail-card">
            <div className="job-detail-header-info">
              <h2 className="job-detail-title">{job.title}</h2>
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
            <p className="job-detail-subtitle">{job.description}</p>
            <div className="job-detail-tags">
              <span>
                <span style={{ marginRight: "4px" }} className="icon">
                  <Calendar size={14} />
                </span>
                <strong>Posted: </strong>
                {job.postedDate}
              </span>
              <span>
                <span style={{ marginRight: "4px" }} className="icon">
                  <DollarSign size={13} />
                </span>
                <strong>Budget: </strong>
                {job.budget}
              </span>
            </div>
          </div>
          <div className="job-detail-card">
            <div className="job-detail-card-header">
              <h3 className="job-detail-card-header-title">
                <span>
                  <FileText size={16} />
                </span>
                Job Details
              </h3>
            </div>

            <div className="job-detail-section">
              <h4>Description</h4>
              <p>{job.description}</p>
            </div>

            <div className="job-detail-section">
              <h4>Detailed Requirements</h4>
              <p>{job.requirements}</p>
            </div>
            {job?.JobImages?.length > 0 && (
              <div className="job-detail-section">
                <h4>Images</h4>
                <div className="job-detail-images">
                  {job?.JobImages?.map((img, index) => (
                    <div key={index} className="job-detail-image">
                      <img src={img} alt="" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="job-detail-info-row">
              <div>
                Location:{" "}
                <span>
                  <span>
                    <MapPin size={14} color="#0265A1" />
                  </span>
                  {job.location}
                </span>
              </div>
              <div>
                Budget Range:{" "}
                <span>
                  <span>
                    <DollarSign size={14} color="#0265A1" />
                  </span>
                  {job.budget}
                </span>
              </div>
            </div>
            {isCompleted && (
              <>
                <div className="job-detail-info-row">
                  <div>
                    Started <span>{job.postedDate}</span>
                  </div>
                  <div>
                    Completed <span>{job.completedDate}</span>
                  </div>
                  <div>
                    Final Amount{" "}
                    <span style={{ color: "#00A63E" }}>{job.finalAmount}</span>
                  </div>
                </div>
                {job?.reviews?.map((review, index) => (
                  <div key={index} className="customer-detail-job-review">
                    <div className="job-detail-customer-review-rating-container">
                      <h3>
                        <span className="icon">
                          <Award color="#00A63E" size={16} />
                        </span>
                        Customer Review
                      </h3>
                      <span className="customer-detail-job-review-rating">
                        {ratingStars(review?.rating)}
                      </span>
                    </div>
                    <span>“{review.review}”</span>
                  </div>
                ))}
              </>
            )}
          </div>
          {isOpen && (
            <div className="job-detail-card">
              <h3 className="job-detail-card-header-title">
                Bids ({bids.length})
              </h3>

              {bids.map((bid) => (
                <div key={bid.id} className="job-detail-bid">
                  <div className="job-detail-bid-header">
                    <div>
                      <ProfileImage
                        Image={bid?.ProfileImage}
                        value={bid?.initials}
                      />
                      <div>
                        <h4>{bid.company}</h4>
                        <span>
                          <span>
                            <Star color="#FDC700" fill="#FDC700" size={14} />
                          </span>{" "}
                          {bid.rating} · {bid.jobs} jobs
                        </span>
                      </div>
                    </div>
                    <div className="job-detail-price">
                      <strong>{bid.price}</strong>
                      <span>{bid.duration}</span>
                    </div>
                  </div>
                  <div className="job-detail-bid-proposal">
                    <h3>Proposal</h3>
                    <p>{bid.proposal}</p>
                  </div>
                  <div className="job-detail-bid-actions">
                    <span>Submitted: {bid.submitted}</span>

                    <div>
                      <button className="job-detail-btn-outline">Reject</button>
                      <button className="job-detail-btn-success">
                        Accept Bid
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="job-detail-left-panel">
          <div className="job-detail-card">
            <h3 className="job-detail-customer-title">
              <span className="job-detail-customer-title-icon">
                <User color="#0a72b5" />
              </span>
              Customer
            </h3>

            <div className="job-detail-customer-info">
              <ProfileImage
                Image={customer?.ProfileImage}
                value={customer?.initials}
                className="job-detail-customer-info-profile"
              />
              <div className="job-detail-customer-meta">
                <h4 className="job-detail-customer-name">{customer.name}</h4>
                <p className="job-detail-customer-since">
                  Member since {customer.memberSince}
                </p>
              </div>
            </div>

            <p className="job-detail-customer-row">
              <span className="icon">
                <Mail size={14} color="#9ca3af" />
              </span>
              {customer.email}
            </p>

            <p className="job-detail-customer-row">
              <span className="icon">
                <Phone size={14} color="#9ca3af" />
              </span>
              {customer.phone}
            </p>

            <p className="job-detail-customer-row">
              <span className="icon">
                <Wrench size={14} color="#9ca3af" />
              </span>
              {customer.totalJobs} total jobs
            </p>
          </div>
          {!isOpen && (
            <div className="job-detail-card">
              <h3 className="job-detail-customer-title">
                <span className="job-detail-customer-title-icon">
                  <Wrench color="#F29C2C" />
                </span>
                Contractor
              </h3>

              <div className="job-detail-customer-info">
                <ProfileImage
                  Image={contractor?.ProfileImage}
                  value={contractor?.initials}
                  className="job-detail-customer-info-profile"
                  bg="linear-gradient(180deg, #F29C2C 0%, #F5B55F 100%)"
                  borderC="#F29C2C33"
                />

                <div className="job-detail-customer-meta">
                  <h4 className="job-detail-customer-name">
                    {contractor.name}
                  </h4>
                  <p className="job-detail-customer-since">
                    <span className="icon">
                      <Star color="#FDC700" fill="#FDC700" size={16} />
                    </span>
                    {contractor?.rating} ( {contractor?.totalJobs} jobs )
                  </p>
                </div>
              </div>

              <p className="job-detail-customer-row">
                <span className="icon">
                  <Mail size={14} color="#9ca3af" />
                </span>
                {contractor.email}
              </p>

              <p className="job-detail-customer-row">
                <span className="icon">
                  <Phone size={14} color="#9ca3af" />
                </span>
                {contractor.phone}
              </p>

              <p className="job-detail-customer-row">
                <span className="icon">
                  <Calendar size={14} color="#9ca3af" />
                </span>
                Joined {contractor.memberSince}
              </p>
            </div>
          )}
          <div className="job-detail-card">
            <h3 className="job-detail-customer-title">
              <span className="icon">
                <Clock />
              </span>
              Timeline
            </h3>

            <div className="job-detail-timeline-list">
              {timeline?.map((t, index) => {
                const getTimelineStatusClass = (label) => {
                  if (!label) return "";

                  return label
                    .toLowerCase()
                    .replace("job", "")
                    .trim()
                    .replace(/\s+/g, "-");
                };
                const statusClass = getTimelineStatusClass(t.label);

                return (
                  <div key={index} className="job-detail-timeline-item">
                    <div className={`job-detail-timeline-icon ${statusClass}`}>
                      <CircleCheck />
                    </div>

                    <div className="job-detail-timeline-content">
                      <h4 className="job-detail-timeline-label">{t.label}</h4>
                      <p className="job-detail-timeline-date">{t.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
