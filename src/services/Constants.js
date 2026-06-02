import SiteLogo from "../assets/images/SiteLogo.png";
import SiteLogoWithText from "../assets/images/SiteLogoWithText.png";
import AuthBg from "../assets/images/AuthBg.png";
import FallBackImage from "../assets/images/FallBackImage.svg";
import heroIllustration from "../assets/images/heroIllustration.png";

export const IMAGES = {
  SiteLogo,
  SiteLogoWithText,
  AuthBg,
  FallBackImage,
  heroIllustration,
};

export const SidebarMenuItems = [
  {
    name: "Workspaces",
    icon: "FolderOpen",
    route: "/workspaces",
    activeAt: "/workspaces",
    startsWith: ["/workspace", "/create-workspace", "/workspace-settings"],
  },
  {
    name: "Chat",
    icon: "MessageCircle",
    route: "/chat",
    activeAt: "/chat",
  },
  {
    name: "Collections",
    icon: "Library",
    route: "/collections",
    activeAt: "/collections",
    startsWith: ["/collection/"],
  },
  {
    name: "CoreBlocks",
    icon: "Codesandbox",
    route: "/coreblocks",
    activeAt: "/coreblocks",
    startsWith: ["/coreblock/"],
  },
  {
    name: "Members",
    icon: "Users",
    route: "/members",
    activeAt: "/members",
  },
  {
    name: "Settings",
    icon: "Settings",
    route: "/settings",
    activeAt: "/settings",
    startsWith: ["/settings"],
  },
];

export const detectLanguage = (code) => {
  if (/^\s*</.test(code)) return "html";
  if (/^\s*import .* from /.test(code) || /console\.log/.test(code))
    return "javascript";
  if (/^\s*def /.test(code)) return "python";
  if (/^\s*#include /.test(code)) return "cpp";
  if (/^\s*function /.test(code)) return "typescript";
  if (/^\s*[\.\#][\w\-]+\s*\{/.test(code)) return "css";
  return "plaintext";
};

export const limit = 20;

export const Push_Notification_Api = import.meta.env.VITE_Push_Notification;