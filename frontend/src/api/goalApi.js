import axiosClient from "./axiosClient.js";

const goalApi = {
  async getTodayGoal() {
    const response = await axiosClient.get("/goals/today");
    return response.data;
  },

  async setTodayGoal(rewardText) {
    const response = await axiosClient.put("/goals/today", { rewardText });
    return response.data;
  },

  async deleteTodayGoal() {
    await axiosClient.delete("/goals/today");
  },
};

export default goalApi;
