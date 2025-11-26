import React, { useState } from 'react';
import { Transaction, TransactionType } from '../../types';
import { IconWallet, IconTrendingUp, IconPlus } from '../Icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FinanceModuleProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({ transactions, setTransactions }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);

  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      description,
      type,
      category: 'General',
      timestamp: Date.now()
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setAmount('');
    setDescription('');
  };

  // Prepare chart data (Last 7 transactions simplified for demo)
  const chartData = transactions.slice(0, 7).reverse().map(t => ({
    name: t.description.substring(0, 10),
    amount: t.type === TransactionType.EXPENSE ? -t.amount : t.amount,
    type: t.type
  }));

  const totalBalance = transactions.reduce((acc, curr) => {
    return curr.type === TransactionType.INCOME ? acc + curr.amount : acc - curr.amount;
  }, 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 h-full flex flex-col overflow-hidden transition-colors">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <IconWallet className="text-emerald-600 dark:text-emerald-500" />
            现金流
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">追踪价值交换。</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 uppercase tracking-wider">余额</p>
          <p className={`text-2xl font-mono font-bold ${totalBalance >= 0 ? 'text-slate-800 dark:text-slate-100' : 'text-rose-600 dark:text-rose-400'}`}>
            ${totalBalance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 h-full overflow-hidden">
        
        {/* Left: Input & List */}
        <div className="flex flex-col h-full overflow-hidden">
           <form onSubmit={addTransaction} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 transition-colors">
              <div className="flex gap-2 mb-2">
                 <button 
                   type="button" 
                   onClick={() => setType(TransactionType.EXPENSE)}
                   className={`flex-1 py-1 text-xs font-bold rounded-md transition-colors ${type === TransactionType.EXPENSE ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300' : 'bg-white dark:bg-slate-700 text-slate-400'}`}
                 >
                   支出
                 </button>
                 <button 
                   type="button" 
                   onClick={() => setType(TransactionType.INCOME)}
                   className={`flex-1 py-1 text-xs font-bold rounded-md transition-colors ${type === TransactionType.INCOME ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' : 'bg-white dark:bg-slate-700 text-slate-400'}`}
                 >
                   收入
                 </button>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="描述" 
                  className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
                <input 
                  type="number" 
                  placeholder="¥" 
                  className="w-20 p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
                <button type="submit" className="bg-slate-800 dark:bg-slate-700 text-white p-2 rounded-lg hover:bg-slate-900 dark:hover:bg-slate-600">
                  <IconPlus className="w-5 h-5" />
                </button>
              </div>
           </form>

           <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {transactions.map(t => (
                <div key={t.id} className="flex justify-between items-center p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-sm transition-colors">
                   <div className="flex flex-col">
                     <span className="font-medium text-slate-700 dark:text-slate-200">{t.description}</span>
                     <span className="text-xs text-slate-400">{new Date(t.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                   </div>
                   <span className={`font-mono font-medium ${t.type === TransactionType.INCOME ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                     {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount}
                   </span>
                </div>
              ))}
           </div>
        </div>

        {/* Right: Visualization */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex flex-col transition-colors">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-4 flex items-center gap-2">
              <IconTrendingUp className="w-4 h-4" /> 近期活动
            </h3>
            <div className="flex-1 min-h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#f1f5f9' }}
                    cursor={{fill: 'transparent'}}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 4, 4]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.type === TransactionType.INCOME ? '#10b981' : '#f43f5e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-xs text-slate-400 text-center">
               消费影响心理安全感。请有意识地记录。
            </div>
        </div>

      </div>
    </div>
  );
};