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
      <div className="mb-6">
  <h2 className="text-3xl font-bold text-gray-800">
    {report.problem_type}
  </h2>

  <p className="text-gray-500 mt-1">
    Report ID: #{report._id.slice(-5)}
  </p>
</div>

      {/* 📊 BASIC INFO */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

  {/* Status */}
  <div className="bg-white p-4 rounded-2xl shadow border">
    <p className="text-gray-500 text-sm mb-1">Status</p>

    <span
      className={`
        font-semibold text-lg
        ${report.status === "Pending" ? "text-orange-500" : ""}
        ${report.status === "In Progress" ? "text-blue-500" : ""}
        ${report.status === "Verification Pending" ? "text-red-500" : ""}
        ${report.status === "Completed" ? "text-green-500" : ""}
      `}
    >
      {report.status}
    </span>
  </div>

  {/* Priority */}
  <div className="bg-white p-4 rounded-2xl shadow border">
    <p className="text-gray-500 text-sm mb-1">Priority</p>

    <span className="font-semibold text-lg">
      {report.priority}
    </span>
  </div>

  {/* Description */}
  <div className="bg-white p-4 rounded-2xl shadow border">
    <p className="text-gray-500 text-sm mb-1">Description</p>

    <p className="text-gray-700">
      {report.description || "No description"}
    </p>
  </div>

</div>

      {/* 📸 IMAGES */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

  {/* Reported Image */}
  {report.image && (
    <div className="bg-white p-4 rounded-2xl shadow border">
      <h3 className="font-semibold mb-3 text-gray-700 text-lg">
        Reported Image
      </h3>

      <div className="overflow-hidden rounded-xl">
        <img
          src={report.image}
          className="w-full h-80 object-cover hover:scale-105 transition duration-300"
        />
      </div>
    </div>
  )}

  {/* Completion Proof */}
  {report.completionImage && (
    <div className="bg-white p-4 rounded-2xl shadow border">
      <h3 className="font-semibold mb-3 text-gray-700 text-lg">
        Completion Proof
      </h3>

      <div className="overflow-hidden rounded-xl">
        <img
          src={report.completionImage}
          className="w-full h-80 object-cover hover:scale-105 transition duration-300"
        />
      </div>
    </div>
  )}

</div>

{/* 📍 MAP */}
<div className="mt-8">

  {/* Distance Box */}
  {distance !== null && (
    <div className="mb-5 bg-white border shadow rounded-2xl p-4 flex items-center justify-between">

      <div>
        <p className="text-sm text-gray-500">
          Verification Distance
        </p>

        <h3 className="text-2xl font-bold text-gray-800">
          {(distance * 1000).toFixed(0)} meters
        </h3>
      </div>

      <div>
        {distance * 1000 < 100 ? (
          <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full font-medium">
            ✔ Valid Completion
          </span>
        ) : (
          <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-medium">
            ❌ Suspicious Location
          </span>
        )}
      </div>

    </div>
  )}

  {/* Map */}
  <div className="bg-white rounded-3xl shadow-xl border overflow-hidden">

    {/* Header */}
    <div className="px-6 py-4 border-b bg-gray-50">
      <h2 className="text-xl font-bold text-gray-800">
        📍 Problem Location
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        Compare reported location with completion proof location
      </p>
    </div>

    {/* Map */}
    <div className="h-[500px] w-full">
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