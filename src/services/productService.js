import axiosInstance from '@/api/axiosInstance';

// ===== Front API =====
// 取得商品列表
export const getProducts = async () => {
  const res = await axiosInstance.get('/products');
  return res.data.products;
};

// 取得商品詳細
export const getProductDetail = async (productId) => {
  const res = await axiosInstance.get(`/product/${productId}`);
  return res.data.product;
};

// ===== Admin API =====
// 後台商品列表
export const getAdminProducts = async (page = 1) => {
  const { data } = await axiosInstance.get('/admin/products', {
    params: { page },
  });

  return {
    products: data.products,
    pagination: data.pagination,
  };
};

// 新增商品
export const createProduct = async (productData) => {
  const res = await axiosInstance.post('/admin/product', {
    data: productData,
  });
  return res.data;
};

// 更新商品
export const updateProduct = async (productId, productData) => {
  const res = await axiosInstance.put(`/admin/product/${productId}`, {
    data: productData,
  });
  return res.data;
};

// 刪除商品
export const deleteProduct = async (productId) => {
  const res = await axiosInstance.delete(`/admin/product/${productId}`);
  return res.data;
};
