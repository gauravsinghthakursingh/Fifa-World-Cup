import React from 'react';
import { Sparkles, Zap, AlertTriangle } from 'lucide-react';

interface RecommendedAction {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  targetSector: string;
}

interface OpsResult {
  analysis: string;
  recommendedActions: RecommendedAction[];
  mitigationSteps: string[];
}

interface OpsDecisionConsoleProps {
  opsCommand: string;
  setOpsCommand: (cmd: string) => void;
  opsAnalyzing: boolean;
  opsResult: OpsResult | null;
  onSubmit: (e: React.FormEvent) => void;
  errorMessage?: string;
  clearError?: () => void;
}

export const OpsDecisionConsole: React.FC<OpsDecisionConsoleProps> = ({
  opsCommand,
  setOpsCommand,
  opsAnalyzing,
  opsResult,
  onSubmit,
  errorMessage,
  clearError,
}) => {
  return (
    <div 
      className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col"
      role="region"
      aria-labelledby="ops-console-title"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-[#00FF41]" aria-hidden="true" />
        <h2 id="ops-console-title" className="text-sm font-black uppercase tracking-wider text-white">StadiumOS Operations Console</h2>
      </div>

      <p className="text-xs text-zinc-300 mb-3 leading-normal">
        Prompt the <strong>StadiumOS AI Decision Engine</strong> to run tactical simulations, gate evacuations, traffic flow routing, or volunteer deployment checklists.
      </p>

      {errorMessage && (
        <div 
          className="mb-3 bg-red-950/40 border-2 border-red-500/50 p-3 rounded-lg text-xs text-red-400 font-mono flex justify-between items-start"
          role="alert"
          aria-live="assertive"
        >
          <div>
            <strong className="block uppercase text-[10px]">Security / Operational Block:</strong>
            {errorMessage}
          </div>
          {clearError && (
            <button 
              type="button"
              onClick={clearError}
              className="text-zinc-400 hover:text-white font-bold ml-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#00FF41] px-1 rounded"
              aria-label="Clear error message"
            >
              ✕
            </button>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex gap-2 mb-4">
        <label htmlFor="ops-prompt-input" className="sr-only">Operations Prompt Directive</label>
        <input 
          id="ops-prompt-input"
          type="text" 
          placeholder="Ex: 'Evacuation protocol for North Stand' or 'Redeploy Gate B crowd'"
          value={opsCommand}
          onChange={(e) => setOpsCommand(e.target.value)}
          className="flex-1 bg-black/60 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00FF41] focus:outline-none focus:ring-1 focus:ring-[#00FF41]"
          aria-describedby="ops-input-help"
        />
        <button 
          type="submit"
          disabled={opsAnalyzing || !opsCommand.trim()}
          className="bg-[#00FF41] hover:bg-[#00e037] text-black font-black uppercase text-xs px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00FF41]"
        >
          <span>{opsAnalyzing ? 'ANALYST WORKING...' : 'ANALYZE'}</span>
          <Zap className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>
      <span id="ops-input-help" className="sr-only">Type any directive to update operations plans dynamically using Gemini AI.</span>

      {/* AI DECISION ENGINE OUTPUT */}
      {opsResult && (
        <div 
          className="bg-white/5 border-l-4 border-[#00FF41] p-4 rounded-r-lg animate-fadeIn"
          role="region"
          aria-label="Operations AI Analysis Result"
          aria-live="polite"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-mono text-[#00FF41] uppercase tracking-widest font-black">
              StadiumOS Tactical Output
            </span>
            <span className="text-[9px] bg-[#00FF41]/10 text-[#00FF41] px-1.5 py-0.5 rounded font-mono font-bold">
              Model: gemini-3.5-flash
            </span>
          </div>

          {/* Analytical text block */}
          <p className="text-xs leading-relaxed text-zinc-200 font-sans mb-3">
            {opsResult.analysis}
          </p>

          {/* Tactical recommendations breakdown */}
          {opsResult.recommendedActions && opsResult.recommendedActions.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-bold text-white uppercase tracking-wider mb-2">Recommended Actions</p>
              <div className="space-y-2">
                {opsResult.recommendedActions.map((act, index) => (
                  <div key={index} className="bg-black/40 border border-white/5 p-2 rounded flex justify-between items-start">
                    <div className="mr-3">
                      <span className="text-[10px] font-bold text-white uppercase block">{act.title}</span>
                      <span className="text-[9.5px] text-zinc-300 block mt-0.5 leading-snug">{act.description}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[9px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-bold uppercase block text-center">
                        {act.targetSector}
                      </span>
                      <span className={`text-[8px] font-bold px-1 py-0.2 rounded uppercase block mt-1 text-center ${
                        act.priority === 'Critical' 
                          ? 'bg-red-600 text-white animate-pulse' 
                          : act.priority === 'High' 
                            ? 'bg-orange-500 text-black' 
                            : 'bg-yellow-500 text-black'
                      }`}>
                        {act.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SOP Mitigation Steps Checklist */}
          {opsResult.mitigationSteps && opsResult.mitigationSteps.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-white uppercase tracking-wider mb-1.5">Actionable SOP Checklist</p>
              <ul className="space-y-1 text-[11px] text-zinc-300 font-mono">
                {opsResult.mitigationSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#00FF41] font-bold">[{idx + 1}]</span>
                    <span className="leading-snug">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
