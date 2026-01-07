import { Routes, Route, Navigate } from "react-router-dom";
import "./assets/style/Style.css";
import AppLayout from "./layout/AppLayout.jsx";
import Login from "./auth/Login.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import Customers from "./pages/Customers.jsx";
import CustomerDetails from "./components/CustomerDetails.jsx";
import Contractors from "./pages/Contractors.jsx";
import ContractorDetails from "./components/ContractorDetails.jsx";
import Jobs from "./pages/Jobs.jsx";
import JobDetails from "./components/JobDetails.jsx";
import Reports from "./pages/Reports.jsx";
import Categories from "./pages/Categories.jsx";
import Notifications from "./pages/Notifications.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashBoard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customer/job-details/:id" element={<JobDetails />} />
        <Route path="/customer-details/:id" element={<CustomerDetails />} />
        <Route path="/contractors" element={<Contractors />} />
        <Route path="/contractor-details/:id" element={<ContractorDetails />} />
        <Route path="/contractor/job-details/:id" element={<JobDetails />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/job-details/:id" element={<JobDetails />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
