import axiosClient from "./axiosClient";

export const getCycles = async () => {
  try {
    const response = await axiosClient.get("/cycle-logs");
    return response.data;
  } catch (error) {
    console.error("Error fetching cycles:", error);
    throw error; 
  }
};

export const startCycle = async (date) => {
  try {
    const response = await axiosClient.post("/cycle-logs", { date });
    return response.data;
  } catch (error) {
    console.error("Error starting cycle:", error);
    throw error;
  }
};

export const getPrediction = async () => {
  try {
    const response = await axiosClient.get("/cycle-logs/prediction");
    return response.data;
  } catch (error) {
    console.error("Error fetching cycle prediction:", error);
    throw error;
  }
};

export const endCycle = async (date) => {
  try {
    const response = await axiosClient.put("/cycle-logs", { date });
    return response.data;
  } catch (error) {
    console.error("Error ending cycle:", error);
    throw error;
  }
};

export const getPhaseMessage = async () => {
  try {
    const response = await axiosClient.get("/cycle-logs/phase-message");
    return response.data;
  } catch (error) {
    console.error("Error fetching cycles:", error);
    throw error; 
  }
};

export const logPastCycle = async (startDate, endDate) => {
  try {
    const response = await axiosClient.post("/cycle-logs/past", {
      startDate,
      endDate,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging past cycle:", error);
    throw error;
  }
};
