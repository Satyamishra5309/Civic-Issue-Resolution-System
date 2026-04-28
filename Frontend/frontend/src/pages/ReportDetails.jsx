import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getReportById,
  getFeedbackByReport,
  createFeedback
} from "../services/api";
import MainLayout from "../layouts/MainLayout";
import MapView from "../components/MapView";



  // 🔥 ADD THIS HERE (TOP of file, before component)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const ReportDetails = () => {
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    message: "",
    rating: 1,
  });




  // 📥 Fetch report
  const fetchReport = async () => {
    const res = await getReportById(id);
    setReport(res.data);
  };

  // 📥 Fetch feedback
  const fetchFeedback = async () => {
    const res = await getFeedbackByReport(id);
    setFeedback(res.data);
  };

  useEffect(() => {
    fetchReport();
    fetchFeedback();
  }, [id]);

  // 📝 Submit feedback
  const handleSubmitFeedback = async () => {
    try {
      const res = await createFeedback({
        reportId: id,
        message: form.message,
        rating: Number(form.rating),
      });

      setFeedback((prev) => [...prev, res.data]);
      setShowForm(false);
      setForm({ message: "", rating: 1 });

    } catch (err) {
      console.error(err);
    }
  };

  if (!report) return <p>Loading...</p>;
  let distance = null;

if (
  report.latitude &&
  report.longitude &&
  report.completionLocation
) {
  distance = calculateDistance(
    report.latitude,
    report.longitude,
    report.completionLocation.lat,
    report.completionLocation.lng
  );
}

  return (
    <MainLayout>

      {/* 🔥 HEADER */}
      <h2 className="text-2xl font-bold mb-4">
        {report.problem_type}
      </h2>

      {/* 📊 BASIC INFO */}
      <div className="space-y-2">
        <p><strong>Status:</strong> {report.status}</p>
        <p><strong>Priority:</strong> {report.priority}</p>
      </div>

      {/* 📸 USER IMAGE */}
      {report.image && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Reported Image</h3>
          <img
            src={`http://localhost:5000${report.image}`}
            className="w-64 rounded shadow"
          />
        </div>
      )}

      {/* 🛠 COMPLETION PROOF */}
      {report.completionImage && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Completion Proof</h3>
          <img
            src={`http://localhost:5000${report.completionImage}`}
            className="w-64 rounded shadow"
          />
        </div>
      )}

      {/* 📍 MAP */}
      <div className="mt-6">
              {distance !== null && (
  <div className="mt-4 p-3 bg-gray-100 rounded">
    <p className="font-semibold">
      📏 Distance: {(distance * 1000).toFixed(0)} meters
    </p>

    {distance * 1000 < 100 ? (
      <p className="text-green-600">✔ Valid completion</p>
    ) : (
      <p className="text-red-600">❌ Suspicious (far location)</p>
    )}
  </div>
)}
        <h2 className="text-lg font-semibold mb-2">Problem Location</h2>
        <div className="mt-6 bg-white p-5 rounded-2xl shadow-lg">
  <h2 className="text-lg font-semibold mb-4 text-gray-700">
    📍 Location Verification
  </h2>


  <div className="h-[420px] w-full rounded-xl overflow-hidden border">
    <MapView report={report} />
  </div>
</div>

      </div>

      {/* ⭐ FEEDBACK (ONLY AFTER COMPLETION) */}
      {report.status === "Completed" && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Feedback</h2>

          {feedback.length > 0 ? (
            feedback.map((f) => (
              <div key={f._id} className="p-3 bg-white shadow rounded mb-2">
                <p>{f.message}</p>
                <p className="text-yellow-500">⭐ {f.rating}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No feedback yet</p>
          )}

          {/* ➕ ADD FEEDBACK */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-blue-500 text-white px-3 py-1 rounded"
            >
              Add Feedback
            </button>
          )}

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
        </div>
      )}

    </MainLayout>
  );
};

export default ReportDetails;