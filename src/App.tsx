import React, { useState } from 'react';
import { ContextMode } from './types';
import { useGlobalState } from './hooks';
import { TaskModule } from './components/modules/TaskModule';
import { FocusModule } from './components/modules/FocusModule';
import { FinanceModule } from './components/modules/FinanceModule';
import { JournalModule } from './components/modules/JournalModule';
import { Dashboard } from './components/Dashboard';
import { IconLayoutDashboard, IconCheckSquare, IconClock, IconWallet, IconBookOpen } from './components/Icons';

interface NavItem {
    id: ContextMode;
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

function App() {
    const [activeTab, setActiveTab] = useState<ContextMode>(ContextMode.DASHBOARD);
    const { state, setTasks, setSessions, setTransactions, setJournalEntries } = useGlobalState();

    const navItems: NavItem[] = [
        { id: ContextMode.DASHBOARD, label: '概览', icon: IconLayoutDashboard },
        { id: ContextMode.TASKS, label: '任务', icon: IconCheckSquare },
        { id: ContextMode.FOCUS, label: '专注', icon: IconClock },
        { id: ContextMode.FINANCE, label: '财务', icon: IconWallet },
        { id: ContextMode.JOURNAL, label: '日记', icon: IconBookOpen },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case ContextMode.DASHBOARD:
                return <Dashboard state={state} />;
            case ContextMode.TASKS:
                return <TaskModule tasks={state.tasks} setTasks={setTasks} />;
            case ContextMode.FOCUS:
                return <FocusModule sessions={state.focusSessions} setSessions={setSessions} tasks={state.tasks} />;
            case ContextMode.FINANCE:
                return <FinanceModule transactions={state.transactions} setTransactions={setTransactions} />;
            case ContextMode.JOURNAL:
                return <JournalModule entries={state.journalEntries} setEntries={setJournalEntries} />;
            default:
                return null;
        }
    };

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
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
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
                        {renderContent()}
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
                                className={`flex flex-col items-center gap-1 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                                    }`}
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
