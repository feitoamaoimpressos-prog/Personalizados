
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
  logo?: string;
  dashboardTitle?: string;
  dashboardSubtitle?: string;
  materials?: string[]; // Lista de materiais pré-configurados
  categories?: string[]; // Lista de categorias de produtos pré-configuradas
}

export interface FinancialStats {
  receberHoje: number;
  pagarHoje: number;
  totalPedidosPeriodo: number;
  totalReceberPeriodo: number;
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
  /**
   * Added 'Apenas Financeiro' to represent non-production related financial records (e.g., installments).
   */
  productionStatus?: 'Pedido em aberto' | 'Criando arte' | 'Pedido em produção' | 'Pedido em transporte' | 'Pedido entregue' | 'Apenas Financeiro';
  items?: OrderItem[];
  customerPhone?: string;
  paymentMethod?: string;
  installments?: number;
  accountName?: string;
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

export type ViewType = 'financeiro' | 'producao' | 'clientes' | 'produtos' | 'pedidos' | 'configuracoes' | 'pdf' | 'historico';
