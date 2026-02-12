
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
  Clock,
  AlertCircle
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

    // Processa Receitas
    orders.forEach(o => {
      const isInstallmentMain = o.productionStatus !== 'Apenas Financeiro' && (o.installments || 0) > 1;
      
      if (o.productionStatus === 'Apenas Financeiro') {
        // É uma parcela/cobrança individual vinculada a um pedido
        list.push({
          id: o.id,
          date: o.date,
          description: o.items?.[0]?.description || `Parcela de Pedido: ${o.customer}`,
          category: 'Parcela / Cobrança',
          type: 'Receita',
          account: o.accountName || 'Caixa Geral',
          value: o.value, 
          status: o.status || (o.remaining === 0 ? 'Pago' : 'Pendente'),
          isInstallment: true
        });
      } else if (!isInstallmentMain) {
        // É um pedido de venda direta (sem parcelamento futuro no sistema)
        list.push({
          id: o.id,
          date: o.date,
          description: `Venda: ${o.customer}`,
          category: 'Venda Direta',
          type: 'Receita',
          account: o.accountName || 'Caixa Geral',
          value: o.value,
          status: o.status || (o.remaining === 0 ? 'Pago' : 'Pendente'),
          isInstallment: false
        });
      } else {
        // É o pedido principal de um parcelamento.
        // Mostramos o valor da ENTRADA (paga no ato) como o movimento financeiro deste registro principal.
        // O restante do valor será coberto pelas parcelas "Apenas Financeiro" criadas.
        list.push({
          id: o.id,
          date: o.date,
          description: `Pedido Principal (Entrada): ${o.customer}`,
          category: 'Venda Parcelada',
          type: 'Receita',
          account: o.accountName || 'Caixa Geral',
          value: o.paid, // Apenas o que foi pago como entrada entra neste registro para não duplicar totais
          status: o.paid > 0 ? 'Pago' : 'Pendente',
          isInstallment: false,
          isMainOrder: true,
          totalOrderValue: o.value
        });
      }
    });

    // Processa Despesas
    expenses.forEach(e => {
      list.push({
        id: e.id,
        date: e.dueDate,
        description: e.description,
        category: e.category,
        type: 'Despesa',
        account: e.accountName || 'Caixa Geral',
        value: e.value,
        status: e.status
      });
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

  return (
    <div className="space-y-6">
      {/* Barra de Filtros e Busca */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden px-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar em todos os registros..." 
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
        <button onClick={handlePrintReport} className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-slate-900/10">
          <Printer className="w-4 h-4" />
          Imprimir Relatório
        </button>
      </div>

      <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm print:shadow-none print:border-none">
        
        {/* Cards de Resumo */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-[2rem] p-8 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-[#059669] uppercase tracking-widest mb-2">Total Entradas</p>
              <p className="text-4xl font-black text-[#059669] tracking-tighter">{formatCurrency(totals.revenue)}</p>
            </div>
            <div className="border-2 border-[#10b981] rounded-full p-2.5">
              <ArrowUpCircle className="w-8 h-8 text-[#10b981]" strokeWidth={2.5} />
            </div>
          </div>

          <div className="bg-[#fff1f2] border border-[#ffe4e6] rounded-[2rem] p-8 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-[#be123c] uppercase tracking-widest mb-2">Total Saídas</p>
              <p className="text-4xl font-black text-[#be123c] tracking-tighter">{formatCurrency(totals.expense)}</p>
            </div>
            <div className="border-2 border-[#f43f5e] rounded-full p-2.5">
              <ArrowDownCircle className="w-8 h-8 text-[#f43f5e]" strokeWidth={2.5} />
            </div>
          </div>

          <div className="bg-[#fffaf5] border border-[#ffedd5] rounded-[2rem] p-8 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-[#c2410c] uppercase tracking-widest mb-2">Saldo Período</p>
              <p className="text-4xl font-black text-[#c2410c] tracking-tighter">{formatCurrency(Math.abs(totals.balance), totals.balance < 0)}</p>
            </div>
            <Wallet className="w-12 h-12 text-[#f97316]" strokeWidth={2} />
          </div>
        </div>

        {/* Tabela de Lançamentos */}
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
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <AlertCircle className="w-8 h-8 text-slate-400" />
                      <p className="text-xs font-black uppercase tracking-[0.2em] italic">Nenhum registro no período</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t, idx) => (
                  <tr key={`${t.id}-${idx}`} className={`group hover:bg-slate-50/50 transition-colors ${t.status === 'Pendente' ? 'bg-slate-50/30' : ''}`}>
                    <td className="py-6 px-10">
                      <div className="flex items-center gap-3">
                        {t.status === 'Pendente' ? <Clock className="w-4 h-4 text-orange-400" /> : <Calendar className="w-4 h-4 text-slate-300" />}
                        <span className={`text-[13px] font-black ${t.status === 'Pendente' ? 'text-orange-500' : 'text-slate-600'}`}>{formatDate(t.date)}</span>
                      </div>
                    </td>
                    <td className="py-6 px-10">
                      <div className="flex flex-col">
                        <span className={`text-[14px] font-black tracking-tight ${t.status === 'Pendente' ? 'text-slate-500' : 'text-slate-800'}`}>
                          {t.description.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Tag className="w-3 h-3 text-slate-300" />
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            {t.category} {t.isMainOrder ? `(VALOR TOTAL: R$ ${t.totalOrderValue.toFixed(2)})` : ''}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-10">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${t.status === 'Pendente' ? 'bg-slate-300' : 'bg-[#3b82f6]'}`}></div>
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{t.account}</span>
                      </div>
                    </td>
                    <td className="py-6 px-10 text-right">
                      <span className={`text-[15px] font-black ${t.type === 'Receita' ? 'text-[#059669]' : 'text-[#be123c]'} ${t.status === 'Pendente' ? 'opacity-60' : ''}`}>
                        {t.type === 'Receita' ? '+' : '-'} {formatCurrency(t.value)}
                      </span>
                    </td>
                    <td className="py-6 px-10 text-center">
                      <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        t.type === 'Receita' 
                          ? (t.status === 'Pendente' ? 'bg-emerald-50 text-emerald-400 border border-emerald-100' : 'bg-[#d1fae5] text-[#059669]') 
                          : (t.status === 'Pendente' ? 'bg-rose-50 text-rose-400 border border-rose-100' : 'bg-[#ffe4e6] text-[#be123c]')
                      }`}>
                        {t.type} {t.status === 'Pendente' ? '?' : ''}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé do Relatório */}
        <div className="p-8 pt-12 border-t border-slate-50 flex items-end justify-between">
          <div className="flex gap-10">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Registros no Período</p>
              <p className="text-lg font-black text-slate-700">{filteredTransactions.length}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Período Selecionado</p>
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
          .bg-slate-50/30 { background-color: transparent !important; }
        }
      `}</style>
    </div>
  );
};
