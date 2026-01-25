// Add missing React import to fix namespace error
import React from 'react';
import { CheckCircle2, Eye, Edit3, DollarSign } from 'lucide-react';
import { Order } from '../types';

interface ProductionTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onEditOrder: (order: Order) => void;
  onSettleOrder: (orderId: string) => void;
  onAdvanceStage: (orderId: string) => void;
}

export const ProductionTable: React.FC<ProductionTableProps> = ({ orders, onViewOrder, onEditOrder, onSettleOrder, onAdvanceStage }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] uppercase text-slate-400 font-bold border-b border-slate-50">
            <th className="py-2 px-1">Pedido</th>
            <th className="py-2 px-1">Cliente</th>
            <th className="py-2 px-1">Valor</th>
            <th className="py-2 px-1">Pago</th>
            <th className="py-2 px-1">Restante</th>
            <th className="py-2 px-1 text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {orders.map((order) => (
            <tr key={order.id} className="text-xs group hover:bg-slate-50/50 transition-colors">
              <td className="py-3 px-1 text-slate-400 font-medium">#{order.id}</td>
              <td className="py-3 px-1 font-bold text-slate-700">{order.customer}</td>
              <td className="py-3 px-1 font-semibold text-slate-800">
                R$ {order.value.toFixed(2)}
              </td>
              <td className="py-3 px-1 font-bold text-green-500">
                R$ {order.paid.toFixed(2)}
              </td>
              <td className="py-3 px-1 font-bold text-rose-500">
                R$ {order.remaining.toFixed(2)}
              </td>
              <td className="py-3 px-1">
                <div className="flex items-center justify-center gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onAdvanceStage(order.id); }}
                    className="text-green-500 hover:text-green-700 transition-all p-1.5 hover:bg-green-50 rounded-lg"
                    title="Avançar para próxima etapa"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  {order.remaining > 0 && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onSettleOrder(order.id); }}
                      className="text-emerald-500 hover:text-emerald-700 transition-all p-1.5 hover:bg-emerald-50 rounded-lg"
                      title="Quitar Pedido (Receber)"
                    >
                      <DollarSign className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEditOrder(order); }}
                    className="text-orange-500 hover:text-orange-700 transition-all p-1.5 hover:bg-orange-50 rounded-lg"
                    title="Editar Pedido"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onViewOrder(order); }}
                    className="text-blue-500 hover:text-blue-700 transition-all p-1.5 hover:bg-blue-50 rounded-lg"
                    title="Visualizar Detalhes"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};