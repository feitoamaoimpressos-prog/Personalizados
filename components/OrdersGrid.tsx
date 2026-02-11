
import React from 'react';
import { ShoppingCart, Search, Plus, Calendar, Printer, Eye, Edit3, DollarSign, Trash2, ChevronDown } from 'lucide-react';
import { Order } from '../types';

interface OrdersGridProps {
  orders: Order[];
  onNewOrder: () => void;
  onViewOrder: (order: Order) => void;
  onPrintOrder: (order: Order) => void;
  onEditOrder: (order: Order) => void;
  onSettleOrder: (orderId: string) => void;
  onUpdateStatus: (orderId: string, newStatus: Order['productionStatus']) => void;
  onDeleteOrder: (orderId: string) => void;
}

const PRODUCTION_STAGES = [
  'Pedido em aberto',
  'Criando arte',
  'Pedido em produção',
  'Pedido em transporte',
  'Pedido entregue'
];

export const OrdersGrid: React.FC<OrdersGridProps> = ({ orders, onNewOrder, onViewOrder, onPrintOrder, onEditOrder, onSettleOrder, onUpdateStatus, onDeleteOrder }) => {
  const getStatusStyle = (status: string | undefined) => {
    switch (status) {
      case 'Pedido em aberto': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Criando arte': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Pedido em produção': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Pedido em transporte': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pedido entregue': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Apenas Financeiro': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '--';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 p-2 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-emerald-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Todos os Pedidos</h2>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar por ID ou cliente..." 
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all w-64"
            />
          </div>
          <button 
            onClick={onNewOrder}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Pedido
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] uppercase text-slate-400 font-bold border-b border-slate-50 bg-slate-50/30">
              <th className="py-4 px-6">ID / Data</th>
              <th className="py-4 px-6">Cliente</th>
              <th className="py-4 px-6">Valor Total</th>
              <th className="py-4 px-6">Status Produção</th>
              <th className="py-4 px-6 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">Nenhum pedido encontrado.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-400 text-xs">#{order.id}</span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 font-medium">
                        <Calendar className="w-3 h-3" />
                        {formatDate(order.date)}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-700">{order.customer}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">
                        R$ {order.value.toFixed(2)}
                      </span>
                      {order.remaining > 0 && (
                        <span className="text-[9px] font-bold text-rose-500 uppercase">Falta R$ {order.remaining.toFixed(2)}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="relative group/status">
                      <select 
                        value={order.productionStatus || 'Pedido em aberto'}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value as any)}
                        className={`appearance-none px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight border cursor-pointer outline-none transition-all pr-8 ${getStatusStyle(order.productionStatus)}`}
                        disabled={order.productionStatus === 'Apenas Financeiro'}
                      >
                        {order.productionStatus === 'Apenas Financeiro' ? (
                          <option value="Apenas Financeiro">Apenas Financeiro</option>
                        ) : (
                          PRODUCTION_STAGES.map(stage => (
                            <option key={stage} value={stage}>{stage}</option>
                          ))
                        )}
                      </select>
                      {order.productionStatus !== 'Apenas Financeiro' && (
                        <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-1 md:gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onViewOrder(order); }}
                        className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all text-blue-600 border border-blue-100"
                        title="Visualizar Detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {order.remaining > 0 && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onSettleOrder(order.id); }}
                          className="p-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all text-emerald-600 border border-emerald-100"
                          title="Quitar Pedido (Receber)"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); onEditOrder(order); }}
                        className="p-2 bg-orange-50 hover:bg-orange-100 rounded-lg transition-all text-orange-600 border border-orange-100"
                        title="Editar Pedido"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onPrintOrder(order); }}
                        className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all text-slate-500 border border-slate-200"
                        title="Imprimir"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteOrder(order.id); }}
                        className="p-2 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all text-rose-500 border border-rose-100"
                        title="Excluir Pedido"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
