import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  assignTeam,
  startWork,
  verifyReport
} from "../services/api";
import AssignModel from "./AssignModel";

const getStatusStyle = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Assigned":
      return "bg-purple-100 text-purple-700";
    case "In Progress":
      return "bg-blue-100 text-blue-700";
    case "Verification Pending":
      return "bg-orange-100 text-orange-700";
    case "Rejected":
      return "bg-red-100 text-red-700";  
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

const ReportTable = ({ reports = [] }) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectReportId, setRejectReportId] = useState(null);

  const navigate = useNavigate();

  // 🔵 Assign Team
  const handleAssignSubmit = async (reportId, teamId) => {
    try {
      await assignTeam({ reportId, teamId });
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssign = (reportId) => {
    setSelectedReport(reportId);
    setModalOpen(true);
  };

  // 🟡 Start Work
  const handleStart = async (reportId) => {
    try {
      await startWork({ reportId });
    } catch (err) {
      console.error(err);
    }
  };

  // 🔴 Verify Completion
  const handleVerify = async (reportId) => {
    try {
      await verifyReport({ reportId, approved: true });
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ Reject Verification
const handleReject = async () => {

  try {

    await verifyReport({

      reportId: rejectReportId,

      approved: false,

      rejectionMessage: rejectReason

    });

    setRejectModal(false);

    setRejectReason("");

    setRejectReportId(null);

  } catch (err) {

    console.error(err);
  }
};

  // 🔍 Filter
  const filtered = reports.filter((r) => {
    return (
      r.problem_type?.toLowerCase().includes(search.toLowerCase()) &&
      (status === "" || r.status === status)
    );
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex justify-between items-center mb-4">
        <input
          placeholder="Search issues..."
          className="border px-3 py-2 rounded-lg w-1/3"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded-lg"
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option>Pending</option>
          <option>Assigned</option>
          <option>In Progress</option>
          <option>Verification Pending</option>
          <option>Rejected</option>
          <option>Completed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Issue</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Priority</th>
              <th className="p-4 text-left">Proof</th>
              <th className="p-4 text-left">Action</th>
              <th className="p-4 text-left">Team</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r) => (
              <tr key={r._id} className="border-t hover:bg-gray-50">

                <td className="p-4">#{r._id.slice(-5)}</td>

                <td className="p-4">{r.problem_type}</td>

                <td className="p-4">
                  <span className={`px-2 py-1 rounded ${getStatusStyle(r.status)}`}>
                    {r.status}
                    </span>
                    {r.rejectionMessage && (

  <p className="text-xs text-red-600 mt-1">

    Reason: {r.rejectionMessage}

  </p>
)}
                  
                </td>



                <td className="p-4">
                  <span className={`px-2 py-1 rounded ${getPriorityStyle(r.priority)}`}>
                    {r.priority}
                  </span>
                </td>

                {/* 📸 Completion Proof */}
                <td className="p-4">
                  {r.completionImage ? (
                    <img src={r.completionImage}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    "—"
                  )}
                </td>

                {/* ⚡ Actions */}
                <td className="p-4 flex items-start gap-2">

                  <button
                    onClick={() => navigate(`/reports/${r._id}`)}
                    className="text-blue-600"
                  >
                    View
                  </button>

                  {/* Assign */}
                 {r.status === "Pending" && (

  <div className="inline-flex flex-col gap-2 align-top">

    <button

      onClick={() => handleAssign(r._id)}

      className="bg-green-500 text-white px-2 py-1 rounded"

    >
      Assign
    </button>

  </div>
)}
                 

                  {/* Verify */}
                 {r.status === "Verification Pending" && (

  <div className="inline-flex flex-col gap-2 align-top">

    {/* ✅ Verify */}
    <button

      onClick={() => handleVerify(r._id)}

      className="bg-purple-600 text-white px-2 py-1 rounded"

    >
      Verify
    </button>

    {/* ❌ Reject */}
    <button

      onClick={() => {

        setRejectReportId(r._id);

        setRejectModal(true);
      }}

      className="bg-red-600 text-white px-2 py-1 rounded"

    >
      Reject
    </button>

  </div>
)}

                </td>

                {/* Team */}
                <td className="p-4">
                  {r.assignedTeam ? r.assignedTeam.name : "—"}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ❌ Reject Modal */}
{rejectModal && (

  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white p-6 rounded-xl w-[400px]">

      <h2 className="text-xl font-semibold mb-4">

        Reject Verification
      </h2>

      <textarea

        placeholder="Enter rejection reason..."

        value={rejectReason}

        onChange={(e) =>
          setRejectReason(e.target.value)
        }

        className="w-full border rounded-lg p-3 h-32"

      />

      <div className="flex justify-end gap-3 mt-4">

        <button

          onClick={() => {

            setRejectModal(false);

            setRejectReason("");
          }}

          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button

          onClick={handleReject}

          className="bg-red-600 text-white px-4 py-2 rounded-lg"

        >
          Reject
        </button>

      </div>

    </div>

  </div>
)}

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