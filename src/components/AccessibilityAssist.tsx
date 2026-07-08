import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Keyboard, Play } from 'lucide-react';
import { StadiumState, Incident } from '../types';

interface AccessibilityAssistProps {
  stadiumState: StadiumState;
  incidents: Incident[];
  activeTab: string;
}

export const AccessibilityAssist: React.FC<AccessibilityAssistProps> = ({ 
  stadiumState, 
  incidents, 
  activeTab 
}) => {
  const [isVoiceOn, setIsVoiceOn] = useState(() => {
    return localStorage.getItem('accessibility_voice_narrator') === 'true';
  });
  const [voiceRate, setVoiceRate] = useState(1.0);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const lastActiveTabRef = useRef(activeTab);
  const lastIncidentCountRef = useRef(incidents.length);

  // Persistence
  useEffect(() => {
    localStorage.setItem('accessibility_voice_narrator', String(isVoiceOn));
  }, [isVoiceOn]);

  // Speech helper
  const speakText = (text: string) => {
    if (!isVoiceOn) return;
    try {
      // Cancel any ongoing speech to avoid overlaps
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceRate;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech synthesis failed:", e);
    }
  };

  // Announce tab changes automatically
  useEffect(() => {
    if (activeTab !== lastActiveTabRef.current) {
      const msg = `Switched to ${activeTab === 'console' ? 'Live Operations Console' : 'FIFA Presentation Pitch Deck'}.`;
      setLiveAnnouncement(msg);
      speakText(msg);
      lastActiveTabRef.current = activeTab;
    }
  }, [activeTab]);

  // Announce new security/incident alerts automatically
  useEffect(() => {
    if (incidents.length > lastIncidentCountRef.current) {
      const newIncident = incidents[0]; // newest are prepended or added
      if (newIncident) {
        const msg = `ALERT! New active incident reported: ${newIncident.title} in ${newIncident.location}. Severity: ${newIncident.severity}.`;
        setLiveAnnouncement(msg);
        speakText(msg);
      }
    }
    lastIncidentCountRef.current = incidents.length;
  }, [incidents]);

  // Keyboard shortcut listeners (Alt + Key commands)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + H: Hear quick overview
      if (e.altKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        narrateFullStatus();
      }
      // Alt + V: Toggle voice narrator
      if (e.altKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        const nextState = !isVoiceOn;
        setIsVoiceOn(nextState);
        setTimeout(() => {
          try {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(nextState ? "Voice reader activated." : "Voice reader deactivated.");
            window.speechSynthesis.speak(u);
          } catch (err) {}
        }, 100);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVoiceOn, stadiumState, incidents]);

  // Narrate entire system status aloud
  const narrateFullStatus = () => {
    const openGatesCount = stadiumState.gates.filter(g => g.status === 'Open').length;
    const closedGatesCount = stadiumState.gates.filter(g => g.status === 'Closed').length;
    const activeIncidents = incidents.filter(i => i.status !== 'Resolved').length;
    const crowdLevel = stadiumState.gates.some(g => g.density === 'Critical') ? 'Critical' : 'High';

    const speechText = `
      Azteca Stadium Command Summary. 
      Overall Crowd Level is ${crowdLevel}.
      Current match phase is ${stadiumState.matchPhase}.
      There are ${stadiumState.gates.length} gates total. ${openGatesCount} gates are open, and ${closedGatesCount} gates are closed.
      There are ${activeIncidents} active stadium security incidents needing attention.
      Local CDMX Bus and Train transit flow consists of ${stadiumState.transit.length} networks, with several reports updated.
    `;
    
    setLiveAnnouncement(speechText);
    
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = voiceRate;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div 
      id="accessibility-companion"
      className="bg-zinc-950/80 border border-[#00FF41]/30 rounded-xl p-4 flex flex-col gap-3 shadow-xl relative overflow-hidden"
      role="region"
      aria-label="Voice & Audio Accessibility Companion"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#00FF41] flex items-center gap-1.5">
          <Volume2 className="w-4 h-4 text-[#00FF41]" aria-hidden="true" />
          <span>Accessibility Guard / बोलता हुआ सहायक</span>
        </h3>
        <span className="text-[9px] font-mono text-[#00FF41] bg-[#00FF41]/10 border border-[#00FF41]/20 px-2 py-0.5 rounded uppercase font-bold">
          AUDIO ACTIVE
        </span>
      </div>

      <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
        <strong>Aapki Suvidha ke liye:</strong> Yeh screen reader aur voice assistant hai. Blind or visually impaired logon ke liye audio status, screen readout updates aur quick shortcuts provide karta hai.
      </p>

      {/* Main control toggles */}
      <div className="grid grid-cols-2 gap-2">
        {/* On/Off Switch */}
        <button
          onClick={() => {
            const next = !isVoiceOn;
            setIsVoiceOn(next);
            if (next) {
              setTimeout(() => {
                try {
                  window.speechSynthesis.cancel();
                  const u = new SpeechSynthesisUtterance("Voice reader enabled.");
                  window.speechSynthesis.speak(u);
                } catch (e) {}
              }, 50);
            } else {
              window.speechSynthesis.cancel();
            }
          }}
          className={`px-3 py-2 rounded-lg border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00FF41] ${
            isVoiceOn 
              ? 'bg-emerald-950/60 border-emerald-500/50 text-[#00FF41]' 
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
          aria-label={isVoiceOn ? "Disable voice assistant" : "Enable voice assistant"}
          aria-pressed={isVoiceOn}
        >
          {isVoiceOn ? <Volume2 className="w-4 h-4 text-[#00FF41]" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          <span>{isVoiceOn ? "Voice: ON" : "Voice: OFF"}</span>
        </button>

        {/* Read current live summary button */}
        <button
          onClick={narrateFullStatus}
          className="px-3 py-2 rounded-lg bg-[#00FF41] hover:bg-[#00e037] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer focus:outline-none focus:ring-1 focus:ring-white"
          title="Narrate entire stadium state in audio"
          aria-label="Narrate Live Stadium Status aloud"
        >
          <Play className="w-3.5 h-3.5 fill-black" aria-hidden="true" />
          <span>Read Report / रिपोर्ट सुनें</span>
        </button>
      </div>

      {/* Speed Controls */}
      {isVoiceOn && (
        <div className="bg-black/30 p-2 rounded-lg border border-white/5 flex items-center justify-between text-[11px]">
          <span className="text-zinc-400 font-mono">Narrator Speed (गति):</span>
          <div className="flex gap-1.5">
            {[0.8, 1.0, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => {
                  setVoiceRate(speed);
                  if (isVoiceOn) {
                    try {
                      window.speechSynthesis.cancel();
                      const u = new SpeechSynthesisUtterance(`Speed ${speed}x`);
                      u.rate = speed;
                      window.speechSynthesis.speak(u);
                    } catch(err){}
                  }
                }}
                className={`px-2 py-0.5 rounded font-mono text-[10px] border cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00FF41] ${
                  voiceRate === speed 
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                    : 'bg-black/40 border-white/5 text-zinc-500 hover:text-zinc-300'
                }`}
                aria-label={`Set speed to ${speed} times`}
                aria-pressed={voiceRate === speed}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Reference */}
      <div className="bg-black/50 border border-white/10 rounded-lg p-3 text-[11px] leading-relaxed">
        <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#00FF41] font-black mb-1.5 flex items-center gap-1.5">
          <Keyboard className="w-3.5 h-3.5 text-[#00FF41]" aria-hidden="true" />
          <span>Keyboard Shortcuts (कीबोर्ड शॉर्टकट)</span>
        </h4>
        <ul className="space-y-1 text-zinc-300 font-mono text-[10px]">
          <li className="flex items-center justify-between">
            <span className="text-zinc-500">Read Out Status Report:</span>
            <kbd className="bg-zinc-800 text-white px-1.5 py-0.5 rounded text-[9px] border border-zinc-700">Alt + H</kbd>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-zinc-500">Toggle Voice ON/OFF:</span>
            <kbd className="bg-zinc-800 text-white px-1.5 py-0.5 rounded text-[9px] border border-zinc-700">Alt + V</kbd>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-zinc-500">Skip to Main Dashboard:</span>
            <kbd className="bg-zinc-800 text-white px-1.5 py-0.5 rounded text-[9px] border border-zinc-700">Alt + 1</kbd>
          </li>
        </ul>
      </div>

      {/* Invisible live-region screen reader announcer */}
      <div 
        id="aural-announcement-region" 
        className="sr-only" 
        role="status" 
        aria-live="assertive"
      >
        {liveAnnouncement}
      </div>
    </div>
  );
};
