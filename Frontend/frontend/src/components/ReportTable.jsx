import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReports } from "../services/api";
import { assignTeam } from "../services/api";
import AssignModel from "./AssignModel";

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
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
const [selectedReport, setSelectedReport] = useState(null);


const handleAssignSubmit = async (reportId, teamId) => {
  try {
    await assignTeam({ reportId, teamId });

    alert("Team assigned ✅");

    setModalOpen(false);

    // temporary refresh
    window.location.reload();

  } catch (err) {
    console.error(err);
    alert("Assign failed ❌");
  }
};

  const navigate = useNavigate();

  // 🔥 Fetch data from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getReports();
        console.log("DATA:", res.data);
        setReports(res.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // 🔍 Filter logic
  const filtered = reports.filter((r) => {
    return (
      r.problem_type?.toLowerCase().includes(search.toLowerCase()) &&
      (status === "" || r.status === status)
    );
  });

  // ⏳ Loading state
  if (loading) {
    return <p className="text-gray-500">Loading reports...</p>;
  }

  const handleAssign = (reportId) => {
  setSelectedReport(reportId);
  setModalOpen(true);
};

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
      <div className="bg-white rounded-xl shadow border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="p-4 text-left">Report ID</th>
              <th className="p-4 text-left">Issue</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Priority</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Action</th>
              <th className="p-4 text-left">Team</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((r) => (
                <tr
                  key={r._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                
                  {/* ID */}
                  <td className="p-4 font-medium text-gray-700">
                    #{r._id.slice(-5)}
                  </td>

                  {/* Issue */}
                  <td className="p-4 text-gray-600">
                    {r.problem_type}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        r.status
                      )}`}
                    >
                      {r.status}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(
                        r.priority
                      )}`}
                    >
                      {r.priority}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="p-4 text-gray-500">
                    {new Date(r.submission_date).toLocaleDateString()}
                  </td>

                  {/* Action */}
                  <td className="p-4">
                    <button
                      onClick={() => navigate(`/reports/${r._id}`)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View Details →
                    </button>

                    <button
    disabled={r.assignedTeam}
    onClick={() => handleAssign(r._id)}
    className={`px-2 py-1 rounded text-sm ${
      r.assignedTeam
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-green-500 text-white hover:bg-green-600"
    }`}
  >
    {r.assignedTeam ? "Assigned" : "Assign"}
  </button>


                  </td>
                  <td className="p-4">
  {r.assignedTeam ? r.assignedTeam.name : "Not Assigned"}
</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  <div className="flex flex-col items-center justify-center py-10 text-gray-500">
  <p className="text-lg">No reports found</p>
  <p className="text-sm">Try adjusting filters</p>
</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AssignModel
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  onAssign={handleAssignSubmit}
  reportId={selectedReport}
/>

    </div>
  );
};

export default ReportTable;