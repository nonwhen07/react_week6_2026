// import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Modal } from 'bootstrap';
import { useState, useEffect } from 'react';
// import LoginPage from './pages/admin/LoginPage';
// import ProductsPage from './pages/ProductsPage';

import { checkAuth } from '@/services/authService';
import { showError } from '@/utils/handleApiSuccess';

import PageLoader from '@/components/PageLoader';

const DashboardPage = () => {
  // 初始化 navigate
  const navigate = useNavigate();

  // const [isAuth, setIsAuth] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  // const API_URL = import.meta.env.VITE_API_URL;
  // const API_PATH = import.meta.env.VITE_API_PATH;

  useEffect(() => {
    const initAuth = async () => {
      setIsScreenLoading(true);

      try {
        // await axios.post(`${API_URL}/v2/api/user/check`);
        await checkAuth();
        // setIsAuth(true);
      } catch {
        // setIsAuth(false);
        // alert('請先登入，將導向登入頁面');
        showError('請先登入，將導向登入頁面');
        navigate('/login'); // **確認沒有登入就跳轉到 LoginPage**
      } finally {
        setIsScreenLoading(false);
      }
    };

    initAuth();
  }, [navigate]);

  // return <>{isAuth ? <ProductsPage /> : <LoginPage setIsAuth={setIsAuth} />}</>;
  return (
    <>
      <div className="container">
        <h1>這是後台首頁</h1>
      </div>
      {/* ScreenLoading */}
      <PageLoader show={isScreenLoading} zIndex={2000} />
    </>
  );
};

export default DashboardPage;
