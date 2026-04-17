import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import ReportDetails from "./pages/ReportDetails";
import Teams from "./pages/Teams";
import Feedback from "./pages/Feedback";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Dashboard />} />
  <Route path="/reports" element={<Reports />} />
  <Route path="/reports/:id" element={<ReportDetails />} />
  <Route path="/teams" element={<Teams />} />
  <Route path="/feedback" element={<Feedback />} />
      </Routes>
  );
}

export default App;

