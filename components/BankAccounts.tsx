
import React from 'react';
import { CreditCard, ChevronRight, ArrowRightLeft, Wallet, Plus, Trash2 } from 'lucide-react';
import { BankAccount } from '../types';

interface BankAccountsProps {
  accounts: BankAccount[];
  hideValues: boolean;
  onOpenTransfer: () => void;
  onOpenNewAccount: () => void;
  onDeleteAccount: (id: string) => void;
}

const formatCurrency = (val: number, hide: boolean) => {
  if (hide) return 'R$ ••••••';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

export const BankAccounts: React.FC<BankAccountsProps> = ({ accounts, hideValues, onOpenTransfer, onOpenNewAccount, onDeleteAccount }) => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200 border border-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-slate-500" />
          <h2 className="text-lg font-bold text-slate-800">Contas Bancárias</h2>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenNewAccount}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Nova Conta
          </button>
          <button 
            onClick={onOpenTransfer}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition-all group"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Transferir
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <div 
            key={account.id} 
            className="flex flex-col p-6 rounded-2xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/10 transition-all cursor-pointer group relative overflow-hidden"
          >
            {/* Botão de Excluir */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDeleteAccount(account.id);
              }}
              className="absolute top-3 right-3 p-1.5 bg-white/50 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-lg transition-all z-20 border border-transparent hover:border-rose-100"
              title="Excluir Conta"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Wallet className="w-16 h-16 text-slate-900 -mr-4 -mt-4" />
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors border border-transparent group-hover:border-blue-50">
                <Wallet className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
              </div>
              <div>
                <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">{account.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{account.type}</p>
              </div>
            </div>
            
            <div className="mt-auto">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mb-0.5">Saldo atual</p>
              <p className={`text-xl font-black ${account.balance >= 0 ? 'text-green-600' : 'text-rose-600'}`}>
                {formatCurrency(account.balance, hideValues)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
