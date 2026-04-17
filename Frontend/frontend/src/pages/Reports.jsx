import MainLayout from "../layouts/MainLayout";
import ReportTable from "../components/ReportTable";

const Reports = () => {
  return (
    <MainLayout>
      <h2 className="text-2xl font-bold mb-4">All Reports</h2>
      <ReportTable />
    </MainLayout>
  );
};

export default Reports;