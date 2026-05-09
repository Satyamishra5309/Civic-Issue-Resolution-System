import MainLayout from "../layouts/MainLayout";
import ReportTable from "../components/ReportTable";
import { useState, useEffect } from "react";
import { getReports } from "../services/api";

const Reports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const res = await getReports();
      setReports(res.data);
    };

    fetchReports();
  }, []);

  return (
    <MainLayout>
      <h2 className="text-2xl font-bold mb-4">All Reports</h2>
      <ReportTable reports={reports} />
    </MainLayout>
  );
};

export default Reports;