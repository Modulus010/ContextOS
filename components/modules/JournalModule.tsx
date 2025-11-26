import React, { useState } from 'react';
import { JournalEntry } from '../../types';
import { IconBookOpen, IconSend, IconSparkles } from '../Icons';
import { analyzeJournalEntry } from '../../services/geminiService';

interface JournalModuleProps {
  entries: JournalEntry[];
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
}

const MOODS = [
  { value: 'terrible', label: '😫', color: 'bg-red-100 text-red-600 border-red-200' },
  { value: 'bad', label: '🙁', color: 'bg-orange-100 text-orange-600 border-orange-200' },
  { value: 'neutral', label: '😐', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  { value: 'good', label: '🙂', color: 'bg-blue-100 text-blue-600 border-blue-200' },
  { value: 'great', label: '🤩', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' }
];

export const JournalModule: React.FC<JournalModuleProps> = ({ entries, setEntries }) => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsAnalyzing(true);
    
    // Optimistic UI update
    const tempId = crypto.randomUUID();
    const newEntry: JournalEntry = {
      id: tempId,
      content,
      mood: mood as any,
      timestamp: Date.now(),
      aiReflection: "Analyzing..."
    };

    setEntries(prev => [newEntry, ...prev]);
    setContent('');

    // Fetch AI reflection
    const reflection = await analyzeJournalEntry(content, mood);
    
    setEntries(prev => prev.map(entry => 
        entry.id === tempId ? { ...entry, aiReflection: reflection } : entry
    ));
    setIsAnalyzing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <IconBookOpen className="text-violet-600" />
          Cognitive Log
        </h2>
        <p className="text-sm text-slate-500 mt-1">Externalize thoughts to process emotions.</p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
        
        {/* Editor Area */}
        <div className="flex-1 p-6 flex flex-col border-r border-slate-50">
          <div className="flex gap-2 mb-4 justify-center">
            {MOODS.map(m => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 transition-all ${mood === m.value ? m.color + ' scale-110 shadow-sm' : 'border-transparent opacity-50 grayscale hover:grayscale-0'}`}
              >
                {m.label}
              </button>
            ))}
          </div>
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="How did today feel? What context switched your focus?"
            className="flex-1 w-full resize-none p-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-violet-200 focus:outline-none transition-colors"
          />
          
          <div className="mt-4 flex justify-end">
             <button
                onClick={handleSubmit}
                disabled={!content.trim() || isAnalyzing}
                className="bg-violet-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-violet-700 disabled:opacity-50 transition-colors flex items-center gap-2"
             >
               {isAnalyzing ? 'Processing...' : <>Log Entry <IconSend className="w-4 h-4" /></>}
             </button>
          </div>
        </div>

        {/* History Stream */}
        <div className="w-full md:w-80 bg-slate-50/50 overflow-y-auto p-4 space-y-4">
           {entries.length === 0 && <p className="text-center text-slate-400 mt-10">No entries yet.</p>}
           {entries.map(entry => (
             <div key={entry.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                  <span className="text-lg">{MOODS.find(m => m.value === entry.mood)?.label}</span>
                </div>
                <p className="text-slate-700 text-sm mb-3 whitespace-pre-wrap">{entry.content}</p>
                {entry.aiReflection && (
                  <div className="bg-violet-50 p-3 rounded-lg flex gap-3 items-start">
                     <IconSparkles className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                     <p className="text-xs text-violet-800 italic">{entry.aiReflection}</p>
                  </div>
                )}
             </div>
           ))}
        </div>

      </div>
    </div>
  );
};