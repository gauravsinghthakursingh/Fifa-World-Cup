import React, { useState, useEffect } from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onToggleSidebar, isSidebarOpen }) => {
  const [timeStr, setTimeStr] = useState(() => {
    return new Date().toTimeString().split(' ')[0];
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeStr(new Date().toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const userDisplayName = user?.displayName || user?.email?.split('@')[0] || 'Operator';
  const userEmail = user?.email || 'authenticated@stadiumos.fifa.com';

  return (
    <header 
      id="stadiumos-header" 
      className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-6 border-b border-white/20 pb-4 gap-4"
      role="banner"
    >
      <div className="leading-none">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-[#00FF41] text-black px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-sm">
            FIFA WORLD CUP 2026
          </span>
          <span className="text-white/40 text-xs font-mono">| CDMX VENUE COMMAND</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
          STADIUM<span className="text-[#00FF41]">OS</span>
        </h1>
        <p className="text-zinc-300 font-mono text-xs tracking-tight uppercase mt-1">
          GenAI Operational intelligence & Multilingual Fan Support Core
        </p>
      </div>

      {/* Realtime Stats / System Telemetry */}
      <div className="flex flex-wrap items-center gap-4 text-right justify-start md:justify-end w-full xl:w-auto">
        {/* Logged in User Profile Section / Guest Mode - Acts as drawer trigger below xl */}
        <button
          onClick={onToggleSidebar}
          className="bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/10 px-3 py-1.5 rounded-lg text-left flex items-center gap-3 transition-all active:scale-95 cursor-pointer xl:pointer-events-none xl:active:scale-100"
          title={user ? "Open Session Controls" : "Open Security Gateway"}
          aria-label="Toggle operations security panel"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user ? 'bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41]' : 'bg-amber-500/10 border border-amber-500/30 text-amber-500'}`}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="w-full h-full rounded-full" />
            ) : (
              <UserIcon className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className={`text-[9px] font-mono uppercase tracking-wider leading-none ${user ? 'text-[#00FF41]' : 'text-amber-500'}`}>
                {user ? 'Active Command' : 'Guest Command'}
              </p>
              <span className="xl:hidden bg-white/10 text-[8px] text-zinc-300 px-1 rounded uppercase font-bold tracking-tight">
                Menu ☰
              </span>
            </div>
            <p className="text-xs font-bold text-white capitalize truncate max-w-[140px] leading-tight" title={user ? userEmail : 'Unauthenticated session'}>
              {user ? userDisplayName : 'Click to Log In'}
            </p>
          </div>
          {user && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onLogout();
              }}
              className="ml-2 p-1.5 hover:bg-white/20 hover:text-red-400 text-zinc-400 rounded-md transition-colors cursor-pointer xl:hidden"
              title="Sign Out"
              role="button"
              aria-label="Sign out of operations session"
            >
              <LogOut className="w-4 h-4" />
            </span>
          )}
        </button>

        <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-left hidden sm:block">
          <p className="text-[10px] font-bold text-[#00FF41] uppercase tracking-wider">Operational Target</p>
          <p className="text-sm font-bold text-white">Estadio Azteca</p>
        </div>
        
        <div 
          className="bg-[#00FF41] text-black px-3 py-2 font-black text-xs uppercase tracking-widest rounded-lg flex items-center gap-1.5 shadow-lg shadow-[#00FF41]/20"
          role="status"
          aria-live="polite"
        >
          <span className="w-2 h-2 bg-black rounded-full animate-ping" aria-hidden="true"></span>
          AI COMMAND CENTRE ACTIVE
        </div>

        <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg" aria-label="System Time CDMX">
          <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Mexico City Time</p>
          <p className="text-2xl font-mono leading-none tracking-tight font-black text-white">
            {timeStr} <span className="text-white/40 text-xs font-normal">UTC-5</span>
          </p>
        </div>
      </div>
    </header>
  );
};
