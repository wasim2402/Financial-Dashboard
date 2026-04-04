import { Link, useLocation } from 'react-router-dom';
import { useGlobalContext } from '../../context/GlobalContext';

export function MobileNav() {
  const { role, setRole } = useGlobalContext();
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
      <div className="flex flex-col items-center gap-0.5 text-slate-400">
        <div className="w-6 h-6 rounded-full overflow-hidden border border-primary/20">
          <img src="/profile.jpg" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <select
          className="bg-transparent border-none text-[10px] text-primary uppercase font-bold tracking-wider focus:outline-none focus:ring-0 cursor-pointer text-center p-0 leading-none"
          value={role}
          onChange={(e) => setRole(e.target.value as any)}
        >
          <option value="Viewer" className="bg-[#161616] text-white">Viewer</option>
          <option value="Admin" className="bg-[#161616] text-white">Admin</option>
        </select>
      </div>
    </nav>
  );
}
