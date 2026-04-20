import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReportById } from "../services/api";
import MainLayout from "../layouts/MainLayout";
import AssignModel from "../components/AssignModel";
import { getFeedbackByReport, createFeedback } from "../services/api";

const ReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState([]);
const [showForm, setShowForm] = useState(false);
const [form, setForm] = useState({
  message: "",
  rating: 1,
});


  useEffect(() => {
  const fetchFeedback = async () => {
    const res = await getFeedbackByReport(id);
    console.log("FEEDBACK API:", res.data);
    setFeedback(res.data);
  };

  fetchFeedback();
}, [id]);

const handleSubmitFeedback = async () => {
  try {
    const res = await createFeedback({
      reportId: id,
      message: form.message,
      rating: form.rating,
    });

    // 🔥 update UI instantly
    setFeedback([...feedback, res.data]);

    setShowForm(false);
    setForm({ message: "", rating: 1 });

  } catch (err) {
    console.error(err);
  }
};

  const fetchReport = async () => {
    const res = await getReportById(id);
    setReport(res.data);
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  if (!report) return <p>Loading...</p>;

  return (
    <MainLayout>
      <h2 className="text-xl font-bold mb-4">
        {report.problem_type}
      </h2>

      <p>Status: {report.status}</p>
      <p>Priority: {report.priority}</p>

      <div className="mt-6">
  <h2 className="text-lg font-semibold mb-2">Feedback</h2>

  {feedback.length > 0 ? (
    feedback.map((f) => (
      <div key={f._id} className="p-3 bg-white shadow rounded mb-2">
        <p className="text-gray-700">{f.message}</p>
        <p className="text-yellow-500">⭐ {f.rating}</p>
      </div>
    ))
  ) : (
    <p className="text-gray-500">No feedback yet</p>
  )}
</div>

<button
  onClick={() => setShowForm(true)}
  className="mt-4 bg-blue-500 text-white px-3 py-1 rounded"
>
  Add Feedback
</button>

{showForm && (
  <div className="mt-4 p-4 bg-gray-100 rounded">

    <textarea
      placeholder="Write feedback..."
      className="w-full border p-2 mb-2"
      value={form.message}
      onChange={(e) =>
        setForm({ ...form, message: e.target.value })
      }
    />

    <select
      className="border p-2 mb-2"
      value={form.rating}
      onChange={(e) =>
        setForm({ ...form, rating: e.target.value })
      }
    >
      <option value="1">1 ⭐</option>
      <option value="2">2 ⭐</option>
      <option value="3">3 ⭐</option>
      <option value="4">4 ⭐</option>
      <option value="5">5 ⭐</option>
    </select>

    <div className="flex gap-2">
      <button
        onClick={handleSubmitFeedback}
        className="bg-green-500 text-white px-3 py-1 rounded"
      >
        Submit
      </button>

      <button
        onClick={() => setShowForm(false)}
        className="bg-gray-400 px-3 py-1 rounded"
      >
        Cancel
      </button>
    </div>
  </div>
)}

      {/* Assign Button */}
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Assign Team
      </button>

      {/* Modal */}
      {open && (
        <AssignModel
          setOpen={setOpen}
          reportId={id}
          refresh={fetchReport}
        />
      )}
    </MainLayout>
  );
};

export default ReportDetails;