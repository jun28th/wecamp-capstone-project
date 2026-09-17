import axios from 'axios'

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
})
  
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/signin"; 
    }
    return Promise.reject(error);
  }
);

export default axiosClient