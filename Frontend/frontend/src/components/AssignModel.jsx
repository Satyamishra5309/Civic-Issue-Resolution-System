import { useEffect, useState } from "react";
import { getTeams } from "../services/api";

const AssignModel = ({ isOpen, onClose, onAssign, reportId }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      const res = await getTeams();
      setTeams(res.data);
    };

    if (isOpen) fetchTeams();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">

        <h2 className="text-lg font-semibold mb-4">Assign Team</h2>

        {/* Dropdown */}
        <select
          className="border w-full p-2 mb-4 rounded"
          onChange={(e) => setSelectedTeam(e.target.value)}
        >
          <option value="">Select Team</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name} ({t.status})
            </option>
          ))}
        </select>

        {/* Buttons */}
        <div className="flex justify-end gap-2">

          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            onClick={() => onAssign(reportId, selectedTeam)}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Assign
          </button>

        </div>
      </div>
    </div>
  );
};

export default AssignModel;