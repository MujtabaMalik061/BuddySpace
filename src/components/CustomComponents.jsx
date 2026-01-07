import React, { useEffect, useRef, useState } from "react";
import "../assets/style/CustomComponents.css";
import {
  Check,
  ChevronDown,
  ChevronUp,
  EllipsisVertical,
  Search,
  X,
  Star,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router";

export const StatesCard = ({
  iconBg = "",
  title = "",
  value = "",
  stringValue = "",
  icon: Icon,
}) => {
  return (
    <div className="customers-stat-card">
      <div className="customers-stat-card-content">
        <p className="customers-stat-title">{title}</p>
        <h3 className="customers-stat-value">
          {value.toLocaleString()}
          {stringValue}
        </h3>
      </div>
      <div style={{ background: iconBg }} className="customers-stat-icon">
        <Icon />
      </div>
    </div>
  );
};

export const Tabs = ({ activeTab, setActiveTab, tabs }) => {
  const spacing = 8;

  const calculateActiveWidthAndLocation = (tabs, activeTab) => {
    if (!tabs?.length) return { width: "0%", left: "0%" };

    const width = 100 / tabs.length;
    const activeIndex = tabs.findIndex((t) => t.filter === activeTab);
    if (activeIndex === -1) return null;

    return {
      width: `calc(${width}% - ${spacing * 2}px)`,
      left: `calc(${width * activeIndex}% + ${spacing}px)`,
    };
  };

  const activePosition = calculateActiveWidthAndLocation(tabs, activeTab);

  return (
    <div className="customers-tabs">
      {activePosition && (
        <div
          style={{
            width: activePosition.width,
            left: activePosition.left,
          }}
          className="customers-tab-active-indicator"
        ></div>
      )}

      {tabs?.map((tab, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(tab.filter)}
          className={`customers-tab ${
            activeTab === tab.filter ? "active" : ""
          }`}
          style={{
            width: activePosition.width,
            color: activeTab === tab.filter ? "#fff" : "",
          }}
        >
          {tab.label}
          {tab.count !== 0 && (
            <span className="customers-badge">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export const SearchInput = ({ value, setValue, placeholder = "Search..." }) => {
  return (
    <div className="customers-search-box">
      <Search className="customers-search-icon" />
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        placeholder={placeholder}
        className="customers-search-input"
      />
    </div>
  );
};

export const Selector = ({
  disabled = false,
  filter,
  setFilter,
  options,
  position = "right",
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const selectorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options?.find((option) => option.filter === filter);

  return (
    <div
      ref={selectorRef}
      onClick={() => setIsFilterOpen(!isFilterOpen)}
      disabled={disabled}
      className={`customers-filter-container ${disabled ? "disabled" : ""}`}
    >
      <div className="customers-filter-selector">
        {selectedOption?.label || filter}
        <span className="icon">
          {isFilterOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
        </span>
      </div>
      {isFilterOpen && (
        <div
          className={`customers-filter-selection-container ${
            position === "left"
              ? "customers-filter-selection-container-left"
              : ""
          }`}
        >
          {options &&
            options.map((option, index) => {
              const isActive = option?.filter === filter;
              return (
                <button
                  key={index}
                  disabled={isActive}
                  onClick={() => {
                    setFilter(option?.filter);
                    setIsFilterOpen(false);
                  }}
                  className={`customers-filter-item ${
                    isActive ? "active" : ""
                  }`}
                >
                  {isActive && (
                    <span>
                      <Check size={13} />
                    </span>
                  )}
                  {option?.label}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
};

export const EllipsisSelector = ({ options, position = "right" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={selectorRef}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
      }}
      className="ellipsisSelector-filter-container"
    >
      <div className="ellipsisSelector-filter-selector">
        <EllipsisVertical size={17} />
      </div>

      {isOpen && (
        <div
          className={`ellipsisSelector-filter-selection-container ${
            position === "left"
              ? "customers-filter-selection-container-left"
              : ""
          }`}
        >
          {options?.map((option, index) => {
            const Icon = option.icon;
            return (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  option?.action();
                  setIsOpen(false);
                }}
                className="ellipsisSelector-filter-item"
              >
                <Icon size={13} />
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const CustomPagination = ({
  show = "",
  lastPage = 1,
  page = 1,
  handlePageChange,
}) => {
  return (
    <div className="pagination-container">
      <span className="pagination-content">{show}</span>
      <div className="pagination-actions-container">
        <button
          className="pagination-btn"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </button>
        <button
          className="pagination-btn"
          disabled={page === lastPage}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const JobsStatesCard = ({
  iconBg = "",
  color = "",
  title = "",
  value = "",
  subTitle = "",
  stringValue = "",
  icon: Icon,
}) => {
  return (
    <div className="job-stat-card">
      <div className="job-stat-header">
        <div className="job-stat-card-content">
          <p className="job-stat-title">{title}</p>
          <h3 style={{ color }} className="job-stat-value">
            {value.toLocaleString()}
            {stringValue}
          </h3>
        </div>
        <div style={{ background: iconBg }} className="job-stat-icon">
          <Icon />
        </div>
      </div>
      <div style={{ color }} className="job-stat-subtitle">
        {subTitle}
      </div>
    </div>
  );
};

export const DashboardStatesCard = ({
  iconBg = "",
  title = "",
  value = "",
  stringValue = "",
  className = "",
  icon: Icon,
}) => {
  return (
    <div className={`dashboard-states-card ${className}`}>
      <div className="dashboard-states-header">
        <div className="dashboard-states-title">{title}</div>
        <div>
          <div style={{ background: iconBg }} className="dashboard-states-icon">
            <Icon />
          </div>
        </div>
      </div>
      <div className="dashboard-states-value">
        {value.toLocaleString()}
        {stringValue}
      </div>
    </div>
  );
};

export const ConfirmModal = ({
  title = "",
  description = "",
  cencelBtn = "Cancel",
  confirmBtn = "Confirm",
  danger = false,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="modal-overlay">
      <div style={{ width: "530px" }} className="modal-content">
        <div className="modal-header">
          <h3 className="modal-heder-title">{title}</h3>
          <button onClick={onClose} className="modal-heder-close-btn">
            <X />
          </button>
        </div>
        <div className="modal-content-area">
          <p>{description}</p>
          <div className="modal-confirm-actions">
            <button onClick={onClose} className="modal-confirm-action-cencel">
              {cencelBtn}
            </button>
            <button
              style={{ background: danger ? "#ff0000db" : "" }}
              onClick={onSubmit}
              className="modal-confirm-action-confirm"
            >
              {confirmBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ratingStars = (rating, size = 16) => {
  return (
    <span
      className="customer-detail-job-review-rating"
      style={{ display: "inline-flex", gap: 2 }}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;

        if (rating >= starValue) {
          return (
            <Star key={index} size={size} color="#FDC700" fill="#FDC700" />
          );
        }

        if (rating >= starValue - 0.5) {
          return (
            <span
              key={index}
              style={{
                position: "relative",
                display: "inline-block",
                width: size,
                height: size,
              }}
            >
              <Star
                size={size}
                color="#FDC700"
                fill="#8f8f8f12"
                style={{ position: "absolute", top: 0, left: 0 }}
              />
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "50%",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <Star size={size} color="#FDC700" fill="#FDC700" />
              </span>
            </span>
          );
        }

        return (
          <Star key={index} size={size} color="#FDC700" fill="#00000012" />
        );
      })}
    </span>
  );
};

export const GoBackBtn = ({ title = "", onBack }) => {
  const navigate = useNavigate();

  return (
    <div className="details-page-back-btn">
      <button
        onClick={() => {
          navigate(onBack);
        }}
      >
        <span className="icon">
          <ArrowLeft />
        </span>
        <p>{title}</p>
      </button>
    </div>
  );
};

export const ProfileImage = ({
  Image = "",
  value = "",
  bg = "linear-gradient(180deg, #0265a1 0%, #0288d1 100%)",
  borderC = "#0265a133",
  className = "",
}) => {
  return (
    <div
      style={{ border: `2px solid ${borderC}`}}
      className={`profile-image-container ${className}`}
    >
      <div style={{ background: bg }}>
        {Image ? <img src={Image} alt="" /> : value}
      </div>
    </div>
  );
};
