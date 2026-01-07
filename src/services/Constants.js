import SiteLogo from "../assets/images/SiteLogo.png";
import SiteLogoWithText from "../assets/images/SiteLogoWithText.png";
import AuthBg from "../assets/images/Auth-Bg.png";

export const IMAGES = {
  SiteLogo,
  SiteLogoWithText,
  AuthBg,
};

export const SidebarMenuItems = [
  {
    name: "Dashboard",
    icon: "LayoutGrid",
    route: "/",
    activeAt: "/",
  },
  {
    name: "All Customers",
    icon: "Users",
    route: "/customers",
    activeAt: "/customers",
    startsWith: ["/customer-details", "/customer/job-details"],
  },
  {
    name: "All Contractors",
    icon: "Users",
    route: "/contractors",
    activeAt: "/contractors",
    startsWith: ["/contractor-details", "/contractor/job-details"],
  },
  {
    name: "All Jobs",
    icon: "Briefcase",
    route: "/jobs",
    activeAt: "/jobs",
    startsWith: ["/job-details"], // ✅ ARRAY
  },
  {
    name: "Reports",
    icon: "Flag",
    route: "/reports",
    activeAt: "/reports",
  },
  {
    name: "Categories",
    icon: "FolderTree",
    route: "/categories",
    activeAt: "/categories",
  },
  {
    name: "Notifications",
    icon: "Bell",
    route: "/notifications",
    activeAt: "/notifications",
  },
];