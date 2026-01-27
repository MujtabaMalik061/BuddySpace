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
    startsWith: ["/collection"],
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

export const limit = 20;