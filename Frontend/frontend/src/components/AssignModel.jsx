import { useEffect, useState } from "react";
import { getTeams } from "../services/api";

const AssignModel = ({ isOpen, onClose, onAssign, reportId }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      const res = await getTeams();
      setTeams(res.data || []);
    };

    if (isOpen) fetchTeams();
  }, [isOpen]);

  if (!isOpen) return null;

  // ✅ Only available teams
  const availableTeams = teams.filter((t) => t.status === "Available");

  const handleAssignClick = () => {
    if (!selectedTeam) {
      alert("Please select a team ❗");
      return;
    }

    onAssign(reportId, selectedTeam);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">

        <h2 className="text-lg font-semibold mb-4">Assign Team</h2>

        {/* 🔥 No team available */}
        {availableTeams.length === 0 ? (
          <p className="text-red-500 mb-4">
            No available teams right now 🚫
          </p>
        ) : (
          <select
            className="border w-full p-2 mb-4 rounded"
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="">Select Team</option>
            {availableTeams.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2">

          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            disabled={availableTeams.length === 0}
            onClick={handleAssignClick}
            className={`px-3 py-1 rounded text-white ${
              availableTeams.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Assign
          </button>

        </div>
      </div>
    </div>
  );
};

export default AssignModel;