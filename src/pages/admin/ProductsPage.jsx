import { useState, useEffect } from 'react';
// import axios from 'axios';

import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/services/productService';
import { handleApiError } from '@/utils/apiErrorHandler';

import Pagination from '@/components/Pagination';
import ProductModal from '@/components/admin/ProductModal';
import DeleteModal from '@/components/admin/DeleteModal';
import StarRating from '@/components/admin/StarRating';
import PageLoader from '@/components/PageLoader';

// production code 常見命名：
// DEFAULT_PRODUCT
// INITIAL_PRODUCT
// EMPTY_PRODUCT

// Modal 資料狀態的預設值，由於六角API可以彈性新增欄位(rating: 0,)，
// 因此在這裡也要確保即使API回傳的產品物件中沒有rating欄位，
// tempProduct的初始狀態仍然包含rating: 0，避免後續操作出錯
const DEFAULT_PRODUCT = {
  imageUrl: '',
  title: '',
  category: '',
  unit: '',
  origin_price: '',
  price: '',
  description: '',
  content: '',
  is_enabled: 0,
  imagesUrl: [''],
  rating: 0, // ⭐新增
};

function ProductsPage() {
  // 環境變數
  // const API_URL = import.meta.env.VITE_API_URL;
  // const API_PATH = import.meta.env.VITE_API_PATH;
  // const BASE_URL = `${API_URL}/v2/api/${API_PATH}/admin`;
  // 管理Modal元件開關
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 狀態管理 (State)
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  // Modal 錯誤訊息狀態
  const [modalError, setModalError] = useState('');

  const [tempProduct, setTempProduct] = useState(DEFAULT_PRODUCT);
  const [modalMode, setModalMode] = useState(null);

  // 將try catch交給呼叫的函式處理包含loading，讓getProducts專注在抓資料，並且能在需要時重複使用
  const getProducts = async (page = 1) => {
    // const res = await axios.get(`${BASE_URL}/products?page=${page}`);
    // setProducts(res.data.products);
    // setPageInfo(res.data.pagination);
    const { products, pagination } = await getAdminProducts(page);
    setProducts(products);
    setPageInfo(pagination);
  };

  // 產品列表分頁
  const handlePageChange = async (page = 1) => {
    try {
      setIsScreenLoading(true);
      await getProducts(page);
    } catch (error) {
      // console.error(error);
      // setModalError(error.response?.data?.message || '取得產品列表分頁失敗');
      handleApiError(error, setModalError, '取得產品列表分頁失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };

  // Modal表單
  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setTempProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'rating' ? Number(value) : value,
    }));
  };
  const handleImageChange = (e, index) => {
    const { value } = e.target;

    setTempProduct((prev) => {
      const images = [...prev.imagesUrl];
      images[index] = value;

      return {
        ...prev,
        imagesUrl: images,
      };
    });
  };
  // Modal表單 - 新增、刪除副圖
  const handleAddImage = () => {
    setTempProduct((prev) => ({
      ...prev,
      imagesUrl: [...prev.imagesUrl, ''],
    }));
  };
  const handleDeleteImage = () => {
    setTempProduct((prev) => ({
      ...prev,
      imagesUrl: prev.imagesUrl.slice(0, -1),
    }));
  };

  // 傳值data時，需包裝成物件{data: {}}，
  // 並將tempProduct的origin_price、price轉換為數字，is_enabled轉換為數字0或1
  const formatProductData = (product) => ({
    ...product,
    origin_price: Number(product.origin_price),
    price: Number(product.price),
    is_enabled: product.is_enabled ? 1 : 0,
  });
  //做前端驗證函式 - 確保必填欄位都有填寫，並回傳對應的錯誤訊息
  const validateProduct = (product) => {
    if (!product.title) return '請輸入產品標題';
    if (!product.category) return '請輸入產品分類';
    if (!product.unit) return '請輸入產品單位';
    if (product.origin_price === '' || Number(product.origin_price) <= 0) return '請輸入原價';
    if (product.price === '' || Number(product.price) <= 0) return '請輸入售價';

    return null;
  };

  // 新增產品
  // const createProduct = async () => {
  //   // return axios.post(`${BASE_URL}/product`, {
  //   //   data: formatProductData(tempProduct),
  //   // });
  //   return await createProduct(tempProduct);
  // };
  // // 編輯產品
  // const updateProduct = async () => {
  //   // return axios.put(`${BASE_URL}/product/${tempProduct.id}`, {
  //   //   data: formatProductData(tempProduct),
  //   // });
  //   return await updateProduct(tempProduct.id, formatProductData(tempProduct));
  // };
  // 更新產品 - 包含前端驗證、錯誤訊息顯示
  const handleUpdateProduct = async () => {
    setIsScreenLoading(true);
    setModalError('');

    const validationError = validateProduct(tempProduct);

    if (validationError) {
      setModalError(validationError);
      setIsScreenLoading(false);
      return;
    }

    try {
      if (modalMode === 'create') {
        await createProduct(formatProductData(tempProduct));
      } else {
        await updateProduct(tempProduct.id, formatProductData(tempProduct));
      }
      await getProducts(pageInfo.current_page || 1);

      setIsProductModalOpen(false); // 成功才關閉 Modal
    } catch (error) {
      // console.error(error);
      // setModalError(error.response?.data?.message || '操作失敗');
      handleApiError(error, setModalError, '操作失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };

  //刪除產品
  // const deleteProduct = async () => {
  //   // return axios.delete(`${BASE_URL}/product/${tempProduct.id}`);
  //   return await deleteProduct(tempProduct.id);
  // };
  const handleDeleteProduct = async () => {
    setIsScreenLoading(true);

    try {
      await deleteProduct(tempProduct.id);
      await getProducts(pageInfo.current_page || 1);

      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsScreenLoading(false);
    }
  };

  // Modal 控制
  // imagesUrl雙重確認函式 - 確保即使api回傳的product物件中imagesUrl為空陣列或非陣列，
  // 也能正確設定tempProduct的imagesUrl為至少包含一個空字串的陣列，避免後續操作出錯
  const normalizeProduct = (p = {}) => ({
    ...DEFAULT_PRODUCT,
    ...p,
    imagesUrl: Array.isArray(p.imagesUrl) && p.imagesUrl.length > 0 ? [...p.imagesUrl] : [''],
  });
  // ProductModal
  const handleOpenProductModal = (mode, product = DEFAULT_PRODUCT) => {
    setModalMode(mode);

    if (mode === 'create') {
      setTempProduct({ ...DEFAULT_PRODUCT });
    } else {
      setTempProduct(normalizeProduct(product));
    }
    setIsProductModalOpen(true);
  };

  // DeleteModal
  // const handleOpenDeleteModal = (product = DEFAULT_PRODUCT) => {
  //   setTempProduct(
  //     // 避免 api 回傳 product 為空物件時，無法正確設定tempProduct更保險
  //     product && Object.keys(product).length > 0 ? product : DEFAULT_PRODUCT,
  //   );
  //   // 改由 isDeleteModalOpen 狀態控制 DeleteModal 的開關，並將 tempProduct 傳遞給 DeleteModal 顯示對應的產品資訊
  //   setIsDeleteModalOpen(true);
  // };
  // 上面寫法已經很不錯了，這裡再稍微優化一下，讓它更具備彈性和健壯性：
  const handleOpenDeleteModal = (product) => {
    setTempProduct(product || DEFAULT_PRODUCT);
    setIsDeleteModalOpen(true);
  };

  // useEffect getProducts 初始載入產品資料
  useEffect(() => {
    const fetchProducts = async () => {
      setIsScreenLoading(true);
      try {
        await getProducts(1);
      } catch (error) {
        // console.error(error);
        // setModalError(error.response?.data?.message || '取得產品列表失敗');
        handleApiError(error, setModalError, '取得產品列表失敗');
      } finally {
        setIsScreenLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <div className="container py-5">
        <div className="d-flex justify-content-between">
          <h2>產品列表</h2>
          <button
            className="btn btn-primary"
            onClick={() => {
              handleOpenProductModal('create');
            }}
          >
            新增產品
          </button>
        </div>
        <table className="table mt-4">
          <thead>
            <tr>
              <th width="120">分類</th>
              <th width="300">產品名稱</th>
              <th width="120">原價</th>
              <th width="120">售價</th>
              <th width="120">商品評價</th>
              <th width="100">是否啟用</th>
              <th width="120"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <th scope="row">{product.category}</th>
                <td>{product.title}</td>
                <td>{product.origin_price}</td>
                <td>{product.price}</td>
                {/* <td>{renderStars(product.rating)}</td> */}
                <td>
                  <StarRating rating={product.rating ?? 0} />
                </td>

                <td>
                  {product.is_enabled ? (
                    <span className="text-success">啟用</span>
                  ) : (
                    <span>未啟用</span>
                  )}
                </td>
                <td>
                  <div className="btn-group">
                    <button
                      type="button"
                      onClick={() => {
                        handleOpenProductModal('edit', product);
                      }}
                      className="btn btn-outline-primary btn-sm"
                    >
                      編輯
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleOpenDeleteModal(product);
                      }}
                      className="btn btn-outline-danger btn-sm"
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
      </div>
      {/* ScreenLoading */}
      <PageLoader show={isScreenLoading} zIndex={2000} />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        modalMode={modalMode}
        tempProduct={tempProduct}
        onModalChange={handleModalInputChange}
        onImageChange={handleImageChange}
        addImage={handleAddImage}
        deleteImage={handleDeleteImage}
        modalError={modalError}
        onConfirm={handleUpdateProduct}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        productTitle={tempProduct.title}
        onConfirm={handleDeleteProduct}
      />
    </>
  );
}

export default ProductsPage;
