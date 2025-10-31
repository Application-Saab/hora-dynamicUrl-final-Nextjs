import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "@/utils/apiconstants";

// Axios instance setup
const api = axios.create({
  baseURL: BASE_URL,
});

// Add token interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Combined useApi Hook
const useApi = (
  initialUrl = null,
  initialMethod = "GET",
  initialBody = null,
  initialTrigger = 0
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRequest, setLastRequest] = useState(null);

  // Main reusable API call function
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

  // Auto initial GET request (optional)
  useEffect(() => {
    if (!initialUrl || initialMethod.toLowerCase() !== "get") return;

    const controller = new AbortController();

    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(initialUrl, {
          signal: controller.signal,
        });
        setData(response.data);
        setLastRequest({
          url: initialUrl,
          method: initialMethod,
          body: null,
          params: {},
        });
      } catch (err) {
        if (err.name !== "CanceledError") {
          const message =
            err.response?.data?.message ||
            err.message ||
            "Something went wrong";
          setError(message);
          setData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    return () => controller.abort(); // Cleanup
  }, [initialUrl, initialMethod, initialTrigger]);

  // Refetch last request
  const refetch = useCallback(async () => {
    if (!lastRequest?.url) {
      console.warn("No previous request found to refetch");
      return;
    }

    const { url, method, body, params } = lastRequest;
    await makeRequest(url, method, body, params);
  }, [lastRequest, makeRequest]);

  // Reset function
  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, makeRequest, refetch, setData, reset };
};

export default useApi;
