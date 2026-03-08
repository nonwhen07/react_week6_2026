import { Outlet } from 'react-router-dom';
// import NavBar from '@/components/admin/NavBar';

export default function BackLayout() {
  return (
    <>
      {/* <NavBar /> */}
      <main className="container py-4">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
}
