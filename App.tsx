import React, { useState, useEffect } from 'react';
import { ContextMode, GlobalState, Task, FocusSession, Transaction, JournalEntry } from './types';
import { TaskModule } from './components/modules/TaskModule';
import { FocusModule } from './components/modules/FocusModule';
import { FinanceModule } from './components/modules/FinanceModule';
import { JournalModule } from './components/modules/JournalModule';
import { Dashboard } from './components/Dashboard';
import { IconLayoutDashboard, IconCheckSquare, IconClock, IconWallet, IconBookOpen } from './components/Icons';

function App() {
  const [activeTab, setActiveTab] = useState<ContextMode>(ContextMode.DASHBOARD);

  // Global State (persisted to localStorage in a real app, keeping simple here for structure)
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('nexus_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [sessions, setSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem('nexus_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('nexus_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('nexus_journal');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence Effects
  useEffect(() => localStorage.setItem('nexus_tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('nexus_sessions', JSON.stringify(sessions)), [sessions]);
  useEffect(() => localStorage.setItem('nexus_transactions', JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem('nexus_journal', JSON.stringify(journalEntries)), [journalEntries]);

  const globalState: GlobalState = {
    tasks,
    focusSessions: sessions,
    transactions,
    journalEntries
  };

  const navItems = [
    { id: ContextMode.DASHBOARD, label: 'Overview', icon: IconLayoutDashboard },
    { id: ContextMode.TASKS, label: 'Tasks', icon: IconCheckSquare },
    { id: ContextMode.FOCUS, label: 'Focus', icon: IconClock },
    { id: ContextMode.FINANCE, label: 'Finance', icon: IconWallet },
    { id: ContextMode.JOURNAL, label: 'Journal', icon: IconBookOpen },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full p-4">
        <div className="mb-8 px-4 mt-4">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            Nexus OS
          </h1>
          <p className="text-xs text-slate-400 font-medium">Context Manager v1.0</p>
        </div>
        
        <nav className="space-y-1 flex-1">
          {navItems.map(item => {
             const Icon = item.icon;
             return (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                   activeTab === item.id 
                     ? 'bg-slate-900 text-white shadow-md shadow-slate-200' 
                     : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                 }`}
               >
                 <Icon className="w-5 h-5" />
                 <span className="font-medium">{item.label}</span>
               </button>
             );
          })}
        </nav>

        <div className="mt-auto px-4 py-4 border-t border-slate-100 text-xs text-slate-400">
          <p>Cognitive load: Optimized</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
           <div className="max-w-5xl mx-auto h-full">
              {activeTab === ContextMode.DASHBOARD && <Dashboard state={globalState} />}
              {activeTab === ContextMode.TASKS && <TaskModule tasks={tasks} setTasks={setTasks} />}
              {activeTab === ContextMode.FOCUS && <FocusModule sessions={sessions} setSessions={setSessions} tasks={tasks} />}
              {activeTab === ContextMode.FINANCE && <FinanceModule transactions={transactions} setTransactions={setTransactions} />}
              {activeTab === ContextMode.JOURNAL && <JournalModule entries={journalEntries} setEntries={setJournalEntries} />}
           </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           {navItems.map(item => {
             const Icon = item.icon;
             const isActive = activeTab === item.id;
             return (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={`flex flex-col items-center gap-1 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
               >
                 <Icon className={`w-6 h-6 ${isActive ? 'fill-indigo-100' : ''}`} />
                 <span className="text-[10px] font-medium">{item.label}</span>
               </button>
             );
           })}
        </div>
      </main>
    </div>
  );
}

export default App;