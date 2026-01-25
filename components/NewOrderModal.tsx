
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { X, UserPlus, Plus, Minus, Trash2, ChevronDown, Package, Loader2, AlertCircle, Save, CreditCard as CardIcon, Calendar as CalendarIcon, Search, Box, Wallet, Banknote, CreditCard, ReceiptText, Landmark, CalendarDays } from 'lucide-react';
import { OrderItem, Order, Customer, Product, BankAccount } from '../types';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: any) => void;
  orderToEdit?: Order | null;
  customers: Customer[];
  products: Product[];
  accounts: BankAccount[];
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({ isOpen, onClose, onSave, orderToEdit, customers, products, accounts }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [firstPaymentDate, setFirstPaymentDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'Pendente' | 'Pago' | 'Cancelado'>('Pendente');
  const [productionStatus, setProductionStatus] = useState<any>('Pedido em aberto');
  const [paymentMethod, setPaymentMethod] = useState('Dinheiro');
  const [installments, setInstallments] = useState(1);
  const [entryValue, setEntryValue] = useState(0);
  const [accountId, setAccountId] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [items, setItems] = useState<OrderItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    description: '',
    quantity: 1,
    unitPrice: 0,
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      if (orderToEdit) {
        setCustomerName(orderToEdit.customer || '');
        setCustomerPhone(orderToEdit.customerPhone || '');
        setDeliveryDate(orderToEdit.date || today);
        setFirstPaymentDate(orderToEdit.date || today);
        setPaymentStatus(orderToEdit.status || 'Pendente');
        setProductionStatus(orderToEdit.productionStatus || 'Pedido em aberto');
        setItems(orderToEdit.items || []);
        setEntryValue(orderToEdit.paid || 0);
        setPaymentMethod(orderToEdit.paymentMethod || 'Dinheiro');
        setInstallments(orderToEdit.installments || 1); 
        const acc = accounts.find(a => a.name === orderToEdit.accountName);
        setAccountId(acc?.id || accounts[0]?.id || '');
      } else {
        setCustomerName('');
        setCustomerPhone('');
        setDeliveryDate(today);
        setFirstPaymentDate(today);
        setPaymentStatus('Pendente');
        setProductionStatus('Pedido em aberto');
        setItems([]);
        setEntryValue(0);
        setPaymentMethod('Dinheiro');
        setInstallments(1);
        setAccountId(accounts[0]?.id || '');
      }
      setGeneralNotes('');
      setError('');
      setIsSaving(false);
      setCurrentItem({ description: '', quantity: 1, unitPrice: 0, notes: '' });
    }
  }, [isOpen, orderToEdit, accounts]);

  const totalValue = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.quantity * (item.unitPrice || 0)), 0);
  }, [items]);

  const remainingValue = useMemo(() => {
    return Math.max(0, totalValue - entryValue);
  }, [totalValue, entryValue]);

  const showInstallmentSelector = useMemo(() => {
    return paymentMethod === 'Cartão de Crédito' || paymentMethod === 'Parcelado (Carnê/Boleto)';
  }, [paymentMethod]);

  // Projeção de parcelas para o preview
  const installmentProjection = useMemo(() => {
    if (!showInstallmentSelector || installments <= 1 || remainingValue <= 0) return [];
    
    const projection = [];
    const valPerInstallment = remainingValue / installments;
    const baseDate = new Date(firstPaymentDate + 'T12:00:00');

    for (let i = 0; i < installments; i++) {
      const dueDate = new Date(baseDate);
      dueDate.setMonth(baseDate.getMonth() + i);
      projection.push({
        index: i + 1,
        date: dueDate.toISOString().split('T')[0],
        value: valPerInstallment
      });
    }
    return projection;
  }, [showInstallmentSelector, installments, remainingValue, firstPaymentDate]);

  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProductName = e.target.value;
    if (selectedProductName) {
      const product = products.find(p => p.name === selectedProductName);
      if (product) {
        setCurrentItem({
          ...currentItem,
          description: product.name,
          unitPrice: product.price
        });
      }
    } else {
      setCurrentItem({
        ...currentItem,
        description: '',
        unitPrice: 0
      });
    }
  };

  const addItem = () => {
    if (!currentItem.description) {
      setError('Descreva o item ou selecione um produto do catálogo.');
      return;
    }
    setItems([...items, { ...currentItem, unitPrice: currentItem.unitPrice || 0 }]);
    setCurrentItem({ description: '', quantity: 1, unitPrice: 0, notes: '' });
    setError('');
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCreateOrder = () => {
    if (items.length === 0) {
      setError('Adicione pelo menos um item ao pedido.');
      return;
    }
    
    const selectedAccount = accounts.find(a => a.id === accountId);
    if (entryValue > 0 && !selectedAccount) {
      setError('Selecione uma conta para receber a entrada.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      onSave({
        customer: customerName.trim() || 'Consumidor Final',
        customerPhone,
        value: totalValue,
        paid: entryValue,
        remaining: remainingValue,
        status: remainingValue === 0 ? 'Pago' : paymentStatus,
        productionStatus: productionStatus,
        date: deliveryDate,
        items: items,
        notes: generalNotes,
        paymentMethod,
        accountName: selectedAccount?.name || '',
        installments: showInstallmentSelector ? installments : 1,
        firstPaymentDate: firstPaymentDate // Passando a data da parcela
      });
      setIsSaving(false);
    }, 400);
  };

  const handleSelectExistingCustomer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    if (name) {
      const found = customers.find(c => c.name === name);
      setCustomerName(name);
      if (found) setCustomerPhone(found.phone);
      setError('');
    }
  };

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {orderToEdit ? `Editar Pedido #${orderToEdit.id}` : 'Criar Novo Pedido'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto max-h-[75vh]">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Seção Cliente */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-slate-400" />
              <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Informações do Cliente</label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Selecionar Cadastrado</label>
                <div className="relative">
                  <select 
                    onChange={handleSelectExistingCustomer}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 appearance-none focus:ring-4 focus:ring-blue-500/5 outline-none"
                  >
                    <option value="">Consumidor Final / Outro</option>
                    {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Nome Manual</label>
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Data de Entrega (Produção)</label>
              <div className="relative">
                <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none" />
                <CalendarIcon className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-blue-600 uppercase">Status de Produção</label>
              <div className="relative">
                <select value={productionStatus} onChange={(e) => setProductionStatus(e.target.value)} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm font-bold text-blue-700 outline-none appearance-none">
                  <option value="Pedido em aberto">Pedido em aberto</option>
                  <option value="Criando arte">Criando arte</option>
                  <option value="Pedido em produção">Pedido em produção</option>
                  <option value="Pedido em transporte">Pedido em transporte</option>
                  <option value="Pedido entregue">Pedido entregue</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Seção Itens */}
          <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Itens do Pedido</h3>
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Box className="w-3 h-3" />
                {products.length} produtos disponíveis
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-6 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Buscar Produto ou Digitar Descrição</label>
                <div className="relative">
                  <select 
                    onChange={handleProductSelect}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none focus:ring-4 focus:ring-blue-500/5"
                  >
                    <option value="">-- Selecione um produto ou digite abaixo --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.name}>
                        {p.name} (R$ {p.price.toFixed(2)}) {p.stock < 10 ? '⚠️ Estoque Baixo' : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <input 
                  type="text" 
                  value={currentItem.description} 
                  onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})} 
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none mt-2" 
                  placeholder="Descrição personalizada..." 
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Qtd</label>
                <input type="number" value={currentItem.quantity} onChange={(e) => setCurrentItem({...currentItem, quantity: parseInt(e.target.value) || 1})} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none font-bold" />
              </div>
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Preço Unit.</label>
                <input type="number" value={currentItem.unitPrice} onChange={(e) => setCurrentItem({...currentItem, unitPrice: parseFloat(e.target.value) || 0})} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none font-bold text-blue-600" />
              </div>
              <div className="md:col-span-1">
                <button type="button" onClick={addItem} className="w-full h-[42px] bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/10"><Plus className="w-5 h-5" /></button>
              </div>
            </div>

            {items.length > 0 && (
              <div className="overflow-hidden border border-slate-100 rounded-xl bg-white mt-4">
                <table className="w-full text-left border-collapse">
                  <thead className="text-[10px] uppercase text-slate-400 font-bold bg-slate-50 border-b border-slate-100">
                    <tr><th className="py-2 px-4">Item</th><th className="py-2 px-4 text-center">Qtd</th><th className="py-2 px-4 text-right">Subtotal</th><th className="py-2 px-4 text-center w-10"></th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item, idx) => (
                      <tr key={idx} className="text-xs font-bold text-slate-700">
                        <td className="py-3 px-4">{item.description}</td>
                        <td className="py-3 px-4 text-center font-black text-slate-400">{item.quantity}</td>
                        <td className="py-3 px-4 text-right">R$ {(item.quantity * item.unitPrice).toFixed(2)}</td>
                        <td className="py-3 px-4 text-center"><button onClick={() => removeItem(idx)} className="text-rose-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Seção Pagamento */}
          <div className="bg-emerald-50/30 p-6 rounded-2xl border border-emerald-100 space-y-6">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-tight">Pagamento e Parcelamento</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-emerald-600 uppercase">Forma de Pagamento</label>
                <div className="relative">
                  <select 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none focus:ring-4 focus:ring-emerald-500/5"
                  >
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="PIX">PIX</option>
                    <option value="Cartão de Débito">Cartão de Débito</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Parcelado (Carnê/Boleto)">Parcelado (Carnê/Boleto)</option>
                    <option value="Transferência Bancária">Transferência Bancária</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
                </div>
              </div>

              {showInstallmentSelector && (
                <>
                  <div className="space-y-1.5 animate-in slide-in-from-left-2 duration-200">
                    <label className="text-[10px] font-bold text-emerald-600 uppercase">Parcelas</label>
                    <div className="relative">
                      <select 
                        value={installments} 
                        onChange={(e) => setInstallments(parseInt(e.target.value))}
                        className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl text-sm font-bold text-slate-700 appearance-none outline-none focus:ring-4 focus:ring-emerald-500/5"
                      >
                        {[1, 2, 3, 4, 5, 6, 10, 12].map(n => (
                          <option key={n} value={n}>{n}x {n === 1 ? '(À vista)' : ''}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5 animate-in slide-in-from-left-2 duration-200">
                    <label className="text-[10px] font-bold text-emerald-600 uppercase">Data do 1º Vencimento</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={firstPaymentDate} 
                        onChange={(e) => setFirstPaymentDate(e.target.value)} 
                        className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl text-sm font-bold text-slate-700 outline-none" 
                      />
                      <CalendarDays className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-emerald-600 uppercase">Entrada Recebida (R$)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={entryValue} 
                    onChange={(e) => setEntryValue(parseFloat(e.target.value) || 0)} 
                    className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl text-sm font-black text-emerald-600 outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all" 
                    placeholder="0,00"
                  />
                  <Banknote className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-emerald-200 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-emerald-600 uppercase">Conta Destino</label>
                <div className="relative">
                  <select 
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none focus:ring-4 focus:ring-emerald-500/5"
                    disabled={entryValue === 0}
                  >
                    <option value="">Selecione...</option>
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                  </select>
                  <Landmark className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Projeção de Parcelas Visível */}
            {installmentProjection.length > 0 && (
              <div className="bg-white/40 p-4 rounded-xl border border-emerald-100 animate-in slide-in-from-bottom-2 duration-300">
                <p className="text-[10px] font-black text-emerald-600 uppercase mb-3 tracking-widest flex items-center gap-2">
                  <ReceiptText className="w-3 h-3" />
                  Projeção de Contas a Receber
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {installmentProjection.map((p) => (
                    <div key={p.index} className="bg-white p-2.5 rounded-lg border border-emerald-50 shadow-sm flex flex-col items-center">
                      <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Parcela {p.index}</span>
                      <span className="text-[11px] font-bold text-slate-700">{formatDate(p.date)}</span>
                      <span className="text-[11px] font-black text-emerald-600 mt-0.5">R$ {p.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {remainingValue > 0 && (
              <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-white/60 rounded-xl border border-emerald-100">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <ReceiptText className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase leading-none mb-1">Saldo a Pagar</p>
                  <p className="text-lg font-black text-slate-700">R$ {remainingValue.toFixed(2)}</p>
                </div>
                {showInstallmentSelector && installments > 1 && (
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-blue-400 uppercase leading-none mb-1">Total Parcelado</p>
                    <p className="text-lg font-black text-blue-600">{installments}x de R$ {(remainingValue / installments).toFixed(2)}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
            <div className="space-y-1.5 w-full md:max-w-xs">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Observações do Pedido</label>
              <textarea 
                value={generalNotes} 
                onChange={(e) => setGeneralNotes(e.target.value)}
                placeholder="Ex: Cliente vai retirar, enviar prova de cor..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all resize-none"
                rows={2}
              />
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Valor Total do Pedido</p>
              <div className="flex items-center justify-end gap-2">
                <span className="text-sm font-bold text-blue-400">R$</span>
                <span className="text-5xl font-black text-blue-600 tracking-tighter">{totalValue.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-50 flex justify-end gap-3 bg-slate-50/30">
          <button onClick={onClose} className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-colors">Cancelar</button>
          <button onClick={handleCreateOrder} disabled={isSaving} className="px-10 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 flex items-center gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};
