
import React, { useState, useMemo } from 'react';
import { FileText, ArrowUpCircle, ArrowDownCircle, Search, Filter, Printer, Download, Calendar, Tag, Wallet, Table as TableIcon } from 'lucide-react';
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

    // Adiciona Receitas (Pedidos)
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

    // Adiciona Despesas
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

  const formatCurrency = (val: number) => {
    if (hideValues) return 'R$ •••';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '--';
    const parts = dateStr.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const handlePrintReport = () => {
    window.print();
  };

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

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_financeiro_${dateRange.start}_a_${dateRange.end}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col transition-all duration-300">
      {/* Header do Registro */}
      <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6 print:hidden">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Registro e Relatório</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fluxo de caixa detalhado</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Filtrar planilha..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 outline-none w-48 lg:w-64"
            />
          </div>

          <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            {(['Todos', 'Receita', 'Despesa'] as TransactionType[]).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  filterType === t ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition-all active:scale-95"
              title="Baixar Planilha CSV"
            >
              <TableIcon className="w-4 h-4" />
              Planilha
            </button>
            <button 
              onClick={handlePrintReport}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-slate-900/10"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
          </div>
        </div>
      </div>

      {/* Resumo do Relatório */}
      <div className="p-8 bg-white grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-slate-50 print:p-4 print:gap-4">
        <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between group print:p-3 print:rounded-xl">
          <div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 print:text-[8px]">Entradas (+)</p>
            <p className="text-2xl font-black text-emerald-700 tracking-tight print:text-lg">{formatCurrency(totals.revenue)}</p>
          </div>
          <ArrowUpCircle className="w-8 h-8 text-emerald-400 print:w-5 print:h-5" />
        </div>

        <div className="p-6 rounded-3xl bg-rose-50/50 border border-rose-100 flex items-center justify-between group print:p-3 print:rounded-xl">
          <div>
            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1 print:text-[8px]">Saídas (-)</p>
            <p className="text-2xl font-black text-rose-700 tracking-tight print:text-lg">{formatCurrency(totals.expense)}</p>
          </div>
          <ArrowDownCircle className="w-8 h-8 text-rose-400 print:w-5 print:h-5" />
        </div>

        <div className={`p-6 rounded-3xl border flex items-center justify-between group print:p-3 print:rounded-xl ${totals.balance >= 0 ? 'bg-blue-50/50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
          <div>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 print:text-[8px] ${totals.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>Saldo Período</p>
            <p className={`text-2xl font-black tracking-tight print:text-lg ${totals.balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>{formatCurrency(totals.balance)}</p>
          </div>
          <Wallet className={`w-8 h-8 print:w-5 print:h-5 ${totals.balance >= 0 ? 'text-blue-400' : 'text-orange-400'}`} />
        </div>
      </div>

      {/* Tabela Estilo Planilha */}
      <div className="overflow-x-auto print:overflow-visible">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
              <th className="py-4 px-8 border-r border-slate-100 print:px-2 print:py-2">Data</th>
              <th className="py-4 px-8 border-r border-slate-100 print:px-2 print:py-2">Descrição da Movimentação</th>
              <th className="py-4 px-8 border-r border-slate-100 print:px-2 print:py-2">Categoria</th>
              <th className="py-4 px-8 border-r border-slate-100 print:px-2 print:py-2">Conta / Origem</th>
              <th className="py-4 px-8 text-right print:px-2 print:py-2">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest italic opacity-50">
                  Nenhum dado encontrado para exibição
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t, idx) => (
                <tr key={`${t.id}-${idx}`} className="group hover:bg-slate-50/50 transition-colors print:hover:bg-transparent">
                  <td className="py-4 px-8 border-r border-slate-50 font-mono text-[11px] text-slate-500 print:px-2 print:py-1">
                    {formatDate(t.date)}
                  </td>
                  <td className="py-4 px-8 border-r border-slate-50 print:px-2 print:py-1">
                    <span className="text-xs font-bold text-slate-700 tracking-tight">{t.description}</span>
                  </td>
                  <td className="py-4 px-8 border-r border-slate-50 print:px-2 print:py-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{t.category}</span>
                  </td>
                  <td className="py-4 px-8 border-r border-slate-50 print:px-2 print:py-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${t.type === 'Receita' ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase">{t.account}</span>
                    </div>
                  </td>
                  <td className={`py-4 px-8 text-right font-mono text-sm font-black print:px-2 print:py-1 ${t.type === 'Receita' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'Receita' ? '+' : '-'} {formatCurrency(t.value)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Rodapé do Relatório */}
      <div className="p-8 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between print:p-4">
        <div className="flex items-center gap-6 print:gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest print:text-[8px]">Movimentações</span>
            <span className="text-sm font-black text-slate-700 print:text-xs">{filteredTransactions.length} registros</span>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest print:text-[8px]">Período Consolidado</span>
            <span className="text-sm font-black text-slate-700 print:text-xs">{formatDate(dateRange.start)} — {formatDate(dateRange.end)}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end opacity-50 print:opacity-100">
          <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest">Personalizados FEITO A MÃO</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Gerado em: {new Date().toLocaleString('pt-BR')}</span>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact; }
          .rounded-[2.5rem] { border-radius: 0 !important; }
          .shadow-xl { box-shadow: none !important; }
          .bg-white { background: white !important; }
          table { border: 1px solid #e2e8f0 !important; }
          th, td { border: 1px solid #f1f5f9 !important; }
        }
      `}</style>
    </div>
  );
};
