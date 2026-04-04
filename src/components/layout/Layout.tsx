import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { useGlobalContext } from '../../context/GlobalContext';

export function Layout() {
  const { isSidebarOpen, setSidebarOpen } = useGlobalContext();
  const location = useLocation();

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#0A0A0A] text-[#dae2fd]">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar />
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-y-auto relative">
        <Header />
        <div className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </div>
        <MobileNav />
      </main>
    </div>
  );
}
