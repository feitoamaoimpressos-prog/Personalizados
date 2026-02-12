
import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Search, 
  Printer, 
  Calendar, 
  Tag, 
  Wallet, 
  Table as TableIcon 
} from 'lucide-react';
import { Order, Expense, BankAccount } from '../types';

interface FinancialRegistryProps {
  orders: Order[];
  expenses: Expense[];
  accounts: BankAccount[];
  hideValues: boolean;
  dateRange: { start: string; end: string };
}

type TransactionType = 'Todos' | 'Receita' | 'Despesa';

export const FinancialRegistry: React.FC<FinancialRegistryProps> = ({ orders, expenses, hideValues, dateRange }) => {
  const [filterType, setFilterType] = useState<TransactionType>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const transactions = useMemo(() => {
    const list: any[] = [];

    orders.forEach(o => {
      if (o.paid > 0) {
        list.push({
          id: o.id,
          date: o.date,
          description: o.productionStatus === 'Apenas Financeiro' && o.items?.[0] ? o.items[0].description : `Pedido: ${o.customer}`,
          category: o.productionStatus === 'Apenas Financeiro' ? 'Serviço/Parcela' : 'Venda',
          type: 'Receita',
          account: o.accountName || 'Caixa Geral',
          value: o.paid,
          status: 'Pago'
        });
      }
    });

    expenses.forEach(e => {
      if (e.status === 'Pago') {
        list.push({
          id: e.id,
          date: e.dueDate,
          description: e.description,
          category: e.category,
          type: 'Despesa',
          account: e.accountName || 'Caixa Geral',
          value: e.value,
          status: 'Pago'
        });
      }
    });

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders, expenses]);

  const filteredTransactions = transactions.filter(t => {
    const matchesType = filterType === 'Todos' || t.type === filterType;
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.account.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totals = useMemo(() => {
    const revenue = filteredTransactions.filter(t => t.type === 'Receita').reduce((acc, t) => acc + t.value, 0);
    const expense = filteredTransactions.filter(t => t.type === 'Despesa').reduce((acc, t) => acc + t.value, 0);
    return { revenue, expense, balance: revenue - expense };
  }, [filteredTransactions]);

  const formatCurrency = (val: number, isNegative = false) => {
    if (hideValues) return 'R$ •••';
    const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    return isNegative ? `-${formatted}` : formatted;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '--';
    const parts = dateStr.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const handlePrintReport = () => window.print();

  const handleExportCSV = () => {
    const headers = ["Data", "Descricao", "Categoria", "Conta", "Tipo", "Valor"];
    const rows = filteredTransactions.map(t => [
      formatDate(t.date),
      t.description.replace(/,/g, ';'),
      t.category,
      t.account,
      t.type,
      t.value.toFixed(2).replace('.', ',')
    ]);
    const csvContent = ["\ufeff" + headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_financeiro_${dateRange.start}_a_${dateRange.end}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Botões de Ação (Topo) - Ocultos na Impressão */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden px-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Pesquisar registros..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 outline-none w-48 lg:w-64"
            />
          </div>
          <div className="flex bg-white border border-slate-200 rounded-xl p-1">
            {(['Todos', 'Receita', 'Despesa'] as TransactionType[]).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  filterType === t ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all">
            <TableIcon className="w-4 h-4" />
            Planilha
          </button>
          <button onClick={handlePrintReport} className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-slate-900/10">
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm print:shadow-none print:border-none">
        
        {/* Resumo Estilizado conforme a Imagem */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Entradas */}
          <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-[2rem] p-8 flex items-center justify-between relative overflow-hidden group">
            <div className="z-10">
              <p className="text-[10px] font-black text-[#059669] uppercase tracking-widest mb-2">Total Entradas</p>
              <p className="text-4xl font-black text-[#059669] tracking-tighter">{formatCurrency(totals.revenue)}</p>
            </div>
            <div className="z-10 border-2 border-[#10b981] rounded-full p-2.5">
              <ArrowUpCircle className="w-8 h-8 text-[#10b981]" strokeWidth={2.5} />
            </div>
          </div>

          {/* Card Saídas */}
          <div className="bg-[#fff1f2] border border-[#ffe4e6] rounded-[2rem] p-8 flex items-center justify-between relative overflow-hidden group">
            <div className="z-10">
              <p className="text-[10px] font-black text-[#be123c] uppercase tracking-widest mb-2">Total Saídas</p>
              <p className="text-4xl font-black text-[#be123c] tracking-tighter">{formatCurrency(totals.expense)}</p>
            </div>
            <div className="z-10 border-2 border-[#f43f5e] rounded-full p-2.5">
              <ArrowDownCircle className="w-8 h-8 text-[#f43f5e]" strokeWidth={2.5} />
            </div>
          </div>

          {/* Card Saldo */}
          <div className="bg-[#fffaf5] border border-[#ffedd5] rounded-[2rem] p-8 flex items-center justify-between relative overflow-hidden group">
            <div className="z-10">
              <p className="text-[10px] font-black text-[#c2410c] uppercase tracking-widest mb-2">Saldo Período</p>
              <p className="text-4xl font-black text-[#c2410c] tracking-tighter">{formatCurrency(Math.abs(totals.balance), totals.balance < 0)}</p>
            </div>
            <div className="z-10">
              <Wallet className="w-12 h-12 text-[#f97316]" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Tabela Formatada conforme a Imagem */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f8fafc] text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">
                <th className="py-4 px-10">Data</th>
                <th className="py-4 px-10">Descrição / Categoria</th>
                <th className="py-4 px-10">Conta</th>
                <th className="py-4 px-10 text-right">Valor</th>
                <th className="py-4 px-10 text-center">Tipo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-300 font-black uppercase tracking-[0.2em] italic">Nenhum registro no período</td>
                </tr>
              ) : (
                filteredTransactions.map((t, idx) => (
                  <tr key={`${t.id}-${idx}`} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 px-10">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-slate-300" />
                        <span className="text-[13px] font-black text-slate-600">{formatDate(t.date)}</span>
                      </div>
                    </td>
                    <td className="py-6 px-10">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-black text-slate-800 tracking-tight">{t.description.toUpperCase()}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Tag className="w-3 h-3 text-slate-300" />
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-10">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div>
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{t.account}</span>
                      </div>
                    </td>
                    <td className="py-6 px-10 text-right">
                      <span className={`text-[15px] font-black ${t.type === 'Receita' ? 'text-[#059669]' : 'text-[#be123c]'}`}>
                        {t.type === 'Receita' ? '+' : '-'} {formatCurrency(t.value)}
                      </span>
                    </td>
                    <td className="py-6 px-10 text-center">
                      <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        t.type === 'Receita' ? 'bg-[#d1fae5] text-[#059669]' : 'bg-[#ffe4e6] text-[#be123c]'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé Estilizado conforme a Imagem */}
        <div className="p-8 pt-12 border-t border-slate-50 flex items-end justify-between">
          <div className="flex gap-10">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Registros</p>
              <p className="text-lg font-black text-slate-700">{filteredTransactions.length}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Período</p>
              <p className="text-lg font-black text-slate-700">{formatDate(dateRange.start)} até {formatDate(dateRange.end)}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1 opacity-40">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Personalizados FEITO A MÃO - SISTEMA DE GESTÃO</span>
          </div>
        </div>
      </div>
      
      <style>{`
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact; }
          .rounded-[2rem] { border-radius: 0 !important; }
          .shadow-sm { box-shadow: none !important; }
          table { border-bottom: 1px solid #f1f5f9; }
        }
      `}</style>
    </div>
  );
};
