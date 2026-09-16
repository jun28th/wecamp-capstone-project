import axiosClient from "./axiosClient.js";
function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
const goalApi = {
  async getTodayGoal() {
    const response = await axiosClient.get("/goals/today", {
      headers: authHeader(),
    });
    return response.data;
  },

  async setTodayGoal(rewardText) {
    const response = await axiosClient.put(
      "/goals/today",
      { rewardText },
      {
        headers: authHeader(),
      },
    );
    return response.data;
  },

  async deleteTodayGoal() {
    await axiosClient.delete("/goals/today", {
      headers: authHeader(),
    });
  },
};

export default goalApi;
