import axiosClient from "./axiosClient.js";

const taskApi = {
  async getTasks(params = {}) {
    const response = await axiosClient.get("/tasks", { params });
    return response.data;
  },

  async getTasksByMonth(year, month) {
    const response = await axiosClient.get("/tasks", {
      params: { year, month },
    });
    return response.data;
  },

  async createTask(data) {
    const response = await axiosClient.post("/tasks", data);
    return response.data;
  },

  async updateTask(id, data) {
    const response = await axiosClient.put(`/tasks/${id}`, data);
    return response.data;
  },

  async deleteTask(id) {
    await axiosClient.delete(`/tasks/${id}`);
  },

  async toggleComplete(id, isCompleted) {
    const response = await axiosClient.patch(
      `/tasks/${id}/complete`,
      { isCompleted }
    );
    return response.data;
  },
};

export default taskApi;
