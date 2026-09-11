import axiosClient from "./axiosClient.js";

const taskApi = {
  async getTasks() {
    const response = await axiosClient.get("/tasks");
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
    const response = await axiosClient.patch(`/tasks/${id}/complete`, { isCompleted });
    return response.data;
  },
};

export default taskApi;
