import { useState } from "react";
import { assignTeam } from "../services/api";
import toast from "react-hot-toast";

const AssignModel = ({ setOpen, reportId, refresh }) => {
  const [team, setTeam] = useState("");
  const [priority, setPriority] = useState("");

  const handleAssign = async () => {
    if (!team || !priority) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await assignTeam({
        reportId,
        team,
        priority,
      });

      toast.success("Team assigned successfully ✅");

      setOpen(false);   // close modal
      refresh();        // refresh table / details
    } catch (error) {
      toast.error("Assignment failed ❌");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-xl font-bold mb-4">Assign Team</h2>

        {/* Team */}
        <select
          className="border p-2 w-full mb-4"
          onChange={(e) => setTeam(e.target.value)}
        >
          <option value="">Select Team</option>
          <option value="Team A">Team A</option>
          <option value="Team B">Team B</option>
        </select>

        {/* Priority */}
        <select
          className="border p-2 w-full mb-4"
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button onClick={() => setOpen(false)}>Cancel</button>

          <button
            onClick={handleAssign}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignModel;