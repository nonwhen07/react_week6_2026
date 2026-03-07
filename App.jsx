// import { RouterProvider } from 'react-router-dom';
// import { router } from './routers/router';

// function App() {
//   return (
//     <>
//       <RouterProvider router={router} />
//     </>
//   );
// }

// export default App;

import { RouterProvider } from 'react-router-dom';
import router from './router'; //@有問題晚點處理

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
