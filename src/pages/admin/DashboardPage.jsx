// import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
// import { Modal } from 'bootstrap';
import { useState, useEffect } from 'react';
import LoginPage from './pages/admin/LoginPage';
import ProductsPage from './pages/ProductsPage';

function DashboardPage() {
  const [isAuth, setIsAuth] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  // const API_PATH = import.meta.env.VITE_API_PATH;

  useEffect(() => {
    const initAuth = async () => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken_week5\s*=\s*([^;]*).*$)|^.*$/,
        '$1',
      );

      if (!token) return;

      axios.defaults.headers.common['Authorization'] = token;

      try {
        await axios.post(`${API_URL}/v2/api/user/check`);
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      }
    };

    initAuth();
  }, []);

  return <>{isAuth ? <ProductsPage /> : <LoginPage setIsAuth={setIsAuth} />}</>;
}

export default DashboardPage;
