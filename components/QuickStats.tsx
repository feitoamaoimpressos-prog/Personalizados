
import React from 'react';
import { FinancialStats } from '../types';

interface QuickStatsProps {
  stats: FinancialStats;
  hideValues: boolean;
}

const formatCurrency = (val: number, hide: boolean) => {
  if (hide) return 'R$ ••••••';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

export const QuickStats: React.FC<QuickStatsProps> = ({ stats, hideValues }) => {
  const cards = [
    { label: 'Receber hoje', value: stats.receberHoje, desc: 'vencendo hoje a receber', color: 'bg-green-50 text-green-700 border-green-100' },
    { label: 'A pagar hoje', value: stats.pagarHoje, desc: 'vencendo hoje a pagar', color: 'bg-rose-50 text-rose-700 border-rose-100' },
    { label: 'Total de pedidos no período', value: stats.totalPedidosPeriodo, desc: '', color: 'bg-blue-50 text-blue-700 border-blue-100' },
    { label: 'Total a receber no período', value: stats.totalReceberPeriodo, desc: '', color: 'bg-teal-50 text-teal-700 border-teal-100' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div key={idx} className={`p-6 rounded-2xl border ${card.color} shadow-sm transition-transform hover:scale-[1.02]`}>
          <p className="text-xs font-semibold opacity-70 uppercase tracking-wider">{card.label}</p>
          <p className="text-2xl font-bold mt-2">{formatCurrency(card.value, hideValues)}</p>
          {card.desc && <p className="text-[10px] mt-1 font-medium opacity-60 italic">{card.desc}</p>}
        </div>
      ))}
    </div>
  );
};
