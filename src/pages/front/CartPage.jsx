import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link } from 'react-router-dom';

import PageLoader from '@/components/PageLoader';
import BtnLoader from '@/components/BtnLoader';
import ProductImage from '@/components/ProductImage';

import { FaTrash, FaPlus, FaMinus, FaCartPlus, FaShoppingCart } from 'react-icons/fa';

const CartPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;
  const BASE_URL = `${API_URL}/v2/api/${API_PATH}`;

  const [carts, setCarts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // 修改/刪除 cart item 時的 loading 狀態，由於是區域性的狀態，且會同時存在多個，所以改用物件來儲存，以 cart_id 作為 key 來標定 loading 的位置
  const [loadingItems, setLoadingItems] = useState({}); // 用物件儲存各商品的 Loading 狀態
  const cartTotal = carts.reduce((total, cart) => total + (cart.total || 0), 0);

  // 畫面渲染後初步載入購物車
  useEffect(() => {
    const fetchCarts = async () => {
      setIsScreenLoading(true);
      try {
        await getCarts();
      } catch (error) {
        console.error(error);
      } finally {
        setIsScreenLoading(false);
      }
    };

    fetchCarts();
  }, []);

  // 取得cart 並將try catch交給呼叫的函式處理包含loading，讓 getCarts 專注在抓資料，並且能在需要時重複使用
  const getCarts = async () => {
    const res = await axios.get(`${BASE_URL}/cart`);
    setCarts(res.data.data.carts);
  };

  // 調整購物車品項
  const editCartItem = async (cart_id, product_id, qty = 1) => {
    // 改為在局部按鈕上顯示 loading， 避免整個畫面都被遮罩，提升使用體驗
    // setIsScreenLoading(true); 所以這段刪掉，改為下面的 loadingItems 狀態來控制按鈕的 loading 狀態

    // 如果 qty 小於 1，直接返回不做任何處理 作法A
    if (qty < 1) {
      console.warn('qty 不能小於 1');
      setIsScreenLoading(false);
      return;
    }

    setLoadingItems((prev) => ({
      ...prev,
      [cart_id]: true,
    }));

    try {
      await axios.put(`${BASE_URL}/cart/${cart_id}`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });
      //成功後刷新購物車
      await getCarts();
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || '調整購物車數量失敗');
    } finally {
      setLoadingItems((prev) => ({
        ...prev,
        [cart_id]: false,
      }));
    }
  };
  // 刪除購物車品項
  const deleteCartItem = async (cart_id) => {
    // 改為在局部按鈕上顯示 loading， 避免整個畫面都被遮罩，提升使用體驗
    // setIsScreenLoading(true); 所以這段刪掉，改為下面的 loadingItems 狀態來控制按鈕的 loading 狀態

    setLoadingItems((prev) => ({
      ...prev,
      [cart_id]: true,
    }));
    try {
      await axios.delete(`${BASE_URL}/cart/${cart_id}`);
      //成功後刷新購物車
      await getCarts();
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || '刪除購物車品項失敗');
    } finally {
      setLoadingItems((prev) => ({
        ...prev,
        [cart_id]: false,
      }));
    }
  };
  // 移除全部購物車品項
  const deleteAllCart = async () => {
    if (!window.confirm('確定要清空購物車嗎？')) return;
    setIsScreenLoading(true);
    try {
      await axios.delete(`${BASE_URL}/carts`);
      alert('刪除全部購物車成功');
      //成功後刷新購物車
      await getCarts();
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || '刪除全部購物車失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };

  // 送出訂單 + Submit事件驅動
  const onSubmit = handleSubmit((data) => {
    if (carts.length < 1) {
      // 如果 購物車為空，直接返回不做任何處理
      setErrorMessage('您的購物車是空的');
      console.warn('您的購物車是空的');
      return;
    }

    const { message, ...user } = data; //data資料"解構"成message，剩下的打包一起變成user
    const userinfo = {
      data: {
        user: user,
        message: message,
      },
    };
    checkOut(userinfo);
  });
  const checkOut = async (orderData) => {
    setIsScreenLoading(true);
    try {
      await axios.post(`${BASE_URL}/order`, orderData);
      //成功後刷新購物車，等待下一位客人
      await getCarts();
      reset(); // 提交成功後重設表單
      alert('已送出訂單');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || '訂單送出失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        {errorMessage && (
          <div className="col-12">
            <div className="alert alert-danger py-2">{errorMessage}</div>
          </div>
        )}
        <div className="mt-4">
          {/* cartTable */}
          {carts.length > 0 ? (
            <>
              <div className="text-end py-3">
                <button
                  onClick={() => deleteAllCart()}
                  className="btn btn-outline-danger"
                  type="button"
                >
                  清空購物車
                </button>
              </div>
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th style={{ width: '200px' }}>操作</th>
                    <th style={{ width: '250px' }}>品名</th>
                    <th style={{ width: '250px' }}>圖片</th>
                    <th style={{ width: '200px' }}>單價</th>
                    <th style={{ width: '200px' }}>數量/單位</th>
                    <th style={{ width: '200px' }} className="text-end">
                      合計
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {carts.map((cart) => (
                    <tr key={cart.id}>
                      <td>
                        <button
                          onClick={() => deleteCartItem(cart.id)}
                          disabled={loadingItems[cart.id]}
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                        >
                          {loadingItems[cart.id] ? <BtnLoader size="sm" /> : <FaTrash size={18} />}
                        </button>
                      </td>
                      <td>{cart.product.title}</td>
                      <td>
                        <ProductImage
                          src={cart.product.imageUrl}
                          alt={cart.product.title}
                          size="small"
                        />
                      </td>
                      <td>{cart.product.price.toLocaleString()}</td>
                      <td style={{ width: '150px' }}>
                        <div className="d-flex align-items-center">
                          <div className="btn-group me-2" role="group">
                            <button
                              onClick={() => editCartItem(cart.id, cart.product.id, cart.qty - 1)}
                              disabled={cart.qty === 1 || loadingItems[cart.id]}
                              type="button"
                              className="btn btn-outline-dark btn-sm"
                            >
                              {loadingItems[cart.id] ? (
                                <BtnLoader aria-hidden="true" size="sm" />
                              ) : (
                                <FaMinus size={20} />
                              )}
                            </button>
                            <span
                              className="btn border border-dark"
                              style={{ width: '50px', cursor: 'auto' }}
                            >
                              {cart.qty}
                            </span>

                            <button
                              onClick={() => editCartItem(cart.id, cart.product.id, cart.qty + 1)}
                              disabled={loadingItems[cart.id]}
                              type="button"
                              className="btn btn-outline-dark btn-sm"
                            >
                              {loadingItems[cart.id] ? (
                                <BtnLoader aria-hidden="true" size="sm" />
                              ) : (
                                <FaPlus size={20} />
                              )}
                            </button>
                          </div>
                          <span className="input-group-text bg-transparent border-0">
                            {cart.product.unit}
                          </span>
                        </div>
                      </td>
                      <td className="text-end">{cart.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" className="text-end">
                      總計：
                    </td>
                    <td className="text-end" style={{ width: '130px' }}>
                      {cartTotal.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </>
          ) : (
            <div className="text-center text-muted">
              <p className="">
                <FaShoppingCart size={20} /> 購物車是空的
              </p>
              <Link to="/products" className="btn btn-outline-primary mt-2">
                <FaCartPlus size={20} />
                去逛商品
              </Link>
            </div>
          )}
        </div>

        {/* orderFormTable */}
        <div className="my-5 row justify-content-center">
          <form onSubmit={onSubmit} className="col-md-6">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                {...register('email', {
                  required: 'Email 欄位必填',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Email 格式錯誤',
                  },
                })}
                id="email"
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="請輸入 Email"
              />
              {errors.email && <p className="text-danger my-2">{errors.email.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                收件人姓名
              </label>
              <input
                {...register('name', { required: '姓名 欄位必填' })}
                id="name"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="請輸入姓名"
              />
              {errors.name && <p className="text-danger my-2">{errors.name.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">
                收件人電話
              </label>
              <input
                {...register('tel', {
                  required: '電話 欄位必填',
                  pattern: {
                    value: /^(0[2-8]\d{7}|09\d{8})$/,
                    message: '電話 格式錯誤',
                  },
                })}
                id="tel"
                type="text"
                className={`form-control ${errors.tel ? 'is-invalid' : ''}`}
                placeholder="請輸入電話"
              />
              {errors.tel && <p className="text-danger my-2">{errors.tel.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                收件人地址
              </label>
              <input
                {...register('address', { required: '地址 欄位必填' })}
                id="address"
                type="text"
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                placeholder="請輸入地址"
              />

              {errors.address && <p className="text-danger my-2">{errors.address.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                留言
              </label>
              <textarea
                {...register('message')}
                id="message"
                className="form-control"
                cols="30"
                rows="10"
              ></textarea>
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-danger">
                送出訂單
              </button>
            </div>
          </form>
        </div>
      </div>

      <PageLoader show={isScreenLoading} zIndex={2000} />
    </>
  );
};

export default CartPage;
