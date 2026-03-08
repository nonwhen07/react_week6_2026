import axios from '@/api/axios';

// 取得購物車列表
export const getCart = async () => {
  const res = await axios.get('/cart');
  return res.data.data.carts;
};

// 加入購物車
export const updateCartItem = async (cartId, productId, qty) => {
  await axios.put(`/cart/${cartId}`, {
    data: {
      product_id: productId,
      qty: Number(qty),
    },
  });
};

// 刪除購物車項目
export const deleteCartItem = async (cartId) => {
  await axios.delete(`/cart/${cartId}`);
};

// 清空購物車
export const clearCart = async () => {
  await axios.delete('/carts');
};

// 結帳
export const createOrder = async (orderData) => {
  await axios.post('/order', orderData);
};
