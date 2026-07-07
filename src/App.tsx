import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  Send, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Bus, 
  Train, 
  Sparkles, 
  Volume2, 
  User, 
  Plus, 
  Cloud, 
  Zap, 
  RefreshCw, 
  Eye, 
  Compass, 
  Languages, 
  Globe, 
  HelpCircle,
  TrendingUp,
  Cpu,
  BookOpen,
  Server,
  Trophy,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { StadiumGrid } from './components/StadiumGrid';
import { StadiumState, Incident, GateInfo, TransitInfo } from './types';

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

// Supported assistance languages
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇲🇽' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

const INITIAL_STADIUM_STATE: StadiumState = {
  stadiumName: 'Estadio Azteca',
  city: 'Mexico City',
  capacity: 87523,
  attendance: 81450,
  matchPhase: 'First Half',
  weather: {
    temp: 24,
    condition: 'Sunny',
  },
  gates: [
    { name: 'Gate A', status: 'Open', density: 'Medium', transitConnector: 'North Parking' },
    { name: 'Gate B', status: 'Open', density: 'Critical', transitConnector: 'Metro Station Line 1' },
    { name: 'Gate C', status: 'Open', density: 'High', transitConnector: 'Bus Shuttle Hub North' },
    { name: 'Gate D', status: 'Open', density: 'Low', transitConnector: 'Rideshare Zone East' },
    { name: 'Gate E', status: 'Open', density: 'Low', transitConnector: 'South Parking' },
    { name: 'Gate F', status: 'Restricted', density: 'High', transitConnector: 'Metro Station Line 2' },
    { name: 'Gate G', status: 'Open', density: 'Medium', transitConnector: 'Bus Shuttle Hub South' },
    { name: 'Gate H', status: 'Closed', density: 'Critical', transitConnector: 'VIP / Media Lot' },
  ],
  transit: [
    { mode: 'Metro', status: 'Crowded', delayMinutes: 12, description: 'Line 1 station access is throttled due to platform crowding.' },
    { mode: 'Bus Shuttle', status: 'Normal', delayMinutes: 0, description: 'Dedicated lanes operational. Shuttles running every 3 minutes.' },
    { mode: 'Rideshare', status: 'Delayed', delayMinutes: 20, description: 'High congestion on East Ring Road causing pickup delays.' },
    { mode: 'Parking Express', status: 'Normal', delayMinutes: 0, description: 'North & South express lots currently at 78% capacity.' },
  ],
};

const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-1',
    title: 'Platform Congestion at Gate B',
    category: 'Crowd',
    severity: 'High',
    status: 'Active',
    location: 'Gate B Outflow',
    timestamp: '14:10',
    reportedBy: 'Sector Manager North',
    description: 'High pressure of outgoing spectators colliding with incoming spectators near Metro entrance. High congestion.',
    aiPlan: 'Redirect outgoing spectator traffic to Gate C (Bus Shuttle Hub) immediately. Use PA system announcement in Zone 4.'
  },
  {
    id: 'inc-2',
    title: 'Wheelchair Elevator Inoperable',
    category: 'Accessibility',
    severity: 'Medium',
    status: 'Mitigating',
    location: 'Sector 103-South',
    timestamp: '13:55',
    reportedBy: 'Volunteer Unit 12',
    description: 'Elevator 3 is stuck on Level 2. Two wheelchair-bound fans require escort to field level access paths.',
    aiPlan: 'Deploy Volunteer Assistance Squad to escort visitors through Ramp 2C. Technician has been dispatched.'
  }
];

export default function App() {
  // Live time
  const [timeStr, setTimeStr] = useState('14:20:45');
  
  // App States
  const [stadiumState, setStadiumState] = useState<StadiumState>(INITIAL_STADIUM_STATE);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  
  // Interactive Custom Simulator Form
  const [showSimulator, setShowSimulator] = useState(false);
  
  // Ops Command Input
  const [opsCommand, setOpsCommand] = useState('');
  const [opsAnalyzing, setOpsAnalyzing] = useState(false);
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
  
  // Fan Chat Input
  const [fanMessage, setFanMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [fanChatHistory, setFanChatHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: '¡Hola! Hi! I am **Kika**, your FIFA World Cup 2026 Multilingual Virtual Host. How can I assist you with your matchday experience at Estadio Azteca today?' }
  ]);
  const [fanChatLoading, setFanChatLoading] = useState(false);

  // New Incident Creator State
  const [newIncTitle, setNewIncTitle] = useState('');
  const [newIncCategory, setNewIncCategory] = useState<'Crowd' | 'Safety' | 'Accessibility' | 'Infrastructure' | 'Medical'>('Crowd');
  const [newIncSeverity, setNewIncSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [newIncLocation, setNewIncLocation] = useState('');
  const [newIncDesc, setNewIncDesc] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState<'console' | 'pitch'>('console');
  
  // Interactive Demo Scenario Walkthrough States
  const [demoStep, setDemoStep] = useState<number>(0);
  const [demoMessage, setDemoMessage] = useState<string>('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Playback Automated Scenarios for Judges
  const triggerDemoScenario = async (step: number) => {
    setDemoStep(step);
    setActiveTab('console'); // Move back to main view so they can see it live

    if (step === 1) {
      // Step 1: Crowd Congestion & Proactive Rerouting
      setStadiumState(prev => ({
        ...prev,
        matchPhase: 'Gates Open',
        gates: prev.gates.map(g => g.name === 'Gate B' ? { ...g, density: 'Critical' } : g),
        transit: prev.transit.map(t => t.mode === 'Metro' ? { ...t, status: 'Crowded', delayMinutes: 25, description: 'Severe queueing at turnstiles.' } : t)
      }));
      setDemoMessage('SIMULATION: Gate B congestion is now CRITICAL. Metro latency increased to 25 mins.');
      
      // Auto populate Fan Chat with appropriate query
      const query = "Is Gate B too crowded to enter? Which gate is better right now?";
      setFanMessage(query);
      setSelectedLanguage('en');
      
      // Submit fan query automatically to showcase GenAI
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
      
      // Prompt operations AI command
      const cmdPrompt = "Vision AI reported minor slip risk hazard near Sector 102-East. Plan dynamic cleaning volunteer reallocation and coordinate Gate C staff.";
      setOpsCommand(cmdPrompt);
      
      setTimeout(() => {
        // Trigger command submit
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
          setOpsResult(data);
          setOpsAnalyzing(false);
        })
        .catch(err => {
          console.error(err);
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
          setOpsResult(data);
          setOpsAnalyzing(false);
        })
        .catch(err => {
          console.error(err);
          setOpsAnalyzing(false);
        });
      }, 800);
    }
  };

  // Sync Live clock
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom of fan chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [fanChatHistory]);

  // Handle Sector/Gate Selection from Stadium Map
  const handleSelectSector = (sectorName: string, type: 'gate' | 'zone') => {
    setSelectedSector(sectorName);
    
    // Automatically pre-fill operations or chat context
    if (type === 'gate') {
      setOpsCommand(`Provide an optimized security checklist and emergency routing plan for ${sectorName}.`);
    } else {
      // Suggesting standard query in chat
      setFanMessage(`Where is the nearest food vendor and restroom close to ${sectorName}?`);
    }
  };

  // Submit Operations Directive to Gemini
  const handleOpsCommandSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!opsCommand.trim()) return;

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
        alert(`Error from GenAI Operations server: ${data.error}`);
      }
    } catch (err: any) {
      console.error(err);
      alert('Failed to connect to Operations AI Engine.');
    } finally {
      setOpsAnalyzing(false);
    }
  };

  // Submit Fan Message to Multilingual Kika Chatbot
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
        setFanChatHistory(prev => [...prev, { role: 'model', text: `⚠️ Assist Desk Error: ${data.error}` }]);
      }
    } catch (err) {
      console.error(err);
      setFanChatHistory(prev => [...prev, { role: 'model', text: '⚠️ Unable to connect to Kika host. Please check connection.' }]);
    } finally {
      setFanChatLoading(false);
    }
  };

  // Simulate logging a new incident manually
  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncTitle || !newIncDesc) return;

    const newIncident: Incident = {
      id: `inc-${Date.now()}`,
      title: newIncTitle,
      category: newIncCategory,
      severity: newIncSeverity,
      status: 'Active',
      location: newIncLocation || 'Unspecified Sector',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reportedBy: 'Manual Trigger Console',
      description: newIncDesc,
    };

    setIncidents(prev => [newIncident, ...prev]);
    
    // Auto populate command window to advise on the new issue
    setOpsCommand(`Analyze and generate immediate deployment plans for the new incident: "${newIncTitle}" at ${newIncident.location}.`);
    
    // Reset fields
    setNewIncTitle('');
    setNewIncLocation('');
    setNewIncDesc('');
    setShowSimulator(false);
  };

  // Modify Gate and Transit parameter in state
  const handleUpdateGateStatus = (index: number, key: keyof GateInfo, value: any) => {
    const updatedGates = [...stadiumState.gates];
    updatedGates[index] = { ...updatedGates[index], [key]: value };
    setStadiumState(prev => ({ ...prev, gates: updatedGates }));
  };

  const handleUpdateTransitStatus = (index: number, key: keyof TransitInfo, value: any) => {
    const updatedTransit = [...stadiumState.transit];
    updatedTransit[index] = { ...updatedTransit[index], [key]: value };
    setStadiumState(prev => ({ ...prev, transit: updatedTransit }));
  };

  // Helper colors for Severity
  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-600 text-white border border-red-700 animate-pulse';
      case 'High':
        return 'bg-orange-500 text-black border border-orange-600';
      case 'Medium':
        return 'bg-yellow-500 text-black border border-yellow-600';
      case 'Low':
      default:
        return 'bg-blue-600 text-white border border-blue-700';
    }
  };

  const attendanceHistory = [
    { time: '13:30', attendance: 25000 },
    { time: '13:45', attendance: 48000 },
    { time: '14:00', attendance: 68500 },
    { time: '14:15', attendance: 76200 },
    { time: '14:30', attendance: stadiumState.attendance },
  ];

  return (
    <div id="applet-viewport" className="w-full min-h-screen bg-[#050A1A] text-white font-sans flex flex-col p-4 md:p-8 select-none overflow-x-hidden">
      
      {/* HEADER SECTION - BOLD TYPOGRAPHY STYLE */}
      <header id="stadiumos-header" className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b border-white/20 pb-4 gap-4">
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
          <p className="text-zinc-400 font-mono text-xs tracking-tight uppercase mt-1">
            GenAI Operational intelligence & Multilingual Fan Support Core
          </p>
        </div>

        {/* Realtime Stats / System Telemetry */}
        <div className="flex flex-wrap items-center gap-4 text-right">
          <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-left hidden sm:block">
            <p className="text-[10px] font-bold text-[#00FF41] uppercase tracking-wider">Operational Target</p>
            <p className="text-sm font-bold">Estadio Azteca</p>
          </div>
          
          <div className="bg-[#00FF41] text-black px-3 py-2 font-black text-xs uppercase tracking-widest rounded-lg flex items-center gap-1.5 shadow-lg shadow-[#00FF41]/20">
            <span className="w-2 h-2 bg-black rounded-full animate-ping"></span>
            AI COMMAND CENTRE ACTIVE
          </div>

          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
            <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Mexico City Time</p>
            <p className="text-2xl font-mono leading-none tracking-tight font-black text-white">
              {timeStr} <span className="text-white/40 text-xs">UTC-5</span>
            </p>
          </div>
        </div>
      </header>

      {/* Simulation / Walkthrough Alert Bar if active */}
      {demoMessage && (
        <div className="mb-4 bg-[#00FF41]/10 border border-[#00FF41]/30 p-2.5 rounded text-xs text-[#00FF41] font-mono flex items-center justify-between animate-pulse">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#00FF41]" />
            {demoMessage}
          </span>
          <button 
            onClick={() => setDemoMessage('')} 
            className="text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* TABS SWITCHER FOR JUDGES */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-6 bg-white/5 p-1.5 rounded-lg border border-white/10">
        <div className="flex gap-1.5">
          <button
            id="tab-console"
            onClick={() => setActiveTab('console')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeTab === 'console'
                ? 'bg-[#00FF41] text-black shadow-lg shadow-[#00FF41]/20'
                : 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            🏟️ LIVE OPERATIONS CONSOLE
          </button>
          <button
            id="tab-pitch"
            onClick={() => setActiveTab('pitch')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeTab === 'pitch'
                ? 'bg-[#00FF41] text-black shadow-lg shadow-[#00FF41]/20'
                : 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            🏆 JUDGES' PITCH & WALKTHROUGH
          </button>
        </div>
        
        {/* Pitch Statement Tag */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-black/40 border border-white/5 rounded text-[10px] font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 bg-[#00FF41] rounded-full animate-pulse"></span>
          FIFA 2026 Pitch Submission ID: #WC-STADIUMOS
        </div>
      </div>

      {activeTab === 'console' ? (
        <div id="stadiumos-workspace" className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: CRITICAL TELEMETRY & LIVE INCIDENT LOG (4-COLS) */}
        <section id="column-operations" className="lg:col-span-4 flex flex-col gap-5">
          
          {/* TOURNAMENT CONTEXT & CONTROLS */}
          <div className="bg-white/5 p-4 border-l-4 border-[#00FF41] rounded-r-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-white/50">MATCHDAY STATS</span>
              <span className="text-[10px] font-mono text-[#00FF41] bg-white/10 px-2 py-0.5 rounded uppercase">
                {stadiumState.matchPhase}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-black/40 p-2.5 rounded border border-white/10">
                <p className="text-[9px] uppercase tracking-wider text-zinc-400">Stadium Attendance</p>
                <p className="text-2xl font-black text-white">
                  {stadiumState.attendance.toLocaleString()}
                  <span className="text-xs text-zinc-500 font-normal"> / {stadiumState.capacity.toLocaleString()}</span>
                </p>
                <div className="w-full bg-zinc-800 h-1 rounded mt-1.5 overflow-hidden">
                  <div 
                    className="bg-[#00FF41] h-full" 
                    style={{ width: `${(stadiumState.attendance / stadiumState.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-black/40 p-2.5 rounded border border-white/10">
                <p className="text-[9px] uppercase tracking-wider text-zinc-400">Weather Overlay</p>
                <p className="text-2xl font-black text-white flex items-center gap-1">
                  <Cloud className="w-5 h-5 text-zinc-400 inline" />
                  {stadiumState.weather.temp}°C
                </p>
                <p className="text-[10px] text-zinc-400 uppercase font-mono">{stadiumState.weather.condition}</p>
              </div>
            </div>

            {/* Live Attendance Trend Line Chart */}
            <div className="bg-black/50 border border-white/10 rounded p-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-[#00FF41] uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> 60-Min Inflow Rate Trend
                </span>
                <span className="text-[9px] text-zinc-500 font-mono">LIVE METRICS</span>
              </div>
              <div className="h-28 w-full" id="attendance-trend-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00FF41" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00FF41" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      stroke="#4b5563" 
                      fontSize={8} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#4b5563" 
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
                className="w-full py-1.5 px-3 bg-white/10 hover:bg-white/20 text-xs font-bold uppercase rounded border border-white/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#00FF41]" />
                {showSimulator ? 'Close Live Controls' : 'Simulate Live Variables'}
              </button>
            </div>
          </div>

          {/* SIMULATOR DRAWER (IF OPENED) */}
          {showSimulator && (
            <div id="variable-simulator" className="bg-[#08122A] p-4 rounded-lg border-2 border-[#00FF41] animate-fadeIn">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-black uppercase text-[#00FF41] tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Live Stadium State Simulator
                </h3>
                <span className="text-[9px] bg-red-950/50 text-red-400 px-1.5 py-0.5 border border-red-900 rounded font-mono">
                  Sandbox Console
                </span>
              </div>

              {/* Adjust Match Phase */}
              <div className="mb-3">
                <label className="block text-[10px] text-zinc-400 uppercase font-mono mb-1">Match Phase</label>
                <select 
                  value={stadiumState.matchPhase}
                  onChange={(e) => setStadiumState(prev => ({ ...prev, matchPhase: e.target.value as any }))}
                  className="w-full bg-black/60 border border-white/20 rounded p-1.5 text-xs text-white uppercase font-mono focus:border-[#00FF41] focus:outline-none"
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
              <div className="mb-3">
                <label className="block text-[10px] text-zinc-400 uppercase font-mono mb-1">Gate Bottleneck Control</label>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  {stadiumState.gates.map((gate, idx) => (
                    <div key={gate.name} className="flex items-center justify-between bg-black/40 p-1 rounded border border-white/10">
                      <span className="font-mono text-zinc-300 font-bold">{gate.name}</span>
                      <select 
                        value={gate.density} 
                        onChange={(e) => handleUpdateGateStatus(idx, 'density', e.target.value)}
                        className="bg-zinc-900 text-white font-mono text-[9px] border-none focus:outline-none"
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
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase font-mono mb-1">Transit Latency Adjusters</label>
                <div className="space-y-1.5 text-[10px]">
                  {stadiumState.transit.map((trans, idx) => (
                    <div key={trans.mode} className="flex items-center justify-between bg-black/40 p-1.5 rounded border border-white/10">
                      <span className="font-mono text-zinc-300 font-bold">{trans.mode}</span>
                      <div className="flex items-center gap-1">
                        <input 
                          type="number" 
                          value={trans.delayMinutes}
                          onChange={(e) => handleUpdateTransitStatus(idx, 'delayMinutes', parseInt(e.target.value) || 0)}
                          className="w-10 bg-zinc-950 text-white border border-white/20 text-center text-[10px] py-0.5"
                          min="0"
                        />
                        <span className="text-zinc-500">min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE OPERATIONAL INCIDENTS TRACKER */}
          <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col min-h-[300px]">
            <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <h2 className="text-sm font-black uppercase tracking-wider">Live Incident Feed</h2>
              </div>
              <span className="text-[10px] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-900/60 font-bold animate-pulse">
                {incidents.filter(i => i.status === 'Active').length} Active
              </span>
            </div>

            {/* Simulated Action: Trigger incident template quickly */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <button 
                onClick={() => {
                  setNewIncTitle('Power Outage Food Zone');
                  setNewIncCategory('Infrastructure');
                  setNewIncSeverity('High');
                  setNewIncLocation('East Stand Food Plaza');
                  setNewIncDesc('Minor electrical breaker failure has put out digital checkout panels at three major kiosks.');
                  setShowSimulator(false);
                  // Open form block
                  const form = document.getElementById('incident-creation-form');
                  if (form) form.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[9px] bg-white/10 hover:bg-white/15 px-2 py-1 rounded text-zinc-300 transition-all font-mono"
              >
                ⚡ Trigger Outage Alert
              </button>
              <button 
                onClick={() => {
                  setNewIncTitle('Dehydration Sector 103');
                  setNewIncCategory('Medical');
                  setNewIncSeverity('Medium');
                  setNewIncLocation('Sector 103-South');
                  setNewIncDesc('Elderly fan displaying early symptoms of heat exhaustion. Volunteer requested to carry ice pack and hydration drinks.');
                  setShowSimulator(false);
                  const form = document.getElementById('incident-creation-form');
                  if (form) form.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[9px] bg-white/10 hover:bg-white/15 px-2 py-1 rounded text-zinc-300 transition-all font-mono"
              >
                🩺 Medical Alert
              </button>
            </div>

            {/* List of Incidents */}
            <div className="flex-1 overflow-y-auto space-y-3 max-h-[360px] pr-1">
              {incidents.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 py-8">
                  <CheckCircle2 className="w-8 h-8 text-[#00FF41] mb-2" />
                  <p className="text-xs uppercase font-bold">Zero Incidents Active</p>
                  <p className="text-[10px] text-zinc-600 mt-1">Excellent operations metrics</p>
                </div>
              ) : (
                incidents.map((inc) => (
                  <div key={inc.id} className="bg-black/50 border border-white/10 p-3 rounded hover:border-white/20 transition-all">
                    <div className="flex justify-between items-start gap-1 mb-1.5">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${getSeverityBadge(inc.severity)}`}>
                        {inc.severity}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-500">{inc.timestamp}</span>
                    </div>

                    <h3 className="text-xs font-black uppercase text-white tracking-tight">{inc.title}</h3>
                    <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                      <MapPin className="w-3 h-3 text-[#00FF41] inline mr-1" />
                      <strong className="text-zinc-300">{inc.location}</strong> – {inc.description}
                    </p>

                    {/* Show AI Actionable advice block directly from layout */}
                    {inc.aiPlan ? (
                      <div className="mt-2 bg-[#00FF41]/5 border border-[#00FF41]/20 p-2 rounded text-[10px] text-[#00FF41] font-mono">
                        <strong className="uppercase">GenAI Mitigation Plan:</strong> {inc.aiPlan}
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          setOpsCommand(`Formulate an operational safety protocol for handling "${inc.title}" in ${inc.location}. Check gates, crowd densities, and volunteer deployment.`);
                          handleOpsCommandSubmit();
                        }}
                        className="mt-2 text-[9px] text-[#00FF41] hover:underline font-mono uppercase flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-[#00FF41]" />
                        Generate Specific SOP via AI
                      </button>
                    )}

                    {/* Manual Incident Resolve Button */}
                    <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center">
                      <span className="text-[9px] text-zinc-500 font-mono">By: {inc.reportedBy}</span>
                      <button 
                        onClick={() => setIncidents(prev => prev.filter(i => i.id !== inc.id))}
                        className="text-[9px] text-zinc-400 hover:text-emerald-400 font-mono uppercase transition-all"
                      >
                        ✓ Mark Resolved
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* CREATOR LOG FORM IN PANEL */}
            <div id="incident-creation-form" className="mt-4 pt-3 border-t border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Log Custom Incident</p>
              <form onSubmit={handleCreateIncident} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Incident Name" 
                    value={newIncTitle}
                    onChange={(e) => setNewIncTitle(e.target.value)}
                    className="bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-[#00FF41] focus:outline-none"
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="Location / Zone" 
                    value={newIncLocation}
                    onChange={(e) => setNewIncLocation(e.target.value)}
                    className="bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-[#00FF41] focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select 
                    value={newIncCategory}
                    onChange={(e) => setNewIncCategory(e.target.value as any)}
                    className="bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-[#00FF41] focus:outline-none font-mono"
                  >
                    <option value="Crowd">Crowd</option>
                    <option value="Safety">Safety</option>
                    <option value="Accessibility">Accessibility</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Medical">Medical</option>
                  </select>

                  <select 
                    value={newIncSeverity}
                    onChange={(e) => setNewIncSeverity(e.target.value as any)}
                    className="bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-[#00FF41] focus:outline-none font-mono"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <textarea 
                  placeholder="Detailed description..."
                  value={newIncDesc}
                  onChange={(e) => setNewIncDesc(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-white h-12 focus:border-[#00FF41] focus:outline-none"
                  required
                />

                <button 
                  type="submit"
                  className="w-full py-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-[10px] uppercase tracking-widest rounded flex items-center justify-center gap-1 border border-white/10"
                >
                  <Plus className="w-3.5 h-3.5" /> Dispatch Alert
                </button>
              </form>
            </div>

          </div>
        </section>

        {/* CENTER COLUMN: INTERACTIVE VISUALIZER MAP & OPERATIONS COMMAND DECISION SUPPORT (5-COLS) */}
        <section id="column-visualizer" className="lg:col-span-5 flex flex-col gap-5">
          
          {/* MAP VISUALIZER */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex-1 flex flex-col justify-between">
            <StadiumGrid 
              gates={stadiumState.gates}
              selectedSector={selectedSector}
              onSelectSector={handleSelectSector}
              crowdLevel={stadiumState.gates.some(g => g.density === 'Critical') ? 'Critical' : 'High'}
            />
          </div>

          {/* TRANSIT STATUS OVERLAY */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
              <Bus className="w-4 h-4 text-[#00FF41]" />
              Tournament Transit Feeds
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {stadiumState.transit.map((tr) => (
                <div key={tr.mode} className="bg-black/40 border border-white/5 p-2 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono font-black text-[#00FF41] flex items-center gap-1 uppercase">
                      {tr.mode === 'Metro' ? <Train className="w-3.5 h-3.5 text-zinc-400" /> : <Bus className="w-3.5 h-3.5 text-zinc-400" />}
                      {tr.mode}
                    </span>
                    <span className={`px-1.5 py-0.2 text-[9px] font-bold uppercase rounded ${
                      tr.status === 'Normal' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                    }`}>
                      {tr.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-mono leading-tight">
                    {tr.delayMinutes > 0 ? `⚠️ Delay: ${tr.delayMinutes} mins latency.` : '✓ Flow operating optimally.'}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1 italic">{tr.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* GENAI OPERATIONS COMMAND DECISION ENGINE */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#00FF41]" />
              <h2 className="text-sm font-black uppercase tracking-wider">operations command center prompt</h2>
            </div>

            <p className="text-xs text-zinc-400 mb-3">
              Prompt the <strong>StadiumOS AI Decision Engine</strong> to run tactical simulations, gate evacuations, traffic flow routing, or multilingual signage deployment checklists.
            </p>

            <form onSubmit={handleOpsCommandSubmit} className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="Ex: 'Evacuation protocol for North Stand' or 'How to handle Gate B congestion'"
                value={opsCommand}
                onChange={(e) => setOpsCommand(e.target.value)}
                className="flex-1 bg-black/60 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00FF41] focus:outline-none"
              />
              <button 
                type="submit"
                disabled={opsAnalyzing || !opsCommand.trim()}
                className="bg-[#00FF41] hover:bg-[#00e037] text-black font-black uppercase text-xs px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {opsAnalyzing ? 'ANALYST WORKING...' : 'ANALYZE'}
                <Zap className="w-4 h-4" />
              </button>
            </form>

            {/* AI DECISION ENGINE OUTPUT */}
            {opsResult && (
              <div className="bg-white/5 border-l-4 border-[#00FF41] p-4 rounded-r-lg animate-fadeIn">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono text-[#00FF41] uppercase tracking-widest font-black">
                    StadiumOS Tactical Output
                  </span>
                  <span className="text-[9px] bg-[#00FF41]/10 text-[#00FF41] px-1.5 py-0.5 rounded font-mono">
                    Model: gemini-3.5-flash
                  </span>
                </div>

                {/* Analytical text block */}
                <p className="text-xs leading-relaxed text-zinc-300 font-sans mb-3">
                  {opsResult.analysis}
                </p>

                {/* Tactical recommendations breakdown */}
                {opsResult.recommendedActions && opsResult.recommendedActions.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[10px] font-bold text-white uppercase tracking-wider mb-2">Recommended Actions</p>
                    <div className="space-y-2">
                      {opsResult.recommendedActions.map((act, index) => (
                        <div key={index} className="bg-black/40 border border-white/10 p-2.5 rounded">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-black text-xs text-[#00FF41] uppercase">{act.title}</span>
                            <span className={`text-[9px] uppercase px-1.5 rounded font-mono ${
                              act.priority === 'Critical' ? 'bg-red-950 text-red-400' :
                              act.priority === 'High' ? 'bg-orange-950 text-orange-400' :
                              act.priority === 'Medium' ? 'bg-yellow-950 text-yellow-400' :
                              'bg-zinc-800 text-zinc-400'
                            }`}>
                              {act.priority}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-normal">{act.description}</p>
                          <div className="mt-1 text-[9px] text-zinc-500 font-mono uppercase">
                            Target Sector: {act.targetSector}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action steps checklist */}
                {opsResult.mitigationSteps && opsResult.mitigationSteps.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-wider mb-2">Operational Mitigation SOP Checklist</p>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {opsResult.mitigationSteps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 font-mono">
                          <span className="text-[#00FF41] text-xs">■</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

        </section>

        {/* RIGHT COLUMN: MULTILINGUAL FAN ASSISTANT "KIKA" CHATPORTAL (3-COLS) */}
        <section id="column-fanchat" className="lg:col-span-3 flex flex-col gap-4">
          
          <div className="bg-white text-black p-4 rounded-lg flex flex-col justify-between h-full min-h-[500px]">
            <div>
              <div className="flex justify-between items-center border-b border-zinc-200 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-zinc-900" />
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-tight">Kika Fan Host</h2>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">FIFA Multilingual desk</p>
                  </div>
                </div>
                
                {/* Language quick switcher */}
                <div className="relative group">
                  <select 
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold font-mono px-2 py-1 rounded border border-zinc-200 focus:outline-none flex items-center cursor-pointer"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Chat Message Window */}
              <div className="space-y-3 h-[360px] overflow-y-auto pr-1 text-xs border border-zinc-100 p-2 rounded bg-zinc-50 flex flex-col">
                {fanChatHistory.map((historyItem, idx) => (
                  <div 
                    key={idx} 
                    className={`p-2.5 rounded-lg max-w-[90%] leading-relaxed ${
                      historyItem.role === 'user' 
                        ? 'bg-zinc-900 text-white self-end rounded-br-none' 
                        : 'bg-zinc-200 text-zinc-800 self-start rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-1 opacity-60 text-[9px] font-mono">
                      {historyItem.role === 'user' ? <User className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                      <span>{historyItem.role === 'user' ? 'Spectator' : 'Kika Host'}</span>
                    </div>
                    {/* Render markdown style strong words nicely */}
                    <div className="whitespace-pre-wrap font-sans">
                      {historyItem.text.split('**').map((chunk, i) => i % 2 === 1 ? <strong key={i} className="font-black text-black">{chunk}</strong> : chunk)}
                    </div>
                  </div>
                ))}
                
                {fanChatLoading && (
                  <div className="bg-zinc-200 text-zinc-800 p-2.5 rounded-lg max-w-[80%] self-start rounded-bl-none animate-pulse">
                    <p className="text-[10px] font-mono italic text-zinc-600 flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-zinc-600"></span>
                      </span>
                      Kika is translating & compiling query...
                    </p>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Quick action buttons based on coordinates */}
            <div className="mt-2 space-y-1">
              <p className="text-[9px] uppercase font-mono tracking-widest text-zinc-400">Quick fan queries:</p>
              <div className="grid grid-cols-2 gap-1.5">
                <button 
                  onClick={() => handleFanChatSubmit(undefined, "Where can I find vegetarian or halal food concession options around here?")}
                  className="bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 p-1.5 rounded text-[10px] text-left font-sans transition-all leading-tight font-medium"
                >
                  🥗 Find Halal/Veg food
                </button>
                <button 
                  onClick={() => handleFanChatSubmit(undefined, "Is there an accessibility ramp or lift near my seating sector?")}
                  className="bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 p-1.5 rounded text-[10px] text-left font-sans transition-all leading-tight font-medium"
                >
                  ♿ Accessibility paths
                </button>
                <button 
                  onClick={() => handleFanChatSubmit(undefined, "What is the best way to exit towards the Metro station? Is it crowded?")}
                  className="bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 p-1.5 rounded text-[10px] text-left font-sans transition-all leading-tight font-medium"
                >
                  🚇 Best route to Metro
                </button>
                <button 
                  onClick={() => handleFanChatSubmit(undefined, "Where is the lost and found or official tournament merchandise store?")}
                  className="bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 p-1.5 rounded text-[10px] text-left font-sans transition-all leading-tight font-medium"
                >
                  👕 Merch & Stores
                </button>
              </div>
            </div>

            {/* Input Submission Bar */}
            <form onSubmit={handleFanChatSubmit} className="mt-3 flex gap-1.5 border-t border-zinc-200 pt-3">
              <input 
                type="text" 
                placeholder="Ask Kika about gates, food, transit..."
                value={fanMessage}
                onChange={(e) => setFanMessage(e.target.value)}
                className="flex-1 bg-zinc-100 border border-zinc-200 rounded px-2.5 py-1.5 text-xs text-black focus:border-zinc-900 focus:outline-none"
              />
              <button 
                type="submit"
                disabled={fanChatLoading || !fanMessage.trim()}
                className="bg-zinc-900 hover:bg-black text-white px-3 py-1.5 rounded font-black text-xs uppercase flex items-center gap-1 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </section>

      </div>
      ) : (
        <div id="stadiumos-pitchdeck" className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PRESENTATION COLLATERAL (7 COLS) */}
          <div className="xl:col-span-7 flex flex-col gap-6">
            
            {/* HERO HOOK STATEMENT CARD */}
            <div className="bg-gradient-to-br from-[#050A1A] to-zinc-950 p-6 rounded-lg border-2 border-[#00FF41] relative overflow-hidden shadow-2xl shadow-[#00FF41]/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#00FF41]/10 rounded-full blur-2xl"></div>
              <span className="bg-[#00FF41] text-black px-2 py-0.5 text-[9px] font-black tracking-widest rounded uppercase">
                FIFA WORLD CUP 2026 / STADIUMOS PITCH
              </span>
              <p className="text-lg md:text-xl font-black uppercase tracking-tight text-white mt-4 leading-snug">
                "Our platform transforms stadium operations from reactive to predictive by combining Generative AI, real-time sensor intelligence, and operational analytics to deliver safer, smarter, and more sustainable FIFA World Cup experiences."
              </p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                <Trophy className="w-3.5 h-3.5 text-[#00FF41]" />
                <span>PITCH JURY IMPACT HOOK</span>
                <span>•</span>
                <span className="text-[#00FF41] font-bold">ESTADIO AZTECA TARGET DEPLOYMENT</span>
              </div>
            </div>

            {/* DEMO SCENARIOS PANEL - HIGHLY INTERACTIVE */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-5">
              <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                <div>
                  <h3 className="text-md font-black uppercase tracking-tight">🎮 Live Sandbox Walkthrough</h3>
                  <p className="text-[10px] text-zinc-400 font-mono">STEP-BY-STEP SIMULATION DECK FOR FIFA JUDGES</p>
                </div>
                <span className="text-[9px] font-mono text-[#00FF41] bg-[#00FF41]/10 px-2.5 py-0.5 rounded border border-[#00FF41]/20 animate-pulse">
                  CLICK STEPS TO AUTOMATE & PLAYBACK LIVE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* STEP 1 */}
                <div 
                  onClick={() => triggerDemoScenario(1)}
                  className={`p-4 rounded border cursor-pointer transition-all ${
                    demoStep === 1 
                      ? 'bg-[#00FF41]/10 border-[#00FF41] shadow-lg shadow-[#00FF41]/5' 
                      : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-black/60'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="bg-white/10 text-white text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">STEP 01</span>
                    {demoStep === 1 && <span className="text-[#00FF41] text-xs font-bold font-mono">ACTIVE SCENARIO</span>}
                  </div>
                  <h4 className="text-xs font-bold uppercase mt-2 text-[#00FF41]">1. Crowd Congestion Pre-detection</h4>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
                    AI predicts congestion at Gate B 30 minutes in advance. Redirection triggers guide arrivals to Gate C.
                  </p>
                  <button className="mt-3 text-[10px] font-mono font-bold text-white uppercase bg-white/10 hover:bg-[#00FF41] hover:text-black px-2.5 py-1 rounded transition-all flex items-center gap-1">
                    Run Simulation Step <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* STEP 2 */}
                <div 
                  onClick={() => triggerDemoScenario(2)}
                  className={`p-4 rounded border cursor-pointer transition-all ${
                    demoStep === 2 
                      ? 'bg-[#00FF41]/10 border-[#00FF41] shadow-lg shadow-[#00FF41]/5' 
                      : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-black/60'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="bg-white/10 text-white text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">STEP 02</span>
                    {demoStep === 2 && <span className="text-[#00FF41] text-xs font-bold font-mono">ACTIVE SCENARIO</span>}
                  </div>
                  <h4 className="text-xs font-bold uppercase mt-2 text-[#00FF41]">2. Dietary Concession & Language</h4>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
                    Assisting fans with diet queries in Spanish/English, pinpointing vegetarian stalls nearest to selected seating.
                  </p>
                  <button className="mt-3 text-[10px] font-mono font-bold text-white uppercase bg-white/10 hover:bg-[#00FF41] hover:text-black px-2.5 py-1 rounded transition-all flex items-center gap-1">
                    Run Simulation Step <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* STEP 3 */}
                <div 
                  onClick={() => triggerDemoScenario(3)}
                  className={`p-4 rounded border cursor-pointer transition-all ${
                    demoStep === 3 
                      ? 'bg-[#00FF41]/10 border-[#00FF41] shadow-lg shadow-[#00FF41]/5' 
                      : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-black/60'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="bg-white/10 text-white text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">STEP 03</span>
                    {demoStep === 3 && <span className="text-[#00FF41] text-xs font-bold font-mono">ACTIVE SCENARIO</span>}
                  </div>
                  <h4 className="text-xs font-bold uppercase mt-2 text-[#00FF41]">3. AI Incident Mitigation & SOP</h4>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
                    Vision AI detects concourse slip risk. Commands generate real-time staff actions & volunteer allocation plans.
                  </p>
                  <button className="mt-3 text-[10px] font-mono font-bold text-white uppercase bg-white/10 hover:bg-[#00FF41] hover:text-black px-2.5 py-1 rounded transition-all flex items-center gap-1">
                    Run Simulation Step <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* STEP 4 */}
                <div 
                  onClick={() => triggerDemoScenario(4)}
                  className={`p-4 rounded border cursor-pointer transition-all ${
                    demoStep === 4 
                      ? 'bg-[#00FF41]/10 border-[#00FF41] shadow-lg shadow-[#00FF41]/5' 
                      : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-black/60'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="bg-white/10 text-white text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">STEP 04</span>
                    {demoStep === 4 && <span className="text-[#00FF41] text-xs font-bold font-mono">ACTIVE SCENARIO</span>}
                  </div>
                  <h4 className="text-xs font-bold uppercase mt-2 text-[#00FF41]">4. Post-Match Smart Egress</h4>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
                    Triggers Post-Match egress. Prepares transport warnings & live maps routing for wheelchair-bound priority.
                  </p>
                  <button className="mt-3 text-[10px] font-mono font-bold text-white uppercase bg-white/10 hover:bg-[#00FF41] hover:text-black px-2.5 py-1 rounded transition-all flex items-center gap-1">
                    Run Simulation Step <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* STRATEGIC ARCHITECTURE BLUEPRINT MAP */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-5">
              <h3 className="text-md font-black uppercase tracking-tight mb-1">🏗️ Robust Google Cloud Ecosystem Architecture</h3>
              <p className="text-[10px] text-zinc-400 font-mono mb-4 uppercase">PRODUCTION-READY TECH STACK INTEGRATION</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <div className="bg-black/40 border border-white/10 p-3 rounded flex flex-col items-center">
                  <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold font-mono text-xs mb-1.5 border border-blue-500/20">GEMINI</div>
                  <span className="text-[10px] font-bold uppercase text-white">Google Gemini</span>
                  <span className="text-[8px] text-zinc-500 mt-1 font-mono">Multilingual & Action Engine</span>
                </div>
                <div className="bg-black/40 border border-white/10 p-3 rounded flex flex-col items-center">
                  <div className="w-8 h-8 rounded bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold font-mono text-xs mb-1.5 border border-teal-500/20">VERTEX</div>
                  <span className="text-[10px] font-bold uppercase text-white">Vertex AI</span>
                  <span className="text-[8px] text-zinc-500 mt-1 font-mono">Crowd Predictive Models</span>
                </div>
                <div className="bg-black/40 border border-white/10 p-3 rounded flex flex-col items-center">
                  <div className="w-8 h-8 rounded bg-orange-500/10 flex items-center justify-center text-orange-400 font-bold font-mono text-xs mb-1.5 border border-orange-500/20">FIREBASE</div>
                  <span className="text-[10px] font-bold uppercase text-white">Firebase Sync</span>
                  <span className="text-[8px] text-zinc-500 mt-1 font-mono">Real-Time Telemetry Store</span>
                </div>
                <div className="bg-black/40 border border-white/10 p-3 rounded flex flex-col items-center">
                  <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold font-mono text-xs mb-1.5 border border-purple-500/20">BIGQUERY</div>
                  <span className="text-[10px] font-bold uppercase text-white">BigQuery</span>
                  <span className="text-[8px] text-zinc-500 mt-1 font-mono">Matchday Analytics Store</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center mt-3">
                <div className="bg-black/40 border border-white/10 p-3 rounded flex flex-col items-center">
                  <div className="w-8 h-8 rounded bg-[#00FF41]/10 flex items-center justify-center text-[#00FF41] font-bold font-mono text-xs mb-1.5 border border-[#00FF41]/20">MAPS</div>
                  <span className="text-[10px] font-bold uppercase text-white">Maps API</span>
                  <span className="text-[8px] text-zinc-500 mt-1 font-mono">Transit & Routing Layers</span>
                </div>
                <div className="bg-black/40 border border-white/10 p-3 rounded flex flex-col items-center">
                  <div className="w-8 h-8 rounded bg-yellow-500/10 flex items-center justify-center text-yellow-400 font-bold font-mono text-xs mb-1.5 border border-yellow-500/20">VISION</div>
                  <span className="text-[10px] font-bold uppercase text-white">Vision AI</span>
                  <span className="text-[8px] text-zinc-500 mt-1 font-mono">Concourse Camera Density</span>
                </div>
                <div className="bg-black/40 border border-white/10 p-3 rounded flex flex-col items-center">
                  <div className="w-8 h-8 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold font-mono text-xs mb-1.5 border border-indigo-500/20">IoT</div>
                  <span className="text-[10px] font-bold uppercase text-white">IoT Sensors</span>
                  <span className="text-[8px] text-zinc-500 mt-1 font-mono">Live Turnstile RFID Feed</span>
                </div>
                <div className="bg-black/40 border border-white/10 p-3 rounded flex flex-col items-center">
                  <div className="w-8 h-8 rounded bg-[#ef4444]/10 flex items-center justify-center text-[#ef4444] font-bold font-mono text-xs mb-1.5 border border-[#ef4444]/20">RAG</div>
                  <span className="text-[10px] font-bold uppercase text-white">FIFA RAG KB</span>
                  <span className="text-[8px] text-zinc-500 mt-1 font-mono">Event Guidelines Library</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT PRESENTATION COLLATERAL (5 COLS) */}
          <div className="xl:col-span-5 flex flex-col gap-6">
            
            {/* MEASURABLE IMPACT TARGETS */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-5">
              <h3 className="text-md font-black uppercase tracking-tight mb-1">📊 Measurable Impact Matrix</h3>
              <p className="text-[10px] text-zinc-400 font-mono mb-4 uppercase">PREDICTIVE TARGET OUTCOMES FOR ESTADIO AZTECA</p>

              <div className="space-y-4">
                <div className="bg-black/50 p-3.5 rounded border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-[#00FF41] uppercase block">CROWD CONGESTION</span>
                    <span className="text-xs font-bold text-white uppercase block mt-0.5">Reduce Queue Waiting Time</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#00FF41] block">-40%</span>
                    <span className="text-[8px] text-zinc-500 font-mono">PROACTIVE ROUTING</span>
                  </div>
                </div>

                <div className="bg-black/50 p-3.5 rounded border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-amber-400 uppercase block">INCIDENT MANAGEMENT</span>
                    <span className="text-xs font-bold text-white uppercase block mt-0.5">Improve Emergency Response</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-400 block">+25%</span>
                    <span className="text-[8px] text-zinc-500 font-mono">AUTOMATED SOP DISPATCH</span>
                  </div>
                </div>

                <div className="bg-black/50 p-3.5 rounded border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-teal-400 uppercase block">SUSTAINABLE LOGISTICS</span>
                    <span className="text-xs font-bold text-white uppercase block mt-0.5">Minimize Concession Food Waste</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-teal-400 block">-30%</span>
                    <span className="text-[8px] text-zinc-500 font-mono">DEMAND HEATMAPS</span>
                  </div>
                </div>

                <div className="bg-black/50 p-3.5 rounded border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-purple-400 uppercase block">ACCESSIBILITY</span>
                    <span className="text-xs font-bold text-white uppercase block mt-0.5">Accessibility In-Venue Coverage</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-purple-400 block">+100%</span>
                    <span className="text-[8px] text-zinc-500 font-mono">REAL-TIME MOBILITY GUIDES</span>
                  </div>
                </div>
              </div>
            </div>

            {/* INNOVATION HIGHLIGHTS */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-5">
              <h3 className="text-md font-black uppercase tracking-tight mb-1">💡 Smart Venue Innovations</h3>
              <p className="text-[10px] text-zinc-400 font-mono mb-4 uppercase">NEXT-GEN SYSTEM CAPABILITIES</p>

              <div className="space-y-4 text-xs">
                <div className="flex gap-3">
                  <div className="bg-zinc-800 w-6 h-6 rounded flex items-center justify-center font-bold text-[#00FF41] shrink-0 font-mono">01</div>
                  <div>
                    <h4 className="font-bold uppercase text-white">Learns from Historical Matchdays</h4>
                    <p className="text-zinc-400 text-[11px] mt-0.5">BigQuery models track previous venue exits to learn queue dynamics based on weather, audience size, and gates status.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-zinc-800 w-6 h-6 rounded flex items-center justify-center font-bold text-[#00FF41] shrink-0 font-mono">02</div>
                  <div>
                    <h4 className="font-bold uppercase text-white">Generates Personalized Fan Itineraries</h4>
                    <p className="text-zinc-400 text-[11px] mt-0.5">Connects specific ticket seating sectors with least congested gates, parking lots, and fastest public transport.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-zinc-800 w-6 h-6 rounded flex items-center justify-center font-bold text-[#00FF41] shrink-0 font-mono">03</div>
                  <div>
                    <h4 className="font-bold uppercase text-white">Optimized Waste & Energy Grid</h4>
                    <p className="text-zinc-400 text-[11px] mt-0.5">Coordinates with Aztec Power Grid to trigger renewable feed reallocation, reducing peak traditional load demand by up to 15%.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* INNOVATOR QUOTE */}
            <div className="bg-[#00FF41]/10 border border-[#00FF41]/30 p-4 rounded text-xs text-[#00FF41] font-mono leading-relaxed">
              <p className="font-bold mb-1">💎 GENUINE GenAI UTILIZATION:</p>
              Generative AI serves as a central venue orchestration layer. It handles dynamic incident summaries, multi-lingual spectator announcements, risk assessment, and volunteer action generation.
            </div>

          </div>

        </div>
      )}

      {/* FOOTER METADATA - BOLD TYPOGRAPHY STYLE */}
      <footer id="stadiumos-footer" className="mt-6 flex flex-col md:flex-row justify-between items-center bg-white/5 py-3 px-6 rounded-lg gap-4">
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
                <Zap className="w-3.5 h-3.5 text-[#00FF41]" /> 89.4% Renewable Grid
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

    </div>
  );
}
