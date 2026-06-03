import React, { useState, useEffect } from "react";
import "../assets/style/AllowIosPush.css";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { toast } from "sonner";
import { IMAGES } from "../services/Constants";
import { requestPermission } from "../utils/extensions/Notification.extensions";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

const AllowIosPush = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isPermissionWant, setIsPermissionWant] = useState(true);
  const [isInstruction, setIsInstruction] = useState(false);
  const ua = navigator.userAgent;
  
  const isIOSDevice = /iPhone|iPad|iPod/i.test(ua);
  const isSafari =
    isIOSDevice && /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS/i.test(ua);
  const isAtHome =
    (window.matchMedia &&
      window.matchMedia("(display-mode: standalone)").matches) ||
    window.navigator.standalone === true;
  const isPermissionAllowed =
    "Notification" in window && window.Notification.permission === "granted";

  const isActivity = currentUser?.activityNotification !== "off";
  const isChatNotifications = currentUser?.chatNotifications;
  const isCommentNotifications = currentUser?.commentNotifications;

  useEffect(() => {
    if (
      (!isIOSDevice && !isPermissionAllowed) ||
      (isIOSDevice && !isSafari) ||
      (isIOSDevice && isSafari && !isAtHome) ||
      (isAtHome && !isPermissionAllowed) ||
      (currentUser && !isActivity) ||
      (currentUser && !isChatNotifications) ||
      (currentUser && !isCommentNotifications)
    ) {
      setIsPermissionWant(true);
    }
  }, [isIOSDevice, isSafari, isAtHome, isPermissionAllowed, currentUser]);

  const onClose = () => {
    setIsPermissionWant(false);
  };

  const getContent = () => {
    if (isIOSDevice && !isSafari) {
      return {
        label: "Please open this app in Safari to allow notification.",
        buttonLabel: "Copy Link",
        buttonActions: async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied!");
          } catch (err) {
            toast.error("Failed to copy link");
          }
        },
      };
    }

    if (isIOSDevice && isSafari && !isAtHome) {
      return {
        label: "Add this app to your Home Screen for allow notification.",
        buttonLabel: "How to Add",
        buttonActions: () => {
          setIsInstruction(true);
        },
      };
    }

    if (
      (isAtHome && !isPermissionAllowed) ||
      (!isIOSDevice && !isPermissionAllowed)
    ) {
      return {
        label: "Enable notifications to stay updated.",
        buttonLabel: "Enable",
        buttonActions: async () => {
          const res = await requestPermission();
          if (res?.permission === "granted") {
            setIsPermissionWant(false);
          } else if (res?.permission === "denied") {
            toast.error(
              "Notifications are blocked by you. Please enable from browser settings.",
            );
          }
        },
      };
    }

    if (currentUser && (!isActivity || !isChatNotifications || !isCommentNotifications)) {
      return {
        label:
          "You have turned off all notifications. Please enable it to receive notifications.",
        buttonLabel: "Go to Settings",
        buttonActions: () => {
          navigate("/settings#notifications");
        },
      };
    }

    return null;
  };

  const content = getContent();

  if (!isPermissionWant || !content) return null;

  return (
    <div className="allow-ios-push-container">
      <div className="allow-ios-push-content-container">
        <span className="icon">
          <Settings />
        </span>

        <p className="allow-ios-push-content">
          {content?.label}
          <span
            className="allow-ios-push-content-btn"
            onClick={content?.buttonActions}
          >
            {content?.buttonLabel}
          </span>
        </p>
      </div>

      <button className="model-header-close-btn" onClick={onClose}>
        &times;
      </button>
      {isInstruction && <Instruction onClose={() => setIsInstruction(false)} />}
    </div>
  );
};

export default AllowIosPush;

const Instruction = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const totalPages = 4;

  const handlePrev = () => {
    if (step === 1) return;
    setStep(step - 1);
  };

  const handleNext = () => {
    if (step === totalPages) return;
    setStep(step + 1);
  };

  const getContent = (step) => {
    const steps = {
      1: {
        heading: "Open Browser Menu",
        description: "Tap the three dots icon to open the browser menu.",
        image: IMAGES.Instruction1,
      },
      2: {
        heading: "Tap Share",
        description: "From the menu, tap the Share button.",
        image: IMAGES.Instruction2,
      },
      3: {
        heading: "Add to Home Screen",
        description: "Scroll and tap 'Add to Home Screen'.",
        image: IMAGES.Instruction3,
      },
      4: {
        heading: "Confirm Add",
        description: "Tap the Add button to finish installation.",
        image: IMAGES.Instruction4,
      },
    };

    return steps[step] || null;
  };

  const content = getContent(step);

  return (
    <div className="model-overlay">
      <div className="model-content">
        <div className="model-header">
          <h3 className="model-header-title">Instruction</h3>
          <button className="model-header-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="model-content-container">
          <h2 className="allow-ios-push-instruction-heading">
            {content?.heading}
          </h2>
          <p className="allow-ios-push-instruction-desc">
            {content?.description}
          </p>
          <div className="allow-ios-push-instruction-img">
            <img src={content?.image} />
          </div>
          <div className="allow-ios-push-instruction-action-container">
            <button disabled={step === 1} onClick={handlePrev} className="prev">
              <span className="icon">
                <ChevronLeft />
              </span>
              Prev
            </button>
            <p>
              Page {step}/{totalPages}
            </p>
            <button
              disabled={step === totalPages}
              onClick={handleNext}
              className="next"
            >
              Next
              <span className="icon">
                <ChevronRight />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
