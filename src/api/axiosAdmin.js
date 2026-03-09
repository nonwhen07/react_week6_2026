import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosAdmin = axios.create({
  baseURL: `${API_URL}/v2`,
  timeout: 10000,
});

// ⭐自動帶 token
axiosAdmin.interceptors.request.use((config) => {
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)hexToken_week6\s*=\s*([^;]*).*$)|^.*$/,
    '$1',
  );

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});

export default axiosAdmin;
