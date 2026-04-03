import { Link, useLocation } from 'react-router-dom';

export function MobileNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-[#161616]/50 flex justify-around py-3 z-50">
      <Link
        to="/"
        className={`flex flex-col items-center gap-1 ${
          path === '/' ? 'text-primary' : 'text-slate-400'
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={path === '/' ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          dashboard
        </span>
        <span
          className={`text-[10px] ${
            path === '/' ? 'font-bold' : 'font-medium'
          } uppercase tracking-tight`}
        >
          Home
        </span>
      </Link>
      <Link
        to="/transactions"
        className={`flex flex-col items-center gap-1 ${
          path === '/transactions' ? 'text-primary' : 'text-slate-400'
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={path === '/transactions' ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          receipt_long
        </span>
        <span
          className={`text-[10px] ${
            path === '/transactions' ? 'font-bold' : 'font-medium'
          } uppercase tracking-tight`}
        >
          Activity
        </span>
      </Link>
      <Link
        to="/insights"
        className={`flex flex-col items-center gap-1 ${
          path === '/insights' ? 'text-primary' : 'text-slate-400'
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={path === '/insights' ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          insights
        </span>
        <span
          className={`text-[10px] ${
            path === '/insights' ? 'font-bold' : 'font-medium'
          } uppercase tracking-tight`}
        >
          Trends
        </span>
      </Link>
      <button className="flex flex-col items-center gap-1 text-slate-400">
        <span className="material-symbols-outlined text-2xl">settings</span>
        <span className="text-[10px] font-medium uppercase tracking-tight">Profile</span>
      </button>
    </nav>
  );
}
