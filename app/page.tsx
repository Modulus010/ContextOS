'use client';

import React, { useState } from 'react';
import { ContextMode } from '@/types';
import { useGlobalState } from '@/hooks';
import { TaskModule } from '@/components/modules/TaskModule';
import { FocusModule } from '@/components/modules/FocusModule';
import { FinanceModule } from '@/components/modules/FinanceModule';
import { JournalModule } from '@/components/modules/JournalModule';
import { Dashboard } from '@/components/Dashboard';
import { IconLayoutDashboard, IconCheckSquare, IconClock, IconWallet, IconBookOpen } from '@/components/Icons';

interface NavItem {
    id: ContextMode;
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export default function HomePage() {
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
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Nexus
                    </h1>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Context OS</p>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {renderContent()}
            </main>

            {/* Bottom Navigation (Mobile) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around items-center h-16 z-50">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex flex-col items-center gap-1 px-3 py-2 ${isActive
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-slate-600 dark:text-slate-400'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-xs">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
