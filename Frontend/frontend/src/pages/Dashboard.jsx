import MainLayout from "../layouts/MainLayout";

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">Total Reports</div>
        <div className="bg-white p-4 rounded-xl shadow">Pending</div>
        <div className="bg-white p-4 rounded-xl shadow">In Progress</div>
        <div className="bg-white p-4 rounded-xl shadow">Completed</div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;