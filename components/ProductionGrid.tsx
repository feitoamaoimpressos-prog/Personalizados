
import React from 'react';
import { Palette, Wrench, Truck, ShoppingBag } from 'lucide-react';
import { ProductionTable } from './ProductionTable';
import { Order } from '../types';

interface ProductionGridProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onEditOrder: (order: Order) => void;
  onSettleOrder: (orderId: string) => void;
  onAdvanceStage: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
}

export const ProductionGrid: React.FC<ProductionGridProps> = ({ orders, onViewOrder, onEditOrder, onSettleOrder, onAdvanceStage, onDeleteOrder }) => {
  const cards = [
    {
      id: 'aberto',
      title: 'Pedido em aberto',
      icon: ShoppingBag,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-100/50',
      orders: orders.filter(o => o.productionStatus === 'Pedido em aberto' || !o.productionStatus)
    },
    {
      id: 'arte',
      title: 'Criando arte',
      icon: Palette,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-100/50',
      orders: orders.filter(o => o.productionStatus === 'Criando arte')
    },
    {
      id: 'producao',
      title: 'Pedido em produção',
      icon: Wrench,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-100/50',
      orders: orders.filter(o => o.productionStatus === 'Pedido em produção')
    },
    {
      id: 'transporte',
      title: 'Pedido em transporte',
      icon: Truck,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-100/50',
      orders: orders.filter(o => o.productionStatus === 'Pedido em transporte')
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
      {cards.map((card) => (
        <div key={card.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[350px] flex flex-col hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className={`${card.bgColor} p-2 rounded-lg`}>
              <card.icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{card.title}</h2>
              <span className="text-[10px] text-slate-400 font-bold">{card.orders.length} pedidos</span>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col">
            {card.orders.length > 0 ? (
              <ProductionTable 
                orders={card.orders} 
                onViewOrder={onViewOrder} 
                onEditOrder={onEditOrder} 
                onSettleOrder={onSettleOrder} 
                onAdvanceStage={onAdvanceStage}
                onDeleteOrder={onDeleteOrder}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center flex-col gap-2 opacity-30">
                <card.icon className="w-8 h-8 text-slate-400" />
                <p className="text-xs font-medium text-slate-400 italic">Nenhum pedido nesta etapa</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
