import axios from 'axios';

// Set base URL if you haven't already (e.g., in main.jsx)
axios.defaults.baseURL = 'https://horaservices.com:3000'; 

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Interceptor to handle 401 errors (e.g., token expired)
// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Token might be invalid or expired
//       localStorage.removeItem('token');
//       // Optionally redirect to login or show a message
//       // window.location.href = '/login'; 
//       console.error('Unauthorized, logging out.');
//     }
//     return Promise.reject(error);
//   }
// );

export default axios;