import axiosClient from "./axiosClient"

const authApi = {
    async SignUp(data) {
        const response = await axiosClient.post("/auth/sign-up", data);
        return response.data;
    },

    async SignIn(data) {
        const response = await axiosClient.post("/auth/sign-in", data);
        return response.data;
    }
}

export default authApi;