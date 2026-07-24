import { reportError } from './errorReporter';

export const fetchWithError = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error ${res.status}`);
    }

    return res;
  } catch (error) {
    await reportError(error, {}, {
      type: 'api',
      endpoint: url,
      statusCode: error.status || 500,
    });
    throw error;
  }
};