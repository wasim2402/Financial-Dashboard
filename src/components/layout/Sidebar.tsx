import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGlobalContext } from '../../context/GlobalContext';
import { clsx } from "clsx";

export function Sidebar() {
  const location = useLocation();
  const path = location.pathname;
  const { isSidebarOpen, setSidebarOpen } = useGlobalContext();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <aside className={clsx(
      "fixed left-0 top-0 h-screen w-64 bg-[#0A0A0A] border-r border-[#161616]/50 py-6 z-[60] transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col",
      isSidebarOpen ? "translate-x-0 shadow-2xl shadow-black" : "-translate-x-full"
    )}>
      <div className="flex items-center justify-between px-6 mb-8 md:hidden">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-bold text-white text-lg tracking-tight">Zorvyn</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(false)}
          className="p-2 -mr-2 text-slate-400 hover:bg-[#161616] transition-colors rounded-lg"
        >
          <span className="material-symbols-outlined text-primary">close</span>
        </button>
      </div>
      <nav className="flex-1 space-y-1 mt-4">
        <Link
          to="/"
          className={
            path === '/'
              ? 'bg-[#161616] text-[#adc6ff] border-l-2 border-[#adc6ff] px-4 py-3 flex items-center gap-3 cursor-pointer transition-transform'
              : 'text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-[#161616] hover:text-slate-200 transition-all'
          }
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-sans text-sm text-white">Dashboard</span>
        </Link>
        <Link
          to="/transactions"
          className={
            path === '/transactions'
              ? 'bg-[#161616] text-[#adc6ff] border-l-2 border-[#adc6ff] px-4 py-3 flex items-center gap-3 cursor-pointer transition-transform'
              : 'text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-[#161616] hover:text-slate-200 transition-all'
          }
        >
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="font-sans text-sm text-white">Transactions</span>
        </Link>
        <Link
          to="/insights"
          className={
            path === '/insights'
              ? 'bg-[#161616] text-[#adc6ff] border-l-2 border-[#adc6ff] px-4 py-3 flex items-center gap-3 cursor-pointer transition-transform'
              : 'text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-[#161616] hover:text-slate-200 transition-all'
          }
        >
          <span className="material-symbols-outlined">insights</span>
          <span className="font-sans text-sm text-white">Insights</span>
        </Link>
      </nav>

      <div className="mt-auto border-t border-[#161616]/50 pt-4 mb-4 space-y-1">
        <a
          href="#"
          className="text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-[#161616] hover:text-slate-200 transition-all"
        >
          <span className="material-symbols-outlined">help_outline</span>
          <span className="font-sans text-sm text-white">Support</span>
        </a>
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={clsx(
            "w-full text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-[#161616] hover:text-slate-200 transition-all",
            isSettingsOpen && "bg-[#161616] text-[#adc6ff]"
          )}
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-sans text-sm text-white">Settings</span>
          <span className={clsx(
            "material-symbols-outlined text-xs ml-auto transition-transform",
            isSettingsOpen && "rotate-180"
          )}>
            expand_more
          </span>
        </button>
        
        {isSettingsOpen && (
          <button
            className="w-full text-slate-400 pl-12 pr-4 py-2.5 flex items-center gap-3 hover:bg-[#161616] hover:text-tertiary transition-all"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-white">Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
}
