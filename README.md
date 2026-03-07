# React Admin Dashboard & E-Commerce Frontend Practice

一個使用 React + Vite 製作的電商練習專案，
包含後台商品管理系統與前台商品頁功能。
本專案模擬真實後台管理流程，實作完整的：

- Token 驗證登入
- 商品 CRUD 管理
- Modal 表單控制
- 狀態與 UI 責任分離設計

🔗 Live Demo  
https://nonwhen07.github.io/react_week5_2026

---

## 🎯 專案目標

### Week 3 - 登入驗證流程

- 建立 Token-based Auth 流程
- 使用 Cookie 儲存 Token
- App 初始化驗證登入狀態
- 驗證成功後載入商品資料

### Week 4 – 商品 CRUD 與架構優化

- 實作完整商品 CRUD
- 拆分 ProductModal / DeleteModal
- 統一資料轉換與驗證流程
- 優化元件責任分離與資料流設計

### Week 5 – 前台商品頁與購物車流程

- 建立 ProductsPage 商品列表頁
- 串接商品 API 並渲染商品資料
- 實作加入購物車（Add to Cart）流程
- 設計 Loading 狀態管理（Screen / Button）
- 建立商品圖片 fallback 機制

---

## 🧰 技術棧

- React 19
- Vite 7
- Axios
- Bootstrap 5
- React-icons
- Sass
- gh-pages

### 📦 核心依賴說明

本專案主要使用以下核心套件：

- axios：API 請求
- bootstrap：UI 框架
- react-router-dom：路由管理
- react-hook-form：處理表格輸入跟驗證
- gh-pages：部署工具
- sass：樣式預處理器

所有依賴已於 package.json 中定義，請使用 npm install 安裝。

```bash
npm install
```

<details> 
<summary>📌 手動安裝依賴（快速小抄）</summary>

```bash
npm install axios react react-dom react-router-dom react-icons react-hook-form bootstrap sass prop-types gh-pages
```

</details>

---

## 🧠 架構設計思維

### 1️⃣ 商品列表資料流程

ProductsPage 負責：

- 呼叫商品 API
- 管理 products state
- 控制頁面 loading 狀態

資料取得後透過 map 渲染商品列表，
保持資料流由上而下。

### 2️⃣ Loading 狀態設計

為避免整頁 loading 影響使用體驗，
設計兩種 loading 狀態：

- Screen Loading：頁面初始化載入商品
- Button Loading：單一商品加入購物車

透過物件型 state 記錄 loading 狀態：

```js
const [loadingItems, setLoadingItems] = useState({});
```

讓每個商品按鈕可以獨立顯示 loading。

### 3️⃣ 加入購物車流程

加入購物車流程：

```md
1. 點擊加入購物車
2. 設定該商品 loading 狀態
3. 呼叫 Cart API
4. 完成後解除 loading
```

確保 UI 能即時回應使用者操作，
並避免整頁重新渲染。

### 4️⃣ API 串接策略

前台商品頁使用 API：

GET 商品列表

```http
GET /v2/api/{apiPath}/products
```

加入購物車

```http
POST /v2/api/{apiPath}/cart
```

所有請求統一透過 Axios 進行。

### 5️⃣ 商品圖片防呆設計

為避免 API 未提供圖片或圖片失效，
設計 fallback 機制：

- imageUrl 為空 → 顯示 placeholder 圖片
- 圖片載入失敗 → 透過 onError 自動替換 no-image

確保 UI 不會出現破圖。

## ⚙ 本地開發

```bash
npm install      # 安裝依賴
npm run dev      # 開發模式
npm run build    # 產生 production build
```

### 預設啟動：

```http
http://localhost:5173
```

---

## 📂 專案結構

```bash
src/
 ├── App.jsx
 ├── pages/
 │     ├── LoginPage.jsx
 │     └── ProductsPage.jsx
 └── components/
       ├── ProductModal.jsx
       ├── DeleteModal.jsx
       └── Pagination.jsx
```

---

## 📘 API 文件來源與設計（Week 3 未補充）

Swagger 文件

https://hexschool.github.io/ec-courses-api-swaggerDoc/

測試後台管理平台

https://ec-course-api.hexschool.io/

所有 API 請求透過 Axios 進行封裝，
登入成功後統一設定 Authorization header，
並透過狀態驅動（state-driven）方式重新抓取資料，
避免直接在登入元件中操作資料請求。

### 登入

```http
POST /v2/admin/signin
```

### 驗證

```http
POST /v2/api/user/check
```

### 商品 CRUD

```http
GET    /v2/api/{apiPath}/admin/products
POST   /v2/api/{apiPath}/admin/product
PUT    /v2/api/{apiPath}/admin/product/{id}
DELETE /v2/api/{apiPath}/admin/product/{id}
```

---

## 🚀 部署流程

### 使用 gh-pages：

```bash
npm run build
npm run deploy
```

dist 目錄會推送至 gh-pages 分支。
並透過 GitHub Pages 進行靜態頁面部署。

---

## 🧩 開發規範與格式化設定

本專案使用 Prettier 統一排版規範，並搭配 VSCode 自動格式化設定。
此設定確保團隊開發時排版一致，
並減少 Git diff 因格式差異造成的噪音。

### 📄 .prettierrc

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 80,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "auto"
}
```

### 📄 .vscode/settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## 🔮 未來優化方向、已知限制

### 已知限制

- Token 使用 cookie 儲存（非 HttpOnly）
- ESLint 依賴存在 dev-only audit 警告（不影響 production）

### 未來優化方向

- 抽離 axios instance
- 導入 React Router
- 使用 Context API 管理 Auth
- 表單改用 useReducer
- 升級為 TypeScript 專案

```

```
