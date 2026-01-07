import React, { useState } from "react";
import { toast } from "sonner";

const ReviewDetailsModal = ({ data, onClose }) => {
  const [modalType, setModalType] = useState("Details");
  const [note, setNote] = useState("");

  const handleClose = () => {
    setModalType("Details");
    setNote("");
    onClose();
  };

  const handleDismiss = () => {
    if (!note) return toast.error("Note is required for this action.");
    toast.success("Report Dismissed successfully.");
    handleClose();
  };

  const handleResolve = () => {
    if (!note) return toast.error("Note is required for this action.");
    toast.success("Report Resolved successfully.");
    handleClose();
  };

  return (
    <div className="modal-overlay">
      <div style={{ width: "530px" }} className="modal-content">
        {modalType === "ResolveReport" ? (
          <>
            <div className="report-detail-header">
              <div>
                <h2 className="report-detail-title">Resolve Report</h2>
                <p className="report-detail-subtitle">
                  Add resolution notes and any actions taken against the
                  reported user.
                </p>
              </div>
              <button onClick={handleClose} className="report-detail-close">
                ×
              </button>
            </div>
            <div className="categoriesModal-field">
              <label className="categoriesModal-label">Notes</label>
              <textarea
                className="categoriesModal-textarea"
                placeholder="e.g., User has been warned and suspended for 7 days"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="report-detail-footer">
              <button
                onClick={handleClose}
                className="report-detail-btn report-detail-btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleResolve}
                className="report-detail-btn report-detail-btn-primary"
              >
                Confirm
              </button>
            </div>
          </>
        ) : modalType === "DismissReport" ? (
          <>
            <div className="report-detail-header">
              <div>
                <h2 className="report-detail-title">Dismiss Report</h2>
                <p className="report-detail-subtitle">
                  Provide a reason for dismissing this report.
                </p>
              </div>
              <button onClick={handleClose} className="report-detail-close">
                ×
              </button>
            </div>
            <div className="categoriesModal-field">
              <label className="categoriesModal-label">Notes</label>
              <textarea
                className="categoriesModal-textarea"
                placeholder="e.g., No violation found after investigation"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="report-detail-footer">
              <button
                onClick={handleClose}
                className="report-detail-btn report-detail-btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleDismiss}
                className="report-detail-btn report-detail-btn-primary"
              >
                Confirm
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="report-detail-header">
              <div>
                <h2 className="report-detail-title">Report Details</h2>
                <p className="report-detail-subtitle">
                  Review the report and take appropriate action
                </p>
              </div>
              <button onClick={handleClose} className="report-detail-close">
                ×
              </button>
            </div>

            <div className="report-detail-content">
              <div className="report-detail-grid">
                <div className="report-detail-item">
                  <span className="report-detail-label">Reported User</span>
                  <span className="report-detail-value">
                    {data?.ReportedUser}
                  </span>
                </div>

                <div className="report-detail-item">
                  <span className="report-detail-label">Reported By</span>
                  <span className="report-detail-value">
                    {data?.ReportedBy}
                  </span>
                </div>

                <div className="report-detail-item">
                  <span className="report-detail-label">Type</span>
                  <span className="report-detail-value">{data?.Type}</span>
                </div>

                <div className="report-detail-item">
                  <span className="report-detail-label">Severity</span>
                  <span className="report-detail-badge report-detail-badge-medium">
                    {data?.Severity}
                  </span>
                </div>

                <div className="report-detail-item">
                  <span className="report-detail-label">Date Reported</span>
                  <span className="report-detail-value">
                    {data?.DateReported}
                  </span>
                </div>

                <div className="report-detail-item">
                  <span className="report-detail-label">Related Job</span>
                  <span className="report-detail-value">
                    {data?.RelatedJobId}
                  </span>
                </div>
              </div>

              <div className="report-detail-reason">
                <span className="report-detail-label">Reason for Report</span>
                <p className="report-detail-reason-text">
                  {data?.ReasonforReport}
                </p>
              </div>
            </div>

            <div className="report-detail-footer">
              <button
                onClick={handleClose}
                className="report-detail-btn report-detail-btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={() => setModalType("DismissReport")}
                className="report-detail-btn report-detail-btn-outline"
              >
                Dismiss Report
              </button>
              <button
                onClick={() => setModalType("ResolveReport")}
                className="report-detail-btn report-detail-btn-primary"
              >
                Resolve & Take Action
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewDetailsModal;
