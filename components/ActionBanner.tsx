
import React, { useState, useMemo } from 'react';
import { Eye, CheckCircle, Wallet, ChevronDown, ChevronUp } from 'lucide-react';
import { Order } from '../types';

interface ActionBannerProps {
  orders: Order[];
  onSettleOrder: (orderId: string) => void;
  onViewOrder: (order: Order) => void;
  hideValues: boolean;
}

export const ActionBanner: React.FC<ActionBannerProps> = ({ orders, onSettleOrder, onViewOrder, hideValues }) => {
  const [isMinimized, setIsMinimized] = useState(true);

  // Filtragem para mostrar apenas o que é efetivamente recebível neste período
  const pendingOrders = useMemo(() => {
    return orders.filter(order => {
      if (order.remaining <= 0) return false;
      
      // Se for um pedido principal (de produção) e for parcelado, 
      // não mostramos ele na lista de recebíveis pois o valor a receber
      // já está distribuído nas parcelas "Apenas Financeiro".
      if (order.productionStatus !== 'Apenas Financeiro' && (order.installments || 0) > 1) {
        return false;
      }
      
      return true;
    });
  }, [orders]);

  // Calcula o total pendente real do período seguindo a lógica de parcelas
  const totalPending = useMemo(() => {
    return pendingOrders.reduce((acc, order) => acc + order.remaining, 0);
  }, [pendingOrders]);

  const formatCurrency = (val: number) => {
    if (hideValues) return 'R$ •••';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden flex flex-col transition-all duration-300">
      {/* Header Estilo Tabela Financeira */}
      <div 
        className="bg-orange-500 p-6 flex items-center justify-between text-white cursor-pointer hover:bg-orange-600 transition-colors"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black uppercase tracking-tight leading-none">Pedidos a Receber</h2>
              {isMinimized ? <ChevronDown className="w-5 h-5 text-orange-200" /> : <ChevronUp className="w-5 h-5 text-orange-200" />}
            </div>
            <p className="text-orange-100 text-[10px] font-bold uppercase mt-1 tracking-widest">Entradas pendentes do período</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-orange-100 text-[10px] font-black uppercase tracking-widest mb-0.5">Pendente no Período</p>
          <span className="text-2xl font-black tracking-tighter">
            {formatCurrency(totalPending)}
          </span>
        </div>
      </div>

      {!isMinimized && (
        <div className="animate-in slide-in-from-top-4 duration-300 flex flex-col">
          <div className="p-4 flex-1">
            {pendingOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase text-slate-400 font-bold border-b border-slate-50">
                      <th className="py-3 px-2">ID</th>
                      <th className="py-3 px-2">Cliente / Descrição</th>
                      <th className="py-3 px-2 text-right">Valor Parcela</th>
                      <th className="py-3 px-2 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {pendingOrders.slice(0, 10).map((order) => (
                      <tr key={order.id} className="group hover:bg-orange-50/30 transition-colors">
                        <td className="py-3 px-2 text-slate-400 font-bold text-[10px]">#{order.id.slice(-6)}</td>
                        <td className="py-3 px-2">
                          <p className="text-xs font-bold text-slate-700 leading-none">
                            {order.productionStatus === 'Apenas Financeiro' && order.items?.[0] 
                              ? order.items[0].description 
                              : order.customer}
                          </p>
                          <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">
                            {order.date ? new Date(order.date).toLocaleDateString('pt-BR') : '--'} 
                            {order.productionStatus === 'Apenas Financeiro' ? ' • Cobrança' : ' • Venda Direta'}
                          </p>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className="text-xs font-black text-rose-500 font-mono">
                            {formatCurrency(order.remaining)}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewOrder(order);
                              }}
                              className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-blue-500 transition-all border border-transparent hover:border-slate-100"
                              title="Ver Detalhes"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onSettleOrder(order.id);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-sm active:scale-95"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Baixar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-slate-300 gap-2">
                <CheckCircle className="w-8 h-8 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest opacity-50">Nenhum valor para este período</p>
              </div>
            )}
          </div>

          {pendingOrders.length > 10 && (
            <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-50 text-center">
              <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-600 transition-colors">
                Ver mais {pendingOrders.length - 10} pendências
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
