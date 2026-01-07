import React from "react";
import "../assets/style/DashBoard.css";
import TopBar from "../components/TopBar";
import { DashboardStatesCard } from "../components/CustomComponents";
import {
  UserGrowthChart,
  JobsDistributionChart,
  JobsbyCategoryChart,
} from "../components/DashBoardCharts";
import {
  UserGrowthTrendsData,
  JobsDistributionData,
  JobsByCategoryData,
  StatesCounts,
} from "../services/DashBoardHelper";
import {
  Briefcase,
  DollarSign,
  FolderTree,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

const DashBoard = () => {
  return (
    <div className="dashboard-page">
      <TopBar
        title="Dashboard"
        subTitle="Manage your platform efficiently and effectively"
      />
      <div className="dashboard-states-wrapper">
        <DashboardStatesCard
          iconBg="linear-gradient(180deg, #0265A1 0%, #0288D1 100%)"
          title="TOTAL USERS"
          className="users"
          value={StatesCounts?.TotalUsers}
          icon={Users}
        />
        <DashboardStatesCard
          iconBg="linear-gradient(180deg, #F29C2C 0%, #F5B55F 100%)"
          title="ACTIVE CONTRACTORS"
          className="contractors"
          value={StatesCounts?.ActiveContractors}
          icon={UserCheck}
        />
        <DashboardStatesCard
          iconBg="linear-gradient(180deg, #38B2AC 0%, #4FD1C5 100%)"
          title="ACTIVE JOBS"
          className="jobs"
          value={StatesCounts?.ActiveJobs}
          icon={Briefcase}
        />
        <DashboardStatesCard
          iconBg="linear-gradient(180deg, #48BB78 0%, #68D391 100%)"
          title="TOTAL BIDS"
          className="bids"
          value={StatesCounts?.TotalBids}
          icon={DollarSign}
        />
      </div>
      <div className="dashboard-charts-wrapper">
        <ChartCard
          icon={TrendingUp}
          iconBg="linear-gradient(180deg, #0265A1 0%, #0288D1 100%)"
          iconSC="#0265A133"
          bg="linear-gradient(90deg, #F8FAFC 0%, rgba(230, 244, 251, 0.3) 50%, #FFFFFF 100%)"
          title="Jobs by Category"
          subTitle="Monthly user acquisition"
          contentStyle={{ marginLeft: "-8px" }}
          chartType={UserGrowthChart}
          ChartData={UserGrowthTrendsData}
        />
        <ChartCard
          icon={Briefcase}
          iconBg="linear-gradient(180deg, #F29C2C 0%, #F5B55F 100%)"
          iconSC="#F29C2C33"
          bg="linear-gradient(90deg, #F8FAFC 0%, rgba(254, 243, 230, 0.3) 50%, #FFFFFF 100%)"
          title="User Growth Trends"
          subTitle="Current status breakdown"
          chartType={JobsDistributionChart}
          ChartData={JobsDistributionData}
        />
      </div>
      <ChartCard
        icon={FolderTree}
        iconBg="linear-gradient(180deg, #0265A1 0%, #F29C2C 100%)"
        iconSC="#0265A133"
        bg="linear-gradient(90deg, #F8FAFC 0%, rgba(239, 246, 255, 0.3) 50%, rgba(255, 247, 237, 0.3) 100%)"
        title="Jobs by Category"
        subTitle="Service category performance"
        contentStyle={{ marginLeft: "-8px" }}
        chartType={JobsbyCategoryChart}
        ChartData={JobsByCategoryData}
      />
    </div>
  );
};

export const ChartCard = ({
  icon: Icon,
  iconBg = "#EFF6FF4D",
  iconSC = "rgb(2 101 161 / 31%)",
  bg = "#EFF6FF4D",
  title = "",
  subTitle = "",
  chartType: Chart,
  ChartData = [],
  contentStyle = {},
}) => {
  return (
    <div className="chart-container">
      <div style={{ background: bg }} className="chart-header">
        <span
          style={{ background: iconBg, boxShadow: `0px 0px 12px ${iconSC}` }}
          className="chart-header-icon"
        >
          <Icon />
        </span>
        <div className="chart-header-content">
          <h2>{title}</h2>
          <p>{subTitle}</p>
        </div>
      </div>
      <div style={contentStyle} className="chart-content-cotainer">
        <Chart Data={ChartData} />
      </div>
    </div>
  );
};

export default DashBoard;
