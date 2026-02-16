
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { QuickStats } from './components/QuickStats';
import { ActionBanner } from './components/ActionBanner';
import { PayableBanner } from './components/PayableBanner';
import { FinancialSummary } from './components/FinancialSummary';
import { BankAccounts } from './components/BankAccounts';
import { FinancialRegistry } from './components/FinancialRegistry';
import { ProductionGrid } from './components/ProductionGrid';
import { CustomersGrid } from './components/CustomersGrid';
import { ProductsGrid } from './components/ProductsGrid';
import { OrdersGrid } from './components/OrdersGrid';
import { HistoryGrid } from './components/HistoryGrid';
import { SettingsGrid } from './components/SettingsGrid';
import { SuppliesGrid } from './components/SuppliesGrid';
import { NewOrderModal } from './components/NewOrderModal';
import { NewProductModal } from './components/NewProductModal';
import { TransferModal } from './components/TransferModal';
import { NewAccountModal } from './components/NewAccountModal';
import { NewTransactionModal } from './components/NewTransactionModal';
import { NewCustomerModal } from './components/NewCustomerModal';
import { NewSupplyModal } from './components/NewSupplyModal';
import { PdfPrintView } from './components/PdfPrintView';
import { OrderDetailView } from './components/OrderDetailView';
import { SyncTool } from './components/SyncTool';
import { FinancialStats, BankAccount, ViewType, Product, Order, Expense, Customer, CompanySettings, Carrier, Supply } from './types';
import { LayoutDashboard, Package, Users, Box, ShoppingCart, Settings, History, Layers, Loader2 } from 'lucide-react';
import { db } from './db';
import { syncService } from './services/syncService';

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
  website: 'www.feitoamaoimpressos.com.br',
  instagram: '@feitoamao.impressos',
  taxId: '62.287.343/0001-36',
  stateRegistration: 'ISENTO',
  pixKey: '62287343000136',
  pixKeyType: 'CNPJ',
  bankName: 'Nubank',
  logo: '',
  dashboardTitle: 'Painel de Gestão',
  dashboardSubtitle: 'Personalizados FEITO A MÃO',
  dashboardGreeting: 'Olá, Bem-vindo de volta!',
  materials: ['Couchê 250g', 'Couchê 300g', 'Lona 440g', 'Vinil Adesivo', 'Papel Offset 90g'],
  categories: ['Impressão', 'Adesivos', 'Personalizados', 'Encadernação', 'Outros'],
  expenseCategories: ['Fornecedor', 'Aluguel', 'Luz/Água', 'Marketing', 'Manutenção', 'Salários', 'Impostos', 'Outros']
};

const getLocalDateString = (date: Date = new Date()): string => {
  const pad = (num: number) => (num < 10 ? '0' : '') + num;
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
};

const getRecurrenceDate = (dateStr: string, frequency: string, index: number): string => {
  const date = new Date(dateStr + 'T12:00:00');
  switch (frequency) {
    case 'Semanal': date.setDate(date.getDate() + (index * 7)); break;
    case 'Quinzenal': date.setDate(date.getDate() + (index * 15)); break;
    case 'Mensal': date.setMonth(date.getMonth() + index); break;
    case 'Bimestral': date.setMonth(date.getMonth() + (index * 2)); break;
    case 'Semestral': date.setMonth(date.getMonth() + (index * 6)); break;
    case 'Anual': date.setFullYear(date.getFullYear() + index); break;
    default: date.setMonth(date.getMonth() + index);
  }
  return getLocalDateString(date);
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('producao');
  const [hideValues, setHideValues] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [lastCloudSync, setLastCloudSync] = useState<number>(0);
  const [syncKey, setSyncKey] = useState<string | null>(null);
  
  const now = new Date();
  const firstDay = getLocalDateString(new Date(now.getFullYear(), now.getMonth(), 1));
  const lastDay = getLocalDateString(new Date(now.getFullYear(), now.getMonth() + 1, 0));
  
  const [dateRange, setDateRange] = useState({ start: firstDay, end: lastDay });
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>(INITIAL_ACCOUNTS);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(INITIAL_COMPANY);
  const [carriers, setCarriers] = useState<Carrier[]>([]);

  // Ref de controle para evitar uploads circulares durante o download
  const isImportingRef = useRef(false);
  const loadingRef = useRef(true);

  // Carregamento Inicial do IndexedDB
  useEffect(() => {
    async function initDB() {
      try {
        const savedData = await db.load('fullState');
        if (savedData) {
          isImportingRef.current = true;
          if (savedData.products) setProducts(savedData.products);
          if (savedData.orders) setOrders(savedData.orders);
          if (savedData.expenses) setExpenses(savedData.expenses);
          if (savedData.accounts) setAccounts(savedData.accounts);
          if (savedData.customers) setCustomers(savedData.customers);
          if (savedData.supplies) setSupplies(savedData.supplies);
          if (savedData.companySettings) setCompanySettings(savedData.companySettings);
          if (savedData.carriers) setCarriers(savedData.carriers);
          if (savedData.activeView) setActiveView(savedData.activeView);
          if (savedData.dateRange) setDateRange(savedData.dateRange);
          if (savedData.hideValues !== undefined) setHideValues(savedData.hideValues);
          if (savedData.syncKey) setSyncKey(savedData.syncKey);
          if (savedData.lastCloudSync) setLastCloudSync(savedData.lastCloudSync);
          setTimeout(() => { isImportingRef.current = false; }, 2000);
        }
      } catch (err) {
        console.error("Erro ao carregar banco de dados local:", err);
      } finally {
        loadingRef.current = false;
        setIsInitialized(true);
        setIsLoading(false);
      }
    }
    initDB();
  }, []);

  // Salvamento Automático Local e Upload para Nuvem
  useEffect(() => { 
    if (!isInitialized || loadingRef.current || isImportingRef.current) return;
    
    const timer = setTimeout(async () => {
      try {
        const stateToSave = { 
          products, orders, expenses, accounts, customers, 
          supplies, companySettings, carriers, activeView, 
          dateRange, hideValues, syncKey, lastCloudSync
        };
        await db.save('fullState', stateToSave);
        setLastSaved(new Date());

        // Só faz upload se tiver chave e NÃO estiver no meio de um download
        if (syncKey && !isImportingRef.current) {
          const success = await syncService.upload(syncKey, stateToSave);
          if (success) {
            const newTs = Date.now();
            setLastCloudSync(newTs);
          }
        }
      } catch (e) {
        console.error("Falha no salvamento:", e);
      }
    }, 2000); 

    return () => clearTimeout(timer);
  }, [products, orders, expenses, accounts, customers, supplies, companySettings, carriers, activeView, dateRange, hideValues, syncKey, isInitialized]);

  // Polling de Sincronização (Download)
  useEffect(() => {
    if (!syncKey || !isInitialized) return;

    const interval = setInterval(async () => {
      if (isImportingRef.current) return; // Não baixa se já estiver processando algo

      const cloudData = await syncService.download(syncKey);
      if (cloudData && cloudData.timestamp > lastCloudSync) {
        console.log("Nuvem atualizada em:", new Date(cloudData.timestamp).toLocaleTimeString());
        handleImportData(cloudData.data);
        setLastCloudSync(cloudData.timestamp);
      }
    }, 20000); // Frequência aumentada para 20s

    return () => clearInterval(interval);
  }, [syncKey, lastCloudSync, isInitialized]);

  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isNewSupplyModalOpen, setIsNewSupplyModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [supplyToEdit, setSupplyToEdit] = useState<Supply | null>(null);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handleExportData = () => {
    const fullData = { products, orders, expenses, accounts, customers, supplies, companySettings, carriers };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_feito_a_mao_${getLocalDateString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (data: any) => {
    if (!data) return;
    try {
      isImportingRef.current = true; // Bloqueia uploads imediatos
      if (data.products) setProducts(data.products);
      if (data.orders) setOrders(data.orders);
      if (data.expenses) setExpenses(data.expenses);
      if (data.accounts) setAccounts(data.accounts);
      if (data.customers) setCustomers(data.customers);
      if (data.supplies) setSupplies(data.supplies);
      if (data.companySettings) setCompanySettings(data.companySettings);
      if (data.carriers) setCarriers(data.carriers);
      if (data.syncKey) setSyncKey(data.syncKey);
      
      // Libera o bloqueio após o React processar todos os estados
      setTimeout(() => {
        isImportingRef.current = false;
      }, 3000);
    } catch (error) {
      console.error('Erro na importação:', error);
      isImportingRef.current = false;
    }
  };

  const handleClearData = (type: 'orders' | 'financeiro' | 'all') => {
    if (!window.confirm('Atenção: Esta ação é irreversível e os dados serão removidos deste dispositivo. Deseja continuar?')) return;
    if (type === 'orders') {
      setOrders([]);
    } else if (type === 'financeiro') {
      setExpenses([]);
      setAccounts(INITIAL_ACCOUNTS);
    } else if (type === 'all') {
      indexedDB.deleteDatabase('GraficaDashboardDB');
      window.location.reload();
      return;
    }
    alert('Operação concluída.');
  };

  const STAGES = ['Pedido em aberto', 'Criando arte', 'Pedido em produção', 'Pedido em transporte', 'Pedido entregue'] as const;

  const filteredExpensesForPeriod = useMemo(() => expenses.filter(exp => exp.dueDate >= dateRange.start && exp.dueDate <= dateRange.end), [expenses, dateRange]);
  const filteredOrdersForPeriod = useMemo(() => orders.filter(order => order.date && order.date >= dateRange.start && order.date <= dateRange.end), [orders, dateRange]);

  const calculatedStats = useMemo((): FinancialStats => {
    const todayStr = getLocalDateString();
    const receberHoje = orders.filter(o => o.date === todayStr && o.remaining > 0).reduce((acc, o) => acc + o.remaining, 0);
    const pagarHoje = expenses.filter(e => e.dueDate === todayStr && e.status === 'Pendente').reduce((acc, e) => acc + e.value, 0);
    const totalPedidosPeriodo = filteredOrdersForPeriod.reduce((acc, o) => (o.productionStatus === 'Apenas Financeiro' ? acc + o.value : acc + (o.installments && o.installments > 1 ? (o.paid || 0) : o.value)), 0);
    const totalReceberPeriodo = filteredOrdersForPeriod.reduce((acc, o) => acc + (o.remaining || 0), 0);
    const totalReceberGeral = orders.reduce((acc, o) => acc + (o.remaining || 0), 0);
    const receitas = filteredOrdersForPeriod.reduce((acc, o) => acc + o.paid, 0);
    const despesas = filteredExpensesForPeriod.filter(e => e.status === 'Pago').reduce((acc, e) => acc + e.value, 0);
    return { receberHoje, pagarHoje, totalPedidosPeriodo, totalReceberPeriodo, totalReceberGeral, receitas, despesas, lucro: receitas - despesas, transacoesReceitas: filteredOrdersForPeriod.filter(o => o.paid > 0).length, transacoesDespesas: filteredExpensesForPeriod.filter(e => e.status === 'Pago').length };
  }, [filteredOrdersForPeriod, filteredExpensesForPeriod, orders, expenses]);

  const handleSaveCustomer = (customerData: any) => {
    if (customerToEdit) { setCustomers(prev => prev.map(c => c.id === customerToEdit.id ? { ...c, ...customerData } : c).sort((a, b) => a.name.localeCompare(b.name))); }
    else { setCustomers(prev => [{ id: Math.random().toString(36).substr(2, 9), totalOrders: 0, status: 'Ativo', ...customerData }, ...prev].sort((a, b) => a.name.localeCompare(b.name))); }
    setIsNewCustomerModalOpen(false); setCustomerToEdit(null);
  };

  const handleSaveSupply = (supplyData: any) => {
    if (supplyToEdit) { setSupplies(prev => prev.map(s => s.id === supplyToEdit.id ? { ...s, ...supplyData, id: s.id } : s).sort((a, b) => a.name.localeCompare(b.name))); }
    else { setSupplies(prev => [{ id: Math.random().toString(36).substr(2, 9), ...supplyData }, ...prev].sort((a, b) => a.name.localeCompare(b.name))); }
    setIsNewSupplyModalOpen(false); setSupplyToEdit(null);
  };

  const handleSaveOrder = (orderData: any) => {
    const installments = orderData.installments || 1;
    const baseId = orderToEdit ? orderToEdit.id : Math.floor(100000 + Math.random() * 900000).toString();
    const currentDate = orderData.date || getLocalDateString();
    const firstPayDate = orderData.firstPaymentDate || currentDate;

    if (orderToEdit) {
      setOrders(prev => prev.map(o => o.id === orderToEdit.id ? { ...o, ...orderData, id: o.id } : o));
    } else {
      const totalValue = orderData.value;
      const entry = orderData.paid || 0;
      const remainingValue = totalValue - entry;

      if (installments > 1) {
        const installmentValue = remainingValue / installments;
        const mainOrder: Order = { ...orderData, id: baseId, value: totalValue, paid: entry, remaining: remainingValue, status: entry >= totalValue ? 'Pago' : 'Pendente', productionStatus: orderData.productionStatus || 'Pedido em aberto', installments: installments };
        const financialRecurrences: Order[] = [];
        for (let i = 0; i < installments; i++) {
          financialRecurrences.push({ ...orderData, id: `${baseId}-P${i + 1}`, date: getRecurrenceDate(firstPayDate, 'Mensal', i), value: installmentValue, paid: 0, remaining: installmentValue, status: 'Pendente', productionStatus: 'Apenas Financeiro', items: [{ description: `Parcela ${i + 1}/${installments} ref. Pedido #${baseId}`, quantity: 1, unitPrice: installmentValue }], installments: 1 });
        }
        setOrders(prev => [mainOrder, ...financialRecurrences, ...prev]);
        if (entry > 0 && orderData.accountName) { setAccounts(prev => prev.map(acc => acc.name === orderData.accountName ? { ...acc, balance: acc.balance + entry } : acc)); }
      } else {
        setOrders(prev => [{ id: baseId, date: currentDate, ...orderData, installments: 1 }, ...prev]);
        if (orderData.paid > 0 && orderData.accountName) { setAccounts(prev => prev.map(acc => acc.name === orderData.accountName ? { ...acc, balance: acc.balance + orderData.paid } : acc)); }
      }
      setCustomers(prev => prev.map(c => c.name === orderData.customer ? { ...c, totalOrders: c.totalOrders + 1 } : c));
    }
    setIsNewOrderModalOpen(false); setOrderToEdit(null);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['productionStatus']) => { setOrders(prev => prev.map(o => o.id === orderId ? { ...o, productionStatus: newStatus } : o)); };
  const handleDeleteOrder = (orderId: string) => { if (window.confirm('Deseja realmente excluir este pedido?')) { setOrders(prev => prev.filter(o => o.id !== orderId)); } };
  
  const handleSaveProduct = (productData: any) => {
    if (productToEdit) { setProducts(prev => prev.map(p => p.id === productToEdit.id ? { ...p, ...productData, id: p.id } : p).sort((a, b) => a.name.localeCompare(b.name))); }
    else { setProducts(prev => [{ id: Math.random().toString(36).substr(2, 9), ...productData }, ...prev].sort((a, b) => a.name.localeCompare(b.name))); }
    setIsNewProductModalOpen(false); setProductToEdit(null);
  };

  const handleSaveTransaction = (data: any) => {
    if (expenseToEdit) {
      setExpenses(prev => prev.map(e => e.id === expenseToEdit.id ? { ...e, ...data, id: e.id } : e));
      setExpenseToEdit(null);
      setIsNewTransactionModalOpen(false);
      return;
    }

    const id = Math.random().toString(36).substr(2, 9);
    if (data.type === 'Despesa') {
      const newExpense: Expense = { id, description: data.description, value: data.value, dueDate: data.dueDate, status: data.status, category: data.category, quantity: data.quantity, unitPrice: data.unitPrice, paymentMethod: data.paymentMethod, accountName: data.accountName, observations: data.observations };
      if (data.isRecurring && data.recurrenceFrequency && data.recurrenceCount) {
        const recurrences: Expense[] = [];
        for (let i = 1; i < data.recurrenceCount; i++) {
          recurrences.push({ ...newExpense, id: `${id}-R${i}`, dueDate: getRecurrenceDate(data.dueDate, data.recurrenceFrequency, i), status: 'Pendente' });
        }
        setExpenses(prev => [...prev, newExpense, ...recurrences]);
      } else { setExpenses(prev => [...prev, newExpense]); }
      if (data.status === 'Pago') { setAccounts(prev => prev.map(acc => acc.name === data.accountName ? { ...acc, balance: acc.balance - data.value } : acc)); }
    } else {
      const newOrder: Order = { id: `REC-${id}`, customer: 'Lançamento Avulso', value: data.value, paid: data.status === 'Pago' ? data.value : 0, remaining: data.status === 'Pago' ? 0 : data.value, date: data.dueDate, status: data.status, productionStatus: 'Apenas Financeiro', items: [{ description: data.description, quantity: data.quantity, unitPrice: data.unitPrice }], paymentMethod: data.paymentMethod, accountName: data.accountName, installments: 1 };
      if (data.isRecurring && data.recurrenceFrequency && data.recurrenceCount) {
        const recurrences: Order[] = [];
        for (let i = 1; i < data.recurrenceCount; i++) {
          recurrences.push({ ...newOrder, id: `REC-${id}-R${i}`, date: getRecurrenceDate(data.dueDate, data.recurrenceFrequency, i), paid: 0, remaining: data.value, status: 'Pendente', installments: 1 });
        }
        setOrders(prev => [...prev, newOrder, ...recurrences]);
      } else { setOrders(prev => [...prev, newOrder]); }
      if (data.status === 'Pago') { setAccounts(prev => prev.map(acc => acc.name === data.accountName ? { ...acc, balance: acc.balance + data.value } : acc)); }
    }
  };

  const handleSettleOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const amountToPay = order.remaining;
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paid: o.paid + amountToPay, remaining: 0, status: 'Pago' as const } : o));
    const targetAccountName = order.accountName || accounts[0]?.name;
    if (targetAccountName) setAccounts(prev => prev.map(acc => acc.name === targetAccountName ? { ...acc, balance: acc.balance + amountToPay } : acc));
  };

  const handleSettleExpense = (expenseId: string, accountId?: string) => {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;
    setExpenses(prev => prev.map(e => e.id === expenseId ? { ...e, status: 'Pago' } : e));
    let targetAccount = accounts.find(a => a.id === accountId) || accounts.find(a => a.name === expense.accountName) || accounts[0];
    if (targetAccount) setAccounts(prev => prev.map(acc => acc.id === targetAccount?.id ? { ...acc, balance: acc.balance - expense.value } : acc));
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Deseja excluir este registro de despesa?')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleAdvanceStage = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const currentStatus = o.productionStatus || 'Pedido em aberto';
        const nextStatus = STAGES[STAGES.indexOf(currentStatus as any) + 1] || currentStatus;
        return { ...o, productionStatus: nextStatus as any };
      }
      return o;
    }));
  };

  const tabs: { id: ViewType; label: string; icon: any }[] = [
    { id: 'producao', label: 'Produção', icon: Package },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart },
    { id: 'financeiro', label: 'Financeiro', icon: LayoutDashboard },
    { id: 'insumos', label: 'Insumos', icon: Layers },
    { id: 'historico', label: 'Histórico', icon: History },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'produtos', label: 'Produtos', icon: Box },
    { id: 'configuracoes', label: 'Sistema', icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <div className="text-center">
          <p className="text-lg font-black text-slate-800 uppercase tracking-tighter">Sincronizando Banco de Dados</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Carregando informações locais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 bg-slate-50/30 font-inter text-slate-900">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isPrinting && viewingOrder ? (
          <PdfPrintView order={viewingOrder} company={companySettings} onBack={() => setIsPrinting(false)} onSettle={() => handleSettleOrder(viewingOrder.id)} />
        ) : viewingOrder ? (
          <OrderDetailView order={viewingOrder} company={companySettings} onBack={() => setViewingOrder(null)} onSettle={() => handleSettleOrder(viewingOrder.id)} onPrint={() => setIsPrinting(true)} />
        ) : (
          <>
            <Header 
              hideValues={hideValues} 
              onToggleHide={() => setHideValues(!hideValues)} 
              dateRange={dateRange} 
              onDateChange={setDateRange} 
              onNewOrder={() => setIsNewOrderModalOpen(true)} 
              onOpenSync={() => setIsSyncModalOpen(true)}
              title={companySettings.dashboardTitle} 
              subtitle={companySettings.dashboardSubtitle} 
              greeting={companySettings.dashboardGreeting} 
              lastSaved={lastSaved} 
              isCloudActive={!!syncKey}
              showHideButton={activeView === 'financeiro'} 
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
              {activeView === 'producao' && <ProductionGrid orders={filteredOrdersForPeriod} onViewOrder={setViewingOrder} onEditOrder={(o) => {setOrderToEdit(o); setIsNewOrderModalOpen(true);}} onSettleOrder={handleSettleOrder} onAdvanceStage={handleAdvanceStage} onDeleteOrder={handleDeleteOrder} />}
              {activeView === 'pedidos' && <OrdersGrid orders={filteredOrdersForPeriod} onNewOrder={() => setIsNewOrderModalOpen(true)} onViewOrder={setViewingOrder} onPrintOrder={(o) => {setViewingOrder(o); setIsPrinting(true);}} onEditOrder={(o) => {setOrderToEdit(o); setIsNewOrderModalOpen(true);}} onSettleOrder={handleSettleOrder} onUpdateStatus={handleUpdateOrderStatus} onDeleteOrder={handleDeleteOrder} />}
              {activeView === 'financeiro' && (
                <div className="space-y-8">
                  <QuickStats stats={calculatedStats} hideValues={hideValues} />
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <ActionBanner orders={filteredOrdersForPeriod} onSettleOrder={handleSettleOrder} onViewOrder={setViewingOrder} onEditOrder={(o) => {setOrderToEdit(o); setIsNewOrderModalOpen(true);}} hideValues={hideValues} />
                    <PayableBanner expenses={filteredExpensesForPeriod} accounts={accounts} onSettleExpense={handleSettleExpense} onEditExpense={(e) => {setExpenseToEdit(e); setIsNewTransactionModalOpen(true);}} onNewTransaction={() => setIsNewTransactionModalOpen(true)} hideValues={hideValues} />
                  </div>
                  <FinancialSummary stats={calculatedStats} hideValues={hideValues} />
                  <BankAccounts accounts={accounts} hideValues={hideValues} onOpenTransfer={() => setIsTransferModalOpen(true)} onOpenNewAccount={() => setIsNewAccountModalOpen(true)} onDeleteAccount={(id) => setAccounts(prev => prev.filter(acc => acc.id !== id))} />
                  <FinancialRegistry orders={filteredOrdersForPeriod} expenses={filteredExpensesForPeriod} accounts={accounts} hideValues={hideValues} dateRange={dateRange} onDeleteTransaction={(id, type) => type === 'Receita' ? handleDeleteOrder(id) : handleDeleteExpense(id)} />
                </div>
              )}
              {activeView === 'insumos' && <SuppliesGrid supplies={supplies} onNewSupply={() => setIsNewSupplyModalOpen(true)} onEditSupply={(s) => { setSupplyToEdit(s); setIsNewSupplyModalOpen(true); }} onDeleteSupply={(id) => setSupplies(prev => prev.filter(s => s.id !== id))} />}
              {activeView === 'historico' && <HistoryGrid orders={filteredOrdersForPeriod} onViewOrder={setViewingOrder} />}
              {activeView === 'clientes' && <CustomersGrid customers={customers} onNewCustomer={() => setIsNewCustomerModalOpen(true)} onEditCustomer={(c) => { setCustomerToEdit(c); setIsNewCustomerModalOpen(true); }} onDeleteCustomer={(id) => setCustomers(prev => prev.filter(c => c.id !== id))} />}
              {activeView === 'produtos' && <ProductsGrid products={products} onNewProduct={() => setIsNewProductModalOpen(true)} onEditProduct={(p) => { setProductToEdit(p); setIsNewProductModalOpen(true); }} onDeleteProduct={(id) => setProducts(prev => prev.filter(p => p.id !== id))} />}
              {activeView === 'configuracoes' && <SettingsGrid settings={companySettings} carriers={carriers} onSaveSettings={setCompanySettings} onSaveCarriers={setCarriers} onExport={handleExportData} onImport={(file) => {
                const reader = new FileReader();
                reader.onload = (e) => handleImportData(JSON.parse(e.target?.result as string));
                reader.readAsText(file);
              }} onClearData={handleClearData} currentFullData={{ products, orders, expenses, accounts, customers, supplies, companySettings, carriers }} />}
            </div>
          </>
        )}
      </div>
      <NewOrderModal isOpen={isNewOrderModalOpen} orderToEdit={orderToEdit} onClose={() => {setIsNewOrderModalOpen(false); setOrderToEdit(null);}} onSave={handleSaveOrder} customers={customers} products={products} accounts={accounts} carriers={carriers} />
      <NewProductModal isOpen={isNewProductModalOpen} productToEdit={productToEdit} onClose={() => { setIsNewProductModalOpen(false); setProductToEdit(null); }} onSave={handleSaveProduct} configuredMaterials={companySettings.materials} configuredCategories={companySettings.categories} />
      <NewCustomerModal isOpen={isNewCustomerModalOpen} customerToEdit={customerToEdit} onClose={() => { setIsNewCustomerModalOpen(false); setCustomerToEdit(null); }} onSave={handleSaveCustomer} />
      <NewSupplyModal isOpen={isNewSupplyModalOpen} supplyToEdit={supplyToEdit} onClose={() => { setIsNewSupplyModalOpen(false); setSupplyToEdit(null); }} onSave={handleSaveSupply} />
      <NewAccountModal isOpen={isNewAccountModalOpen} onClose={() => setIsNewAccountModalOpen(false)} onSave={(acc) => setAccounts(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), ...acc }])} />
      <TransferModal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} accounts={accounts} onTransfer={(fromId, toId, amount) => setAccounts(prev => prev.map(acc => acc.id === fromId ? { ...acc, balance: acc.balance - amount } : acc.id === toId ? { ...acc, balance: acc.balance + amount } : acc))} />
      <NewTransactionModal isOpen={isNewTransactionModalOpen} expenseToEdit={expenseToEdit} onClose={() => {setIsNewTransactionModalOpen(false); setExpenseToEdit(null);}} accounts={accounts} products={products} expenseCategories={companySettings.expenseCategories} onSave={handleSaveTransaction} />
      <SyncTool 
        isOpen={isSyncModalOpen} 
        onClose={() => setIsSyncModalOpen(false)} 
        onImport={handleImportData}
        onSetKey={(key) => {
          setSyncKey(key);
          setLastCloudSync(0); 
        }}
        currentData={{ products, orders, expenses, accounts, customers, supplies, companySettings, carriers }}
      />
    </div>
  );
}
