import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReportById } from "../services/api";
import MainLayout from "../layouts/MainLayout";
import AssignModel from "../components/AssignModel";

const ReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [open, setOpen] = useState(false);

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