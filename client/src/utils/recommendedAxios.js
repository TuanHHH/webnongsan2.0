import axios from 'axios';

//Document: https://axios-http.com/docs/instance
const axiosInstanceRecommended = axios.create({
  baseURL: import.meta.env.VITE_RECOMMENDED_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

//Document: https://axios-http.com/docs/interceptors
// Add a request interceptor
axiosInstanceRecommended.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});



// Add a response interceptor
axiosInstanceRecommended.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  return Promise.reject(error);
});

export default axiosInstanceRecommended;