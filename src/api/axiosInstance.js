import axios from 'axios';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8765/api', // GatewayServer 주소
});

// 요청 인터셉터: Authorization 헤더 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('!! 엑시오스 Request Authorization Header:', config.headers.Authorization);
    }
    else {
      console.warn('!! 엑시오스 No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('!! 엑시오스 Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
