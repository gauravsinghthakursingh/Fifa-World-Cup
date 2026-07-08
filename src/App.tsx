import React, { useState, useEffect, useRef } from 'react';
import { 
  Bus, 
  Train, 
  Sparkles, 
  Cloud, 
  Zap, 
  RefreshCw, 
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  RadialBarChart,
  RadialBar
} from 'recharts';

import { StadiumGrid } from './components/StadiumGrid';
import { Header } from './components/Header';
import { StadiumVariablesSimulator } from './components/StadiumVariablesSimulator';
import { IncidentFeed } from './components/IncidentFeed';
import { OpsDecisionConsole } from './components/OpsDecisionConsole';
import { KikaFanAssistant } from './components/KikaFanAssistant';
import { JudgesPitchDeck } from './components/JudgesPitchDeck';
import { AuthGate } from './components/AuthGate';
import { SideAuthPanel } from './components/SideAuthPanel';
import { AccessibilityAssist } from './components/AccessibilityAssist';
import { auth, logoutUser, onAuthStateChanged, User } from './firebase';

import { StadiumState, Incident, GateInfo, TransitInfo } from './types';
import { INITIAL_STADIUM_STATE, INITIAL_INCIDENTS, ATTENDANCE_HISTORY, LANGUAGES } from './data';

// Custom Glowing Tooltip for Recharts matching the Bold high-contrast green theme
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#050A1A] border-2 border-[#00FF41] px-2.5 py-1.5 text-[10px] font-mono rounded shadow-lg">
        <p className="text-zinc-400 uppercase tracking-wider font-bold">Time: {payload[0].payload.time}</p>
        <p className="text-[#00FF41] font-black mt-0.5">
          ATTENDANCE: {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function App() {
  // Authentication states
  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Auth persistence listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // App States
  const [stadiumState, setStadiumState] = useState<StadiumState>(INITIAL_STADIUM_STATE);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  
  // Interactive Custom Simulator Form Visibility
  const [showSimulator, setShowSimulator] = useState(false);
  
  // Responsive Fixed Right Sidebar Visibility for Mobile/Tablet
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Ops Command states
  const [opsCommand, setOpsCommand] = useState('');
  const [opsAnalyzing, setOpsAnalyzing] = useState(false);
  const [opsError, setOpsError] = useState('');
  const [opsResult, setOpsResult] = useState<{
    analysis: string;
    recommendedActions: { title: string; description: string; priority: 'Low' | 'Medium' | 'High' | 'Critical'; targetSector: string }[];
    mitigationSteps: string[];
  } | null>({
    analysis: 'Initial pre-match operations analysis complete. Systems nominal except for Gate B bottleneck. Recommending proactive volunteer deployment.',
    recommendedActions: [
      {
        title: 'Throttling Gate B Entrance',
        description: 'Slow down entry rate through Gate B and prompt arrivals to walk 150m East to Gate C.',
        priority: 'High',
        targetSector: 'Gate B'
      },
      {
        title: 'Activate Multilingual Signage',
        description: 'Update electronic displays around South Stand to flash bilingual (ES/EN) accessibility directions.',
        priority: 'Medium',
        targetSector: 'Sector 103-South'
      }
    ],
    mitigationSteps: [
      'Coordinate with Metro Police to dispatch extra safety barriers near Line 1 entrance.',
      'Broadcast real-time transit warnings via mobile App push notifications.'
    ]
  });
  
  // Fan Chat state managers
  const [fanMessage, setFanMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [fanChatHistory, setFanChatHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: '¡Hola! Hi! I am **Kika**, your FIFA World Cup 2026 Multilingual Virtual Host. How can I assist you with your matchday experience at Estadio Azteca today?' }
  ]);
  const [fanChatLoading, setFanChatLoading] = useState(false);

  // Tab switcher
  const [activeTab, setActiveTab] = useState<'console' | 'pitch'>('console');
  
  // Interactive Walkthrough Scenario Statuses
  const [demoStep, setDemoStep] = useState<number>(0);
  const [demoMessage, setDemoMessage] = useState<string>('');

  // Playback Automated Scenario Scripts for Hackathon Judges
  const triggerDemoScenario = async (step: number) => {
    setDemoStep(step);
    setActiveTab('console'); // Shift active window back to Live Operations view
    setOpsError('');

    if (step === 1) {
      // Step 1: Crowd Congestion & Proactive Rerouting
      setStadiumState(prev => ({
        ...prev,
        matchPhase: 'Gates Open',
        gates: prev.gates.map(g => g.name === 'Gate B' ? { ...g, density: 'Critical' } : g),
        transit: prev.transit.map(t => t.mode === 'Metro' ? { ...t, status: 'Crowded', delayMinutes: 25, description: 'Severe queueing at turnstiles.' } : t)
      }));
      setDemoMessage('SIMULATION: Gate B congestion is now CRITICAL. Metro latency increased to 25 mins.');
      
      const query = "Is Gate B too crowded to enter? Which gate is better right now?";
      setFanMessage(query);
      setSelectedLanguage('en');
      
      // Submit query automatically to showcase responsive translation
      setTimeout(() => {
        handleFanChatSubmit(undefined, query);
      }, 500);

    } else if (step === 2) {
      // Step 2: Dietary Concessions & Multi-language Support (Spanish)
      setSelectedLanguage('es');
      setDemoMessage('SIMULATION: Switching assistant Kika to Spanish mode to assist South Stand fan.');
      setSelectedSector('Sector 103-South');
      
      const query = "¿Dónde puedo encontrar comida vegetariana cerca de la Sección 103?";
      setFanMessage(query);
      
      setTimeout(() => {
        handleFanChatSubmit(undefined, query);
      }, 500);

    } else if (step === 3) {
      // Step 3: Real-Time Incident Reporting & Command Briefing
      const newIncident: Incident = {
        id: `demo-inc-${Date.now()}`,
        title: 'Spilled Liquid causing slip risk near Concourse C',
        category: 'Safety',
        severity: 'High',
        status: 'Active',
        location: 'Sector 102-East Gate C',
        timestamp: '14:21',
        reportedBy: 'Vision AI IoT Camera #14',
        description: 'Computer Vision feed detected minor hazard in heavy walking zone. Volunteer dispatcher needed.',
      };
      
      setIncidents(prev => [newIncident, ...prev]);
      setDemoMessage('SIMULATION: Vision AI IoT Camera #14 reported a Slip Risk at Sector 102-East.');
      
      const cmdPrompt = "Vision AI reported minor slip risk hazard near Sector 102-East. Plan dynamic cleaning volunteer reallocation and coordinate Gate C staff.";
      setOpsCommand(cmdPrompt);
      
      setTimeout(() => {
        setOpsAnalyzing(true);
        fetch('/api/gemini/ops-command', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command: cmdPrompt,
            stadiumState,
            incidents: [newIncident, ...incidents],
          }),
        })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setOpsError(data.error);
          } else {
            setOpsResult(data);
          }
          setOpsAnalyzing(false);
        })
        .catch(err => {
          console.error(err);
          setOpsError('Failed to retrieve automated response from command server.');
          setOpsAnalyzing(false);
        });
      }, 800);

    } else if (step === 4) {
      // Step 4: Post-Match Evacuation Plan
      setStadiumState(prev => ({
        ...prev,
        matchPhase: 'Post-Match',
        gates: prev.gates.map(g => g.name === 'Gate E' ? { ...g, density: 'High' } : g)
      }));
      setDemoMessage('SIMULATION: Match is over! Crowd evacuation of 81,450 fans initiated.');
      
      const cmdPrompt = "Match has concluded. Formulate the comprehensive Group Stage Post-Match evacuation flow, prioritizing accessible ramps and shuttle buses.";
      setOpsCommand(cmdPrompt);
      
      setTimeout(() => {
        setOpsAnalyzing(true);
        fetch('/api/gemini/ops-command', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command: cmdPrompt,
            stadiumState,
            incidents,
          }),
        })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setOpsError(data.error);
          } else {
            setOpsResult(data);
          }
          setOpsAnalyzing(false);
        })
        .catch(err => {
          console.error(err);
          setOpsError('Failed to retrieve evacuation routing advice.');
          setOpsAnalyzing(false);
        });
      }, 800);
    }
  };

  // Handle Sector/Gate Selection from Stadium Map
  const handleSelectSector = (sectorName: string, type: 'gate' | 'zone') => {
    setSelectedSector(sectorName);
    
    if (type === 'gate') {
      setOpsCommand(`Provide an optimized security checklist and emergency routing plan for ${sectorName}.`);
    } else {
      setFanMessage(`Where is the nearest food vendor and restroom close to ${sectorName}?`);
    }
  };

  // Submit Operations Command Directive to Gemini
  const handleOpsCommandSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!opsCommand.trim()) return;

    setOpsError('');
    setOpsAnalyzing(true);
    try {
      const res = await fetch('/api/gemini/ops-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: opsCommand,
          stadiumState,
          incidents,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOpsResult(data);
      } else {
        setOpsError(data.error || 'Operations Analysis aborted.');
      }
    } catch (err: any) {
      console.error(err);
      setOpsError('Failed to establish connection to Operations Command. Secure network check required.');
    } finally {
      setOpsAnalyzing(false);
    }
  };

  // Submit Fan Message to Multilingual Host Chatbot
  const handleFanChatSubmit = async (e?: React.FormEvent, directMessage?: string) => {
    if (e) e.preventDefault();
    const query = directMessage || fanMessage;
    if (!query.trim()) return;

    const userMsg = { role: 'user' as const, text: query };
    setFanChatHistory(prev => [...prev, userMsg]);
    setFanMessage('');
    setFanChatLoading(true);

    try {
      const res = await fetch('/api/gemini/fan-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'English',
          userSector: selectedSector || 'General Area',
          stadiumState,
          chatHistory: fanChatHistory,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFanChatHistory(prev => [...prev, { role: 'model', text: data.reply }]);
      } else {
        setFanChatHistory(prev => [...prev, { role: 'model', text: `⚠️ Assist Desk Blocked: ${data.error}` }]);
      }
    } catch (err) {
      console.error(err);
      setFanChatHistory(prev => [...prev, { role: 'model', text: '⚠️ Unable to connect to Kika host. Offline telemetry active.' }]);
    } finally {
      setFanChatLoading(false);
    }
  };

  // Add Incident callback
  const handleAddIncident = (
    title: string, 
    category: 'Crowd' | 'Safety' | 'Accessibility' | 'Infrastructure' | 'Medical', 
    severity: 'Low' | 'Medium' | 'High' | 'Critical', 
    location: string, 
    description: string
  ) => {
    const newInc: Incident = {
      id: `inc-${Date.now()}`,
      title,
      category,
      severity,
      status: 'Active',
      location,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reportedBy: 'Ops Dispatcher Hub',
      description,
    };

    setIncidents(prev => [newInc, ...prev]);
    setOpsCommand(`Analyze and generate immediate deployment plans for the new incident: "${title}" at ${location}. Check status of surrounding gates and transit latencies.`);
  };

  // State modifiers for sandbox simulator
  const handleUpdateMatchPhase = (phase: string) => {
    setStadiumState(prev => ({ ...prev, matchPhase: phase as any }));
  };

  const handleUpdateGateDensity = (index: number, density: string) => {
    const updatedGates = [...stadiumState.gates];
    updatedGates[index] = { ...updatedGates[index], density: density as any };
    setStadiumState(prev => ({ ...prev, gates: updatedGates }));
  };

  const handleUpdateTransitDelay = (index: number, minutes: number) => {
    const updatedTransit = [...stadiumState.transit];
    updatedTransit[index] = { ...updatedTransit[index], delayMinutes: minutes };
    setStadiumState(prev => ({ ...prev, transit: updatedTransit }));
  };

  const attendanceTrendData = [
    ...ATTENDANCE_HISTORY,
    { time: '14:30', attendance: stadiumState.attendance }
  ];

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#050A1A] flex flex-col items-center justify-center font-mono text-zinc-400">
        <div className="w-8 h-8 border-2 border-[#00FF41] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="uppercase text-xs tracking-widest text-[#00FF41]">Synchronizing System Security...</p>
      </div>
    );
  }

  return (
    <div id="applet-viewport" className="w-full min-h-screen bg-[#050A1A] text-white font-sans flex flex-col p-4 md:p-8 select-none overflow-x-hidden xl:pr-[380px] transition-all duration-300">
      
      {/* ACCESSIBILITY: SKIP LINK FOR SCREEN READERS */}
      <a 
        href="#stadiumos-main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 bg-[#00FF41] text-black px-4 py-2 font-black rounded border-2 border-black"
      >
        Skip to main content
      </a>

      {/* HEADER BRANDING MODULE */}
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen} 
      />

      {/* DEMO PLAYBACK NOTIFICATION RIBBON */}
      {demoMessage && (
        <div 
          className="mb-4 bg-[#00FF41]/10 border border-[#00FF41]/30 p-2.5 rounded text-xs text-[#00FF41] font-mono flex items-center justify-between animate-pulse"
          role="alert"
          aria-live="polite"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#00FF41]" aria-hidden="true" />
            {demoMessage}
          </span>
          <button 
            type="button"
            onClick={() => setDemoMessage('')} 
            className="text-zinc-400 hover:text-white focus:outline-none"
            aria-label="Dismiss sandbox notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* NAVIGATION TABS SELECTOR */}
      <nav 
        className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-6 bg-white/5 p-1.5 rounded-lg border border-white/10"
        aria-label="Workspace Tab Navigation"
      >
        <div className="flex gap-1.5" role="tablist">
          <button
            id="tab-console"
            role="tab"
            aria-selected={activeTab === 'console'}
            aria-controls="panel-console"
            tabIndex={0}
            onClick={() => setActiveTab('console')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-1 focus:ring-[#00FF41] ${
              activeTab === 'console'
                ? 'bg-[#00FF41] text-black shadow-lg shadow-[#00FF41]/20'
                : 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            🏟️ LIVE OPERATIONS CONSOLE
          </button>
          <button
            id="tab-pitch"
            role="tab"
            aria-selected={activeTab === 'pitch'}
            aria-controls="panel-pitch"
            tabIndex={0}
            onClick={() => setActiveTab('pitch')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-1 focus:ring-[#00FF41] ${
              activeTab === 'pitch'
                ? 'bg-[#00FF41] text-black shadow-lg shadow-[#00FF41]/20'
                : 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            🏆 JUDGES' PITCH & WALKTHROUGH
          </button>
        </div>
        
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-black/40 border border-white/5 rounded text-[10px] font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 bg-[#00FF41] rounded-full animate-pulse" aria-hidden="true"></span>
          FIFA 2026 Submission ID: #WC-STADIUMOS
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main id="stadiumos-main-content" className="flex-1 flex flex-col">
        {activeTab === 'console' ? (
          <div 
            id="panel-console"
            role="tabpanel"
            aria-labelledby="tab-console"
            className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-fadeIn"
          >
            {/* LEFT COLUMN: CRITICAL TELEMETRY & LIVE INCIDENTS */}
            <section id="column-operations" className="lg:col-span-4 flex flex-col gap-5">
              
              {/* TOURNAMENT CONTEXT & CONTROLS */}
              <div className="bg-white/5 p-4 border-l-4 border-[#00FF41] rounded-r-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">MATCHDAY STATS</span>
                  <span className="text-[10px] font-mono text-[#00FF41] bg-white/10 px-2 py-0.5 rounded font-bold uppercase">
                    {stadiumState.matchPhase}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-black/40 p-2.5 rounded border border-white/10" aria-label="Attendance statistics">
                    <p className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Attendance Progress</p>
                    <p className="text-xl font-black text-white">
                      {stadiumState.attendance.toLocaleString()}
                      <span className="text-xs text-zinc-500 font-normal"> / {stadiumState.capacity.toLocaleString()}</span>
                    </p>
                    <div className="w-full bg-zinc-800 h-1.5 rounded mt-1.5 overflow-hidden">
                      <div 
                        className="bg-[#00FF41] h-full" 
                        style={{ width: `${(stadiumState.attendance / stadiumState.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-black/40 p-2.5 rounded border border-white/10" aria-label="Environment metrics">
                    <p className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Weather Overlay</p>
                    <p className="text-xl font-black text-white flex items-center gap-1">
                      <Cloud className="w-4 h-4 text-zinc-400 inline" aria-hidden="true" />
                      {stadiumState.weather.temp}°C
                    </p>
                    <p className="text-[9px] text-zinc-400 uppercase font-mono mt-0.5">{stadiumState.weather.condition}</p>
                  </div>
                </div>

                {/* Live Attendance Trend Line Chart */}
                <div className="bg-black/50 border border-white/10 rounded p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-[#00FF41] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                      <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" /> 60-Min Inflow rate
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono">STABILIZED IoT FEED</span>
                  </div>
                  <div className="h-28 w-full" id="attendance-trend-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={attendanceTrendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00FF41" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#00FF41" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="time" 
                          stroke="#9ca3af" 
                          fontSize={8} 
                          tickLine={false} 
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#9ca3af" 
                          fontSize={8} 
                          tickLine={false} 
                          axisLine={false}
                          domain={[0, 90000]}
                          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="attendance" 
                          stroke="#00FF41" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorAttendance)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    id="toggle-simulator-btn"
                    onClick={() => setShowSimulator(!showSimulator)}
                    className="w-full py-1.5 px-3 bg-white/10 hover:bg-white/20 text-xs font-bold uppercase rounded border border-white/20 flex items-center justify-center gap-1.5 transition-all focus:outline-none focus:ring-1 focus:ring-[#00FF41]"
                    aria-expanded={showSimulator}
                    aria-controls="variable-simulator"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#00FF41]" aria-hidden="true" />
                    {showSimulator ? 'Close Live Controls' : 'Simulate Live Variables'}
                  </button>
                </div>
              </div>

              {/* SIMULATOR COMPONENT */}
              {showSimulator && (
                <StadiumVariablesSimulator
                  stadiumState={stadiumState}
                  onUpdateMatchPhase={handleUpdateMatchPhase}
                  onUpdateGateDensity={handleUpdateGateDensity}
                  onUpdateTransitDelay={handleUpdateTransitDelay}
                />
              )}

              {/* INCIDENT FEED MODULE */}
              <IncidentFeed
                incidents={incidents}
                onMarkResolved={(id) => setIncidents(prev => prev.filter(i => i.id !== id))}
                onGenerateSOP={(inc) => {
                  setOpsCommand(`Formulate an operational safety protocol for handling "${inc.title}" in ${inc.location}. Check gates, crowd densities, and volunteer deployment.`);
                  handleOpsCommandSubmit();
                }}
                onAddIncident={handleAddIncident}
              />
            </section>

            {/* CENTER COLUMN: MAP VISUALIZER & TACTICAL ANALYSIS */}
            <section id="column-visualizer" className="lg:col-span-5 flex flex-col gap-5">
              
              {/* STADIUM INTERACTIVE MAP */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex-1 flex flex-col justify-between">
                <StadiumGrid 
                  gates={stadiumState.gates}
                  selectedSector={selectedSector}
                  onSelectSector={handleSelectSector}
                  crowdLevel={stadiumState.gates.some(g => g.density === 'Critical') ? 'Critical' : 'High'}
                />
              </div>

              {/* TRANSIT STATUS OVERLAYS */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4" aria-label="Transit Feed Logs">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-300 mb-3 flex items-center gap-2">
                  <Bus className="w-4 h-4 text-[#00FF41]" aria-hidden="true" />
                  Tournament Transit Feeds
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {stadiumState.transit.map((tr) => (
                    <div key={tr.mode} className="bg-black/40 border border-white/5 p-2 rounded">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono font-black text-[#00FF41] flex items-center gap-1 uppercase">
                          {tr.mode === 'Metro' ? <Train className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" /> : <Bus className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />}
                          {tr.mode}
                        </span>
                        <span className={`px-1.5 py-0.2 text-[9px] font-bold uppercase rounded ${
                          tr.status === 'Normal' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                        }`}>
                          {tr.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-300 font-mono leading-tight">
                        {tr.delayMinutes > 0 ? `⚠️ Latency: ${tr.delayMinutes} mins.` : '✓ Flow operating optimally.'}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-1 italic leading-tight">{tr.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* OPERATIONS COMMAND DECISION CONSOLE */}
              <OpsDecisionConsole
                opsCommand={opsCommand}
                setOpsCommand={setOpsCommand}
                opsAnalyzing={opsAnalyzing}
                opsResult={opsResult}
                onSubmit={handleOpsCommandSubmit}
                errorMessage={opsError}
                clearError={() => setOpsError('')}
              />
            </section>

            {/* RIGHT COLUMN: KIKA SPECTATOR ASSISTANT */}
            <section id="column-chatbot" className="lg:col-span-3 flex flex-col gap-5">
              <KikaFanAssistant
                fanMessage={fanMessage}
                setFanMessage={setFanMessage}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                selectedSector={selectedSector}
                fanChatHistory={fanChatHistory}
                fanChatLoading={fanChatLoading}
                onSubmit={handleFanChatSubmit}
              />
            </section>
          </div>
        ) : (
          <div 
            id="panel-pitch"
            role="tabpanel"
            aria-labelledby="tab-pitch"
            className="flex-1 animate-fadeIn"
          >
            {/* PITCH PRESENTATION DECK */}
            <JudgesPitchDeck 
              triggerDemoScenario={triggerDemoScenario} 
              demoStep={demoStep} 
            />
          </div>
        )}
      </main>

      {/* FOOTER METADATA SECTION */}
      <footer 
        id="stadiumos-footer" 
        className="mt-6 flex flex-col md:flex-row justify-between items-center bg-white/5 py-3 px-6 rounded-lg gap-4"
        role="contentinfo"
      >
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-white/40 uppercase tracking-[0.2em]">VENUE / LOCATION</span>
            <span className="text-[11px] font-black uppercase text-[#00FF41]">Estadio Azteca / Mexico City</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-white/40 uppercase tracking-[0.2em]">MATCH PROFILE</span>
            <span className="text-[11px] font-black uppercase text-white">Group Stage / MEX v ITA (Match #22)</span>
          </div>
          <div className="flex items-center gap-3 bg-white/5 pl-3 pr-2 py-1 rounded border border-white/5">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-white/40 uppercase tracking-[0.2em]">SUSTAINABILITY INDEX</span>
              <span className="text-[11px] font-black text-white flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#00FF41]" aria-hidden="true" /> 89.4% Renewable Grid
              </span>
              <span className="text-[8px] text-zinc-500 font-mono">VS 10.6% PEAK LOAD DEMAND</span>
            </div>
            <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center p-0.5 border border-white/10" id="sustainability-radial-chart">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  innerRadius="40%" 
                  outerRadius="100%" 
                  barSize={3} 
                  data={[
                    { name: 'Traditional', value: 10.6, fill: '#ef4444' },
                    { name: 'Renewable', value: 89.4, fill: '#00FF41' }
                  ]}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    background={{ fill: 'rgba(255,255,255,0.05)' }}
                    dataKey="value"
                    cornerRadius={5}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase text-center md:text-right">
          System Status: <span className="text-[#00FF41] font-bold">Nominal</span> / Latency: 14ms / Secure GenAI Core
        </div>
      </footer>

      {/* PERSISTENT FIXED SECURITY SIDEBAR CONTAINER */}
      <aside 
        id="fixed-security-sidebar"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[380px] bg-[#070e1e]/98 backdrop-blur-md border-l border-white/10 flex flex-col shadow-2xl transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'
        }`}
        role="complementary"
        aria-label="Security Operator Panel"
      >
        {/* Header inside the sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse"></span>
            <span className="text-xs font-mono tracking-widest text-[#00FF41] font-black uppercase">SYSTEM GATEWAY</span>
          </div>
          {/* Close button - only visible on mobile/tablet screens since sidebar is permanently open on xl */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="xl:hidden text-zinc-400 hover:text-white p-1 hover:bg-white/10 rounded transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00FF41]"
            aria-label="Close sidebar"
          >
            <span className="text-sm font-bold uppercase font-mono mr-1">Close</span> ✕
          </button>
        </div>

        {/* Sidebar content scrollable */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          <SideAuthPanel 
            user={user} 
            onAuthenticated={(u) => setUser(u)} 
            onLogout={handleLogout} 
          />
          
          <AccessibilityAssist 
            stadiumState={stadiumState}
            incidents={incidents}
            activeTab={activeTab}
          />
          
          {/* Helpful Operations Checklist inside sidebar to make it rich, functional & easy to understand */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs leading-relaxed">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#00FF41] font-black mb-2 flex items-center gap-1.5">
              <span>📋 Operator Checklist / चेकलिस्ट</span>
            </h4>
            <ul className="space-y-1.5 text-zinc-300 font-mono text-[10px]">
              <li className="flex items-start gap-1.5">
                <span className="text-[#00FF41]">✓</span>
                <span>Active session: {user ? 'Verified / लॉग-इन है' : 'Guest Mode / गेस्ट मोड'}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#00FF41]">✓</span>
                <span>Google Auth: Live (Active)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#00FF41]">✓</span>
                <span>Language core: Spanish, English, Hindi</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Brand footer in sidebar */}
        <div className="p-4 border-t border-white/10 bg-black/40 text-center">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            STADIUMOS v2.4 // FIFA VENUE TECH
          </p>
        </div>
      </aside>

      {/* Backdrop for mobile/tablet when sidebar is open */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 xl:hidden transition-all duration-300"
          aria-hidden="true"
        ></div>
      )}

    </div>
  );
}
