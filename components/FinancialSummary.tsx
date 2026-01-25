
import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Receitas */}
        <div className="p-6 rounded-2xl border border-green-100 bg-white hover:bg-green-50/30 transition-colors group">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500 p-3 rounded-xl text-white shadow-md group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-slate-500 font-semibold">Receitas</span>
          </div>
          <p className="text-3xl font-black text-green-600">
            {formatCurrency(stats.receitas, hideValues)}
          </p>
          <p className="text-sm text-green-700 mt-1 font-medium">{stats.transacoesReceitas} transações</p>
        </div>

        {/* Despesas */}
        <div className="p-6 rounded-2xl border border-rose-100 bg-white hover:bg-rose-50/30 transition-colors group">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-rose-500 p-3 rounded-xl text-white shadow-md group-hover:scale-110 transition-transform">
              <TrendingDown className="w-6 h-6" />
            </div>
            <span className="text-slate-500 font-semibold">Despesas</span>
          </div>
          <p className="text-3xl font-black text-rose-600">
            {formatCurrency(stats.despesas, hideValues)}
          </p>
          <p className="text-sm text-rose-700 mt-1 font-medium">{stats.transacoesDespesas} transações</p>
        </div>

        {/* Lucro */}
        <div className="p-6 rounded-2xl border border-blue-100 bg-white hover:bg-blue-50/30 transition-colors group">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 p-3 rounded-xl text-white shadow-md group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-slate-500 font-semibold">Lucro no Período</span>
          </div>
          <p className="text-3xl font-black text-blue-600">
            {formatCurrency(stats.lucro, hideValues)}
          </p>
          <p className="text-sm text-blue-700 mt-1 font-medium">Positivo</p>
        </div>
      </div>
    </div>
  );
};
