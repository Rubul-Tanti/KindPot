'use client'
import { handleRefreshAccessToken } from "@/server/authentication";
import axios from "axios";
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async(error) => {

    if (error.response?.status === 401) {
  if (localStorage.getItem("access_token")) {
    try {
      await handleRefreshAccessToken();
    } catch (err) {
      window.location.href = "/signup";
    }
  } else {
    window.location.href = "/signup";
  }
}else if(error.response?.status===403){
  window.location.href = "/subscriptions"
}
 return Promise.reject(error);
  }
);

export default api;