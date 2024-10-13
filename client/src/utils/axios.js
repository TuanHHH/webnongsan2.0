import axios from 'axios';
import { setExpiredMessage } from '@/store/user/userSlice';
import { store } from '@/store/redux';

//Document: https://axios-http.com/docs/instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

//Document: https://axios-http.com/docs/interceptors
// Add a request interceptor
axiosInstance.interceptors.request.use(function (config) {
  // Do something before request is sent
  let localData = window.localStorage.getItem('persist:ogani_shop/user');
  if (localData && typeof localData === 'string') {
    localData = JSON.parse(localData);
    const accessToken = JSON.parse(localData?.token);
    if (accessToken && accessToken !== 'null') {
      config.headers = { authorization: `Bearer ${accessToken}` };
    }
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});



// Add a response interceptor
axiosInstance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response.data;
}, async function (error) {
  const originalRequest = error.config;
  // Kiểm tra có phải lỗi 401 do access_token hết hạn hay không
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    const state = store.getState();
    if (!state.user.isLoggedIn) {
      return Promise.reject(error); 
    }
    // Gọi api làm mới token
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      const { access_token } = response.data.data;
      if (access_token) {
        // Cập nhật access token trong local storage
        let localData = window.localStorage.getItem('persist:ogani_shop/user');
        localData = JSON.parse(localData);
        localData.token = JSON.stringify(access_token);
        window.localStorage.setItem('persist:ogani_shop/user', JSON.stringify(localData));

        // Cập nhật lại header authorization và gửi lại request gốc
        originalRequest.headers['authorization'] = `Bearer ${access_token}`;
        return axios(originalRequest);
      }
    } catch (err) {
      window.localStorage.removeItem('persist:ogani_shop/user');
      store.dispatch(setExpiredMessage());
      return Promise.reject(err);
    }
  }
  return error.response.data
});

export default axiosInstance;