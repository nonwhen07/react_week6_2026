import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosAdmin = axios.create({
  baseURL: `${API_URL}/v2`,
  timeout: 10000,
});

export default axiosAdmin;
