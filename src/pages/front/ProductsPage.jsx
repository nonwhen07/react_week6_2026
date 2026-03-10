import { useEffect, useState } from 'react';
// import axios from 'axios';
import { Link } from 'react-router-dom';

import { getProducts } from '@/services/productService';
import { updateCartItem } from '@/services/cartService';
import { handleApiError } from '@/utils/apiErrorHandler';

import PageLoader from '@/components/PageLoader';
import BtnLoader from '@/components/BtnLoader';
import ProductImage from '@/components/ProductImage';

import { FaCartPlus, FaSearch } from 'react-icons/fa';

const ProductsPage = () => {
  // const API_URL = import.meta.env.VITE_API_URL;
  // const API_PATH = import.meta.env.VITE_API_PATH;
  // const BASE_URL = `${API_URL}/v2/api/${API_PATH}`;

  const [products, setProducts] = useState([]);
  // const [pageInfo, setPageInfo] = useState({});
  // const [tempProduct, setTempProduct] = useState([]);
  // show 錯誤訊息狀態
  const [errorMessage, setErrorMessage] = useState('');
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  // const [isLoading, setIsLoading] = useState(false); //改用下面的loadingItems，先儲存商品ID來標定loading位置
  const [loadingItems, setLoadingItems] = useState({}); // 用物件儲存各商品的 Loading 狀態

  // 取得商品列表
  const fetchProducts = async () => {
    setIsScreenLoading(true);
    try {
      // const res = await axios.get(`${BASE_URL}/products`);
      const products = await getProducts();
      setProducts(products);
    } catch (error) {
      // console.error(error);
      // setErrorMessage(error.response?.data?.message || '取得產品失敗');
      handleApiError(error, setErrorMessage, '取得產品失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 加入購物車
  const handleAddCartItem = async (product_id, qty = 1) => {
    // setIsScreenLoading(true); // 加入購物車不需要整個畫面都 loading，改為按鈕局部 loading
    if (loadingItems[product_id]) return; // 防止重複點擊
    if (!product_id || qty < 1) return;

    setLoadingItems((prev) => ({
      ...prev,
      [product_id]: true,
    }));

    try {
      await updateCartItem(product_id, qty);
    } catch (error) {
      // console.error(error);
      // setErrorMessage(error.response?.data?.message || '加入購物車失敗');
      handleApiError(error, setErrorMessage, '加入購物車失敗');
    } finally {
      setLoadingItems((prev) => ({
        ...prev,
        [product_id]: false,
      }));
    }
  };

  return (
    <>
      <div className="container">
        <div className="mt-4">
          {errorMessage && <div className="alert alert-danger w-100">{errorMessage}</div>}
          <table className="table align-middle">
            <thead>
              <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th style={{ minWidth: '200px', width: 'auto', maxWidth: '280px' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={{ width: '200px' }}>
                    <ProductImage src={product.imageUrl} alt={product.title} size="medium" />
                  </td>
                  <td>{product.title}</td>
                  <td>
                    <del className="h6">原價 {product.origin_price} 元</del>
                    <div className="h5">特價 {product.price}元</div>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <Link
                        to={`/product/${product.id}`}
                        type="button"
                        className="btn btn-outline-secondary d-flex align-items-center gap-1"
                      >
                        <FaSearch size={16} />
                        查看更多
                      </Link>
                      {/* BtnLoader 参考範例 */}
                      <button
                        disabled={loadingItems[product.id]}
                        onClick={() => handleAddCartItem(product.id)}
                        type="button"
                        className="btn btn-outline-danger d-flex align-items-center gap-1"
                      >
                        {loadingItems[product.id] ? (
                          <>
                            <BtnLoader aria-hidden="true" size="sm" />
                            加入中...
                          </>
                        ) : (
                          <>
                            <FaCartPlus size={16} />
                            加入購物車
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* ScreenLoading */}
      <PageLoader show={isScreenLoading} zIndex={2000} />
    </>
  );
};

export default ProductsPage;
