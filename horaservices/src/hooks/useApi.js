import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "@/utils/apiconstants";
import { reportError } from "@/utils/errorReporter";   // ← Import yahan add karo
import { safeGetItem } from "@/utils/safeStorage";

// Axios instance setup
const api = axios.create({
  baseURL: BASE_URL,
});

// Add token interceptor
api.interceptors.request.use(
  (config) => {
    const token = safeGetItem("token");
    if (token) config.headers.Authorization = `${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ← Add Response Interceptor for Global Error Reporting
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Report API error
    await reportError(error, {}, {
      type: 'api',
      endpoint: error.config?.url,
      statusCode: error.response?.status,
      payload: {
        requestData: error.config?.data,
        responseData: error.response?.data,
        method: error.config?.method,
      }
    });

    return Promise.reject(error);
  }
);

// Combined useApi Hook
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
  const [isFetched, setIsFetched] = useState(false);

  // Main reusable API call function
  const makeRequest = useCallback(
    async (url, method = "GET", body = null, params = {}) => {
      if (!url) return;

      setLoading(true);
      setError(null);
      setIsFetched(false);

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

        // Extra reporting (in case interceptor misses something)
        await reportError(err, {}, {
          type: 'api',
          endpoint: url,
          statusCode: err.response?.status,
          component: "useApi Hook",
          payload: { method, body, params }
        });

        console.error("API Error:", message);
        throw err;
      } finally {
        setLoading(false);
        setIsFetched(true);
      }
    },
    []
  );

  // Auto initial GET request
  useEffect(() => {
    if (!initialUrl || initialMethod.toLowerCase() !== "get") return;

    const controller = new AbortController();

    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      setIsFetched(false);

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

          // Report initial
          await reportError(err, {}, {
            type: 'api',
            endpoint: initialUrl,
            statusCode: err.response?.status,
            component: "useApi Initial Fetch",
          });
        }
      } finally {
        setLoading(false);
        setIsFetched(true);
      }
    };

    fetchInitialData();

    return () => controller.abort();
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

  return {
    data,
    loading,
    isFetched,
    error,
    makeRequest,
    refetch,
    setData,
    reset,
  };
};

export default useApi;
