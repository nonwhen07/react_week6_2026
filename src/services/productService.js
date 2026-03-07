import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const BASE_URL = `${API_URL}/v2/api/${API_PATH}`;

export const getProducts = () => {
  return axios.get(`${BASE_URL}/products`);
};
