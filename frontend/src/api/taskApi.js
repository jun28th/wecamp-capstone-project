import axiosClient from "./axiosClient.js";
function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
const taskApi = {
  async getTasks() {
    const response = await axiosClient.get("/tasks", {
      headers: authHeader(),
    });
    return response.data;
  },

  async getTasksByMonth(year, month) {
    const response = await axiosClient.get("/tasks", {
      params: { year, month },
      headers: authHeader(), // Gom headers vào chung một object config
    });
    return response.data;
  },

  async createTask(data) {
    const response = await axiosClient.post("/tasks", data, {
      headers: authHeader(),
    });
    return response.data;
  },

  async updateTask(id, data) {
    const response = await axiosClient.put(`/tasks/${id}`, data, {
      headers: authHeader(),
    });
    return response.data;
  },

  async deleteTask(id) {
    await axiosClient.delete(`/tasks/${id}`, {
      headers: authHeader(),
    });
  },

  async toggleComplete(id, isCompleted) {
    const response = await axiosClient.patch(
      `/tasks/${id}/complete`,
      { isCompleted },
      {
        headers: authHeader(),
      },
    );
    return response.data;
  },
};

export default taskApi;
