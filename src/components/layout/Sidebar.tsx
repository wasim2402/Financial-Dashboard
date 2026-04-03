import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 bg-[#0A0A0A] border-r border-[#161616]/50 py-6 z-40 fixed left-0">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-1">
          <img src="/logo.png" alt="Zorvyn Logo" className="w-10 h-10 object-contain" />
          <h2 className="text-xl font-bold text-white tracking-tight">Zorvyn</h2>
        </div>
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
          <span className="font-sans text-sm">Dashboard</span>
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
          <span className="font-sans text-sm">Transactions</span>
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
          <span className="font-sans text-sm">Insights</span>
        </Link>
      </nav>

      <div className="mt-auto border-t border-[#161616]/50 pt-4 mb-4">
        <a
          href="#"
          className="text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-[#161616] hover:text-slate-200 transition-all"
        >
          <span className="material-symbols-outlined">help_outline</span>
          <span className="font-sans text-sm">Support</span>
        </a>
        <a
          href="#"
          className="text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-[#161616] hover:text-slate-200 transition-all"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-sans text-sm">Settings</span>
        </a>
      </div>
    </aside>
  );
}
