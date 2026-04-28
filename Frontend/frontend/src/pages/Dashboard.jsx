import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getReports, getTeams } from "../services/api";
import ReportTable from "../components/ReportTable";
import socket from "../socket";
import AnalyticsChart from "../components/AnalyticsChart";
import HeatmapView from "../components/HeatmapView";
import StatusPieChart from "../components/StatusPieChart";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getReports();
      setReports(res.data || []);
    };

    const fetchTeams = async () => {
      const res = await getTeams();
      setTeams(res.data || []);
    };

    fetchData();
    fetchTeams();

    // 🟢 New Issue
    socket.on("new_issue", (newReport) => {
      setReports((prev) => [newReport, ...prev]);
    });

    // 🔵 Assign / Start updates
    socket.on("issue_updated", (updatedReport) => {
      setReports((prev) =>
        prev.map((r) =>
          r._id === updatedReport._id ? updatedReport : r
        )
      );
      fetchTeams();
    });

    // 🟣 Verification pending
    socket.on("verification_pending", (updatedReport) => {
      setReports((prev) =>
        prev.map((r) =>
          r._id === updatedReport._id ? updatedReport : r
        )
      );
    });

    // 🔴 Completed
    socket.on("issue_completed", (updatedReport) => {
      setReports((prev) =>
        prev.map((r) =>
          r._id === updatedReport._id ? updatedReport : r
        )
      );
      fetchTeams();
    });

    return () => {
      socket.off("new_issue");
      socket.off("issue_updated");
      socket.off("verification_pending");
      socket.off("issue_completed");
    };
  }, []);

  // 📊 Stats
  const total = reports.length;
  const pending = reports.filter(r => r.status === "Pending").length;
  const assigned = reports.filter(r => r.status === "Assigned").length;
  const progress = reports.filter(r => r.status === "In Progress").length;
  const verification = reports.filter(r => r.status === "Verification Pending").length;
  const completed = reports.filter(r => r.status === "Completed").length;

  return (
 <MainLayout>
  <h1 className="text-3xl font-bold text-gray-800 mb-6">
    Dashboard Overview
  </h1>

  <div className="px-6 space-y-10">

    {/* 🔥 STATS (FIXED GRID) */}
    <div className="grid grid-cols-3 gap-6">
      <Card title="Total Reports" value={total} color="from-blue-500 to-blue-700" />
      <Card title="Pending" value={pending} color="from-yellow-400 to-yellow-600" />
      <Card title="Assigned" value={assigned} color="from-purple-500 to-purple-700" />
      <Card title="In Progress" value={progress} color="from-indigo-500 to-indigo-700" />
      <Card title="Verification" value={verification} color="from-orange-400 to-orange-600" />
      <Card title="Completed" value={completed} color="from-green-500 to-green-700" />
    </div>

    {/* 🔥 ANALYTICS SECTION */}
    <div className="grid grid-cols-2 gap-6">

      {/* 📊 PIE CHART */}
      <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          📊 Status Distribution
        </h2>
        <StatusPieChart reports={reports} />
      </div>

      {/* 📍 HEATMAP */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          📍 Issue Heatmap
        </h2>
        <div className="h-[320px] rounded-xl overflow-hidden">
          <HeatmapView reports={reports} />
        </div>
      </div>

    </div>

    {/* 👥 TEAM STATUS */}
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        👥 Team Status
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {teams.map((team) => (
          <div
            key={team._id}
            className="p-4 rounded-xl border hover:shadow-md transition flex justify-between items-center"
          >
            <span className="font-medium text-gray-700">
              {team.name}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                team.status === "Available"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {team.status}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* 📋 REPORT TABLE */}
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        📋 Recent Reports
      </h2>

      <div className="bg-white rounded-2xl shadow-lg p-4">
        <ReportTable reports={reports} />
      </div>
    </div>

  </div>
</MainLayout>
  );
};

const Card = ({ title, value, color }) => (
  <div className={`bg-gradient-to-r ${color} text-white p-6 rounded-2xl shadow-md hover:shadow-xl transition`}>
    <h3 className="text-sm opacity-80">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

export default Dashboard;