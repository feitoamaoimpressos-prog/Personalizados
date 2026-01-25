
import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { QuickStats } from './components/QuickStats';
import { ActionBanner } from './components/ActionBanner';
import { PayableBanner } from './components/PayableBanner';
import { FinancialSummary } from './components/FinancialSummary';
import { BankAccounts } from './components/BankAccounts';
import { ProductionGrid } from './components/ProductionGrid';
import { CustomersGrid } from './components/CustomersGrid';
import { ProductsGrid } from './components/ProductsGrid';
import { OrdersGrid } from './components/OrdersGrid';
import { HistoryGrid } from './components/HistoryGrid';
import { SettingsGrid } from './components/SettingsGrid';
import { NewOrderModal } from './components/NewOrderModal';
import { NewProductModal } from './components/NewProductModal';
import { TransferModal } from './components/TransferModal';
import { NewAccountModal } from './components/NewAccountModal';
import { NewTransactionModal } from './components/NewTransactionModal';
import { NewCustomerModal } from './components/NewCustomerModal';
import { PdfPrintView } from './components/PdfPrintView';
import { OrderDetailView } from './components/OrderDetailView';
import { FinancialStats, BankAccount, ViewType, Product, Order, Expense, Customer, CompanySettings } from './types';
import { LayoutDashboard, Package, Users, Box, ShoppingCart, Settings, History } from 'lucide-react';

const INITIAL_ACCOUNTS: BankAccount[] = [
  { id: '1', name: 'Caixa Geral', type: 'Caixa', balance: 0.00 },
  { id: '2', name: 'Banco Nubank', type: 'Conta Corrente', balance: 0.00 }
];

const INITIAL_COMPANY: CompanySettings = {
  name: 'Personalizados FEITO A MÃO',
  address: 'Rua Jossei Toda, 718 - Residencial Mantiqueira',
  city: 'Pindamonhangaba - SP',
  phone: '(12) 99239-1458',
  email: 'feitoamao.impressos@gmail.com',
  pixKey: '62287343000136',
  logo: '',
  dashboardTitle: 'Dashboard',
  dashboardSubtitle: 'Gestão de Gráfica Rápida',
  materials: ['Couchê 250g', 'Couchê 300g', 'Lona 440g', 'Vinil Adesivo', 'Papel Offset 90g'],
  categories: ['Papelaria', 'Grandes Formatos', 'Brindes', 'Comunicação Visual', 'Outros']
};

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Consumidor Final',
    email: 'atendimento@exemplo.com',
    phone: '',
    totalOrders: 0,
    status: 'Ativo'
  }
];

// Helper to get local date string YYYY-MM-DD
const getLocalDateString = (date: Date = new Date()): string => {
  const pad = (num: number) => (num < 10 ? '0' : '') + num;
  return date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate());
};

// Helper to calculate future dates based on frequency
const getRecurrenceDate = (dateStr: string, frequency: string, index: number): string => {
  const date = new Date(dateStr + 'T12:00:00');
  switch (frequency) {
    case 'Semanal':
      date.setDate(date.getDate() + (index * 7));
      break;
    case 'Quinzenal':
      date.setDate(date.getDate() + (index * 15));
      break;
    case 'Mensal':
      date.setMonth(date.getMonth() + index);
      break;
    case 'Bimestral':
      date.setMonth(date.getMonth() + (index * 2));
      break;
    case 'Semestral':
      date.setMonth(date.getMonth() + (index * 6));
      break;
    case 'Anual':
      date.setFullYear(date.getFullYear() + index);
      break;
    default:
      date.setMonth(date.getMonth() + index);
  }
  return getLocalDateString(date);
};

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('producao');
  const [hideValues, setHideValues] = useState(false);
  
  const now = new Date();
  const firstDay = getLocalDateString(new Date(now.getFullYear(), now.getMonth(), 1));
  const lastDay = getLocalDateString(new Date(now.getFullYear(), now.getMonth() + 1, 0));
  
  const [dateRange, setDateRange] = useState({ start: firstDay, end: lastDay });
  
  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>(INITIAL_ACCOUNTS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(INITIAL_COMPANY);
  
  // Modal States
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const STAGES = [
    'Pedido em aberto',
    'Criando arte',
    'Pedido em produção',
    'Pedido em transporte',
    'Pedido entregue'
  ] as const;

  const filteredExpensesForPeriod = useMemo(() => {
    return expenses.filter(exp => exp.dueDate >= dateRange.start && exp.dueDate <= dateRange.end);
  }, [expenses, dateRange]);

  const filteredOrdersForPeriod = useMemo(() => {
    return orders.filter(order => order.date && order.date >= dateRange.start && order.date <= dateRange.end);
  }, [orders, dateRange]);

  const calculatedStats = useMemo((): FinancialStats => {
    const todayStr = getLocalDateString();
    
    const receberHoje = orders.filter(o => o.date === todayStr && o.remaining > 0).reduce((acc, o) => acc + o.remaining, 0);
    const pagarHoje = expenses.filter(e => e.dueDate === todayStr && e.status === 'Pendente').reduce((acc, e) => acc + e.value, 0);
    
    const totalPedidosPeriodo = filteredOrdersForPeriod
      .filter(o => o.productionStatus !== 'Apenas Financeiro')
      .reduce((acc, o) => acc + o.value, 0);
    
    const totalReceberPeriodo = filteredOrdersForPeriod.reduce((acc, o) => acc + o.remaining, 0);
    
    const receitas = filteredOrdersForPeriod.reduce((acc, o) => acc + o.paid, 0);
    
    const despesas = filteredExpensesForPeriod.filter(e => e.status === 'Pago').reduce((acc, e) => acc + e.value, 0);
    
    return { 
      receberHoje, 
      pagarHoje, 
      totalPedidosPeriodo, 
      totalReceberPeriodo, 
      receitas, 
      despesas, 
      lucro: receitas - despesas, 
      transacoesReceitas: filteredOrdersForPeriod.length, 
      transacoesDespesas: filteredExpensesForPeriod.length 
    };
  }, [filteredOrdersForPeriod, filteredExpensesForPeriod, orders, expenses]);

  const handleSaveCustomer = (customerData: any) => {
    const newCustomer: Customer = {
      id: Math.random().toString(36).substr(2, 9),
      totalOrders: 0,
      status: 'Ativo',
      ...customerData
    };
    setCustomers(prev => [newCustomer, ...prev]);
    setIsNewCustomerModalOpen(false);
  };

  const handleDeleteCustomer = (id: string) => {
    if (window.confirm('Excluir este cliente permanentemente?')) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleSaveOrder = (orderData: any) => {
    const installments = orderData.installments || 1;
    const baseId = Math.floor(100000 + Math.random() * 900000).toString();
    const currentDate = orderData.date || getLocalDateString();
    const firstPayDate = orderData.firstPaymentDate || currentDate;

    if (orderToEdit) {
      setOrders(prev => prev.map(o => o.id === orderToEdit.id ? { ...o, ...orderData, id: o.id } : o));
    } else {
      if (installments > 1) {
        const totalValue = orderData.value;
        const entry = orderData.paid || 0;
        const remainingValue = totalValue - entry;
        const installmentValue = remainingValue / installments;

        const mainOrder: Order = {
          ...orderData,
          id: baseId,
          value: totalValue, 
          paid: entry,
          remaining: 0,
          status: entry >= totalValue ? 'Pago' : 'Pendente',
          productionStatus: orderData.productionStatus || 'Pedido em aberto'
        };

        const financialRecurrences: Order[] = [];

        for (let i = 0; i < installments; i++) {
          financialRecurrences.push({
            ...orderData,
            id: `${baseId}-P${i + 1}`,
            date: getRecurrenceDate(firstPayDate, 'Mensal', i),
            value: 0,
            paid: 0,
            remaining: installmentValue,
            status: 'Pendente',
            productionStatus: 'Apenas Financeiro',
            items: [{ description: `Parcela ${i + 1}/${installments} ref. Pedido #${baseId}`, quantity: 1, unitPrice: installmentValue }]
          });
        }

        setOrders(prev => [mainOrder, ...financialRecurrences, ...prev]);

        if (entry > 0 && orderData.accountName) {
          setAccounts(prev => prev.map(acc => 
            acc.name === orderData.accountName 
              ? { ...acc, balance: acc.balance + entry } 
              : acc
          ));
        }
      } else {
        const order: Order = {
          id: baseId,
          date: currentDate,
          ...orderData
        };
        setOrders(prev => [order, ...prev]);
        
        if (orderData.paid > 0 && orderData.accountName) {
          setAccounts(prev => prev.map(acc => 
            acc.name === orderData.accountName 
              ? { ...acc, balance: acc.balance + orderData.paid } 
              : acc
          ));
        }
      }

      setCustomers(prev => prev.map(c => c.name === orderData.customer ? { ...c, totalOrders: c.totalOrders + 1 } : c));
    }
    setIsNewOrderModalOpen(false);
    setOrderToEdit(null);
  };

  const handleSaveProduct = (productData: any) => {
    if (productToEdit) {
      setProducts(prev => prev.map(p => p.id === productToEdit.id ? { ...p, ...productData, id: p.id } : p));
    } else {
      const product: Product = { id: Math.random().toString(36).substr(2, 9), ...productData };
      setProducts(prev => [product, ...prev]);
    }
    setIsNewProductModalOpen(false);
    setProductToEdit(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Excluir este produto do catálogo?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSaveAccount = (accountData: any) => {
    const newAccount: BankAccount = { id: Math.random().toString(36).substr(2, 9), ...accountData };
    setAccounts(prev => [...prev, newAccount]);
  };

  const handleDeleteAccount = (id: string) => {
    if (accounts.length <= 1) {
      alert("O sistema deve ter pelo menos uma conta ativa.");
      return;
    }
    if (window.confirm('Excluir esta conta permanentemente? Esta ação não pode ser desfeita.')) {
      setAccounts(prev => prev.filter(acc => acc.id !== id));
    }
  };

  const handleSaveTransaction = (data: any) => {
    const isRec = data.isRecurring && data.recurrenceCount > 1;
    const count = isRec ? data.recurrenceCount : 1;
    const frequency = data.recurrenceFrequency || 'Mensal';
    const transactionsToSave: any[] = [];

    for (let i = 0; i < count; i++) {
      const currentEntryDate = i === 0 ? data.dueDate : getRecurrenceDate(data.dueDate, frequency, i);
      const entryId = Math.random().toString(36).substr(2, 9);
      
      const entryData = {
        ...data,
        id: entryId,
        dueDate: currentEntryDate,
        description: isRec ? `${data.description} (${i + 1}/${count})` : data.description,
        status: i === 0 ? data.status : 'Pendente'
      };
      transactionsToSave.push(entryData);
    }

    if (data.type === 'Despesa') {
      setExpenses(prev => [...transactionsToSave, ...prev]);
      
      const initialEntry = transactionsToSave[0];
      if (initialEntry.status === 'Pago' && initialEntry.accountName) {
        setAccounts(prev => prev.map(acc => 
          acc.name === initialEntry.accountName 
            ? { ...acc, balance: acc.balance - initialEntry.value } 
            : acc
        ));
      }
    } else {
      // Fix: Explicitly typing newOrders as Order[] to prevent string widening of productionStatus union type.
      const newOrders: Order[] = transactionsToSave.map(t => ({
        id: t.id,
        customer: t.description,
        value: t.value,
        paid: t.status === 'Pago' ? t.value : 0,
        remaining: t.status === 'Pago' ? 0 : t.value,
        date: t.dueDate,
        status: t.status as any,
        productionStatus: 'Apenas Financeiro',
        accountName: t.accountName,
        paymentMethod: t.paymentMethod
      }));
      
      setOrders(prev => [...newOrders, ...prev]);

      const initialEntry = transactionsToSave[0];
      if (initialEntry.status === 'Pago' && initialEntry.accountName) {
        setAccounts(prev => prev.map(acc => 
          acc.name === initialEntry.accountName 
            ? { ...acc, balance: acc.balance + initialEntry.value } 
            : acc
        ));
      }
    }
  };

  const handleSettleOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const amountToPay = order.remaining;
    
    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, paid: o.paid + amountToPay, remaining: 0, status: 'Pago' as const } : o);
      if (viewingOrder && viewingOrder.id === orderId) {
        setViewingOrder({ ...viewingOrder, paid: viewingOrder.paid + amountToPay, remaining: 0, status: 'Pago' as const });
      }
      return updated;
    });
    
    const targetAccountName = order.accountName || accounts[0]?.name;
    
    if (targetAccountName) {
      setAccounts(prev => prev.map(acc => 
        acc.name === targetAccountName 
          ? { ...acc, balance: acc.balance + amountToPay } 
          : acc
      ));
    }
  };

  const handleSettleExpense = (expenseId: string, accountId?: string) => {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;

    setExpenses(prev => prev.map(e => e.id === expenseId ? { ...e, status: 'Pago' } : e));
    
    let targetAccount = accounts.find(a => a.id === accountId);
    if (!targetAccount) {
      targetAccount = accounts.find(a => a.name === expense.accountName) || accounts[0];
    }
    
    if (targetAccount) {
      setAccounts(prev => prev.map(acc => 
        acc.id === targetAccount?.id 
          ? { ...acc, balance: acc.balance - expense.value } 
          : acc
      ));
    }
  };

  const handleTransfer = (fromId: string, toId: string, amount: number) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === fromId) return { ...acc, balance: acc.balance - amount };
      if (acc.id === toId) return { ...acc, balance: acc.balance + amount };
      return acc;
    }));
  };

  const handleAdvanceStage = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const currentStatus = o.productionStatus || 'Pedido em aberto';
        const currentIndex = STAGES.indexOf(currentStatus as any);
        const nextStatus = STAGES[currentIndex + 1] || currentStatus;
        return { ...o, productionStatus: nextStatus as any };
      }
      return o;
    }));
  };

  const tabs: { id: ViewType; label: string; icon: any }[] = [
    { id: 'producao', label: 'Produção', icon: Package },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart },
    { id: 'financeiro', label: 'Financeiro', icon: LayoutDashboard },
    { id: 'historico', label: 'Histórico', icon: History },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'produtos', label: 'Produtos', icon: Box },
    { id: 'configuracoes', label: 'Sistema', icon: Settings },
  ];

  return (
    <div className="min-h-screen pb-12 bg-slate-50/30 font-inter text-slate-900">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isPrinting && viewingOrder ? (
          <PdfPrintView order={viewingOrder} company={companySettings} onBack={() => setIsPrinting(false)} onSettle={() => handleSettleOrder(viewingOrder.id)} />
        ) : viewingOrder ? (
          <OrderDetailView 
            order={viewingOrder} 
            company={companySettings} 
            onBack={() => setViewingOrder(null)} 
            onSettle={() => handleSettleOrder(viewingOrder.id)} 
            onPrint={() => setIsPrinting(true)}
          />
        ) : (
          <>
            <Header 
              hideValues={hideValues} 
              onToggleHide={() => setHideValues(!hideValues)} 
              dateRange={dateRange} 
              onDateChange={setDateRange} 
              onNewOrder={() => setIsNewOrderModalOpen(true)}
              title={companySettings.dashboardTitle}
              subtitle={companySettings.dashboardSubtitle}
            />
            <div className="mt-8 flex flex-wrap gap-1 p-1 bg-slate-200/50 rounded-xl w-fit">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveView(tab.id)} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeView === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="mt-8">
              {activeView === 'producao' && <ProductionGrid orders={orders} onViewOrder={setViewingOrder} onEditOrder={(o) => {setOrderToEdit(o); setIsNewOrderModalOpen(true);}} onSettleOrder={handleSettleOrder} onAdvanceStage={handleAdvanceStage} />}
              {activeView === 'pedidos' && <OrdersGrid orders={orders} onNewOrder={() => setIsNewOrderModalOpen(true)} onViewOrder={setViewingOrder} onPrintOrder={(o) => {setViewingOrder(o); setIsPrinting(true);}} onEditOrder={(o) => {setOrderToEdit(o); setIsNewOrderModalOpen(true);}} onSettleOrder={handleSettleOrder} />}
              {activeView === 'financeiro' && (
                <div className="space-y-8">
                  <QuickStats stats={calculatedStats} hideValues={hideValues} />
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <ActionBanner orders={filteredOrdersForPeriod} onSettleOrder={handleSettleOrder} onViewOrder={setViewingOrder} hideValues={hideValues} />
                    <PayableBanner expenses={filteredExpensesForPeriod} accounts={accounts} onSettleExpense={handleSettleExpense} onNewTransaction={() => setIsNewTransactionModalOpen(true)} hideValues={hideValues} />
                  </div>
                  <FinancialSummary stats={calculatedStats} hideValues={hideValues} />
                  <BankAccounts accounts={accounts} hideValues={hideValues} onOpenTransfer={() => setIsTransferModalOpen(true)} onOpenNewAccount={() => setIsNewAccountModalOpen(true)} onDeleteAccount={handleDeleteAccount} />
                </div>
              )}
              {activeView === 'historico' && <HistoryGrid orders={orders} onViewOrder={setViewingOrder} />}
              {activeView === 'clientes' && <CustomersGrid customers={customers} onNewCustomer={() => setIsNewCustomerModalOpen(true)} onDeleteCustomer={handleDeleteCustomer} />}
              {activeView === 'produtos' && (
                <ProductsGrid 
                  products={products} 
                  onNewProduct={() => setIsNewProductModalOpen(true)} 
                  onEditProduct={(p) => { setProductToEdit(p); setIsNewProductModalOpen(true); }}
                  onDeleteProduct={handleDeleteProduct}
                />
              )}
              {activeView === 'configuracoes' && <SettingsGrid settings={companySettings} onSaveSettings={setCompanySettings} />}
            </div>
          </>
        )}
      </div>

      <NewOrderModal isOpen={isNewOrderModalOpen} orderToEdit={orderToEdit} onClose={() => {setIsNewOrderModalOpen(false); setOrderToEdit(null);}} onSave={handleSaveOrder} customers={customers} products={products} accounts={accounts} />
      <NewProductModal 
        isOpen={isNewProductModalOpen} 
        productToEdit={productToEdit}
        onClose={() => { setIsNewProductModalOpen(false); setProductToEdit(null); }} 
        onSave={handleSaveProduct} 
        configuredMaterials={companySettings.materials}
        configuredCategories={companySettings.categories}
      />
      <NewCustomerModal isOpen={isNewCustomerModalOpen} onClose={() => setIsNewCustomerModalOpen(false)} onSave={handleSaveCustomer} />
      <NewAccountModal isOpen={isNewAccountModalOpen} onClose={() => setIsNewAccountModalOpen(false)} onSave={handleSaveAccount} />
      <TransferModal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} accounts={accounts} onTransfer={handleTransfer} />
      <NewTransactionModal isOpen={isNewTransactionModalOpen} onClose={() => setIsNewTransactionModalOpen(false)} accounts={accounts} products={products} onSave={handleSaveTransaction} />
    </div>
  );
}
