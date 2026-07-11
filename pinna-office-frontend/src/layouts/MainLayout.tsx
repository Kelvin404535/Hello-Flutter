import { Outlet } from "react-router-dom";
import TopBar from '../components/layout/TopBar/TopBar';
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import FloatingWhatsApp from '@/components/common/FloatingWhatsApp';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}