import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getReports = () => API.get("/reports");
export const getReportById = (id) => API.get(`/reports/${id}`);
export const assignTeam = (data) => API.post("/assign", data);

export default API;