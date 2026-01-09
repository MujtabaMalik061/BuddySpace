import React, { useEffect, useRef, useState } from "react";
import "../assets/style/CustomComponents.css";
import { ArrowLeft, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router";

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

export const IconSelector = ({
  disabled = false,
  icon: Icon,
  options,
  position = "right",
}) => {
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
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
      }}
      className="ellipsisSelector-filter-container"
    >
      <div className="ellipsisSelector-filter-selector">{Icon}</div>

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
                {Icon && <Icon size={13} />}
                {option.label}
              </button>
            );
          })}
        </div>
      )}
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
        </button>
      ))}
    </div>
  );
};

export const BackBtn = ({title = "", onBack = ""}) => {
  const navigate = useNavigate();

  return (
    <div className="back-btn-container">
      <button
        onClick={() => {
          navigate(onBack);
        }}
      >
        <span className="icon">
          <ArrowLeft />
        </span>
        {title}
      </button>
    </div>
  );
};
