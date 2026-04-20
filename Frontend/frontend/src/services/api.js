import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
/*http://localhost:5000/api  */
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

export default API;