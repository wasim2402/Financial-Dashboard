import { useGlobalContext } from "../../context/GlobalContext";
import type { Role } from "../../types";

export function Header() {
  const { role, setRole, setSidebarOpen } = useGlobalContext();
  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-[#161616]/50 flex justify-between items-center px-6 py-3 w-full shadow-xl shadow-black/40">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 -ml-2 rounded-lg text-slate-400 hover:bg-[#161616] transition-colors"
        >
          <span className="material-symbols-outlined text-primary">menu</span>
        </button>
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Zorvyn Logo" className="w-10 h-10 object-contain" />
          <h2 className="text-2xl font-bold text-white tracking-tight">Zorvyn</h2>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        <button className="p-2 rounded-xl text-slate-400 hover:bg-[#161616] hover:text-white transition-colors active:scale-95 duration-200">
          <span className="material-symbols-outlined">dark_mode</span>
        </button>
        <button className="p-2 rounded-xl text-slate-400 hover:bg-[#161616] hover:text-white transition-colors active:scale-95 duration-200 relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></span>
        </button>
        <div className="hidden md:block h-8 w-[1px] bg-[#161616] mx-2"></div>
        <div className="hidden md:flex items-center gap-3 cursor-pointer group">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-white group-hover:text-white transition-colors leading-none">
              Wasim
            </span>
            <select
              className="mt-0.5 bg-transparent border-none text-[10px] text-primary uppercase font-bold tracking-wider focus:outline-none focus:ring-0 cursor-pointer text-right p-0 leading-none"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="Viewer" className="bg-[#161616] text-white">Viewer</option>
              <option value="Admin" className="bg-[#161616] text-white">Admin</option>
            </select>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20 hover:border-primary/50 transition-colors">
            <img
              alt="User profile"
              src="/profile.jpg"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
