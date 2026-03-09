import axiosAPI from '@/api/axiosAPI';

// 取得購物車列表
export const getCart = async () => {
  const res = await axiosAPI.get('/cart');
  return res.data.data.carts;
};

// 加入購物車
export const updateCartItem = async (cartId, productId, qty) => {
  await axiosAPI.put(`/cart/${cartId}`, {
    data: {
      product_id: productId,
      qty: Number(qty),
    },
  });
};

// 刪除購物車項目
export const deleteCartItem = async (cartId) => {
  await axiosAPI.delete(`/cart/${cartId}`);
};

// 清空購物車
export const clearCart = async () => {
  await axiosAPI.delete('/carts');
};

// 結帳
export const createOrder = async (orderData) => {
  await axiosAPI.post('/order', orderData);
};
