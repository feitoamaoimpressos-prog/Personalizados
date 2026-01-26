
import React from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  CreditCard, 
  Clock, 
  Package, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Printer,
  ChevronRight,
  Truck,
  Tag,
  Store
} from 'lucide-react';
import { Order, CompanySettings } from '../types';

interface OrderDetailViewProps {
  order: Order;
  company: CompanySettings;
  onBack: () => void;
  onSettle: () => void;
  onPrint: () => void;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ order, onBack, onSettle, onPrint }) => {
  const isPaid = order.remaining === 0;

  const getStatusBadge = (status?: string) => {
    const styles: Record<string, string> = {
      'Pedido em aberto': 'bg-blue-100 text-blue-600',
      'Criando arte': 'bg-purple-100 text-purple-600',
      'Pedido em produção': 'bg-orange-100 text-orange-600 border-orange-200',
      'Pedido em transporte': 'bg-orange-100 text-orange-600 border-orange-200',
      'Pedido entregue': 'bg-green-100 text-green-600',
    };
    return styles[status || ''] || 'bg-slate-100 text-slate-600';
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '--';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const itemsSubtotal = order.items?.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0) || order.value;

  return (
    <div className="max-w-3xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Bar Actions */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para a lista
        </button>
        <button 
          onClick={onPrint}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Imprimir PDF
        </button>
      </div>

      <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        {/* Header Section */}
        <div className="p-8 pb-6 border-b border-slate-50 flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{order.customer}</h2>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
              <Phone className="w-4 h-4" />
              <span>{order.customerPhone || 'Não informado'}</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nº PED{order.id}</span>
            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(order.productionStatus)}`}>
              {order.productionStatus || 'Pedido em aberto'}
            </span>
          </div>
        </div>

        {/* Payment Banner */}
        <div className="px-8 py-4">
          <div className={`rounded-2xl p-6 flex flex-col gap-4 border ${isPaid ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isPaid ? 'text-emerald-600' : 'text-rose-600'}`}>Status do Pagamento</span>
                <h3 className={`text-2xl font-black tracking-tight ${isPaid ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {isPaid ? 'Pedido Pago' : 'A Pagar'}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valor Total</span>
                <p className={`text-2xl font-black tracking-tighter ${isPaid ? 'text-emerald-700' : 'text-rose-700'}`}>
                  R$ {order.value.toFixed(2)}
                </p>
              </div>
            </div>

            {!isPaid && (
              <button 
                onClick={onSettle}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Registrar Pagamento
              </button>
            )}
          </div>
        </div>

        {/* Financial Breakdown Cards */}
        <div className="px-8 pb-8 grid grid-cols-2 gap-4">
          <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-5">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 block">Valor Pago</span>
            <p className="text-xl font-black text-emerald-600 tracking-tight">R$ {order.paid.toFixed(2)}</p>
          </div>
          <div className="bg-rose-50/30 border border-rose-100 rounded-2xl p-5">
            <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1 block">Valor Restante</span>
            <p className="text-xl font-black text-rose-600 tracking-tight">R$ {order.remaining.toFixed(2)}</p>
          </div>
        </div>

        {/* Frete, Desconto e Transportadora Detail */}
        {(order.shipping || order.discount || order.carrier) && (
          <div className="px-8 pb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
             {order.carrier ? (
               <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
                 <Store className="w-5 h-5 text-blue-400" />
                 <div>
                    <span className="text-[9px] font-black text-blue-400 uppercase block">Transportadora</span>
                    <p className="text-sm font-black text-blue-700 truncate max-w-[120px]">{order.carrier}</p>
                 </div>
               </div>
             ) : null}
             {order.shipping ? (
               <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                 <Truck className="w-5 h-5 text-slate-400" />
                 <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase block">Frete</span>
                    <p className="text-sm font-black text-slate-700">R$ {order.shipping.toFixed(2)}</p>
                 </div>
               </div>
             ) : null}
             {order.discount ? (
               <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center gap-3">
                 <Tag className="w-5 h-5 text-rose-400" />
                 <div>
                    <span className="text-[9px] font-black text-rose-400 uppercase block">Desconto</span>
                    <p className="text-sm font-black text-rose-600">- R$ {order.discount.toFixed(2)}</p>
                 </div>
               </div>
             ) : null}
          </div>
        )}

        {/* Information Grid */}
        <div className="px-8 pb-8 grid grid-cols-2 gap-y-6 gap-x-12 border-b border-slate-50">
          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2.5 rounded-xl">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Data do Pedido</span>
              <p className="text-sm font-bold text-slate-700">
                {formatDate(order.date)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-purple-50 p-2.5 rounded-xl">
              <CreditCard className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Forma de Pagamento</span>
              <p className="text-sm font-bold text-slate-700">{order.paymentMethod || 'Não definido'}</p>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-slate-800" />
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Itens do Pedido</h4>
          </div>

          <div className="space-y-3">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, idx) => (
                <div key={idx} className="bg-slate-50/50 rounded-2xl p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="space-y-1">
                    <p className="font-black text-slate-800 tracking-tight">{item.description}</p>
                    <p className="text-[11px] font-bold text-slate-400">
                      Quantidade: {item.quantity} | Preço unitário: R$ {item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-black text-blue-600">R$ {(item.quantity * item.unitPrice).toFixed(2)}</p>
                </div>
              ))
            ) : null}
          </div>

          {/* Totals Section */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center justify-between px-6 text-slate-400 font-bold text-[11px] uppercase tracking-widest">
              <span>Subtotal Itens:</span>
              <span>R$ {itemsSubtotal.toFixed(2)}</span>
            </div>
            {order.shipping ? (
              <div className="flex items-center justify-between px-6 text-slate-400 font-bold text-[11px] uppercase tracking-widest">
                <span>Frete:</span>
                <span>+ R$ {order.shipping.toFixed(2)}</span>
              </div>
            ) : null}
            {order.discount ? (
              <div className="flex items-center justify-between px-6 text-rose-400 font-bold text-[11px] uppercase tracking-widest">
                <span>Desconto:</span>
                <span>- R$ {order.discount.toFixed(2)}</span>
              </div>
            ) : null}
            <div className="bg-blue-50/50 rounded-2xl p-6 flex items-center justify-between border border-blue-100">
              <span className="text-sm font-black text-slate-800 uppercase tracking-tight">Valor Final:</span>
              <span className="text-3xl font-black text-blue-600 tracking-tighter">R$ {order.value.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
