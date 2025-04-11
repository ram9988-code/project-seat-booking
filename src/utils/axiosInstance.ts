import axios from "axios";
import cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // Replace with your backend URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = cookies.get("accessToken");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const response = await axios.post("http://localhost:3000/auth/refresh");

      if (response.status === 200) {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;
        return axiosInstance(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
