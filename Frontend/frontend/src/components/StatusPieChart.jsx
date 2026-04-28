import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#facc15", // Pending
  "#a855f7", // Assigned
  "#6366f1", // In Progress
  "#fb923c", // Verification
  "#22c55e", // Completed
];

const StatusPieChart = ({ reports }) => {
  const data = [
    { name: "Pending", value: reports.filter(r => r.status === "Pending").length },
    { name: "Assigned", value: reports.filter(r => r.status === "Assigned").length },
    { name: "In Progress", value: reports.filter(r => r.status === "In Progress").length },
    { name: "Verification", value: reports.filter(r => r.status === "Verification Pending").length },
    { name: "Completed", value: reports.filter(r => r.status === "Completed").length },
  ];

  return (
    <PieChart width={350} height={300}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={100}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default StatusPieChart;