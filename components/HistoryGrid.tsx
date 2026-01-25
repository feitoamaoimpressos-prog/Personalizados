
import React, { useState } from 'react';
import { History, Search, Eye, Calendar, CheckCircle2 } from 'lucide-react';
import { Order } from '../types';

interface HistoryGridProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
}

export const HistoryGrid: React.FC<HistoryGridProps> = ({ orders, onViewOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtra apenas pedidos finalizados: Pagos E Entregues
  const finishedOrders = orders.filter(order => 
    order.status === 'Pago' && order.productionStatus === 'Pedido entregue'
  );

  const filteredHistory = finishedOrders.filter(order => 
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-2 rounded-lg">
            <History className="w-5 h-5 text-slate-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Histórico</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pedidos Finalizados</p>
          </div>
        </div>
        
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Buscar no histórico..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 transition-all w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] uppercase text-slate-400 font-bold border-b border-slate-50 bg-slate-50/30">
              <th className="py-4 px-6">ID / Data</th>
              <th className="py-4 px-6">Cliente</th>
              <th className="py-4 px-6">Valor Total</th>
              <th className="py-4 px-6">Status Final</th>
              <th className="py-4 px-6 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">Nenhum registro finalizado encontrado.</td>
              </tr>
            ) : (
              filteredHistory.map((order) => (
                <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-400 text-xs">#{order.id}</span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 font-medium">
                        <Calendar className="w-3 h-3" />
                        {order.date}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-700">{order.customer}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-800">
                      R$ {order.value.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-tight">
                        PAGO
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-tight">
                        ENTREGUE
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button 
                      onClick={() => onViewOrder(order)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-slate-400 hover:text-blue-600"
                      title="Ver Comprovante / Detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Mostrando {filteredHistory.length} de {finishedOrders.length} registros finalizados
        </p>
      </div>
    </div>
  );
};
