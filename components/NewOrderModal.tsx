
import React, { useState, useMemo, useEffect } from 'react';
import { X, Plus, Trash2, Loader2, Save, Package, DollarSign, ChevronDown, Search, Truck, Layers, Wallet } from 'lucide-react';
import { OrderItem, Order, Customer, Product, BankAccount, Carrier } from '../types';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: any) => void;
  orderToEdit?: Order | null;
  customers: Customer[];
  products: Product[];
  accounts: BankAccount[];
  carriers: Carrier[];
}

const PRODUCTION_STAGES = [
  'Pedido em aberto',
  'Criando arte',
  'Pedido em produção',
  'Pedido em transporte',
  'Pedido entregue'
];

export const NewOrderModal: React.FC<NewOrderModalProps> = ({ isOpen, onClose, onSave, orderToEdit, customers, products, accounts, carriers }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerTaxId, setCustomerTaxId] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerZip, setCustomerZip] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerState, setCustomerState] = useState('');
  
  const [deliveryDate, setDeliveryDate] = useState('');
  const [firstPaymentDate, setFirstPaymentDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'Pendente' | 'Pago' | 'Cancelado'>('Pendente');
  const [productionStatus, setProductionStatus] = useState<any>('Pedido em aberto');
  const [paymentMethod, setPaymentMethod] = useState('Dinheiro');
  const [installments, setInstallments] = useState(1);
  const [entryValue, setEntryValue] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [carrier, setCarrier] = useState('');
  const [accountId, setAccountId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [items, setItems] = useState<OrderItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    description: '',
    quantity: 1,
    unitPrice: 0
  });

  const [productSearch, setProductSearch] = useState('');
  const [showProductList, setShowProductList] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      if (orderToEdit) {
        setCustomerName(orderToEdit.customer || '');
        setCustomerPhone(orderToEdit.customerPhone || '');
        setCustomerEmail(orderToEdit.customerEmail || '');
        setCustomerTaxId(orderToEdit.customerTaxId || '');
        setCustomerAddress(orderToEdit.customerAddress || '');
        setCustomerZip(orderToEdit.customerZip || '');
        setCustomerCity(orderToEdit.customerCity || '');
        setCustomerState(orderToEdit.customerState || '');
        setDeliveryDate(orderToEdit.date || today);
        setFirstPaymentDate(orderToEdit.date || today);
        setPaymentStatus(orderToEdit.status || 'Pendente');
        setProductionStatus(orderToEdit.productionStatus || 'Pedido em aberto');
        setItems(orderToEdit.items || []);
        setEntryValue(orderToEdit.paid || 0);
        setShipping(orderToEdit.shipping || 0);
        setDiscount(orderToEdit.discount || 0);
        setCarrier(orderToEdit.carrier || '');
        setPaymentMethod(orderToEdit.paymentMethod || 'Dinheiro');
        setInstallments(orderToEdit.installments || 1);
        const acc = accounts.find(a => a.name === orderToEdit.accountName);
        setAccountId(acc?.id || accounts[0]?.id || '');
      } else {
        setCustomerName('');
        setCustomerPhone('');
        setCustomerEmail('');
        setCustomerTaxId('');
        setCustomerAddress('');
        setCustomerZip('');
        setCustomerCity('');
        setCustomerState('');
        setDeliveryDate(today);
        setFirstPaymentDate(today);
        setPaymentStatus('Pendente');
        setProductionStatus('Pedido em aberto');
        setItems([]);
        setEntryValue(0);
        setShipping(0);
        setDiscount(0);
        setCarrier(carriers[0]?.name || '');
        setPaymentMethod('Dinheiro');
        setInstallments(1);
        setAccountId(accounts[0]?.id || '');
      }
      setError('');
      setIsSaving(false);
    }
  }, [isOpen, orderToEdit, accounts, carriers]);

  const maskPhone = (value: string) => {
    let v = value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length <= 2) return v.length > 0 ? `(${v}` : v;
    if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length <= 10) return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
    return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerPhone(maskPhone(e.target.value));
  };

  const totalValue = useMemo(() => {
    const itemsTotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    return itemsTotal + shipping - discount;
  }, [items, shipping, discount]);

  const remainingValue = useMemo(() => Math.max(0, totalValue - entryValue), [totalValue, entryValue]);

  const currentItemSubtotal = useMemo(() => {
    return currentItem.quantity * currentItem.unitPrice;
  }, [currentItem]);

  const addItem = () => {
    if (!currentItem.description) return setError('Descreva o item.');
    setItems([...items, { ...currentItem }]);
    setCurrentItem({ description: '', quantity: 1, unitPrice: 0 });
    setProductSearch('');
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSelectProduct = (product: Product) => {
    setCurrentItem({
      description: product.name,
      quantity: 1,
      unitPrice: product.price
    });
    setProductSearch(product.name);
    setShowProductList(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleSelectExistingCustomer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = customers.find(c => c.name === e.target.value);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
      setCustomerEmail(found.email || '');
      setCustomerTaxId(found.taxId || '');
      setCustomerAddress(found.address || '');
      setCustomerZip(found.zip || '');
      setCustomerCity(found.city || '');
      setCustomerState(found.state || '');
    } else {
      setCustomerName(e.target.value);
    }
  };

  const handleCreateOrder = () => {
    if (!customerName) return setError('Nome do cliente é obrigatório.');
    if (items.length === 0) return setError('Adicione pelo menos um item.');
    if (!accountId) return setError('Selecione uma conta bancária para o registro financeiro.');
    
    setIsSaving(true);
    const selectedAccount = accounts.find(a => a.id === accountId);
    
    onSave({
      customer: customerName,
      customerPhone,
      customerEmail,
      customerTaxId,
      customerAddress,
      customerZip,
      customerCity,
      customerState,
      value: totalValue,
      paid: entryValue,
      remaining: remainingValue,
      shipping,
      discount,
      carrier,
      status: remainingValue === 0 ? 'Pago' : paymentStatus,
      productionStatus,
      date: deliveryDate,
      firstPaymentDate: firstPaymentDate,
      items,
      paymentMethod,
      installments: paymentMethod.includes('Parcelado') || paymentMethod === 'Cartão de Crédito' ? installments : 1,
      accountName: selectedAccount?.name || ''
    });
    setIsSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto text-slate-900">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-800">{orderToEdit ? 'Editar Pedido' : 'Novo Pedido'}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
        </div>

        <div className="p-8 space-y-6 overflow-y-auto max-h-[75vh]">
          {error && <div className="bg-rose-50 text-rose-600 px-4 py-3 rounded-xl text-xs font-bold">{error}</div>}

          {/* Dados Básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Cliente</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <select 
                    onChange={handleSelectExistingCustomer} 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold bg-white text-slate-900 appearance-none pr-10 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    value={customers.find(c => c.name === customerName)?.name || ""}
                  >
                    <option value="">Selecione...</option>
                    {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <input 
                  type="text" 
                  placeholder="Ou digite o nome"
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-bold focus:ring-2 focus:ring-blue-500/20 outline-none placeholder:text-slate-400" 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Telefone / WhatsApp</label>
              <input 
                type="text" 
                placeholder="(00) 00000-0000"
                value={customerPhone} 
                onChange={handlePhoneChange} 
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-bold focus:ring-2 focus:ring-blue-500/20 outline-none placeholder:text-slate-400" 
              />
            </div>
          </div>

          {/* Itens com Seleção de Produtos */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-500">Produtos / Serviços</h3>
            <div className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-12 md:col-span-5 relative">
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Item (Busca ou Manual)</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={productSearch} 
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setCurrentItem({...currentItem, description: e.target.value});
                      setShowProductList(true);
                    }} 
                    onFocus={() => setShowProductList(true)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-bold focus:ring-2 focus:ring-blue-500/20 outline-none placeholder:text-slate-400" 
                    placeholder="Procure um produto..."
                  />
                </div>
                {showProductList && filteredProducts.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                    {filteredProducts.map(p => (
                      <button 
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectProduct(p)}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm font-medium border-b border-slate-50 last:border-0"
                      >
                        <span className="block font-bold text-slate-900">{p.name}</span>
                        <span className="text-[10px] text-slate-500 uppercase">R$ {p.price.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="col-span-3 md:col-span-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Qtd</label>
                <input 
                  type="number" 
                  value={currentItem.quantity} 
                  onChange={(e) => setCurrentItem({...currentItem, quantity: Number(e.target.value)})} 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-bold focus:ring-2 focus:ring-blue-500/20 outline-none" 
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Preço Unit.</label>
                <input 
                  type="number" 
                  value={currentItem.unitPrice || ''} 
                  onChange={(e) => setCurrentItem({...currentItem, unitPrice: Number(e.target.value)})} 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-bold focus:ring-2 focus:ring-blue-500/20 outline-none" 
                />
              </div>
              <div className="col-span-5 md:col-span-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Valor Total</label>
                <div className="px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 font-black">
                  R$ {currentItemSubtotal.toFixed(2)}
                </div>
              </div>
              <div className="col-span-3 md:col-span-1">
                <button onClick={addItem} className="w-full h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {items.length > 0 && (
              <div className="mt-4 border border-slate-200 rounded-xl bg-white overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr className="text-slate-900 uppercase font-black">
                      <th className="py-3 px-4 text-left">Item</th>
                      <th className="py-3 px-4 text-center">Qtd</th>
                      <th className="py-3 px-4 text-right">Subtotal</th>
                      <th className="py-3 px-4 text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 px-4 font-bold text-slate-900">{it.description}</td>
                        <td className="py-3 px-4 text-center font-bold text-slate-900">{it.quantity}</td>
                        <td className="py-3 px-4 text-right font-black text-slate-900">R$ {(it.quantity * it.unitPrice).toFixed(2)}</td>
                        <td className="py-3 px-4 text-center">
                          <button onClick={() => removeItem(i)} className="p-1.5 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Status Inicial da Produção */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Layers className="w-3 h-3" />
                Status Inicial da Produção
              </label>
              <div className="relative">
                <select 
                  value={productionStatus} 
                  onChange={(e) => setProductionStatus(e.target.value)} 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-bold focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none"
                >
                  {PRODUCTION_STAGES.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                  <option value="Apenas Financeiro">Apenas Financeiro (Sem Produção)</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Entrega Prevista</label>
              <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-bold focus:ring-2 focus:ring-blue-500/20 outline-none" />
            </div>
          </div>

          {/* Logística e Conta Bancária */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Transportadora / Envio</label>
              <div className="relative">
                <select 
                  value={carrier} 
                  onChange={(e) => setCarrier(e.target.value)} 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-bold focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none"
                >
                  <option value="">Selecione...</option>
                  {carriers.map(c => <option key={c.id} value={c.name}>{c.name} ({c.type})</option>)}
                  <option value="Manual">Outro (Digitar)</option>
                </select>
                <Truck className="w-4 h-4 absolute right-10 top-1/2 -translate-y-1/2 text-slate-400" />
                <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-blue-500" />
                Conta Bancária (Recebimento) *
              </label>
              <div className="relative">
                <select 
                  value={accountId} 
                  onChange={(e) => setAccountId(e.target.value)} 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-bold focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none"
                >
                  <option value="">Escolha a conta...</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name} (Saldo: R$ {acc.balance.toFixed(2)})</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Financeiro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Valor do Frete (R$)</label>
              <input type="number" value={shipping || ''} onChange={(e) => setShipping(Number(e.target.value))} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-bold focus:ring-2 focus:ring-blue-500/20 outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Valor do Desconto (R$)</label>
              <input type="number" value={discount || ''} onChange={(e) => setDiscount(Number(e.target.value))} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-rose-600 font-bold bg-white focus:ring-2 focus:ring-blue-500/20 outline-none" />
            </div>
          </div>

          {/* Pagamento e Parcelas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Forma de Pagamento</label>
              <div className="relative">
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold bg-white text-slate-900 appearance-none pr-10 focus:ring-2 focus:ring-blue-500/20 outline-none"
                >
                  <option value="Dinheiro">Dinheiro (À Vista)</option>
                  <option value="PIX">PIX (À Vista)</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Boleto Parcelado">Boleto Parcelado</option>
                  <option value="Promissória Parcelada">Promissória Parcelada</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {(paymentMethod.includes('Parcelado') || paymentMethod === 'Cartão de Crédito') && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Nº de Parcelas</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="48"
                    value={installments} 
                    onChange={(e) => setInstallments(Math.max(1, parseInt(e.target.value) || 1))} 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Data da 1ª Parcela</label>
                  <input 
                    type="date" 
                    value={firstPaymentDate} 
                    onChange={(e) => setFirstPaymentDate(e.target.value)} 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 outline-none" 
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-1 w-full md:w-auto">
              <span className="text-[11px] font-bold text-blue-600 uppercase">Valor de Entrada / Sinal</span>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" />
                <input 
                  type="number" 
                  value={entryValue} 
                  onChange={(e) => setEntryValue(Number(e.target.value))} 
                  className="w-full md:w-48 pl-10 pr-4 py-3 bg-white border border-blue-200 rounded-xl text-xl font-black text-blue-600 focus:ring-4 focus:ring-blue-500/10 outline-none" 
                />
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Total do Pedido</span>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">R$ {totalValue.toFixed(2)}</p>
              {remainingValue > 0 && (
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-rose-600 uppercase mt-1">Falta Receber: R$ {remainingValue.toFixed(2)}</span>
                  {installments > 1 && (
                    <span className="text-[10px] font-bold text-slate-500 italic">
                      ({installments}x de R$ {(remainingValue / installments).toFixed(2)})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-50 flex justify-end gap-3 bg-slate-50/30">
          <button onClick={onClose} className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-colors">Cancelar</button>
          <button onClick={handleCreateOrder} disabled={isSaving} className="px-10 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Confirmar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};
