import React from 'react';

interface HeaderProps {
  timeStr: string;
}

export const Header: React.FC<HeaderProps> = ({ timeStr }) => {
  return (
    <header 
      id="stadiumos-header" 
      className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b border-white/20 pb-4 gap-4"
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
      <div className="flex flex-wrap items-center gap-4 text-right">
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
