
import React, { useState } from 'react';
import { Layers, Plus, Search, AlertTriangle, Edit3, Trash2, Filter, Package2, ArrowUpRight } from 'lucide-react';
import { Supply } from '../types';

interface SuppliesGridProps {
  supplies: Supply[];
  onNewSupply: () => void;
  onEditSupply: (supply: Supply) => void;
  onDeleteSupply: (id: string) => void;
}

export const SuppliesGrid: React.FC<SuppliesGridProps> = ({ supplies, onNewSupply, onEditSupply, onDeleteSupply }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');

  const categories = ['Todas', ...Array.from(new Set(supplies.map(s => s.category)))];

  const filteredSupplies = supplies.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (s.supplier && s.supplier.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'Todas' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = supplies.filter(s => s.quantity <= s.minQuantity).length;
  const totalInvestment = supplies.reduce((acc, s) => acc + (s.quantity * s.costPrice), 0);

  return (
    <div className="space-y-6">
      {/* Resumo Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total de Itens</p>
            <p className="text-2xl font-black text-slate-800">{supplies.length}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-2xl">
            <Layers className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        <div className={`p-6 rounded-[2rem] border shadow-sm flex items-center justify-between ${lowStockCount > 0 ? 'bg-orange-50 border-orange-100' : 'bg-white border-slate-100'}`}>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estoque Crítico</p>
            <p className={`text-2xl font-black ${lowStockCount > 0 ? 'text-orange-600' : 'text-slate-800'}`}>{lowStockCount}</p>
          </div>
          <div className={`${lowStockCount > 0 ? 'bg-orange-100' : 'bg-slate-50'} p-3 rounded-2xl transition-colors`}>
            <AlertTriangle className={`w-6 h-6 ${lowStockCount > 0 ? 'text-orange-600' : 'text-slate-400'}`} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Investimento Total</p>
            <p className="text-2xl font-black text-emerald-600">R$ {totalInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-emerald-50 p-3 rounded-2xl">
            <Package2 className="w-6 h-6 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 p-2 rounded-lg">
              <Layers className="w-5 h-5 text-indigo-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Almoxarifado e Insumos</h2>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar insumo..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all w-64 font-bold text-slate-700"
              />
            </div>
            
            <div className="relative">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-indigo-500/20 outline-none"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button 
              onClick={onNewSupply}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] uppercase text-slate-400 font-black border-b border-slate-50 bg-slate-50/30 tracking-widest">
                <th className="py-4 px-6">Material / Insumo</th>
                <th className="py-4 px-6">Categoria</th>
                <th className="py-4 px-6">Quantidade Atual</th>
                <th className="py-4 px-6">Estoque Mínimo</th>
                <th className="py-4 px-6">Custo Médio</th>
                <th className="py-4 px-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSupplies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-20">
                      <Layers className="w-12 h-12" />
                      <p className="text-sm font-black uppercase tracking-widest">Nenhum insumo encontrado</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSupplies.map((supply) => {
                  const isLowStock = supply.quantity <= supply.minQuantity;
                  const percentage = Math.min(100, (supply.quantity / (supply.minQuantity * 2)) * 100);

                  return (
                    <tr key={supply.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-800 tracking-tight">{supply.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{supply.supplier || 'Sem fornecedor'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-[10px] font-black px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg uppercase tracking-widest">
                          {supply.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1.5 min-w-[120px]">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-black ${isLowStock ? 'text-orange-600' : 'text-slate-700'}`}>
                              {supply.quantity} {supply.unit}
                            </span>
                            {isLowStock && <AlertTriangle className="w-3.5 h-3.5 text-orange-500 animate-pulse" />}
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 rounded-full ${isLowStock ? 'bg-orange-500' : 'bg-emerald-500'}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs font-bold text-slate-400">
                          {supply.minQuantity} {supply.unit}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-black text-slate-700">
                          R$ {supply.costPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => onEditSupply(supply)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onDeleteSupply(supply.id)}
                            className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors border border-rose-100"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
