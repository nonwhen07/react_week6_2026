import { Outlet } from 'react-router-dom';
import BackNavBar from '@/components/admin/BackNavBar';

export default function BackLayout() {
  return (
    <>
      <BackNavBar />
      <main className="container py-4">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
}
