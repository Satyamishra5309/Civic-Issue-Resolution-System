import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getReports } from "../services/api";
import ReportTable from "../components/ReportTable";

const Dashboard = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getReports();
      setReports(res.data);
    };
    fetchData();
  }, []);

  // 📊 Stats calculation
  const total = reports.length;
  const pending = reports.filter(r => r.status === "Pending").length;
  const progress = reports.filter(r => r.status === "In Progress").length;
  const completed = reports.filter(r => r.status === "Completed").length;

  return (
    <MainLayout>
    <h1 className="text-2xl font-bold text-gray-800">
  Dashboard Overview
</h1>
      <div className="p-6 space-y-6">

        {/* 🔥 Stats Cards */}
        <div className="grid grid-cols-4 gap-6">
          <Card title="Total Reports" value={total} color="bg-blue-500" />
          <Card title="Pending" value={pending} color="bg-yellow-500" />
          <Card title="In Progress" value={progress} color="bg-indigo-500" />
          <Card title="Completed" value={completed} color="bg-green-500" />
        </div>

        {/* 📊 Table */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Recent Reports</h2>
          <ReportTable />
        </div>

      </div>
    </MainLayout>
  );
};

const Card = ({ title, value, color }) => (
  <div className={`p-5 rounded-xl text-white shadow ${color}`}>
    <h3 className="text-sm">{title}</h3>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default Dashboard;