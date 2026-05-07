import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import "leaflet/dist/leaflet.css";

import MainLayout from "../layouts/MainLayout";
import { getReports } from "../services/api";

const TeamDetails = () => {

  const { id } = useParams();

  const [reports, setReports] = useState([]);
  const [teamName, setTeamName] = useState("");

  useEffect(() => {

  const fetchData = async () => {

    try {

      const res = await getReports();

      // filter reports for this team
      const filtered = res.data.filter(
        (r) => r.assignedTeam?._id === id
      );

      setReports(filtered);

      // set team name
      if (filtered.length > 0) {
        setTeamName(
          filtered[0].assignedTeam?.name || "Team"
        );
      }

    } catch (err) {
      console.error(err);
    }
  };

  fetchData();

}, [id]);

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// 📈 Weekly Report Analytics
const weeklyMap = {
  Sun: 0,
  Mon: 0,
  Tue: 0,
  Wed: 0,
  Thu: 0,
  Fri: 0,
  Sat: 0,
};

// Count reports dynamically
reports.forEach((r) => {

  if (r.submission_date) {

    const date = new Date(r.submission_date);

    const day = days[date.getDay()];

    weeklyMap[day]++;

  }

});

// Final weekly chart data
const weeklyData = days.map((day) => ({
  day,
  reports: weeklyMap[day],
}));

// 🛠 Category Analytics
const categoryData = {};

reports.forEach((r) => {

  if (!categoryData[r.problem_type]) {
    categoryData[r.problem_type] = 0;
  }

  categoryData[r.problem_type]++;

});

const pieData = Object.keys(categoryData).map(
  (key) => ({
    name: key,
    value: categoryData[key],
  })
);

// 📊 Stats
const total = reports.length;

const completed = reports.filter(
  (r) => r.status === "Completed"
).length;

const pending = reports.filter(
  (r) => r.status !== "Completed"
).length;

const completionRate =
  total > 0
    ? ((completed / total) * 100).toFixed(0)
    : 0;

// ⏱ Average Response Time
const completedReports = reports.filter(
  (r) => r.completedAt && r.submission_date
);

let avgResponse = "0 mins";

if (completedReports.length > 0) {

  const totalMinutes = completedReports.reduce(
    (acc, r) => {

      const submitted = new Date(r.submission_date);

      const completedDate = new Date(r.completedAt);

      const diff =
        (completedDate - submitted) / (1000 * 60);

      return acc + diff;

    },
    0
  );

  avgResponse =
    Math.round(
      totalMinutes / completedReports.length
    ) + " mins";
}

// 🎨 Chart Colors
const COLORS = [
  "#3B82F6",
  "#22C55E",
  "#F97316",
  "#EF4444",
  "#A855F7",
  "#EAB308",
  "#14B8A6",
];

  return (
    <MainLayout>

      <div className="p-6 space-y-8">

        {/* 🔥 Header */}
        <div>
         <h1 className="text-4xl font-bold text-gray-800">
  👨‍🔧 {teamName || "Team"} Dashboard
</h1>

          <p className="text-gray-500 mt-2">
            Monitor live team activity and performance
          </p>
        </div>

        {/* 📊 STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-lg border p-5">
            <p className="text-gray-500 text-sm">
              Total Issues
            </p>

            <h2 className="text-4xl font-bold text-blue-600 mt-2">
              {total}
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border p-5">
            <p className="text-gray-500 text-sm">
              Completed
            </p>

            <h2 className="text-4xl font-bold text-green-600 mt-2">
              {completed}
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border p-5">
            <p className="text-gray-500 text-sm">
              Pending
            </p>

            <h2 className="text-4xl font-bold text-orange-500 mt-2">
              {pending}
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border p-5">
            <p className="text-gray-500 text-sm">
              Completion Rate
            </p>

            <h2 className="text-4xl font-bold text-purple-600 mt-2">
              {completionRate}%
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border p-5">
            <p className="text-gray-500 text-sm">
              Avg Response
            </p>

            <h2 className="text-4xl font-bold text-red-500 mt-2">
              {avgResponse}
            </h2>
          </div>

        </div>

        {/* 📈 PERFORMANCE CHARTS */}
<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

  {/* Weekly Performance */}
  <div className="bg-white rounded-3xl shadow-xl border p-6">

    <h2 className="text-2xl font-bold text-gray-800 mb-6">
      📈 Weekly Performance
    </h2>

    <div className="h-[350px]">

      <ResponsiveContainer width="100%" height="100%">

        <BarChart data={weeklyData}>

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Bar
  dataKey="reports"
  radius={[12, 12, 0, 0]}
>

  {weeklyData.map((entry, index) => (
    <Cell
      key={`cell-${index}`}
      fill={COLORS[index % COLORS.length]}
    />
  ))}

</Bar>

        </BarChart>

      </ResponsiveContainer>

    </div>

  </div>

  {/* Issue Categories */}
  <div className="bg-white rounded-3xl shadow-xl border p-6">

    <h2 className="text-2xl font-bold text-gray-800 mb-6">
      🛠 Issue Categories Solved
    </h2>

    <div className="h-[350px]">

      <ResponsiveContainer width="100%" height="100%">

        <PieChart>

          <Pie
  data={pieData}
  dataKey="value"
  nameKey="name"
  outerRadius={120}
  innerRadius={55}
  paddingAngle={4}
  label
>

  {pieData.map((entry, index) => (
    <Cell
      key={`cell-${index}`}
      fill={COLORS[index % COLORS.length]}
    />
  ))}

</Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>

  </div>

</div>

        {/* 📍 LIVE ACTIVITY */}
        <div className="bg-white rounded-3xl shadow-xl border overflow-hidden">

          {/* Header */}
          <div className="px-6 py-5 border-b bg-gray-50">

            <h2 className="text-2xl font-bold text-gray-800">
              📍 Team Live Activity
            </h2>

            <p className="text-gray-500 mt-1">
              Active assigned report locations and routes
            </p>

          </div>

          

          {/* Map */}
          <div className="h-[600px] w-full">

            <MapContainer
              center={[26.8467, 80.9462]}
              zoom={12}
              scrollWheelZoom={true}
              className="h-full w-full z-0"
            >

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* 📍 Markers */}
              {reports.map((r) => {

                if (!r.latitude || !r.longitude)
                  return null;

                const userPos = [
                  Number(r.latitude),
                  Number(r.longitude),
                ];

                const workerPos = r.completionLocation
                  ? [
                      Number(r.completionLocation.lat),
                      Number(r.completionLocation.lng),
                    ]
                  : null;

                return (
                  <div key={r._id}>

                    {/* Complaint */}
                    <Marker position={userPos}>
                      <Popup>
                        <div>

                          <h3 className="font-bold">
                            {r.problem_type}
                          </h3>

                          <p>Status: {r.status}</p>

                          <p>Priority: {r.priority}</p>

                        </div>
                      </Popup>
                    </Marker>

                    {/* Completion */}
                    {workerPos && (
                      <>
                        <Marker position={workerPos}>
                          <Popup>
                            🛠 Completion Location
                          </Popup>
                        </Marker>

                        {/* Route */}
                        <Polyline
                          positions={[
                            userPos,
                            workerPos,
                          ]}
                          pathOptions={{
                            color: "#2563eb",
                            weight: 5,
                            dashArray: "8",
                          }}
                        />
                      </>
                    )}

                  </div>
                );
              })}

            </MapContainer>

          </div>

        </div>

      </div>

    </MainLayout>
  );
};

export default TeamDetails;