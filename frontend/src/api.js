import axios from "axios";

// --- Fix 4: API base URL now comes from environment config ---
// Falls back to localhost for local dev if VITE_API_BASE isn't set.
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export const extractTasks = (notes) =>
  axios.post(`${API_BASE}/extract-tasks`, { notes }).then((r) => r.data);

export const getTasks = (filters = {}) =>
  axios.get(`${API_BASE}/tasks`, { params: filters }).then((r) => r.data);

export const updateTask = (id, updates) =>
  axios.put(`${API_BASE}/tasks/${id}`, updates).then((r) => r.data);

export const deleteTask = (id) =>
  axios.delete(`${API_BASE}/tasks/${id}`).then((r) => r.data);

export const exportTasksUrl = () => `${API_BASE}/tasks/export`;