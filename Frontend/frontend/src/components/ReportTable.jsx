import { useState } from "react";
import { useNavigate } from "react-router-dom";

const reportsData = [
  {
    id: 1,
    type: "Road Damage",
    status: "Pending",
    priority: "High",
    date: "2026-04-17",
  },
  {
    id: 2,
    type: "Water Leakage",
    status: "In Progress",
    priority: "Medium",
    date: "2026-04-16",
  },
  {
    id: 3,
    type: "Garbage Issue",
    status: "Completed",
    priority: "Low",
    date: "2026-04-15",
  },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "In Progress":
      return "bg-blue-100 text-blue-700";
    case "Completed":
      return "bg-green-100 text-green-700";
    default:
      return "";
  }
};

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-600";
    case "Medium":
      return "bg-yellow-100 text-yellow-600";
    case "Low":
      return "bg-green-100 text-green-600";
    default:
      return "";
  }
};

const ReportTable = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const filtered = reportsData.filter((r) => {
    return (
      r.type.toLowerCase().includes(search.toLowerCase()) &&
      (status === "" || r.status === status)
    );
  });

  return (
    <div>
      {/* 🔍 Filters */}
      <div className="flex justify-between items-center mb-4">
        <input
          placeholder="Search issues..."
          className="border px-3 py-2 rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded-lg"
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>

      {/* 📊 Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">Report ID</th>
              <th className="p-4 text-left">Issue</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Priority</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium text-gray-700">
                    #{r.id}
                  </td>

                  <td className="p-4 text-gray-600">{r.type}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        r.status
                      )}`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(
                        r.priority
                      )}`}
                    >
                      {r.priority}
                    </span>
                  </td>

                  <td className="p-4 text-gray-500">{r.date}</td>

                  <td className="p-4">
                    <button
                      onClick={() => navigate(`/reports/${r.id}`)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View Details →
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;