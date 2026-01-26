
import React, { useState } from 'react';
import { Eye, CheckCircle, CreditCard, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Expense, BankAccount } from '../types';

interface PayableBannerProps {
  expenses: Expense[];
  accounts: BankAccount[];
  onSettleExpense: (expenseId: string, accountId: string) => void;
  onNewTransaction: () => void;
  hideValues: boolean;
}

export const PayableBanner: React.FC<PayableBannerProps> = ({ expenses, accounts, onSettleExpense, onNewTransaction, hideValues }) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [selectedAccounts, setSelectedAccounts] = useState<Record<string, string>>({});

  const pendingExpenses = expenses.filter(exp => exp.status === 'Pendente');
  const totalPending = pendingExpenses.reduce((acc, exp) => acc + exp.value, 0);

  const formatCurrency = (val: number) => {
    if (hideValues) return 'R$ •••';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '--';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  };

  const handleAccountChange = (expenseId: string, accountId: string) => {
    setSelectedAccounts(prev => ({ ...prev, [expenseId]: accountId }));
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden flex flex-col transition-all duration-300">
      {/* Header Estilo Tabela Financeira */}
      <div 
        className="bg-rose-500 p-6 flex items-center justify-between text-white cursor-pointer hover:bg-rose-600 transition-colors"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black uppercase tracking-tight leading-none">Contas a Pagar</h2>
              {isMinimized ? <ChevronDown className="w-5 h-5 text-rose-200" /> : <ChevronUp className="w-5 h-5 text-rose-200" />}
            </div>
            <p className="text-rose-100 text-[10px] font-bold uppercase mt-1 tracking-widest">Saídas e compromissos</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onNewTransaction();
            }}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/20"
          >
            <Plus className="w-4 h-4" />
            Novo Registro
          </button>
          <div className="text-right border-l border-white/20 pl-4">
            <p className="text-rose-100 text-[10px] font-black uppercase tracking-widest mb-0.5">Total a Pagar</p>
            <span className="text-2xl font-black tracking-tighter">
              {formatCurrency(totalPending)}
            </span>
          </div>
        </div>
      </div>

      {!isMinimized && (
        <div className="animate-in slide-in-from-top-4 duration-300 flex flex-col">
          <div className="p-4 flex-1">
            {pendingExpenses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase text-slate-400 font-bold border-b border-slate-50">
                      <th className="py-3 px-2">Descrição</th>
                      <th className="py-3 px-2">Vencimento</th>
                      <th className="py-3 px-2 text-right">Valor</th>
                      <th className="py-3 px-2">Pagar com...</th>
                      <th className="py-3 px-2 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {pendingExpenses.slice(0, 10).map((expense) => {
                      const isOverdue = new Date(expense.dueDate) < new Date(new Date().setHours(0,0,0,0));
                      const currentSelectedAccount = selectedAccounts[expense.id] || accounts.find(a => a.name === expense.accountName)?.id || accounts[0]?.id || '';
                      
                      return (
                        <tr key={expense.id} className="group hover:bg-rose-50/30 transition-colors">
                          <td className="py-3 px-2">
                            <p className="text-xs font-bold text-slate-700 leading-none">{expense.description}</p>
                            <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-wider">{expense.category}</p>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`text-[11px] font-bold ${isOverdue ? 'text-rose-600 animate-pulse' : 'text-slate-500'}`}>
                              {formatDate(expense.dueDate)}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span className="text-xs font-black text-rose-600 font-mono">
                              {formatCurrency(expense.value)}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <div className="relative">
                              <select 
                                value={currentSelectedAccount}
                                onChange={(e) => handleAccountChange(expense.id, e.target.value)}
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 outline-none appearance-none pr-6 focus:border-rose-300 transition-all"
                              >
                                {accounts.map(acc => (
                                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                                ))}
                              </select>
                              <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-blue-500 transition-all border border-transparent hover:border-slate-100"
                                title="Ver Detalhes"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSettleExpense(expense.id, currentSelectedAccount);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-sm active:scale-95"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                Pagar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-slate-300 gap-2">
                <CheckCircle className="w-8 h-8 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest opacity-50">Tudo pago!</p>
              </div>
            )}
          </div>

          {pendingExpenses.length > 10 && (
            <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-50 text-center">
              <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-600 transition-colors">
                Ver mais {pendingExpenses.length - 10} contas pendentes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
