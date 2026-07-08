import React from 'react';
import { Trophy, ArrowRight, Sparkles } from 'lucide-react';

interface JudgesPitchDeckProps {
  triggerDemoScenario: (step: number) => void;
  demoStep: number;
}

export const JudgesPitchDeck: React.FC<JudgesPitchDeckProps> = ({
  triggerDemoScenario,
  demoStep,
}) => {
  // Support keyboard accessibility (Space or Enter to trigger simulation step)
  const handleKeyDown = (e: React.KeyboardEvent, step: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerDemoScenario(step);
    }
  };

  return (
    <div 
      id="stadiumos-pitchdeck" 
      className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start"
      role="region"
      aria-labelledby="pitchdeck-heading"
    >
      <h2 id="pitchdeck-heading" className="sr-only">Judges Pitch and Walkthrough Presentation</h2>
      
      {/* LEFT PRESENTATION COLLATERAL (7 COLS) */}
      <div className="xl:col-span-7 flex flex-col gap-6">
        
        {/* HERO HOOK STATEMENT CARD */}
        <div 
          className="bg-gradient-to-br from-[#050A1A] to-zinc-950 p-6 rounded-lg border-2 border-[#00FF41] relative overflow-hidden shadow-2xl shadow-[#00FF41]/10"
          role="article"
          aria-label="Value Proposition"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00FF41]/10 rounded-full blur-2xl" aria-hidden="true"></div>
          <span className="bg-[#00FF41] text-black px-2.5 py-1 text-[10px] font-black tracking-widest rounded uppercase">
            FIFA WORLD CUP 2026 / STADIUMOS PITCH
          </span>
          <p className="text-lg md:text-xl font-black uppercase tracking-tight text-white mt-4 leading-snug">
            "Our platform transforms stadium operations from reactive to predictive by combining Generative AI, real-time sensor intelligence, and operational analytics to deliver safer, smarter, and more sustainable FIFA World Cup experiences."
          </p>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-zinc-300">
            <Trophy className="w-3.5 h-3.5 text-[#00FF41]" aria-hidden="true" />
            <span>PITCH JURY IMPACT HOOK</span>
            <span>•</span>
            <span className="text-[#00FF41] font-bold">ESTADIO AZTECA TARGET DEPLOYMENT</span>
          </div>
        </div>

        {/* DEMO SCENARIOS PANEL - HIGHLY INTERACTIVE */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-5" role="group" aria-labelledby="live-sandbox-title">
          <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
            <div>
              <h3 id="live-sandbox-title" className="text-md font-black uppercase tracking-tight text-white">
                🎮 Live Sandbox Walkthrough
              </h3>
              <p className="text-[10px] text-zinc-300 font-mono">STEP-BY-STEP SIMULATION DECK FOR FIFA JUDGES</p>
            </div>
            <span className="text-[10px] font-mono text-[#00FF41] bg-[#00FF41]/10 px-2.5 py-0.5 rounded border border-[#00FF41]/20 animate-pulse">
              CLICK STEPS TO AUTOMATE & PLAYBACK LIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* STEP 1 */}
            <button 
              type="button"
              onClick={() => triggerDemoScenario(1)}
              onKeyDown={(e) => handleKeyDown(e, 1)}
              className={`p-4 rounded border text-left cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#00FF41] ${
                demoStep === 1 
                  ? 'bg-[#00FF41]/10 border-[#00FF41] shadow-lg shadow-[#00FF41]/5' 
                  : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-black/60'
              }`}
              aria-current={demoStep === 1 ? 'step' : undefined}
              aria-label="Simulation Step 1: Crowd Congestion Pre-detection"
            >
              <div className="flex justify-between items-start">
                <span className="bg-white/10 text-white text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">STEP 01</span>
                {demoStep === 1 && <span className="text-[#00FF41] text-xs font-bold font-mono">ACTIVE SCENARIO</span>}
              </div>
              <h4 className="text-xs font-bold uppercase mt-2 text-[#00FF41]">1. Crowd Congestion Pre-detection</h4>
              <p className="text-[11px] text-zinc-300 mt-1 leading-normal">
                AI predicts congestion at Gate B 30 minutes in advance. Redirection triggers guide arrivals to Gate C.
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono font-bold text-white uppercase bg-white/10 hover:bg-[#00FF41] hover:text-black px-2.5 py-1 rounded transition-all">
                Run Simulation Step <ArrowRight className="w-3 h-3" />
              </div>
            </button>

            {/* STEP 2 */}
            <button 
              type="button"
              onClick={() => triggerDemoScenario(2)}
              onKeyDown={(e) => handleKeyDown(e, 2)}
              className={`p-4 rounded border text-left cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#00FF41] ${
                demoStep === 2 
                  ? 'bg-[#00FF41]/10 border-[#00FF41] shadow-lg shadow-[#00FF41]/5' 
                  : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-black/60'
              }`}
              aria-current={demoStep === 2 ? 'step' : undefined}
              aria-label="Simulation Step 2: Dietary Concession & Language Assistance"
            >
              <div className="flex justify-between items-start">
                <span className="bg-white/10 text-white text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">STEP 02</span>
                {demoStep === 2 && <span className="text-[#00FF41] text-xs font-bold font-mono">ACTIVE SCENARIO</span>}
              </div>
              <h4 className="text-xs font-bold uppercase mt-2 text-[#00FF41]">2. Dietary Concession & Language</h4>
              <p className="text-[11px] text-zinc-300 mt-1 leading-normal">
                Assisting fans with diet queries in Spanish/English, pinpointing vegetarian stalls nearest to selected seating.
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono font-bold text-white uppercase bg-white/10 hover:bg-[#00FF41] hover:text-black px-2.5 py-1 rounded transition-all">
                Run Simulation Step <ArrowRight className="w-3 h-3" />
              </div>
            </button>

            {/* STEP 3 */}
            <button 
              type="button"
              onClick={() => triggerDemoScenario(3)}
              onKeyDown={(e) => handleKeyDown(e, 3)}
              className={`p-4 rounded border text-left cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#00FF41] ${
                demoStep === 3 
                  ? 'bg-[#00FF41]/10 border-[#00FF41] shadow-lg shadow-[#00FF41]/5' 
                  : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-black/60'
              }`}
              aria-current={demoStep === 3 ? 'step' : undefined}
              aria-label="Simulation Step 3: AI Incident Mitigation & Standard Operating Procedures"
            >
              <div className="flex justify-between items-start">
                <span className="bg-white/10 text-white text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">STEP 03</span>
                {demoStep === 3 && <span className="text-[#00FF41] text-xs font-bold font-mono">ACTIVE SCENARIO</span>}
              </div>
              <h4 className="text-xs font-bold uppercase mt-2 text-[#00FF41]">3. AI Incident Mitigation & SOP</h4>
              <p className="text-[11px] text-zinc-300 mt-1 leading-normal">
                Vision AI detects concourse slip risk. Commands generate real-time staff actions & volunteer allocation plans.
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono font-bold text-white uppercase bg-white/10 hover:bg-[#00FF41] hover:text-black px-2.5 py-1 rounded transition-all">
                Run Simulation Step <ArrowRight className="w-3 h-3" />
              </div>
            </button>

            {/* STEP 4 */}
            <button 
              type="button"
              onClick={() => triggerDemoScenario(4)}
              onKeyDown={(e) => handleKeyDown(e, 4)}
              className={`p-4 rounded border text-left cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#00FF41] ${
                demoStep === 4 
                  ? 'bg-[#00FF41]/10 border-[#00FF41] shadow-lg shadow-[#00FF41]/5' 
                  : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-black/60'
              }`}
              aria-current={demoStep === 4 ? 'step' : undefined}
              aria-label="Simulation Step 4: Post-Match Smart Egress"
            >
              <div className="flex justify-between items-start">
                <span className="bg-white/10 text-white text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">STEP 04</span>
                {demoStep === 4 && <span className="text-[#00FF41] text-xs font-bold font-mono">ACTIVE SCENARIO</span>}
              </div>
              <h4 className="text-xs font-bold uppercase mt-2 text-[#00FF41]">4. Post-Match Smart Egress</h4>
              <p className="text-[11px] text-zinc-300 mt-1 leading-normal">
                Triggers Post-Match egress. Prepares transport warnings & live maps routing for wheelchair-bound priority.
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono font-bold text-white uppercase bg-white/10 hover:bg-[#00FF41] hover:text-black px-2.5 py-1 rounded transition-all">
                Run Simulation Step <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          </div>
        </div>

        {/* STRATEGIC ARCHITECTURE BLUEPRINT MAP */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-5" role="region" aria-labelledby="architecture-title">
          <h3 id="architecture-title" className="text-md font-black uppercase tracking-tight text-white mb-1">
            🏗️ Robust Google Cloud Ecosystem Architecture
          </h3>
          <p className="text-[10px] text-zinc-300 font-mono mb-4 uppercase">PRODUCTION-READY TECH STACK INTEGRATION</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="bg-black/40 border border-white/10 p-3 rounded flex flex-col items-center">
              <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold font-mono text-xs mb-1.5 border border-blue-500/20">GEMINI</div>
              <span className="text-[10px] font-bold uppercase text-white">Google Gemini</span>
              <span className="text-[8px] text-zinc-400 mt-1 font-mono">Multilingual & Action Engine</span>
            </div>
            <div className="bg-black/40 border border-white/10 p-3 rounded flex flex-col items-center">
              <div className="w-8 h-8 rounded bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold font-mono text-xs mb-1.5 border border-teal-500/20">VERTEX</div>
              <span className="text-[10px] font-bold uppercase text-white">Vertex AI</span>
              <span className="text-[8px] text-zinc-400 mt-1 font-mono">Crowd Predictive Models</span>
            </div>
            <div className="bg-black/40 border border-white/10 p-3 rounded flex flex-col items-center">
              <div className="w-8 h-8 rounded bg-orange-500/10 flex items-center justify-center text-orange-400 font-bold font-mono text-xs mb-1.5 border border-orange-500/20">FIREBASE</div>
              <span className="text-[10px] font-bold uppercase text-white">Firebase Sync</span>
              <span className="text-[8px] text-zinc-400 mt-1 font-mono">Real-Time Telemetry Store</span>
            </div>
            <div className="bg-black/40 border border-white/10 p-3 rounded flex flex-col items-center">
              <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold font-mono text-xs mb-1.5 border border-purple-500/20">BIGQUERY</div>
              <span className="text-[10px] font-bold uppercase text-white">BigQuery</span>
              <span className="text-[8px] text-zinc-400 mt-1 font-mono">Matchday Analytics Store</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center mt-3">
            <div className="bg-black/40 border border-white/10 p-3 rounded flex flex-col items-center">
              <div className="w-8 h-8 rounded bg-[#00FF41]/10 flex items-center justify-center text-[#00FF41] font-bold font-mono text-xs mb-1.5 border border-[#00FF41]/20">MAPS</div>
              <span className="text-[10px] font-bold uppercase text-white">Maps API</span>
              <span className="text-[8px] text-zinc-400 mt-1 font-mono">Transit & Routing Layers</span>
            </div>
            <div className="bg-black/40 border border-white/10 p-3 rounded flex flex-col items-center">
              <div className="w-8 h-8 rounded bg-yellow-500/10 flex items-center justify-center text-yellow-400 font-bold font-mono text-xs mb-1.5 border border-yellow-500/20">VISION</div>
              <span className="text-[10px] font-bold uppercase text-white">Vision AI</span>
              <span className="text-[8px] text-zinc-400 mt-1 font-mono">Concourse Camera Density</span>
            </div>
            <div className="bg-black/40 border border-white/10 p-3 rounded flex flex-col items-center">
              <div className="w-8 h-8 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold font-mono text-xs mb-1.5 border border-indigo-500/20">IoT</div>
              <span className="text-[10px] font-bold uppercase text-white">IoT Sensors</span>
              <span className="text-[8px] text-zinc-400 mt-1 font-mono">Live Turnstile RFID Feed</span>
            </div>
            <div className="bg-black/40 border border-white/10 p-3 rounded flex flex-col items-center">
              <div className="w-8 h-8 rounded bg-[#ef4444]/10 flex items-center justify-center text-[#ef4444] font-bold font-mono text-xs mb-1.5 border border-[#ef4444]/20">RAG</div>
              <span className="text-[10px] font-bold uppercase text-white">FIFA RAG KB</span>
              <span className="text-[8px] text-zinc-400 mt-1 font-mono">Event Guidelines Library</span>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT PRESENTATION COLLATERAL (5 COLS) */}
      <div className="xl:col-span-5 flex flex-col gap-6">
        
        {/* MEASURABLE IMPACT TARGETS */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-5" role="region" aria-labelledby="impact-matrix-title">
          <h3 id="impact-matrix-title" className="text-md font-black uppercase tracking-tight text-white mb-1">
            📊 Measurable Impact Matrix
          </h3>
          <p className="text-[10px] text-zinc-300 font-mono mb-4 uppercase">PREDICTIVE TARGET OUTCOMES FOR ESTADIO AZTECA</p>

          <div className="space-y-4">
            <div className="bg-black/50 p-3.5 rounded border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-[#00FF41] uppercase block">CROWD CONGESTION</span>
                <span className="text-xs font-bold text-white uppercase block mt-0.5">Reduce Queue Waiting Time</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#00FF41] block">-40%</span>
                <span className="text-[8px] text-zinc-400 font-mono">PROACTIVE ROUTING</span>
              </div>
            </div>

            <div className="bg-black/50 p-3.5 rounded border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-amber-400 uppercase block">INCIDENT MANAGEMENT</span>
                <span className="text-xs font-bold text-white uppercase block mt-0.5">Improve Emergency Response</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-400 block">+25%</span>
                <span className="text-[8px] text-zinc-400 font-mono">AUTOMATED SOP DISPATCH</span>
              </div>
            </div>

            <div className="bg-black/50 p-3.5 rounded border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-teal-400 uppercase block">SUSTAINABLE LOGISTICS</span>
                <span className="text-xs font-bold text-white uppercase block mt-0.5">Minimize Concession Food Waste</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-teal-400 block">-30%</span>
                <span className="text-[8px] text-zinc-400 font-mono">DEMAND HEATMAPS</span>
              </div>
            </div>

            <div className="bg-black/50 p-3.5 rounded border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-purple-400 uppercase block">ACCESSIBILITY</span>
                <span className="text-xs font-bold text-white uppercase block mt-0.5">Accessibility In-Venue Coverage</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-purple-400 block">+100%</span>
                <span className="text-[8px] text-zinc-400 font-mono">REAL-TIME MOBILITY GUIDES</span>
              </div>
            </div>
          </div>
        </div>

        {/* INNOVATION HIGHLIGHTS */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-5" role="region" aria-labelledby="innovations-title">
          <h3 id="innovations-title" className="text-md font-black uppercase tracking-tight text-white mb-1">
            💡 Smart Venue Innovations
          </h3>
          <p className="text-[10px] text-zinc-300 font-mono mb-4 uppercase">NEXT-GEN SYSTEM CAPABILITIES</p>

          <div className="space-y-4 text-xs">
            <div className="flex gap-3">
              <div className="bg-zinc-800 w-6 h-6 rounded flex items-center justify-center font-bold text-[#00FF41] shrink-0 font-mono" aria-hidden="true">01</div>
              <div>
                <h4 className="font-bold uppercase text-white">Learns from Historical Matchdays</h4>
                <p className="text-zinc-300 text-[11px] mt-0.5">
                  BigQuery models track previous venue exits to learn queue dynamics based on weather, audience size, and gates status.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-zinc-800 w-6 h-6 rounded flex items-center justify-center font-bold text-[#00FF41] shrink-0 font-mono" aria-hidden="true">02</div>
              <div>
                <h4 className="font-bold uppercase text-white">Generates Personalized Fan Itineraries</h4>
                <p className="text-zinc-300 text-[11px] mt-0.5">
                  Connects specific ticket seating sectors with least congested gates, parking lots, and fastest public transport.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-zinc-800 w-6 h-6 rounded flex items-center justify-center font-bold text-[#00FF41] shrink-0 font-mono" aria-hidden="true">03</div>
              <div>
                <h4 className="font-bold uppercase text-white">Optimized Waste & Energy Grid</h4>
                <p className="text-zinc-300 text-[11px] mt-0.5">
                  Coordinates with Aztec Power Grid to trigger renewable feed reallocation, reducing peak traditional load demand by up to 15%.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* INNOVATOR QUOTE */}
        <div 
          className="bg-[#00FF41]/10 border border-[#00FF41]/30 p-4 rounded text-xs text-[#00FF41] font-mono leading-relaxed"
          role="blockquote"
        >
          <p className="font-bold mb-1">💎 GENUINE GenAI UTILIZATION:</p>
          Generative AI serves as a central venue orchestration layer. It handles dynamic incident summaries, multi-lingual spectator announcements, risk assessment, and volunteer action generation.
        </div>

      </div>

    </div>
  );
};
