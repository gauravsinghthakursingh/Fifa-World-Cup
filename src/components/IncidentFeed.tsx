import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, MapPin, Plus } from 'lucide-react';
import { Incident } from '../types';

interface IncidentFeedProps {
  incidents: Incident[];
  onMarkResolved: (id: string) => void;
  onGenerateSOP: (incident: Incident) => void;
  onAddIncident: (title: string, category: 'Crowd' | 'Safety' | 'Accessibility' | 'Infrastructure' | 'Medical', severity: 'Low' | 'Medium' | 'High' | 'Critical', location: string, description: string) => void;
}

export const IncidentFeed: React.FC<IncidentFeedProps> = ({
  incidents,
  onMarkResolved,
  onGenerateSOP,
  onAddIncident,
}) => {
  // Local form states
  const [newIncTitle, setNewIncTitle] = useState('');
  const [newIncCategory, setNewIncCategory] = useState<'Crowd' | 'Safety' | 'Accessibility' | 'Infrastructure' | 'Medical'>('Crowd');
  const [newIncSeverity, setNewIncSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [newIncLocation, setNewIncLocation] = useState('');
  const [newIncDesc, setNewIncDesc] = useState('');

  const [formError, setFormError] = useState('');

  // Severity style helper
  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-600 text-white border border-red-700 animate-pulse font-bold';
      case 'High':
        return 'bg-orange-500 text-black border border-orange-600 font-bold';
      case 'Medium':
        return 'bg-yellow-500 text-black border border-yellow-600 font-bold';
      case 'Low':
      default:
        return 'bg-blue-600 text-white border border-blue-700 font-bold';
    }
  };

  const loadTemplate = (title: string, category: any, severity: any, location: string, desc: string) => {
    setNewIncTitle(title);
    setNewIncCategory(category);
    setNewIncSeverity(severity);
    setNewIncLocation(location);
    setNewIncDesc(desc);
    setFormError('');

    // Smooth scroll to formulation form for ease of access
    const formElement = document.getElementById('incident-creation-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncTitle.trim() || !newIncDesc.trim() || !newIncLocation.trim()) {
      setFormError('Please fill out all incident details (Title, Location, and Description) before dispatching.');
      return;
    }
    setFormError('');
    onAddIncident(newIncTitle, newIncCategory, newIncSeverity, newIncLocation, newIncDesc);

    // Reset fields
    setNewIncTitle('');
    setNewIncLocation('');
    setNewIncDesc('');
  };

  return (
    <div 
      className="flex-1 bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col min-h-[300px]"
      role="region"
      aria-labelledby="incident-feed-heading"
    >
      <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-500" aria-hidden="true" />
          <h2 id="incident-feed-heading" className="text-sm font-black uppercase tracking-wider text-white">Live Incident Feed</h2>
        </div>
        <span 
          className="text-[10px] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-900/60 font-bold"
          role="status"
        >
          {incidents.length} Reported Incidents
        </span>
      </div>

      {/* Trigger Templates */}
      <div className="mb-3" role="group" aria-label="Incident quick template triggers">
        <p className="text-[10px] uppercase font-mono text-zinc-400 mb-1.5 font-bold">Quick Templates</p>
        <div className="flex flex-wrap gap-1.5">
          <button 
            type="button"
            onClick={() => loadTemplate(
              'Power Outage Food Zone', 
              'Infrastructure', 
              'High', 
              'East Stand Food Plaza', 
              'Minor electrical breaker failure has put out digital checkout panels at three major kiosks.'
            )}
            className="text-[9px] bg-white/10 hover:bg-white/15 px-2 py-1 rounded text-zinc-300 transition-all font-mono border border-white/5 focus:outline-none focus:ring-1 focus:ring-[#00FF41]"
          >
            ⚡ Outage Alert
          </button>
          <button 
            type="button"
            onClick={() => loadTemplate(
              'Dehydration Sector 103', 
              'Medical', 
              'Medium', 
              'Sector 103-South', 
              'Elderly fan displaying early symptoms of heat exhaustion. Volunteer requested to carry ice pack and hydration drinks.'
            )}
            className="text-[9px] bg-white/10 hover:bg-white/15 px-2 py-1 rounded text-zinc-300 transition-all font-mono border border-white/5 focus:outline-none focus:ring-1 focus:ring-[#00FF41]"
          >
            🩺 Medical Alert
          </button>
        </div>
      </div>

      {/* List of Incidents */}
      <div className="flex-1 overflow-y-auto space-y-3 max-h-[360px] pr-1" aria-label="Reported active incidents log">
        {incidents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 py-8" role="status">
            <CheckCircle2 className="w-8 h-8 text-[#00FF41] mb-2" aria-hidden="true" />
            <p className="text-xs uppercase font-bold">Zero Incidents Active</p>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono">Operations metrics secure</p>
          </div>
        ) : (
          incidents.map((inc) => (
            <div 
              key={inc.id} 
              className="bg-black/50 border border-white/10 p-3 rounded hover:border-white/20 transition-all"
              role="listitem"
            >
              <div className="flex justify-between items-start gap-1 mb-1.5">
                <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${getSeverityBadge(inc.severity)}`}>
                  {inc.severity}
                </span>
                <span className="text-[9px] font-mono text-zinc-400">{inc.timestamp}</span>
              </div>

              <h3 className="text-xs font-black uppercase text-white tracking-tight">{inc.title}</h3>
              <p className="text-[10px] text-zinc-300 mt-1 leading-relaxed">
                <MapPin className="w-3 h-3 text-[#00FF41] inline mr-1" aria-hidden="true" />
                <strong className="text-zinc-200">{inc.location}</strong> – {inc.description}
              </p>

              {inc.aiPlan ? (
                <div className="mt-2 bg-[#00FF41]/5 border border-[#00FF41]/20 p-2 rounded text-[10px] text-[#00FF41] font-mono leading-normal">
                  <strong className="uppercase block text-[9px] mb-0.5 text-[#00FF41]">GenAI Mitigation Plan:</strong>
                  {inc.aiPlan}
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => onGenerateSOP(inc)}
                  className="mt-2 text-[9px] text-[#00FF41] hover:underline font-mono uppercase flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-[#00FF41]"
                >
                  <span>✨ Generate Specific SOP via AI</span>
                </button>
              )}

              <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center text-[9px] font-mono">
                <span className="text-zinc-500">Source: {inc.reportedBy}</span>
                <button 
                  type="button"
                  onClick={() => onMarkResolved(inc.id)}
                  className="text-zinc-300 hover:text-[#00FF41] uppercase transition-all focus:outline-none focus:ring-1 focus:ring-[#00FF41] px-1 rounded"
                >
                  ✓ Resolve Alert
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Manual log form */}
      <div id="incident-creation-form" className="mt-4 pt-3 border-t border-white/10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 mb-2">Log Custom Incident</p>
        
        {formError && (
          <div className="mb-2 bg-red-950/40 border border-red-900/60 p-2 rounded text-[10px] text-red-400 font-mono" role="alert">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="inc-title-input" className="sr-only">Incident Title</label>
              <input 
                id="inc-title-input"
                type="text" 
                placeholder="Incident Name" 
                value={newIncTitle}
                onChange={(e) => { setNewIncTitle(e.target.value); setFormError(''); }}
                className="w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-[#00FF41] focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="inc-location-input" className="sr-only">Incident Location</label>
              <input 
                id="inc-location-input"
                type="text" 
                placeholder="Location / Zone" 
                value={newIncLocation}
                onChange={(e) => { setNewIncLocation(e.target.value); setFormError(''); }}
                className="w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-[#00FF41] focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="inc-category-select" className="sr-only">Incident Category</label>
              <select 
                id="inc-category-select"
                value={newIncCategory}
                onChange={(e) => setNewIncCategory(e.target.value as any)}
                className="w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-[#00FF41] focus:outline-none font-mono"
              >
                <option value="Crowd">Crowd</option>
                <option value="Safety">Safety</option>
                <option value="Accessibility">Accessibility</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Medical">Medical</option>
              </select>
            </div>

            <div>
              <label htmlFor="inc-severity-select" className="sr-only">Incident Severity</label>
              <select 
                id="inc-severity-select"
                value={newIncSeverity}
                onChange={(e) => setNewIncSeverity(e.target.value as any)}
                className="w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-[#00FF41] focus:outline-none font-mono"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="inc-desc-input" className="sr-only">Incident Description</label>
            <textarea 
              id="inc-desc-input"
              placeholder="Detailed description..."
              value={newIncDesc}
              onChange={(e) => { setNewIncDesc(e.target.value); setFormError(''); }}
              className="w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-white h-12 focus:border-[#00FF41] focus:outline-none"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-[10px] uppercase tracking-widest rounded flex items-center justify-center gap-1 border border-white/10 transition-all focus:ring-1 focus:ring-[#00FF41]"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Dispatch Alert
          </button>
        </form>
      </div>

    </div>
  );
};
