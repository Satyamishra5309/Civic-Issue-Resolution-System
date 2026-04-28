import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

const AnalyticsChart = ({ reports }) => {
  // 📊 Group by date
  const dataMap = {};

  reports.forEach((r) => {
    const date = new Date(r.submission_date).toLocaleDateString();

    if (!dataMap[date]) {
      dataMap[date] = 0;
    }

    dataMap[date]++;
  });

  const chartData = Object.keys(dataMap).map((date) => ({
    date,
    count: dataMap[date],
  }));

  return (
    <LineChart width={600} height={300} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="count" stroke="#3b82f6" />
    </LineChart>
  );
};

export default AnalyticsChart;