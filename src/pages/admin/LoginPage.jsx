import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import PropTypes from 'prop-types';

import { login } from '@/services/authService';
import { handleApiError } from '@/utils/apiErrorHandler';
import { showSuccess } from '@/utils/handleApiSuccess';

import PageLoader from '@/components/PageLoader';
// import BtnLoader from '@/components/BtnLoader';

const LoginPage = () => {
  // 初始化 navigate
  const navigate = useNavigate();
  // 環境變數
  // const API_URL = import.meta.env.VITE_API_URL;
  const [account, setAccount] = useState({
    username: 'example@test.com',
    password: 'example',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  // 登入表單 - 登入submit事件（使用 async/await）
  const handleLogin = async (e) => {
    setIsScreenLoading(true);
    e.preventDefault(); // 一定要最前面，避免後續程式碼執行後頁面刷新

    setErrorMessage('');

    if (!account.username || !account.password) {
      setErrorMessage('請填寫完整登入資訊');
      setIsScreenLoading(false);
      return;
    }

    try {
      // const res = await axios.post(`${API_URL}/v2/admin/signin`, account);
      const res = await login(account);

      const { token, expired } = res;

      document.cookie = `hexToken_week6=${token}; path=/; expires=${new Date(
        expired,
      ).toUTCString()}`;

      // axios.defaults.headers.common['Authorization'] = token;

      // alert('登入成功，將導向後台首頁');
      showSuccess('登入成功，將導向後台首頁');
      navigate('/admin');
    } catch (error) {
      // setErrorMessage(error.response?.data?.message || '登入失敗');
      handleApiError(error, setErrorMessage, '登入失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };

  // 登入表單 - Input變動
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="mb-5">請先登入</h1>
        {errorMessage && <div className="alert alert-danger w-100">{errorMessage}</div>}
        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
          <div className="form-floating mb-3">
            <input
              id="username"
              name="username"
              type="email"
              value={account.username}
              onChange={handleInputChange}
              className="form-control"
              placeholder="example@test.com"
              required
            />
            <label htmlFor="username">Email address</label>
          </div>
          <div className="form-floating">
            <input
              id="password"
              name="password"
              type="password"
              value={account.password || ''}
              onChange={handleInputChange}
              className="form-control"
              placeholder="example"
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          <button type="submit" className="btn btn-primary">
            登入
          </button>
        </form>
      </div>
      {/* ScreenLoading */}
      <PageLoader show={isScreenLoading} zIndex={2000} />
    </>
  );
};

export default LoginPage;
