import axiosClient from "./axiosClient.js";

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const dailyLogService = {
  async getTodayLog() {
    try {
      const response = await axiosClient.get("/dailyLog/", {
        headers: authHeader(),
      });
      return response.data; // API trả null nếu chưa có log
    } catch (error) {
      console.error(
        "getTodayLog failed:",
        error.response?.data ?? error.message,
      );
      throw error;
    }
  },

  async updateLog(payload) {
    try {
      const response = await axiosClient.patch("/dailyLog/", payload, {
        headers: authHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("updateLog failed:", error.response?.data ?? error.message);
      throw error;
    }
  },
  async createLog(payload) {
    try {
      const response = await axiosClient.post("/dailyLog", payload, {
        headers: authHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("createLog failed:", error.response?.data ?? error.message);
      throw error;
    }
  },
};

export default dailyLogService;
