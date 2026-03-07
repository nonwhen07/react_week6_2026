import { PropTypes } from 'prop-types';
// import { Link } from 'react-router-dom';

// URL 驅動 pagination 中 Link 的實現方式，會在 URL 中加入 `?page=2` 這樣的查詢參數，並透過 React Router 的 `<Link>` 元件來實現分頁按鈕的跳轉。
// 但在這裡我們的分頁按鈕並不需要切換路由，而是直接呼叫 `handlePageChange` 函式來更新頁面內容。
// 因此 State 驅動 pagination，我們改用 `<button>` 元素來實現分頁按鈕，並在 `onClick` 事件中呼叫 `handlePageChange` 函式來更新頁面內容。

// 最簡單判斷心法 會不會改 URL ? Link ： button，主要是看使用者需不需要分享分頁連結，
// 或是需要瀏覽器的前進後退功能來切換分頁，如果需要就用 Link，不需要就用 button。
// 前台大多情況可能會需要分享分頁連結，所以會使用 Link，後台管理系統通常不需要分享分頁連結，所以使用 button 就好。

const Pagination = ({ pageInfo, handlePageChange }) => {
  return (
    <div className="d-flex justify-content-center">
      <nav className={`${pageInfo.total_pages === 1 ? 'd-none' : ''}`}>
        <ul className="pagination">
          <li className={`page-item ${!pageInfo.has_pre && 'disabled'}`}>
            {/* <a
              onClick={(e) => e.preventDefault(); handlePageChange(pageInfo.current_page - 1)}
              className="page-link"
              href="#"
            >
              上一頁
            </a> */}
            <button
              type="button"
              onClick={() => handlePageChange(pageInfo.current_page - 1)}
              className="page-link"
            >
              上一頁
            </button>
          </li>
          {Array.from({ length: pageInfo.total_pages }).map((_, index) => (
            <li
              key={index}
              className={`pageitem ${pageInfo.current_page === index + 1 ? 'active' : ''}`}
            >
              {/* <a onClick={(e) => e.preventDefault(); handlePageChange(index + 1)} className="page-link" href="#">
                {index + 1}
              </a> */}
              <button
                type="button"
                onClick={() => handlePageChange(index + 1)}
                className="page-link"
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${!pageInfo.has_next && 'disabled'}`}>
            {/* <a
              onClick={(e) => e.preventDefault(); handlePageChange(pageInfo.current_page + 1)}
              className="page-link"
              href="#"
            >
              下一頁
            </a> */}
            <button
              type="button"
              onClick={() => handlePageChange(pageInfo.current_page + 1)}
              className="page-link"
            >
              下一頁
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

// === 新增 `propTypes` 驗證 ===
Pagination.propTypes = {
  handlePageChange: PropTypes.func.isRequired,
  pageInfo: PropTypes.shape({
    total_pages: PropTypes.number.isRequired,
    has_pre: PropTypes.bool.isRequired,
    has_next: PropTypes.bool.isRequired,
    current_page: PropTypes.number.isRequired,
  }).isRequired, // 確保 `pageInfo` 是物件，且內部屬性為必填
};

export default Pagination;
