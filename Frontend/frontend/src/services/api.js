import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});
/* import.meta.env.VITE_API_URL  */
export const registerAdmin = (data) => API.post("/auth/register", data);
export const loginAdmin = (data) => API.post("/auth/login", data);
export const getReports = () => API.get("/reports");
export const getReportById = (id) => API.get(`/reports/${id}`);
export const assignTeam = (data) => API.post("/reports/assign", data);
export const getTeams = () => API.get("/teams");
export const createTeam = (data) => API.post("/teams", data);
export const getFeedback = () => API.get("/feedback");
export const getFeedbackByReport = (reportId) =>
  API.get(`/feedback/${reportId}`);

export const createFeedback = (data) =>
  API.post("/feedback", data);

export const getAllFeedback = () => API.get("/feedback");

export const completeReport = (data) =>
  API.post("/reports/complete", data);

export const startWork = (data) =>
  API.post("/reports/start", data);

export const uploadCompletion = (data) =>
  API.post("/reports/complete-request", data);

export const verifyReport = (data) =>
  API.post("/reports/verify", data);

export default API;