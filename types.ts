
export interface BankAccount {
  id: string;
  name: string;
  type: string;
  balance: number;
}

export interface CompanySettings {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  pixKey: string;
  pixKeyType?: 'CNPJ' | 'CPF' | 'E-mail' | 'Telefone' | 'Chave Aleatória';
  bankName?: string;
  taxId?: string; // CNPJ
  stateRegistration?: string; // IE
  website?: string;
  instagram?: string;
  logo?: string;
  dashboardTitle?: string;
  dashboardSubtitle?: string;
  dashboardGreeting?: string;
  materials?: string[]; 
  categories?: string[]; 
  expenseCategories?: string[]; 
}

export interface FinancialStats {
  receberHoje: number;
  pagarHoje: number;
  totalPedidosPeriodo: number;
  totalReceberPeriodo: number;
  totalReceberGeral: number; 
  receitas: number;
  despesas: number;
  lucro: number;
  transacoesReceitas: number;
  transacoesDespesas: number;
}

export interface OrderItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customer: string;
  value: number;
  paid: number;
  remaining: number;
  date?: string;
  status?: 'Pendente' | 'Pago' | 'Cancelado';
  productionStatus?: 'Pedido em aberto' | 'Criando arte' | 'Pedido em produção' | 'Pedido em transporte' | 'Pedido entregue' | 'Apenas Financeiro';
  items?: OrderItem[];
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  customerZip?: string;
  customerCity?: string;
  customerState?: string;
  customerTaxId?: string;
  paymentMethod?: string;
  installments?: number;
  accountName?: string;
  shipping?: number;
  discount?: number;
  carrier?: string;
}

export interface Expense {
  id: string;
  description: string;
  value: number;
  dueDate: string;
  status: 'Pendente' | 'Pago';
  category: string;
  quantity?: number;
  unitPrice?: number;
  paymentMethod?: string;
  accountName?: string;
  observations?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  status: 'Ativo' | 'Inativo';
  taxId?: string;
  responsible?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip?: string;
  observations?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  status: 'Disponível' | 'Indisponível';
  size?: string;
  material?: string;
  finishing?: string;
}

export interface Carrier {
  id: string;
  name: string;
  phone: string;
  email?: string;
  responsible?: string;
  type: 'Motoboy' | 'Transportadora' | 'Correios' | 'Retirada';
  status: 'Ativo' | 'Inativo';
}

export type ViewType = 'financeiro' | 'producao' | 'clientes' | 'produtos' | 'categorias' | 'pedidos' | 'configuracoes' | 'pdf' | 'historico';
