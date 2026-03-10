import { useEffect, useState } from 'react';
// import axios from 'axios';
import { useParams } from 'react-router-dom';

import { getProductDetail } from '@/services/productService';
import { updateCartItem } from '@/services/cartService';
import { handleApiError } from '@/utils/apiErrorHandler';

import PageLoader from '@/components/PageLoader';
import ProductImage from '@/components/front/product/ProductImage';
import ProductInfo from '@/components/front/product/ProductInfo';

const ProductDetailPage = () => {
  // const API_URL = import.meta.env.VITE_API_URL;
  // const API_PATH = import.meta.env.VITE_API_PATH;
  // const BASE_URL = `${API_URL}/v2/api/${API_PATH}`;

  // 根據路由的參數命名來取得該命名參數，ex path: 'product/:product_id'
  // 如果是多個參數ex path: 'product/:product_id/:typemode'，則取得方式為 const { product_id, typemode } = useParams();
  const { product_id } = useParams(); // 根據路由參數名稱取得對應值，ex path: 'product/:product_id',

  const [product, setProduct] = useState({});
  const [qtySelect, setQtySelect] = useState(1);

  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  // 畫面渲染後初步載入產品細項
  useEffect(() => {
    const fetchProduct = async () => {
      setIsScreenLoading(true);
      try {
        // const res = await axios.get(`${BASE_URL}/product/${product_id}`);
        const product = await getProductDetail(product_id);
        setProduct(product);
        setQtySelect(1);
      } catch (error) {
        // console.error(error);
        // setErrorMessage(error.response?.data?.message || '取得產品細項失敗');
        handleApiError(error, setErrorMessage, '取得產品細項失敗');
      } finally {
        setIsScreenLoading(false);
      }
    };

    fetchProduct();
  }, [product_id]);

  //加入購物車
  const handleAddCartItem = async (productId, qty = 1) => {
    if (isLoading) return; // 防止重複點擊
    if (!productId || qty < 1) return;
    setIsLoading(true);

    try {
      // await axios.post(`${BASE_URL}/cart`, {
      //   data: {
      //     product_id: productId,
      //     qty: Number(qty),
      //   },
      // });
      await updateCartItem(productId, qty);

      setCartMessage('✓ 已加入購物車');
      setIsAdded(true); // 成功加入購物車後，設定isAdded為true
      setTimeout(() => {
        setCartMessage('');
        setIsAdded(false);
      }, 2000);
    } catch (error) {
      // console.error(error);
      // setErrorMessage(error.response?.data?.message || '加入購物車失敗');
      handleApiError(error, setErrorMessage, '加入購物車失敗');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container py-5">
        <div className="row g-5 align-items-start">
          {errorMessage && (
            <div className="col-12">
              <div className="alert alert-danger py-2">{errorMessage}</div>
            </div>
          )}
          {/* 商品圖片 */}
          <div className="col-md-6">
            <ProductImage product={product} />
          </div>

          {/* 商品資訊 */}
          <div className="col-md-6">
            <ProductInfo
              product={product}
              qtySelect={qtySelect}
              setQtySelect={setQtySelect}
              addCartItem={handleAddCartItem}
              isLoading={isLoading}
              cartMessage={cartMessage}
              isAdded={isAdded}
            />
          </div>
        </div>
      </div>

      {/* 全畫面 loading */}
      {/* ScreenLoading */}
      <PageLoader show={isScreenLoading} zIndex={2000} />
    </>
  );
};

export default ProductDetailPage;
