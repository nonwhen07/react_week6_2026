import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const BASE_URL = `${API_URL}/v2/api/${API_PATH}`;

export const addCartItem = (product_id, qty) => {
  return axios.post(`${BASE_URL}/cart`, {
    data: {
      product_id,
      qty,
    },
  });
};

export const getCart = () => {
  return axios.get(`${BASE_URL}/cart`);
};

export const deleteCartItem = (cartId) => {
  return axios.delete(`${BASE_URL}/cart/${cartId}`);
};
