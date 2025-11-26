import React, { useEffect, useState } from 'react';
import { GlobalState } from '../types';
import { generateContextualInsight } from '../services/geminiService';
import { IconSparkles, IconLayoutDashboard, IconCheckSquare, IconClock, IconWallet } from './Icons';

interface DashboardProps {
  state: GlobalState;
}

export const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const [insight, setInsight] = useState<string>("正在分析您的语境模式...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Debounced or simple effect to get insight
    const fetchInsight = async () => {
      if (state.tasks.length === 0 && state.focusSessions.length === 0) {
        setInsight("Nexus 已就绪。从添加任务或记录心情开始吧。");
        return;
      }
      setLoading(true);
      const text = await generateContextualInsight(state);
      setInsight(text);
      setLoading(false);
    };

    fetchInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.tasks.length, state.focusSessions.length, state.transactions.length, state.journalEntries.length]); 
  // Trigger on count changes to avoid spamming API on every keystroke

  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  const completedToday = state.tasks.filter(t => t.status === 'done' && t.createdAt >= startOfDay).length;
  const focusMinutes = Math.floor(state.focusSessions.filter(s => s.timestamp >= startOfDay).reduce((acc, c) => acc + c.durationSeconds, 0) / 60);
  const spentToday = state.transactions.filter(t => t.type === 'expense' && t.timestamp >= startOfDay).reduce((acc, c) => acc + c.amount, 0);

  return (
    <div className="h-full flex flex-col gap-6 p-2 md:p-0">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <IconLayoutDashboard className="text-slate-400" />
        <h1 className="text-2xl font-bold text-slate-800">语境概览</h1>
      </div>

      {/* AI Insight Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <IconSparkles className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <h3 className="font-semibold text-indigo-100 flex items-center gap-2 mb-2">
            <IconSparkles className="w-4 h-4" /> Nexus 洞察
          </h3>
          <p className={`text-lg md:text-xl font-medium leading-relaxed ${loading ? 'animate-pulse' : ''}`}>
            "{insight}"
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">已完成任务</p>
             <p className="text-3xl font-bold text-slate-800 mt-1">{completedToday}</p>
           </div>
           <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
             <IconCheckSquare className="w-6 h-6" />
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">专注时间</p>
             <p className="text-3xl font-bold text-slate-800 mt-1">{focusMinutes}<span className="text-sm font-normal text-slate-400 ml-1">分钟</span></p>
           </div>
           <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
             <IconClock className="w-6 h-6" />
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">今日支出</p>
             <p className="text-3xl font-bold text-slate-800 mt-1">${spentToday}</p>
           </div>
           <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
             <IconWallet className="w-6 h-6" />
           </div>
        </div>
      </div>

      {/* Recent Activity Mini-Feed */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex-1">
        <h3 className="text-lg font-bold text-slate-800 mb-4">活动流</h3>
        <div className="space-y-4">
           {[
             ...state.tasks.filter(t => t.status === 'done').map(t => ({ type: 'task', data: t, time: t.createdAt })),
             ...state.focusSessions.map(s => ({ type: 'focus', data: s, time: s.timestamp })),
             ...state.journalEntries.map(j => ({ type: 'journal', data: j, time: j.timestamp }))
           ].sort((a, b) => b.time - a.time).slice(0, 5).map((item: any, idx) => (
             <div key={idx} className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0">
               <div className="mt-1">
                 {item.type === 'task' && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                 {item.type === 'focus' && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
                 {item.type === 'journal' && <div className="w-2 h-2 rounded-full bg-violet-500"></div>}
               </div>
               <div>
                 <p className="text-sm text-slate-800">
                    {item.type === 'task' && `完成任务：${item.data.title}`}
                    {item.type === 'focus' && `专注了 ${Math.floor(item.data.durationSeconds / 60)} 分钟`}
                    {item.type === 'journal' && `记录心情：${item.data.mood}`}
                 </p>
                 <p className="text-xs text-slate-400">
                   {new Date(item.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </p>
               </div>
             </div>
           ))}
           {state.tasks.length === 0 && <p className="text-slate-400 italic text-sm">暂无活动记录。</p>}
        </div>
      </div>
    </div>
  );
};