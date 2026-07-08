import React, { useRef, useEffect } from 'react';
import { Send, Sparkles, Languages, Globe } from 'lucide-react';
import { LANGUAGES } from '../data';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface KikaFanAssistantProps {
  fanMessage: string;
  setFanMessage: (msg: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  selectedSector: string | null;
  fanChatHistory: ChatMessage[];
  fanChatLoading: boolean;
  onSubmit: (e?: React.FormEvent, directMessage?: string) => void;
}

export const KikaFanAssistant: React.FC<KikaFanAssistantProps> = ({
  fanMessage,
  setFanMessage,
  selectedLanguage,
  setSelectedLanguage,
  selectedSector,
  fanChatHistory,
  fanChatLoading,
  onSubmit,
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat history securely on new replies
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [fanChatHistory, fanChatLoading]);

  // Clean suggestion query tags to prevent injection in recommendation cards
  const handleSuggestionClick = (suggestion: string) => {
    onSubmit(undefined, suggestion);
  };

  return (
    <div 
      className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col h-[520px]"
      role="region"
      aria-labelledby="fan-assistant-heading"
    >
      <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#00FF41]" aria-hidden="true" />
          <h2 id="fan-assistant-heading" className="text-sm font-black uppercase tracking-wider text-white">Multilingual Spectator Support</h2>
        </div>
        <span className="text-[10px] font-mono text-zinc-400 font-bold bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/20 px-2.5 py-0.5 rounded uppercase">
          AI Host: Kika 2026
        </span>
      </div>

      {/* Language Selector Toggles */}
      <div className="mb-3">
        <label htmlFor="language-select-toggle" className="block text-[10px] text-zinc-400 uppercase font-mono mb-1.5 font-bold">
          <Languages className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" /> Change Assist Language
        </label>
        <div className="flex flex-wrap gap-1" id="language-select-toggle">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setSelectedLanguage(lang.code)}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-[#00FF41] ${
                selectedLanguage === lang.code
                  ? 'bg-[#00FF41] text-black border border-[#00FF41]'
                  : 'bg-black/40 text-zinc-300 hover:text-white border border-white/10'
              }`}
              aria-label={`Select language: ${lang.name}`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Seat Location Reminder */}
      <div className="mb-3 px-3 py-1.5 bg-black/40 rounded border border-white/5 text-[11px] flex justify-between items-center text-zinc-300">
        <span>📍 Virtual Seating Location Context:</span>
        <span className="font-bold text-white uppercase bg-white/5 px-2 py-0.5 rounded border border-white/10">
          {selectedSector || 'General Entrance'}
        </span>
      </div>

      {/* Conversation Thread History */}
      <div 
        className="flex-1 overflow-y-auto space-y-3 mb-3 bg-black/20 p-3 rounded-lg border border-white/15 max-h-[250px]"
        role="log"
        aria-label="Kika chat dialogue thread"
      >
        {fanChatHistory.map((msg, index) => (
          <div 
            key={index} 
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className={`text-[9px] font-mono mb-0.5 text-zinc-400 font-bold`}>
              {msg.role === 'user' ? 'FOOTBALL SPECTATOR' : 'KIKA (FIFA HOST)'}
            </div>
            <div className={`p-2.5 rounded-lg text-xs leading-relaxed max-w-[85%] font-sans ${
              msg.role === 'user' 
                ? 'bg-[#00FF41]/15 text-[#00FF41] border border-[#00FF41]/30 rounded-tr-none' 
                : 'bg-zinc-800 text-white border border-zinc-700 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {fanChatLoading && (
          <div className="flex flex-col items-start" role="status" aria-label="Kika is thinking">
            <span className="text-[9px] font-mono text-zinc-400 font-bold mb-0.5">KIKA IS TRANSLATING...</span>
            <div className="p-2.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs rounded-tl-none border border-zinc-700 animate-pulse">
              Generating contextual reply...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion tags if last response had them */}
      {fanChatHistory.length > 0 && !fanChatLoading && (
        <div className="mb-3">
          <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5 font-bold">Suggested Questions:</p>
          <div className="flex flex-wrap gap-1.5">
            <button 
              type="button"
              onClick={() => handleSuggestionClick("Where is the nearest medical aid station?")}
              className="text-[9px] bg-white/5 hover:bg-white/15 text-zinc-300 px-2 py-1 rounded transition-all font-mono border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#00FF41]"
            >
              🩺 Nearest Medical Station?
            </button>
            <button 
              type="button"
              onClick={() => handleSuggestionClick("How do I request wheelchair assistance ramp access?")}
              className="text-[9px] bg-white/5 hover:bg-white/15 text-zinc-300 px-2 py-1 rounded transition-all font-mono border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#00FF41]"
            >
              ♿ Wheelchair Assistance?
            </button>
            <button 
              type="button"
              onClick={() => handleSuggestionClick("What bus shuttles take me to North Mexico CDMX parking?")}
              className="text-[9px] bg-white/5 hover:bg-white/15 text-zinc-300 px-2 py-1 rounded transition-all font-mono border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#00FF41]"
            >
              🚌 CDMX Shuttle Bus Routes?
            </button>
          </div>
        </div>
      )}

      {/* Direct Input Send Box */}
      <form onSubmit={(e) => onSubmit(e)} className="flex gap-2">
        <label htmlFor="fan-message-input" className="sr-only">Query message for Kika assistant</label>
        <input 
          id="fan-message-input"
          type="text" 
          placeholder="Ask Kika: 'Where are vegetarian tacos?' or 'Is Metro Line 1 delayed?'"
          value={fanMessage}
          onChange={(e) => setFanMessage(e.target.value)}
          className="flex-1 bg-black/60 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00FF41] focus:outline-none focus:ring-1 focus:ring-[#00FF41]"
          disabled={fanChatLoading}
        />
        <button 
          type="submit"
          disabled={fanChatLoading || !fanMessage.trim()}
          className="bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white rounded-lg p-2 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00FF41]"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
};
