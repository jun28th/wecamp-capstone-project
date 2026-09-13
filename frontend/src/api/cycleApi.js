import axiosClient from "./axiosClient"; // Giữ nguyên path import của bạn
function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
export const getCycles = async () => {
  try {
    const response = await axiosClient.get("/cycle-logs", {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cycles:", error);
    throw error; // Ném lỗi ra để component gọi API (như fetchCycles) bắt được trong catch
  }
};

export const startCycle = async (date) => {
  try {
    const response = await axiosClient.post(
      "/cycle-logs",
      { date },
      { headers: authHeader() }, // Bổ sung authHeader
    );
    return response.data;
  } catch (error) {
    console.error("Error starting cycle:", error);
    throw error;
  }
};

export const endCycle = async (date) => {
  try {
    const response = await axiosClient.put(
      "/cycle-logs",
      { date },
      { headers: authHeader() }, // Bổ sung authHeader
    );
    return response.data;
  } catch (error) {
    console.error("Error ending cycle:", error);
    throw error;
  }
};
