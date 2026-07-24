import axios from "axios";
import { reportError } from "./errorReporter";
import { BASE_URL } from "./apiconstants";

const axiosApi = axios.create({
  baseURL: BASE_URL,
  timeout: 1500000, // 25 minutes
});

axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const errorContext = {
      type: 'api',
      endpoint: error.config?.url,
      statusCode: error.response?.status,
      payload: {
        requestData: error.config?.data,
        responseData: error.response?.data,
      }
    };

    await reportError(error, {}, errorContext);

    return Promise.reject(error);
  }
);

export default axiosApi;