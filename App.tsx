
import React, { useState, useMemo, useEffect } from 'react';
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
import { FinancialStats, BankAccount, ViewType, Product, Order, Expense, Customer, CompanySettings, Carrier, Supply } from './types';
import { LayoutDashboard, Package, Users, Box, ShoppingCart, Settings, History, Layers } from 'lucide-react';

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

const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Adesivo Fotográfico A4', category: 'Impressão', price: 7.00, costPrice: 1.90, stock: 0, status: 'Disponível' },
  { id: 'p2', name: 'Adesivo Fotográfico A4 - Atacado', category: 'Impressão', price: 5.50, costPrice: 1.90, stock: 0, status: 'Disponível' },
  { id: 'p3', name: 'Adesivo Marmitex 220gr', category: 'Impressão', price: 0.90, costPrice: 0.51, stock: 0, status: 'Disponível' },
  { id: 'p4', name: 'Adesivo Vinil - 1 - 3x1,5cm + meio corte', category: 'Adesivos', price: 0.25, costPrice: 0.10, stock: 0, status: 'Disponível' },
  { id: 'p5', name: 'Adesivo Vinil - 2 - 4x2cm + meio corte', category: 'Adesivos', price: 0.35, costPrice: 0.10, stock: 0, status: 'Disponível' },
  { id: 'p6', name: 'Adesivo Vinil - 3 - 6,5x3,5cm + meio corte', category: 'Adesivos', price: 0.50, costPrice: 0.15, stock: 0, status: 'Disponível' },
  { id: 'p7', name: 'Adesivo Vinil - 4 - 7x3cm + meio corte', category: 'Adesivos', price: 0.65, costPrice: 0.15, stock: 0, status: 'Disponível' },
  { id: 'p8', name: 'Adesivo Vinil - 5 - 8,8x5,8cm + meio corte', category: 'Adesivos', price: 0.70, costPrice: 0.15, stock: 0, status: 'Disponível' },
  { id: 'p9', name: 'Adesivo Vinil - 6 - 10x7cm + meio corte', category: 'Adesivos', price: 1.97, costPrice: 0.51, stock: 0, status: 'Disponível' },
  { id: 'p10', name: 'Adesivo Vinil - 7 - 20x10+ meio corte', category: 'Adesivos', price: 10.00, costPrice: 1.90, stock: 0, status: 'Disponível' },
  { id: 'p11', name: 'Adesivo Vinil - Metro 60cm', category: 'Impressão', price: 95.00, costPrice: 36.00, stock: 0, status: 'Disponível' },
  { id: 'p12', name: 'Agenda 2025 - A5 - 2DPP - Promoção', category: 'Impressão', price: 50.00, costPrice: 26.00, stock: 0, status: 'Disponível' },
  { id: 'p13', name: 'Agenda 2026 - A5 - 2DPP', category: 'Impressão', price: 60.00, costPrice: 26.00, stock: 0, status: 'Disponível' },
  { id: 'p14', name: 'Agenda Escolar A6', category: 'Impressão', price: 30.00, costPrice: 0.00, stock: 0, status: 'Disponível' },
  { id: 'p15', name: 'Bandeirola até 10 letras', category: 'Personalizados', price: 25.00, costPrice: 10.24, stock: 0, status: 'Disponível' },
  { id: 'p16', name: 'Banner 60x90 - Com bastão e cordão', category: 'Impressão', price: 115.00, costPrice: 60.00, stock: 0, status: 'Disponível' },
  { id: 'p17', name: 'Bloco A5 - 1 via papel 75g', category: 'Impressão', price: 14.00, costPrice: 5.70, stock: 0, status: 'Disponível' },
  { id: 'p18', name: 'Bloco A6 - 1 via - 10 un.', category: 'Impressão', price: 110.00, costPrice: 41.00, stock: 0, status: 'Disponível' },
  { id: 'p19', name: 'Bloco A6 - 1 via - 20 un.', category: 'Impressão', price: 180.00, costPrice: 82.00, stock: 0, status: 'Disponível' },
  { id: 'p20', name: 'Bloco de comanda Garçon - 7,5x11 2 vias + Carbono', category: 'Impressão', price: 4.50, costPrice: 2.40, stock: 0, status: 'Disponível' },
  { id: 'p21', name: 'Bloco10x14 - 100 Folhas - Wire-o - Capa 180', category: 'Impressão', price: 7.60, costPrice: 0.00, stock: 0, status: 'Disponível' },
  { id: 'p22', name: 'Bloco10x14 - 50 Folhas - Wire-o - Capa 180', category: 'Impressão', price: 5.60, costPrice: 0.00, stock: 0, status: 'Disponível' },
  { id: 'p23', name: 'Bombonieri', category: 'Impressão', price: 13.90, costPrice: 5.46, stock: 0, status: 'Disponível' },
  { id: 'p24', name: 'Caderneta de Vacinação - 15x21 - Espiral - Promoção', category: 'Personalizados', price: 50.00, costPrice: 23.00, stock: 0, status: 'Disponível' },
  { id: 'p25', name: 'Caderno Escolar A5 - Brochura', category: 'Impressão', price: 30.00, costPrice: 10.97, stock: 0, status: 'Disponível' },
  { id: 'p26', name: 'Caderno Escolar A5 - Wire-o', category: 'Impressão', price: 45.00, costPrice: 16.35, stock: 0, status: 'Disponível' },
  { id: 'p27', name: 'Caderno Escolar Universitário - Brochura', category: 'Impressão', price: 45.00, costPrice: 25.00, stock: 0, status: 'Disponível' },
  { id: 'p28', name: 'Caderno Espiral - 25x18', category: 'Impressão', price: 80.00, costPrice: 0.00, stock: 0, status: 'Disponível' },
  { id: 'p29', name: 'Caixa Granada Exército', category: 'Impressão', price: 6.00, costPrice: 2.50, stock: 0, status: 'Disponível' },
  { id: 'p30', name: 'Caixa Kit Lanche', category: 'Impressão', price: 17.60, costPrice: 9.82, stock: 0, status: 'Disponível' },
  { id: 'p31', name: 'Caixa Milk Básica', category: 'Personalizados', price: 4.20, costPrice: 1.58, stock: 0, status: 'Disponível' },
  { id: 'p32', name: 'Caixa Milk Semi-Luxo', category: 'Personalizados', price: 4.70, costPrice: 0.00, stock: 0, status: 'Disponível' },
  { id: 'p33', name: 'Caixa Mochila do Exército', category: 'Impressão', price: 6.00, costPrice: 2.50, stock: 0, status: 'Disponível' },
  { id: 'p34', name: 'Caixa Personalizada', category: 'Impressão', price: 4.70, costPrice: 0.00, stock: 0, status: 'Disponível' },
  { id: 'p35', name: 'Caixa Regador', category: 'Personalizados', price: 8.00, costPrice: 3.00, stock: 0, status: 'Disponível' },
  { id: 'p36', name: 'Caixa Roda Gigante', category: 'Personalizados', price: 8.00, costPrice: 3.00, stock: 0, status: 'Disponível' },
  { id: 'p37', name: 'Caneca', category: 'Impressão', price: 50.00, costPrice: 0.00, stock: 0, status: 'Disponível' },
  { id: 'p38', name: 'Cardápio A4 -Plastificado 8 pág. Frente e Verso', category: 'Impressão', price: 28.00, costPrice: 0.00, stock: 0, status: 'Disponível' },
  { id: 'p39', name: 'Cartão de Visita - 4x1 - 250g Verniz Frente - 1000 Un.', category: 'Impressão', price: 110.00, costPrice: 64.87, stock: 0, status: 'Disponível' },
  { id: 'p40', name: 'Cartão de Visita - 4x4 - 250g Verniz Frente - 1000 Un.', category: 'Impressão', price: 125.00, costPrice: 72.69, stock: 0, status: 'Disponível' },
  { id: 'p41', name: 'Centro de Mesa Sextavado', category: 'Personalizados', price: 8.00, costPrice: 4.73, stock: 0, status: 'Disponível' },
  { id: 'p42', name: 'Chaveiro de Acrílico 3x4', category: 'Personalizados', price: 10.00, costPrice: 3.65, stock: 0, status: 'Disponível' },
  { id: 'p43', name: 'Chaveiro Fio de Malha com tag', category: 'Impressão', price: 10.00, costPrice: 0.00, stock: 0, status: 'Disponível' },
  { id: 'p44', name: 'Diario de Oração', category: 'Impressão', price: 50.00, costPrice: 0.00, stock: 0, status: 'Disponível' },
  { id: 'p45', name: 'Display de Mesa', category: 'Personalizados', price: 8.00, costPrice: 2.50, stock: 0, status: 'Disponível' },
  { id: 'p46', name: 'Encadernação até 150 folhas', category: 'Encadernação', price: 10.00, costPrice: 2.00, stock: 0, status: 'Disponível' },
  { id: 'p47', name: 'Esfera de Natal - Bolinha Avulsa', category: 'Impressão', price: 6.00, costPrice: 2.00, stock: 0, status: 'Disponível' },
  { id: 'p48', name: 'Etiquetas Escolares Kit 1 - 43 un.', category: 'Adesivos', price: 25.00, costPrice: 4.93, stock: 0, status: 'Disponível' },
  { id: 'p49', name: 'Etiquetas Escolares Kit 2 - 86 un.', category: 'Adesivos', price: 35.00, costPrice: 6.81, stock: 0, status: 'Disponível' },
  { id: 'p50', name: 'Etiquetas Escolares Kit 3 - 120 un.', category: 'Adesivos', price: 45.00, costPrice: 8.95, stock: 0, status: 'Disponível' },
  { id: 'p51', name: 'Kit Agenda + Caderno', category: 'Impressão', price: 90.00, costPrice: 45.00, stock: 0, status: 'Disponível' },
  { id: 'p52', name: 'Kit Esfera de Natal - Bolinha', category: 'Impressão', price: 18.00, costPrice: 6.00, stock: 0, status: 'Disponível' },
  { id: 'p53', name: 'Kit M Festa na Mesa', category: 'Impressão', price: 106.25, costPrice: 25.00, stock: 0, status: 'Disponível' },
  { id: 'p54', name: 'Kit P Festa na Mesa', category: 'Impressão', price: 60.00, costPrice: 20.00, stock: 0, status: 'Disponível' },
  { id: 'p55', name: 'Kit pegue e monte 30 peças', category: 'Impressão', price: 90.00, costPrice: 0.00, stock: 0, status: 'Disponível' },
  { id: 'p56', name: 'Mini Caderno A6', category: 'Impressão', price: 18.00, costPrice: 6.00, stock: 0, status: 'Disponível' },
  { id: 'p57', name: 'Nossa Senhora de Vidro tam. 30cm', category: 'Personalizados', price: 15.00, costPrice: 6.65, stock: 0, status: 'Disponível' },
  { id: 'p58', name: 'Painel 60x40', category: 'Personalizados', price: 60.00, costPrice: 0.00, stock: 0, status: 'Disponível' },
  { id: 'p59', name: 'Planner Mensal', category: 'Impressão', price: 50.00, costPrice: 0.00, stock: 0, status: 'Disponível' },
  { id: 'p60', name: 'Planner Semanal', category: 'Impressão', price: 50.00, costPrice: 0.00, stock: 0, status: 'Disponível' },
  { id: 'p61', name: 'Porta Bis', category: 'Impressão', price: 2.70, costPrice: 0.00, stock: 0, status: 'Disponível' },
  { id: 'p62', name: 'Quadro de Parede A4', category: 'Personalizados', price: 8.00, costPrice: 1.78, stock: 0, status: 'Disponível' },
  { id: 'p63', name: 'Quadro infantil ilustrado 21x28cm em papel 180g', category: 'Impressão', price: 7.25, costPrice: 2.35, stock: 0, status: 'Disponível' },
  { id: 'p64', name: 'Sacola Personalizada 15x20,5x5', category: 'Personalizados', price: 7.00, costPrice: 2.50, stock: 0, status: 'Disponível' },
  { id: 'p65', name: 'Saquinho de Suspiro', category: 'Impressão', price: 7.15, costPrice: 2.30, stock: 0, status: 'Disponível' },
  { id: 'p66', name: 'Serviço de Corte e Vinco A4 - Colaborador', category: 'Outros', price: 1.30, costPrice: 0.80, stock: 0, status: 'Disponível' },
  { id: 'p67', name: 'Tag 10x7 - Papel 180g - 450 un.', category: 'Impressão', price: 98.00, costPrice: 0.00, stock: 0, status: 'Disponível' },
  { id: 'p68', name: 'Tag para Canetas 18x5,5', category: 'Personalizados', price: 0.85, costPrice: 0.32, stock: 0, status: 'Disponível' },
  { id: 'p69', name: 'Tobolata 7x10 cm', category: 'Personalizados', price: 11.00, costPrice: 4.40, stock: 0, status: 'Disponível' },
  { id: 'p70', name: 'Topo de bolo Simples', category: 'Personalizados', price: 15.00, costPrice: 0.00, stock: 0, status: 'Disponível' },
  { id: 'p71', name: 'Topper de Docinho 35x35cm com palito', category: 'Impressão', price: 0.90, costPrice: 0.00, stock: 0, status: 'Disponível' },
  { id: 'p72', name: 'Topper para Cupcake - 4x4cm com palito', category: 'Impressão', price: 0.98, costPrice: 0.00, stock: 0, status: 'Disponível' },
  { id: 'p73', name: 'Tubete 13cm', category: 'Personalizados', price: 2.70, costPrice: 0.00, stock: 0, status: 'Disponível' },
  { id: 'p74', name: 'Vela Aromatizada', category: 'Personalizados', price: 19.00, costPrice: 8.80, stock: 0, status: 'Disponível' }
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Adaliana Souza', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c2', name: 'Adriely Balieiro Ribeiro', email: '', phone: '12 99757-9771', totalOrders: 0, status: 'Ativo' },
  { id: 'c3', name: 'Alexandra - Emo', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c4', name: 'Amélia', email: '', phone: '12 99186-3889', totalOrders: 1, status: 'Ativo' },
  { id: 'c5', name: 'ANDERSON LUIZ OURIVES CORREA', email: 'feitoamao.impressos@gmail.com', phone: '12 99239-1458', totalOrders: 0, status: 'Ativo' },
  { id: 'c6', name: 'Beatriz - UTI', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c7', name: 'Beatriz Helena Ártico', email: '', phone: '12 99257-9779', totalOrders: 0, status: 'Ativo' },
  { id: 'c8', name: 'Camila', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c9', name: 'Célia - Santa Casa Guaratinguetá', email: '', phone: '', totalOrders: 2, status: 'Ativo' },
  { id: 'c10', name: 'Ciliane', email: '', phone: '12 99618-5065', totalOrders: 1, status: 'Ativo' },
  { id: 'c11', name: 'Cintia', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c12', name: 'Cris - Loira UTI', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c13', name: 'Cristiane - Cris', email: '', phone: '12 99767-8032', totalOrders: 1, status: 'Ativo' },
  { id: 'c14', name: 'Edimilson - Didi', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c15', name: 'Eliana\'s Restaurante', email: '', phone: '12 99205-3252', totalOrders: 0, status: 'Ativo' },
  { id: 'c16', name: 'Elida - Samira', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c17', name: 'Flávia Ferreira', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c18', name: 'Gabi - Unha', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c19', name: 'Gabriela', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c20', name: 'Geovana - Cris', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c21', name: 'Gera Som', email: 'feitoamao.impressos@gmail.com', phone: '12 99619-3794', totalOrders: 0, status: 'Ativo' },
  { id: 'c22', name: 'Gisele CC', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c23', name: 'Graça - Santa Casa', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c24', name: 'Gráfica Denis', email: '', phone: '12 99702-4365', totalOrders: 1, status: 'Ativo' },
  { id: 'c25', name: 'Gráfica Digital Center', email: '', phone: '12 99600-2727', totalOrders: 2, status: 'Ativo' },
  { id: 'c26', name: 'IRM SENHOR DOS PASSOS E STA CASA DE MISERICORDIA DE GUARATINGUETA', email: 'compras@santacasaguara.com.br', phone: '12 99628-3943', totalOrders: 0, status: 'Ativo' },
  { id: 'c27', name: 'Jeferson Barbearia', email: '', phone: '12 99100-1530', totalOrders: 1, status: 'Ativo' },
  { id: 'c28', name: 'Jéssica - Enfermeira', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c29', name: 'Jéssica - Ortopedia', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c30', name: 'Juliana - Santa Casa', email: '', phone: '', totalOrders: 4, status: 'Ativo' },
  { id: 'c31', name: 'Letícia - Santa Casa Guará', email: '', phone: '', totalOrders: 2, status: 'Ativo' },
  { id: 'c32', name: 'Loja Ireny', email: '', phone: '12 98142-6238', totalOrders: 0, status: 'Ativo' },
  { id: 'c33', name: 'Loja Vitória', email: '', phone: '12 98142-6238', totalOrders: 1, status: 'Ativo' },
  { id: 'c34', name: 'Lorraine - Santa Casa Guara', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c35', name: 'Lúcia Moraes', email: '', phone: '12 99142-7858', totalOrders: 4, status: 'Ativo' },
  { id: 'c36', name: 'Lugui Ferramentas', email: '', phone: '12 98245-1589', totalOrders: 3, status: 'Ativo' },
  { id: 'c37', name: 'Mais Motos', email: '', phone: '12 97409-5312', totalOrders: 1, status: 'Ativo' },
  { id: 'c38', name: 'Mariane Bijoux', email: '', phone: '12 99738-1848', totalOrders: 1, status: 'Ativo' },
  { id: 'c39', name: 'Marina', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c40', name: 'Michele - Enfermeira', email: '', phone: '', totalOrders: 0, status: 'Ativo' },
  { id: 'c41', name: 'Michele - Enfermeira Pediatria', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c42', name: 'Mônica', email: '', phone: '', totalOrders: 0, status: 'Ativo' },
  { id: 'c43', name: 'Natalia - PI', email: '', phone: '', totalOrders: 3, status: 'Ativo' },
  { id: 'c44', name: 'Natália - C1', email: '', phone: '', totalOrders: 2, status: 'Ativo' },
  { id: 'c45', name: 'Ortobom - Guaratinguetá', email: '', phone: '(12) 99239-2009', totalOrders: 0, status: 'Ativo' },
  { id: 'c46', name: 'Paloma - C1', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c47', name: 'Paula Mariana', email: '', phone: '', totalOrders: 0, status: 'Ativo' },
  { id: 'c48', name: 'Pedro', email: '', phone: '', totalOrders: 0, status: 'Ativo' },
  { id: 'c49', name: 'Pizzaria La Bella', email: '', phone: '12 99766-0189', totalOrders: 4, status: 'Ativo' },
  { id: 'c50', name: 'Priscila - Santa Casa Aparecida', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c51', name: 'Psicomed', email: '', phone: '12 3105-3194', totalOrders: 1, status: 'Ativo' },
  { id: 'c52', name: 'Renata', email: '', phone: '12 99725-8925', totalOrders: 1, status: 'Ativo' },
  { id: 'c53', name: 'Renata (Outra)', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c54', name: 'Rose - Enfermeira', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c55', name: 'Samira - Santa Casa Aparecida', email: '', phone: '', totalOrders: 2, status: 'Ativo' },
  { id: 'c56', name: 'Santa Casa de Misericórdia de Guaratinguetá', email: '', phone: '12 2131-1900', totalOrders: 1, status: 'Ativo' },
  { id: 'c57', name: 'Sheila - Festas', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c58', name: 'Silvia - Camila Shopping', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c59', name: 'Suelen', email: '', phone: '', totalOrders: 0, status: 'Ativo' },
  { id: 'c60', name: 'Taisa Helena', email: '', phone: '12 99260-8262', totalOrders: 1, status: 'Ativo' },
  { id: 'c61', name: 'Tassia - Felipe', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c62', name: 'Thais', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c63', name: 'Thais - Cinta', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c64', name: 'Thais - Enfermeira', email: '', phone: '12 99747-2680', totalOrders: 1, status: 'Ativo' },
  { id: 'c65', name: 'Valquiria - Val', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c66', name: 'Vanessa', email: '', phone: '', totalOrders: 1, status: 'Ativo' },
  { id: 'c67', name: 'Yane', email: '', phone: '', totalOrders: 1, status: 'Ativo' }
];

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
  const [activeView, setActiveView] = useState<ViewType>(() => (localStorage.getItem('activeView') as ViewType) || 'producao');
  const [hideValues, setHideValues] = useState(() => localStorage.getItem('hideValues') === 'true');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const now = new Date();
  const firstDay = getLocalDateString(new Date(now.getFullYear(), now.getMonth(), 1));
  const lastDay = getLocalDateString(new Date(now.getFullYear(), now.getMonth() + 1, 0));
  
  const [dateRange, setDateRange] = useState(() => {
    const saved = localStorage.getItem('dateRange');
    return saved ? JSON.parse(saved) : { start: firstDay, end: lastDay };
  });
  
  // Refatoração dos initializers para evitar sobrescrita se a lista estiver vazia por escolha do usuário
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    if (saved === null) return INITIAL_PRODUCTS; // Primeira vez usando o app
    try {
      return JSON.parse(saved);
    } catch { return INITIAL_PRODUCTS; }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    if (saved === null) return [];
    try {
      return JSON.parse(saved);
    } catch { return []; }
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    if (saved === null) return [];
    try {
      return JSON.parse(saved);
    } catch { return []; }
  });

  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem('accounts');
    if (saved === null) return INITIAL_ACCOUNTS;
    try {
      return JSON.parse(saved);
    } catch { return INITIAL_ACCOUNTS; }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('customers');
    if (saved === null) return INITIAL_CUSTOMERS; // Primeira vez usando o app
    try {
      return JSON.parse(saved);
    } catch { return INITIAL_CUSTOMERS; }
  });

  const [supplies, setSupplies] = useState<Supply[]>(() => {
    const saved = localStorage.getItem('supplies');
    if (saved === null) return [];
    try {
      return JSON.parse(saved);
    } catch { return []; }
  });

  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem('companySettings');
    if (saved === null) return INITIAL_COMPANY;
    try {
      return JSON.parse(saved);
    } catch { return INITIAL_COMPANY; }
  });

  const [carriers, setCarriers] = useState<Carrier[]>(() => {
    const saved = localStorage.getItem('carriers');
    if (saved === null) return [];
    try {
      return JSON.parse(saved);
    } catch { return []; }
  });

  // Efeito de persistência automática global - agora salva SEMPRE que houver alteração
  useEffect(() => { 
    try {
      localStorage.setItem('products', JSON.stringify(products)); 
      localStorage.setItem('orders', JSON.stringify(orders));
      localStorage.setItem('expenses', JSON.stringify(expenses));
      localStorage.setItem('accounts', JSON.stringify(accounts));
      localStorage.setItem('customers', JSON.stringify(customers));
      localStorage.setItem('supplies', JSON.stringify(supplies));
      localStorage.setItem('companySettings', JSON.stringify(companySettings));
      localStorage.setItem('carriers', JSON.stringify(carriers));
      localStorage.setItem('activeView', activeView);
      localStorage.setItem('dateRange', JSON.stringify(dateRange));
      localStorage.setItem('hideValues', String(hideValues));
      setLastSaved(new Date());
    } catch (e) {
      console.error("Erro ao salvar dados localmente:", e);
    }
  }, [products, orders, expenses, accounts, customers, supplies, companySettings, carriers, activeView, dateRange, hideValues]);

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

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.products) setProducts(data.products);
        if (data.orders) setOrders(data.orders);
        if (data.expenses) setExpenses(data.expenses);
        if (data.accounts) setAccounts(data.accounts);
        if (data.customers) setCustomers(data.customers);
        if (data.supplies) setSupplies(data.supplies);
        if (data.companySettings) setCompanySettings(data.companySettings);
        if (data.carriers) setCarriers(data.carriers);
        alert('Backup restaurado com sucesso!');
      } catch (error) {
        alert('Erro ao processar arquivo de backup.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = (type: 'orders' | 'financeiro' | 'all') => {
    if (!window.confirm('Atenção: Esta ação é irreversível. Deseja realmente excluir os dados selecionados?')) return;
    
    if (type === 'orders') {
      setOrders([]);
    } else if (type === 'financeiro') {
      setExpenses([]);
      setAccounts(INITIAL_ACCOUNTS);
    } else if (type === 'all') {
      // Limpa o localStorage para forçar o recarregamento dos INITIAL_... no próximo refresh ou imediatamente
      localStorage.clear();
      setOrders([]);
      setExpenses([]);
      setCustomers(INITIAL_CUSTOMERS);
      setProducts(INITIAL_PRODUCTS);
      setSupplies([]);
      setAccounts(INITIAL_ACCOUNTS);
      setCompanySettings(INITIAL_COMPANY);
      setCarriers([]);
      alert('O sistema foi limpo e as listas oficiais foram restauradas.');
      window.location.reload(); // Recarrega para limpar todos os estados e referências
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
    
    const totalPedidosPeriodo = filteredOrdersForPeriod.reduce((acc, o) => {
      if (o.productionStatus === 'Apenas Financeiro') {
        return acc + o.value;
      } else {
        if (o.installments && o.installments > 1) {
          return acc + (o.paid || 0);
        } else {
          return acc + o.value;
        }
      }
    }, 0);

    const totalReceberPeriodo = filteredOrdersForPeriod.reduce((acc, o) => {
      if (o.productionStatus === 'Apenas Financeiro') {
        return acc + o.remaining;
      } else {
        if (o.installments && o.installments > 1) {
          return acc;
        }
        return acc + o.remaining;
      }
    }, 0);

    const totalReceberGeral = orders.reduce((acc, o) => {
      if (o.productionStatus === 'Apenas Financeiro') {
        return acc + o.remaining;
      } else {
        if (o.installments && o.installments > 1) {
          return acc;
        }
        return acc + o.remaining;
      }
    }, 0);

    const receitas = filteredOrdersForPeriod.reduce((acc, o) => acc + o.paid, 0);
    const despesas = filteredExpensesForPeriod.filter(e => e.status === 'Pago').reduce((acc, e) => acc + e.value, 0);
    
    return { 
      receberHoje, 
      pagarHoje, 
      totalPedidosPeriodo, 
      totalReceberPeriodo, 
      totalReceberGeral, 
      receitas, 
      despesas, 
      lucro: receitas - despesas, 
      transacoesReceitas: filteredOrdersForPeriod.filter(o => o.paid > 0).length, 
      transacoesDespesas: filteredExpensesForPeriod.filter(e => e.status === 'Pago').length 
    };
  }, [filteredOrdersForPeriod, filteredExpensesForPeriod, orders, expenses]);

  const handleSaveCustomer = (customerData: any) => {
    if (customerToEdit) {
      setCustomers(prev => prev.map(c => c.id === customerToEdit.id ? { ...c, ...customerData } : c).sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      const newCustomer: Customer = { id: Math.random().toString(36).substr(2, 9), totalOrders: 0, status: 'Ativo', ...customerData };
      setCustomers(prev => [newCustomer, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
    }
    setIsNewCustomerModalOpen(false);
    setCustomerToEdit(null);
  };

  const handleSaveSupply = (supplyData: any) => {
    if (supplyToEdit) {
      setSupplies(prev => prev.map(s => s.id === supplyToEdit.id ? { ...s, ...supplyData, id: s.id } : s).sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      const supply: Supply = { id: Math.random().toString(36).substr(2, 9), ...supplyData };
      setSupplies(prev => [supply, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
    }
    setIsNewSupplyModalOpen(false);
    setSupplyToEdit(null);
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
        if (entry > 0 && orderData.accountName) {
          setAccounts(prev => prev.map(acc => acc.name === orderData.accountName ? { ...acc, balance: acc.balance + entry } : acc));
        }
      } else {
        const order: Order = { id: baseId, date: currentDate, ...orderData, installments: 1 };
        setOrders(prev => [order, ...prev]);
        if (orderData.paid > 0 && orderData.accountName) {
          setAccounts(prev => prev.map(acc => acc.name === orderData.accountName ? { ...acc, balance: acc.balance + orderData.paid } : acc));
        }
      }
      setCustomers(prev => prev.map(c => c.name === orderData.customer ? { ...c, totalOrders: c.totalOrders + 1 } : c));
    }
    setIsNewOrderModalOpen(false);
    setOrderToEdit(null);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['productionStatus']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, productionStatus: newStatus } : o));
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Deseja realmente excluir este pedido? Esta ação não pode ser desfeita.')) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
    }
  };

  const handleSaveProduct = (productData: any) => {
    if (productToEdit) {
      setProducts(prev => prev.map(p => p.id === productToEdit.id ? { ...p, ...productData, id: p.id } : p).sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      const product: Product = { id: Math.random().toString(36).substr(2, 9), ...productData };
      setProducts(prev => [product, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
    }
    setIsNewProductModalOpen(false);
    setProductToEdit(null);
  };

  const handleSaveTransaction = (data: any) => {
    const id = Math.random().toString(36).substr(2, 9);
    if (data.type === 'Despesa') {
      const newExpense: Expense = { id, description: data.description, value: data.value, dueDate: data.dueDate, status: data.status, category: data.category, quantity: data.quantity, unitPrice: data.unitPrice, paymentMethod: data.paymentMethod, accountName: data.accountName, observations: data.observations };
      if (data.isRecurring && data.recurrenceFrequency && data.recurrenceCount) {
        const recurrences: Expense[] = [];
        for (let i = 1; i < data.recurrenceCount; i++) {
          recurrences.push({ ...newExpense, id: `${id}-R${i}`, dueDate: getRecurrenceDate(data.dueDate, data.recurrenceFrequency, i), status: 'Pendente' });
        }
        setExpenses(prev => [...prev, newExpense, ...recurrences]);
      } else {
        setExpenses(prev => [...prev, newExpense]);
      }
      if (data.status === 'Pago') {
        setAccounts(prev => prev.map(acc => acc.name === data.accountName ? { ...acc, balance: acc.balance - data.value } : acc));
      }
    } else {
      const newOrder: Order = { id: `REC-${id}`, customer: 'Lançamento Avulso', value: data.value, paid: data.status === 'Pago' ? data.value : 0, remaining: data.status === 'Pago' ? 0 : data.value, date: data.dueDate, status: data.status, productionStatus: 'Apenas Financeiro', items: [{ description: data.description, quantity: data.quantity, unitPrice: data.unitPrice }], paymentMethod: data.paymentMethod, accountName: data.accountName, installments: 1 };
      if (data.isRecurring && data.recurrenceFrequency && data.recurrenceCount) {
        const recurrences: Order[] = [];
        for (let i = 1; i < data.recurrenceCount; i++) {
          recurrences.push({ ...newOrder, id: `REC-${id}-R${i}`, date: getRecurrenceDate(data.dueDate, data.recurrenceFrequency, i), paid: 0, remaining: data.value, status: 'Pendente', installments: 1 });
        }
        setOrders(prev => [...prev, newOrder, ...recurrences]);
      } else {
        setOrders(prev => [...prev, newOrder]);
      }
      if (data.status === 'Pago') {
        setAccounts(prev => prev.map(acc => acc.name === data.accountName ? { ...acc, balance: acc.balance + data.value } : acc));
      }
    }
  };

  const handleSettleOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const amountToPay = order.remaining;
    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, paid: o.paid + amountToPay, remaining: 0, status: 'Pago' as const } : o);
      if (viewingOrder && viewingOrder.id === orderId) setViewingOrder({ ...viewingOrder, paid: viewingOrder.paid + amountToPay, remaining: 0, status: 'Pago' as const });
      return updated;
    });
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
    { id: 'insumos', label: 'Insumos', icon: Layers },
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
          <OrderDetailView order={viewingOrder} company={companySettings} onBack={() => setViewingOrder(null)} onSettle={() => handleSettleOrder(viewingOrder.id)} onPrint={() => setIsPrinting(true)} />
        ) : (
          <>
            <Header hideValues={hideValues} onToggleHide={() => setHideValues(!hideValues)} dateRange={dateRange} onDateChange={setDateRange} onNewOrder={() => setIsNewOrderModalOpen(true)} title={companySettings.dashboardTitle} subtitle={companySettings.dashboardSubtitle} greeting={companySettings.dashboardGreeting} lastSaved={lastSaved} showHideButton={activeView === 'financeiro'} />
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
                    <ActionBanner orders={filteredOrdersForPeriod} onSettleOrder={handleSettleOrder} onViewOrder={setViewingOrder} hideValues={hideValues} />
                    <PayableBanner expenses={filteredExpensesForPeriod} accounts={accounts} onSettleExpense={handleSettleExpense} onNewTransaction={() => setIsNewTransactionModalOpen(true)} hideValues={hideValues} />
                  </div>
                  <FinancialSummary stats={calculatedStats} hideValues={hideValues} />
                  <BankAccounts accounts={accounts} hideValues={hideValues} onOpenTransfer={() => setIsTransferModalOpen(true)} onOpenNewAccount={() => setIsNewAccountModalOpen(true)} onDeleteAccount={(id) => setAccounts(prev => prev.filter(acc => acc.id !== id))} />
                </div>
              )}
              {activeView === 'insumos' && <SuppliesGrid supplies={supplies} onNewSupply={() => setIsNewSupplyModalOpen(true)} onEditSupply={(s) => { setSupplyToEdit(s); setIsNewSupplyModalOpen(true); }} onDeleteSupply={(id) => setSupplies(prev => prev.filter(s => s.id !== id))} />}
              {activeView === 'historico' && <HistoryGrid orders={filteredOrdersForPeriod} onViewOrder={setViewingOrder} />}
              {activeView === 'clientes' && <CustomersGrid customers={customers} onNewCustomer={() => setIsNewCustomerModalOpen(true)} onEditCustomer={(c) => { setCustomerToEdit(c); setIsNewCustomerModalOpen(true); }} onDeleteCustomer={(id) => setCustomers(prev => prev.filter(c => c.id !== id))} />}
              {activeView === 'produtos' && <ProductsGrid products={products} onNewProduct={() => setIsNewProductModalOpen(true)} onEditProduct={(p) => { setProductToEdit(p); setIsNewProductModalOpen(true); }} onDeleteProduct={(id) => setProducts(prev => prev.filter(p => p.id !== id))} />}
              {activeView === 'configuracoes' && <SettingsGrid settings={companySettings} carriers={carriers} onSaveSettings={setCompanySettings} onSaveCarriers={setCarriers} onExport={handleExportData} onImport={handleImportData} onClearData={handleClearData} />}
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
      <NewTransactionModal isOpen={isNewTransactionModalOpen} onClose={() => setIsNewTransactionModalOpen(false)} accounts={accounts} products={products} expenseCategories={companySettings.expenseCategories} onSave={handleSaveTransaction} />
    </div>
  );
}
