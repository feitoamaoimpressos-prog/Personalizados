
import React, { useState, useMemo } from 'react';
import { FileText, ArrowUpCircle, ArrowDownCircle, Search, Filter, Printer, Download, Calendar, Tag, Wallet } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col transition-all duration-300">
      {/* Header do Registro */}
      <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Registro e Relatório</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Movimentações consolidadas do período</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Filtrar registros..." 
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

          <button 
            onClick={handlePrintReport}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-slate-900/10"
          >
            <Printer className="w-4 h-4" />
            Gerar Relatório
          </button>
        </div>
      </div>

      {/* Resumo do Relatório (Visível também no Print) */}
      <div className="p-8 bg-white grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-slate-50">
        <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between group">
          <div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Entradas</p>
            <p className="text-2xl font-black text-emerald-700 tracking-tight">{formatCurrency(totals.revenue)}</p>
          </div>
          <ArrowUpCircle className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform" />
        </div>

        <div className="p-6 rounded-3xl bg-rose-50/50 border border-rose-100 flex items-center justify-between group">
          <div>
            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Total Saídas</p>
            <p className="text-2xl font-black text-rose-700 tracking-tight">{formatCurrency(totals.expense)}</p>
          </div>
          <ArrowDownCircle className="w-8 h-8 text-rose-400 group-hover:scale-110 transition-transform" />
        </div>

        <div className={`p-6 rounded-3xl border flex items-center justify-between group ${totals.balance >= 0 ? 'bg-blue-50/50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
          <div>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${totals.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>Saldo Período</p>
            <p className={`text-2xl font-black tracking-tight ${totals.balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>{formatCurrency(totals.balance)}</p>
          </div>
          <Wallet className={`w-8 h-8 ${totals.balance >= 0 ? 'text-blue-400' : 'text-orange-400'} group-hover:rotate-12 transition-transform`} />
        </div>
      </div>

      {/* Tabela de Lançamentos */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-50">
            <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <th className="py-5 px-8">Data</th>
              <th className="py-5 px-8">Descrição / Categoria</th>
              <th className="py-5 px-8">Conta</th>
              <th className="py-5 px-8 text-right">Valor</th>
              <th className="py-5 px-8 text-center print:hidden">Tipo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest italic opacity-50">
                  Nenhum lançamento encontrado para os filtros selecionados
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t, idx) => (
                <tr key={`${t.id}-${idx}`} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-300" />
                      <span className="text-xs font-black text-slate-600">{formatDate(t.date)}</span>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800 tracking-tight">{t.description}</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Tag className="w-3 h-3 text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{t.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{t.account}</span>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <span className={`text-sm font-black ${t.type === 'Receita' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === 'Receita' ? '+' : '-'} {formatCurrency(t.value)}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-center print:hidden">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      t.type === 'Receita' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
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

      {/* Rodapé do Relatório */}
      <div className="p-8 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Registros</span>
            <span className="text-sm font-black text-slate-700">{filteredTransactions.length}</span>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Período</span>
            <span className="text-sm font-black text-slate-700">{formatDate(dateRange.start)} até {formatDate(dateRange.end)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 opacity-50">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Personalizados FEITO A MÃO - Sistema de Gestão</span>
        </div>
      </div>
    </div>
  );
};
