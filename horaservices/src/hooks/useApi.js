import { useState, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "@/utils/apiconstants";

// Axios instance setup
const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Reusable hook
const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRequest, setLastRequest] = useState(null);

  // Make request (GET, POST, PUT, DELETE)
  const makeRequest = useCallback(
    async (url, method = "GET", body = null, params = {}) => {
      if (!url) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api({
          url,
          method: method.toLowerCase(),
          data: body,
          params,
        });

        setData(response.data);
        // Store last request for refetch
        setLastRequest({ url, method, body, params });
        return response.data;
      } catch (err) {
        const message =
          err.response?.data?.message || err.message || "Something went wrong";
        setError(message);
        console.error("API Error:", message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Refetch (only last called API)
  const refetch = useCallback(async () => {
    if (!lastRequest?.url) {
      console.warn("No previous request found to refetch");
      return;
    }

    const { url, method, body, params } = lastRequest;
    await makeRequest(url, method, body, params);
  }, [lastRequest, makeRequest]);

  // Reset data and error
  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, makeRequest, refetch, setData, reset };
};

export default useApi;
