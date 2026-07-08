import React from 'react';
import { Zap } from 'lucide-react';
import { StadiumState } from '../types';

interface StadiumVariablesSimulatorProps {
  stadiumState: StadiumState;
  onUpdateMatchPhase: (phase: string) => void;
  onUpdateGateDensity: (index: number, density: string) => void;
  onUpdateTransitDelay: (index: number, minutes: number) => void;
}

export const StadiumVariablesSimulator: React.FC<StadiumVariablesSimulatorProps> = ({
  stadiumState,
  onUpdateMatchPhase,
  onUpdateGateDensity,
  onUpdateTransitDelay,
}) => {
  return (
    <div 
      id="variable-simulator" 
      className="bg-[#08122A] p-4 rounded-lg border-2 border-[#00FF41] animate-fadeIn"
      role="region"
      aria-labelledby="simulator-title"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 id="simulator-title" className="text-xs font-black uppercase text-[#00FF41] tracking-wider flex items-center gap-1">
          <Zap className="w-3.5 h-3.5" aria-hidden="true" /> Live Stadium State Simulator
        </h3>
        <span className="text-[9px] bg-red-950/50 text-red-400 px-1.5 py-0.5 border border-red-900 rounded font-mono font-bold">
          Sandbox Console
        </span>
      </div>

      {/* Adjust Match Phase */}
      <div className="mb-3">
        <label htmlFor="simulator-match-phase" className="block text-[10px] text-zinc-400 uppercase font-mono mb-1">
          Match Phase
        </label>
        <select 
          id="simulator-match-phase"
          value={stadiumState.matchPhase}
          onChange={(e) => onUpdateMatchPhase(e.target.value)}
          className="w-full bg-black/60 border border-white/20 rounded p-1.5 text-xs text-white uppercase font-mono focus:border-[#00FF41] focus:outline-none focus:ring-1 focus:ring-[#00FF41]"
        >
          <option value="Gates Open">Gates Open</option>
          <option value="Warmups">Warmups</option>
          <option value="First Half">First Half</option>
          <option value="Halftime">Halftime</option>
          <option value="Second Half">Second Half</option>
          <option value="Post-Match">Post-Match</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Adjust Gate Density */}
      <div className="mb-3" role="group" aria-labelledby="gate-bottlenecks-group">
        <label id="gate-bottlenecks-group" className="block text-[10px] text-zinc-400 uppercase font-mono mb-1">
          Gate Bottleneck Control
        </label>
        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          {stadiumState.gates.map((gate, idx) => (
            <div key={gate.name} className="flex items-center justify-between bg-black/40 p-1 rounded border border-white/10">
              <span className="font-mono text-zinc-300 font-bold">{gate.name}</span>
              <select 
                aria-label={`Density control for ${gate.name}`}
                value={gate.density} 
                onChange={(e) => onUpdateGateDensity(idx, e.target.value)}
                className="bg-zinc-900 text-white font-mono text-[9px] border-none focus:outline-none focus:ring-1 focus:ring-[#00FF41] rounded"
              >
                <option value="Low">Low</option>
                <option value="Medium">Med</option>
                <option value="High">High</option>
                <option value="Critical">Crit</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Adjust Transit Delays */}
      <div role="group" aria-labelledby="transit-delays-group">
        <label id="transit-delays-group" className="block text-[10px] text-zinc-400 uppercase font-mono mb-1">
          Transit Latency Adjusters
        </label>
        <div className="space-y-1.5 text-[10px]">
          {stadiumState.transit.map((trans, idx) => (
            <div key={trans.mode} className="flex items-center justify-between bg-black/40 p-1.5 rounded border border-white/10">
              <span className="font-mono text-zinc-300 font-bold">{trans.mode}</span>
              <div className="flex items-center gap-1">
                <input 
                  type="number" 
                  aria-label={`${trans.mode} delay in minutes`}
                  value={trans.delayMinutes}
                  onChange={(e) => onUpdateTransitDelay(idx, parseInt(e.target.value) || 0)}
                  className="w-12 bg-zinc-950 text-white border border-white/20 text-center text-[10px] py-0.5 rounded focus:border-[#00FF41] focus:outline-none"
                  min="0"
                />
                <span className="text-zinc-500 font-mono">min</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
