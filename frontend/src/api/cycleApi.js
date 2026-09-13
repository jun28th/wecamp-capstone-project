import axiosClient from "./axiosClient.js";

export const getCycles = async () => {
  const response = await axiosClient.get("/cycle-logs");
  return response.data;
};

export const startCycle = async (date) => {
  const response = await axiosClient.post("/cycle-logs", { date });
  return response.data;
};

export const endCycle = async (date) => {
  const response = await axiosClient.put("/cycle-logs", { date });
  return response.data;
};
