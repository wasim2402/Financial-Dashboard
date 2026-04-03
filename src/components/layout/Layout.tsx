import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

export function Layout() {
  return (
    <div className="flex min-h-screen overflow-hidden bg-[#0A0A0A] text-[#dae2fd]">
      <Sidebar />
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-y-auto relative">
        <Header />
        <Outlet />
        <MobileNav />
      </main>
    </div>
  );
}
