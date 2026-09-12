import axiosClient from "./axiosClient";

function authHeader() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

const authApi = {
    async SignUp(data) {
        const response = await axiosClient.post("/auth/sign-up", data);
        return response.data;
    },

    async SignIn(data) {
        const response = await axiosClient.post("/auth/sign-in", data);
        return response.data;
    },

    async Profile() {
        const response = await axiosClient.get("/auth/profile", {
            headers: authHeader(),
        });
        return response.data;
    }
}

export default authApi;