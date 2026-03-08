import axiosAdmin from '@/api/axiosAdmin';

// 登入
export const login = async (account) => {
  const res = await axiosAdmin.post('/admin/signin', account);
  return res.data;
};

// 檢查登入
export const checkAuth = async () => {
  const res = await axiosAdmin.post('/api/user/check');
  return res.data;
};
