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
    { id: ContextMode.DASHBOARD, label: '概览', icon: IconLayoutDashboard },
    { id: ContextMode.TASKS, label: '任务', icon: IconCheckSquare },
    { id: ContextMode.FOCUS, label: '专注', icon: IconClock },
    { id: ContextMode.FINANCE, label: '财务', icon: IconWallet },
    { id: ContextMode.JOURNAL, label: '日记', icon: IconBookOpen },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full p-4 transition-colors duration-200">
        <div className="mb-8 px-4 mt-4">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
            Nexus OS
          </h1>
          <p className="text-xs text-slate-400 font-medium">上下文管理器 v1.0</p>
        </div>

        <nav className="space-y-1 flex-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-md shadow-slate-200 dark:shadow-none'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto px-4 py-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
          <p>认知负荷：已优化</p>
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
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'fill-indigo-100 dark:fill-indigo-900/30' : ''}`} />
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