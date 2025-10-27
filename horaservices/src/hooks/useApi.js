import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Create isolated axios instance
const api = axios.create({
  baseURL: "https://horaservices.com:3000",
  // timeout: 10000, // 10 seconds timeout for safety
});

// Request interceptor for Authorization
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Main hook
const useApi = (initialUrl = null, initialMethod = "get", initialBody = null, initialTrigger = 0) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle API calls (GET, POST, PUT, DELETE)
  const makeRequest = useCallback(async (url, method = "get", body = null, params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api({
        method: method.toLowerCase(),
        url,
        data: body,
        params,
      });

      setData(response.data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Something went wrong";
      setError(message);
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch for initial GET request
  useEffect(() => {
    if (!initialUrl || initialMethod.toLowerCase() !== "get") return;

    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(initialUrl, { signal: controller.signal });
        setData(response.data);
      } catch (err) {
        if (err.name !== "CanceledError") {
          const message = err.response?.data?.message || err.message || "Something went wrong";
          setError(message);
          setData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort(); // cleanup on unmount
  }, [initialUrl, initialMethod, initialTrigger]);

  // Optional reset function to clear data and errors
  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  // Return all useful states and methods
  return { data, loading, error, makeRequest, setData, reset };
};

export default useApi;
