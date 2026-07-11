import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar/TopBar';
import Header from './Header/Header';
import Footer from './Footer/Footer';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <TopBar />
      <Header />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;