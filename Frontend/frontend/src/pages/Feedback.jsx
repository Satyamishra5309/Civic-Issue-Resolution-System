import { useEffect, useState } from "react";
import { getAllFeedback } from "../services/api";
import MainLayout from "../layouts/MainLayout";

const Feedback = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getAllFeedback();
      setData(res.data);
    };
    fetch();
  }, []);

  // 🔥 calculate average rating per report
  const avgRatings = {};

  data.forEach((f) => {
    const id = f.reportId?._id;
    if (!avgRatings[id]) {
      avgRatings[id] = { total: 0, count: 0 };
    }
    avgRatings[id].total += f.rating;
    avgRatings[id].count += 1;
  });

  return (
    <MainLayout>
    <div>
      <h2 className="text-xl font-bold mb-4">Feedback Overview</h2>

      {data.length > 0 ? (
        data.map((f) => (
          <div key={f._id} className="p-4 bg-white shadow mb-3 rounded">

            {/* Report Name */}
            <h3 className="font-semibold text-blue-600">
              {f.reportId?.problem_type || "Unknown Report"}
            </h3>

            {/* Feedback */}
            <p className="text-gray-700">{f.message}</p>

            {/* Rating */}
            <p className="text-yellow-500">⭐ {f.rating}</p>

            {/* 🔥 Average */}
            <p className="text-sm text-gray-500 mt-1">
              Avg Rating:{" "}
              {(
                avgRatings[f.reportId?._id].total /
                avgRatings[f.reportId?._id].count
              ).toFixed(1)}
            </p>

          </div>
        ))
      ) : (
        <p>No feedback available</p>
      )}
    </div>
    </MainLayout>
  );
};

export default Feedback;