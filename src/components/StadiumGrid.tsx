import React from 'react';
import { GateInfo } from '../types';

interface StadiumGridProps {
  gates: GateInfo[];
  selectedSector: string | null;
  onSelectSector: (sectorName: string, type: 'gate' | 'zone') => void;
  crowdLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export const StadiumGrid: React.FC<StadiumGridProps> = ({
  gates,
  selectedSector,
  onSelectSector,
  crowdLevel,
}) => {
  // Get gate density color
  const getGateColorClass = (gateName: string) => {
    const gate = gates.find((g) => g.name === gateName);
    if (!gate) return 'fill-zinc-300 stroke-zinc-400';
    if (gate.status === 'Closed') return 'fill-red-500 stroke-red-600 animate-pulse';
    if (gate.status === 'Restricted') return 'fill-amber-500 stroke-amber-600';

    switch (gate.density) {
      case 'Critical':
        return 'fill-red-400 stroke-red-500';
      case 'High':
        return 'fill-orange-400 stroke-orange-500';
      case 'Medium':
        return 'fill-yellow-400 stroke-yellow-500';
      case 'Low':
      default:
        return 'fill-emerald-400 stroke-emerald-500';
    }
  };

  const getZoneColorClass = (zoneId: string) => {
    const isSelected = selectedSector === zoneId;
    if (isSelected) {
      return 'fill-green-600 stroke-green-800 opacity-90 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00FF41]';
    }

    // Default zone coloring based on general crowdLevel
    switch (crowdLevel) {
      case 'Critical':
        return 'fill-red-100 hover:fill-red-200 stroke-zinc-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500';
      case 'High':
        return 'fill-orange-100 hover:fill-orange-200 stroke-zinc-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500';
      case 'Medium':
        return 'fill-yellow-100 hover:fill-yellow-200 stroke-zinc-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500';
      case 'Low':
      default:
        return 'fill-emerald-55 hover:fill-emerald-100 stroke-zinc-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500';
    }
  };

  const getGateInfoStr = (gateName: string) => {
    const gate = gates.find((g) => g.name === gateName);
    if (!gate) return `${gateName}. Status unknown.`;
    return `${gateName}. Status: ${gate.status}, Crowd density: ${gate.density}.`;
  };

  const handleKeyDown = (e: React.KeyboardEvent, sectorName: string, type: 'gate' | 'zone') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectSector(sectorName, type);
    }
  };

  return (
    <div id="stadium-layout-container" className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm h-full">
      <div className="flex items-center justify-between w-full mb-3">
        <div>
          <h4 className="text-sm font-semibold text-zinc-900 font-sans">Interactive Stadium Visualizer</h4>
          <p className="text-xs text-zinc-500">Estadio Azteca (Mexico City) – CDMX Hub (Keyboard & Screen-Reader Accessible)</p>
        </div>
        <div className="flex items-center gap-1 bg-zinc-50 px-2 py-1 rounded-full border border-zinc-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Live Seat Grid</span>
        </div>
      </div>

      <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
        {/* Added descriptive standard aria-label for entire SVG map */}
        <svg 
          viewBox="0 0 400 400" 
          className="w-full h-full select-none" 
          id="stadium-svg"
          aria-label="Stadium seating plan and gates diagram. Use Tab key to navigate through gates A to H and seating stands."
          role="region"
        >
          {/* Defs for gradients & patterns */}
          <defs>
            <pattern id="pitch-lines" width="40" height="20" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Outer Ring - Parking & Transit Perimeter */}
          <circle cx="200" cy="200" r="185" className="fill-none stroke-zinc-100 stroke-2 stroke-dashed" />

          {/* Gate Markers (A - H Around Perimeter) with full keyboard accessibility */}
          {/* TOP / NORTH GATES */}
          <g 
            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            onClick={() => onSelectSector('Gate A', 'gate')}
            onKeyDown={(e) => handleKeyDown(e, 'Gate A', 'gate')}
            tabIndex={0}
            role="button"
            aria-label={getGateInfoStr('Gate A')}
          >
            <circle cx="200" cy="15" r="12" className={getGateColorClass('Gate A')} />
            <text x="200" y="19" textAnchor="middle" className="fill-zinc-900 text-[10px] font-bold font-mono">A</text>
          </g>
          
          <g 
            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            onClick={() => onSelectSector('Gate B', 'gate')}
            onKeyDown={(e) => handleKeyDown(e, 'Gate B', 'gate')}
            tabIndex={0}
            role="button"
            aria-label={getGateInfoStr('Gate B')}
          >
            <circle cx="330" cy="70" r="12" className={getGateColorClass('Gate B')} />
            <text x="330" y="74" textAnchor="middle" className="fill-zinc-900 text-[10px] font-bold font-mono">B</text>
          </g>

          {/* EAST GATES */}
          <g 
            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            onClick={() => onSelectSector('Gate C', 'gate')}
            onKeyDown={(e) => handleKeyDown(e, 'Gate C', 'gate')}
            tabIndex={0}
            role="button"
            aria-label={getGateInfoStr('Gate C')}
          >
            <circle cx="385" cy="200" r="12" className={getGateColorClass('Gate C')} />
            <text x="385" y="204" textAnchor="middle" className="fill-zinc-900 text-[10px] font-bold font-mono">C</text>
          </g>
          
          <g 
            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            onClick={() => onSelectSector('Gate D', 'gate')}
            onKeyDown={(e) => handleKeyDown(e, 'Gate D', 'gate')}
            tabIndex={0}
            role="button"
            aria-label={getGateInfoStr('Gate D')}
          >
            <circle cx="330" cy="330" r="12" className={getGateColorClass('Gate D')} />
            <text x="330" y="334" textAnchor="middle" className="fill-zinc-900 text-[10px] font-bold font-mono">D</text>
          </g>

          {/* SOUTH GATES */}
          <g 
            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            onClick={() => onSelectSector('Gate E', 'gate')}
            onKeyDown={(e) => handleKeyDown(e, 'Gate E', 'gate')}
            tabIndex={0}
            role="button"
            aria-label={getGateInfoStr('Gate E')}
          >
            <circle cx="200" cy="385" r="12" className={getGateColorClass('Gate E')} />
            <text x="200" y="389" textAnchor="middle" className="fill-zinc-900 text-[10px] font-bold font-mono">E</text>
          </g>
          
          <g 
            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            onClick={() => onSelectSector('Gate F', 'gate')}
            onKeyDown={(e) => handleKeyDown(e, 'Gate F', 'gate')}
            tabIndex={0}
            role="button"
            aria-label={getGateInfoStr('Gate F')}
          >
            <circle cx="70" cy="330" r="12" className={getGateColorClass('Gate F')} />
            <text x="70" y="334" textAnchor="middle" className="fill-zinc-900 text-[10px] font-bold font-mono">F</text>
          </g>

          {/* WEST GATES */}
          <g 
            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            onClick={() => onSelectSector('Gate G', 'gate')}
            onKeyDown={(e) => handleKeyDown(e, 'Gate G', 'gate')}
            tabIndex={0}
            role="button"
            aria-label={getGateInfoStr('Gate G')}
          >
            <circle cx="15" cy="200" r="12" className={getGateColorClass('Gate G')} />
            <text x="15" y="204" textAnchor="middle" className="fill-zinc-900 text-[10px] font-bold font-mono">G</text>
          </g>
          
          <g 
            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            onClick={() => onSelectSector('Gate H', 'gate')}
            onKeyDown={(e) => handleKeyDown(e, 'Gate H', 'gate')}
            tabIndex={0}
            role="button"
            aria-label={getGateInfoStr('Gate H')}
          >
            <circle cx="70" cy="70" r="12" className={getGateColorClass('Gate H')} />
            <text x="70" y="74" textAnchor="middle" className="fill-zinc-900 text-[10px] font-bold font-mono">H</text>
          </g>

          {/* Outer Stadium Wall (Outer Bowl Ring) */}
          <ellipse cx="200" cy="200" rx="150" ry="135" className="fill-zinc-50 stroke-zinc-300 stroke-2" />

          {/* Seating Zones - Outer Tier (4 Zones) */}
          {/* North Zone */}
          <path
            d="M 125 105 A 150 135 0 0 1 275 105 L 250 130 A 100 90 0 0 0 150 130 Z"
            className={getZoneColorClass('North Stand')}
            onClick={() => onSelectSector('North Stand', 'zone')}
            onKeyDown={(e) => handleKeyDown(e, 'North Stand', 'zone')}
            tabIndex={0}
            role="button"
            aria-label="North Stand. Focus zone."
          />
          {/* East Zone */}
          <path
            d="M 275 105 A 150 135 0 0 1 325 250 L 285 235 A 100 90 0 0 0 250 130 Z"
            className={getZoneColorClass('East Stand')}
            onClick={() => onSelectSector('East Stand', 'zone')}
            onKeyDown={(e) => handleKeyDown(e, 'East Stand', 'zone')}
            tabIndex={0}
            role="button"
            aria-label="East Stand. Focus zone."
          />
          {/* South Zone */}
          <path
            d="M 325 250 A 150 135 0 0 1 125 295 L 150 270 A 100 90 0 0 0 250 235 Z"
            className={getZoneColorClass('South Stand')}
            onClick={() => onSelectSector('South Stand', 'zone')}
            onKeyDown={(e) => handleKeyDown(e, 'South Stand', 'zone')}
            tabIndex={0}
            role="button"
            aria-label="South Stand. Focus zone."
          />
          {/* West Zone */}
          <path
            d="M 125 295 A 150 135 0 0 1 75 150 L 115 165 A 100 90 0 0 0 150 270 Z"
            className={getZoneColorClass('West Stand')}
            onClick={() => onSelectSector('West Stand', 'zone')}
            onKeyDown={(e) => handleKeyDown(e, 'West Stand', 'zone')}
            tabIndex={0}
            role="button"
            aria-label="West Stand. Focus zone."
          />

          {/* Inner Seating Bowl Ring */}
          <ellipse cx="200" cy="200" rx="90" ry="80" className="fill-white stroke-zinc-200 stroke-2" />

          {/* Category 1 Inner Seating Sectors (Interactive 4-Way Splitting) */}
          <path
            d="M 155 160 A 90 80 0 0 1 245 160 L 230 180 A 55 45 0 0 0 170 180 Z"
            className={getZoneColorClass('Sector 101-North')}
            onClick={() => onSelectSector('Sector 101-North', 'zone')}
            onKeyDown={(e) => handleKeyDown(e, 'Sector 101-North', 'zone')}
            tabIndex={0}
            role="button"
            aria-label="Sector 101 North Stand Seating Category 1."
          />
          <path
            d="M 245 160 A 90 80 0 0 1 265 230 L 245 220 A 55 45 0 0 0 230 180 Z"
            className={getZoneColorClass('Sector 102-East')}
            onClick={() => onSelectSector('Sector 102-East', 'zone')}
            onKeyDown={(e) => handleKeyDown(e, 'Sector 102-East', 'zone')}
            tabIndex={0}
            role="button"
            aria-label="Sector 102 East Stand Seating Category 1."
          />
          <path
            d="M 265 230 A 90 80 0 0 1 135 240 L 155 220 A 55 45 0 0 0 245 220 Z"
            className={getZoneColorClass('Sector 103-South')}
            onClick={() => onSelectSector('Sector 103-South', 'zone')}
            onKeyDown={(e) => handleKeyDown(e, 'Sector 103-South', 'zone')}
            tabIndex={0}
            role="button"
            aria-label="Sector 103 South Stand Seating Category 1."
          />
          <path
            d="M 135 240 A 90 80 0 0 1 135 160 L 155 180 A 55 45 0 0 0 155 220 Z"
            className={getZoneColorClass('Sector 104-West')}
            onClick={() => onSelectSector('Sector 104-West', 'zone')}
            onKeyDown={(e) => handleKeyDown(e, 'Sector 104-West', 'zone')}
            tabIndex={0}
            role="button"
            aria-label="Sector 104 West Stand Seating Category 1."
          />

          {/* Pitch Outer Perimeter */}
          <rect x="155" y="170" width="90" height="60" rx="2" className="fill-green-600 stroke-green-700 stroke-2 shadow-inner" aria-hidden="true" />
          
          {/* Soccer Pitch Field Lines */}
          <rect x="160" y="173" width="80" height="54" className="fill-none stroke-white/40 stroke-[1.5]" aria-hidden="true" />
          
          {/* Halfway line */}
          <line x1="200" y1="173" x2="200" y2="227" className="stroke-white/40 stroke-[1.5]" aria-hidden="true" />
          <circle cx="200" cy="200" r="10" className="fill-none stroke-white/40 stroke-[1.5]" aria-hidden="true" />
          
          {/* Penalty boxes */}
          <rect x="160" y="185" width="12" height="30" className="fill-none stroke-white/30 stroke-[1]" aria-hidden="true" />
          <rect x="228" y="185" width="12" height="30" className="fill-none stroke-white/30 stroke-[1]" aria-hidden="true" />

          {/* Goal areas */}
          <rect x="157" y="193" width="3" height="14" className="fill-none stroke-white/40 stroke-[1]" aria-hidden="true" />
          <rect x="240" y="193" width="3" height="14" className="fill-none stroke-white/40 stroke-[1]" aria-hidden="true" />

          {/* Center spot */}
          <circle cx="200" cy="200" r="1.5" className="fill-white" aria-hidden="true" />

          {/* Static design text overlays */}
          <text x="200" y="204" textAnchor="middle" className="fill-white/20 text-[6px] font-bold tracking-widest font-sans uppercase pointer-events-none" aria-hidden="true">Azteca 2026</text>
        </svg>
      </div>

      {/* Grid Legend & Interactive Details */}
      <div className="w-full mt-2 border-t border-zinc-100 pt-2 grid grid-cols-4 gap-1 text-[10px] text-zinc-500 font-sans" aria-hidden="true">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-sm"></span>
          <span>Low Gate</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-yellow-400 rounded-sm"></span>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-orange-400 rounded-sm"></span>
          <span>Congested</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-red-400 rounded-sm animate-pulse"></span>
          <span>Crit/Closed</span>
        </div>
      </div>

      <div className="w-full mt-3 px-3 py-2 bg-zinc-50 rounded-lg border border-zinc-100 text-xs">
        {selectedSector ? (
          <div className="flex items-center justify-between" role="status" aria-live="polite">
            <span className="text-zinc-600 font-medium">Selected Location:</span>
            <span className="text-green-700 font-bold font-mono uppercase bg-green-50 px-2 py-0.5 rounded border border-green-100">
              {selectedSector}
            </span>
          </div>
        ) : (
          <div className="text-center text-zinc-400 italic">
            💡 Press Tab to select any Stand or Gate with your keyboard, or click to focus.
          </div>
        )}
      </div>
    </div>
  );
};
