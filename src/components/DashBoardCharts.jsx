import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

const COLORS = ["#0265A1", "#F29C2C", "#38B2AC", "#E53E3E"];

export const UserGrowthChart = ({ Data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={Data}>
        <defs>
          <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B5ED7" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#0B5ED7" stopOpacity={0.05} />
          </linearGradient>

          <linearGradient id="contractorsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F4A62A" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#F4A62A" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        <CartesianGrid stroke="#E9EEF5" strokeDasharray="3 3" />

        <XAxis dataKey="month" tick={{ fill: "#6B7280" }} />

        <YAxis tick={{ fill: "#6B7280" }} />

        <Tooltip
          itemSorter={(item) => (item.dataKey === "totalUsers" ? -1 : 1)}
          contentStyle={{
            fontWeight: 600,
            borderRadius: 12,
            border: "1px solid #00000011",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          }}
        />

        <Legend wrapperStyle={{ paddingTop: 20 }} />
        <Area
          type="monotone"
          dataKey="totalUsers"
          name="Total Users"
          stroke="#0265A1"
          strokeWidth={3}
          fill="url(#usersGradient)"
          dot={false}
          activeDot={{ r: 6 }}
        />

        <Area
          type="monotone"
          dataKey="contractors"
          name="Contractors"
          stroke="#F29C2C"
          strokeWidth={3}
          fill="url(#contractorsGradient)"
          dot={false}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const JobsDistributionChart = ({ Data }) => {
  const isMobile = window.innerWidth <= 768;
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={Data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={110}
          label={!isMobile && (({ name, value }) => `${name}: ${value}`)}
        >
          {Data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            fontWeight: 600,
            borderRadius: 12,
            border: "1px solid #00000011",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const JobsbyCategoryChart = ({ Data }) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={Data}>
        <defs>
          <linearGradient
            id="dashboard-bar-gradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor="#0265A1" stopOpacity={1} />
            <stop offset="95%" stopColor="#0288D1" stopOpacity={0.8} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip
          contentStyle={{
            fontWeight: 600,
            borderRadius: 12,
            border: "1px solid #00000011",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          }}
        />
        <Legend wrapperStyle={{ paddingTop: 20 }} />

        <Bar
          dataKey="totalJobs"
          name="Total Jobs"
          radius={[8, 8, 0, 0]}
          fill="url(#dashboard-bar-gradient)"
          animationDuration={2000}
          animationBegin={300}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
