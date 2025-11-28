import axios from "axios";
import { store } from "../redux";
import { setLogout } from "../redux/slice/userslice";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: "https://client1.appsstaging.com:3017/api/v1/",
  // baseURL: "https://client1.appsstaging.com:3017/api/v1/",

  timeout: 20000,
});

instance.interceptors.request.use(
  (config) => {
    const token = store.getState().user.token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;

    console.error("API Error:", message);
    if (typeof message === "string") {
      if (
        message.includes("Unauthorized") ||
        message.includes("Invalid session token")
      ) {
        store.dispatch(setLogout());
        toast.error("Session expired. Please login again.");
        window.location.href = "/login";
        return Promise.reject(message);
      }
    }

    return Promise.reject(message || "Something went wrong. Please try again.");
  }
);

export const apiHelper = async (
  method,
  endPoint,
  customHeaders = {},
  body = null,
  customConfig = {}
) => {
  try {
    const config = {
      method,
      url: endPoint,
      headers: {
        "Content-Type": "application/json",
        ...customHeaders,
      },
      ...(method !== "GET" && body != null ? { data: body } : {}),
      ...customConfig,
    };

    const response = await instance.request(config);
    return {
      error: null,
      response,
    };
  } catch (error) {
    return {
      error:
        typeof error === "string"
          ? error
          : error?.message || "Something went wrong.",
      response: null,
    };
  }
};

export const getTimeLogs = async (query = "") => {
  const queryString = query ? `?q=${encodeURIComponent(query)}` : "";
  return await apiHelper("GET", `admin/get-time-logs${queryString}`);
};

export const getDisputes = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.search) queryParams.append('search', params.search);
  if (params.status) queryParams.append('status', params.status);
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  return await apiHelper("GET", `admin/get-disputes${queryString}`);
};
