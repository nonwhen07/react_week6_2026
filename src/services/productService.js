import axios from '@/api/axiosInstance';

// 取得商品列表
export const getProducts = async () => {
  const res = await axios.get('/products');
  return res.data.products;
};

// 取得商品詳細
export const getProductDetail = async (productId) => {
  const res = await axios.get(`/product/${productId}`);
  return res.data.product;
};
