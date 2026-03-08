import { Outlet } from 'react-router-dom';
import NavBar from '@/components/front/NavBar';
import Footer from '@/components/front/Footer';
import GoTop from '@/components/GoTop';

export default function FonterLayout() {
  return (
    <>
      <NavBar />
      <main className="container py-4">
        <Outlet />
      </main>
      <GoTop />
      <Footer />
    </>
  );
}
