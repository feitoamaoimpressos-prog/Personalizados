
import React from 'react';
import { TrendingUp, TrendingDown, Wallet, HandCoins } from 'lucide-react';
import { FinancialStats } from '../types';

interface FinancialSummaryProps {
  stats: FinancialStats;
  hideValues: boolean;
}

const formatCurrency = (val: number, hide: boolean) => {
  if (hide) return 'R$ ••••••';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({ stats, hideValues }) => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200 border border-slate-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Receitas */}
        <div className="p-6 rounded-2xl border border-green-100 bg-white hover:bg-green-50/30 transition-colors group">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500 p-3 rounded-xl text-white shadow-md group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-widest">Receitas</span>
          </div>
          <p className="text-2xl font-black text-green-600">
            {formatCurrency(stats.receitas, hideValues)}
          </p>
          <p className="text-xs text-green-700 mt-1 font-medium">{stats.transacoesReceitas} entradas pagas</p>
        </div>

        {/* Despesas */}
        <div className="p-6 rounded-2xl border border-rose-100 bg-white hover:bg-rose-50/30 transition-colors group">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-rose-500 p-3 rounded-xl text-white shadow-md group-hover:scale-110 transition-transform">
              <TrendingDown className="w-6 h-6" />
            </div>
            <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-widest">Despesas</span>
          </div>
          <p className="text-2xl font-black text-rose-600">
            {formatCurrency(stats.despesas, hideValues)}
          </p>
          <p className="text-xs text-rose-700 mt-1 font-medium">{stats.transacoesDespesas} saídas pagas</p>
        </div>

        {/* Total a Receber */}
        <div className="p-6 rounded-2xl border border-orange-100 bg-white hover:bg-orange-50/30 transition-colors group">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-500 p-3 rounded-xl text-white shadow-md group-hover:scale-110 transition-transform">
              <HandCoins className="w-6 h-6" />
            </div>
            <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-widest">A Receber</span>
          </div>
          <p className="text-2xl font-black text-orange-600">
            {formatCurrency(stats.totalReceberPeriodo, hideValues)}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[9px] font-bold text-orange-400 uppercase tracking-tighter">Total Sistema:</span>
            <span className="text-[10px] font-black text-orange-600">{formatCurrency(stats.totalReceberGeral, hideValues)}</span>
          </div>
        </div>

        {/* Lucro */}
        <div className="p-6 rounded-2xl border border-blue-100 bg-white hover:bg-blue-50/30 transition-colors group">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 p-3 rounded-xl text-white shadow-md group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-widest">Resultado</span>
          </div>
          <p className="text-2xl font-black text-blue-600">
            {formatCurrency(stats.lucro, hideValues)}
          </p>
          <p className={`text-xs mt-1 font-bold ${stats.lucro >= 0 ? 'text-blue-700' : 'text-rose-600'}`}>
            {stats.lucro >= 0 ? 'Saldo Positivo' : 'Saldo Negativo'}
          </p>
        </div>
      </div>
    </div>
  );
};
