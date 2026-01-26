
import React, { useState } from 'react';
import { 
  LayoutGrid, TrendingDown, Layers, Plus, Trash2, 
  Tag, Package, Info, AlertCircle
} from 'lucide-react';
import { CompanySettings, Product } from '../types';

interface CategoriesGridProps {
  products: Product[];
  settings: CompanySettings;
  onSaveSettings: (settings: CompanySettings) => void;
}

export const CategoriesGrid: React.FC<CategoriesGridProps> = ({ products, settings, onSaveSettings }) => {
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('');
  const [newMaterial, setNewMaterial] = useState('');

  const handleAdd = (type: 'product' | 'expense' | 'material') => {
    let updatedSettings = { ...settings };
    
    if (type === 'product' && newProductCategory.trim()) {
      if (settings.categories?.includes(newProductCategory.trim())) return alert('Categoria já existe');
      updatedSettings.categories = [...(settings.categories || []), newProductCategory.trim()];
      setNewProductCategory('');
    } else if (type === 'expense' && newExpenseCategory.trim()) {
      if (settings.expenseCategories?.includes(newExpenseCategory.trim())) return alert('Categoria já existe');
      updatedSettings.expenseCategories = [...(settings.expenseCategories || []), newExpenseCategory.trim()];
      setNewExpenseCategory('');
    } else if (type === 'material' && newMaterial.trim()) {
      if (settings.materials?.includes(newMaterial.trim())) return alert('Material já existe');
      updatedSettings.materials = [...(settings.materials || []), newMaterial.trim()];
      setNewMaterial('');
    }

    onSaveSettings(updatedSettings);
  };

  const handleRemove = (type: 'product' | 'expense' | 'material', value: string) => {
    if (!window.confirm(`Deseja remover "${value}"?`)) return;
    
    let updatedSettings = { ...settings };
    
    if (type === 'product') {
      const isUsed = products.some(p => p.category === value);
      if (isUsed) return alert('Esta categoria não pode ser removida pois existem produtos vinculados a ela.');
      updatedSettings.categories = settings.categories?.filter(c => c !== value);
    } else if (type === 'expense') {
      updatedSettings.expenseCategories = settings.expenseCategories?.filter(c => c !== value);
    } else if (type === 'material') {
      updatedSettings.materials = settings.materials?.filter(m => m !== value);
    }

    onSaveSettings(updatedSettings);
  };

  const getProductCount = (category: string) => products.filter(p => p.category === category).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      
      {/* CATEGORIAS DE PRODUTOS */}
      <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-50 p-3 rounded-2xl shadow-sm">
            <LayoutGrid className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Categorias de Venda</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Produtos e Serviços</p>
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          <input 
            type="text" 
            placeholder="Nova categoria..." 
            value={newProductCategory}
            onChange={(e) => setNewProductCategory(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
          />
          <button 
            onClick={() => handleAdd('product')}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
          {settings.categories?.map((cat, idx) => (
            <div key={idx} className="group flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                <div>
                  <span className="text-sm font-bold text-slate-700">{cat}</span>
                  <p className="text-[9px] font-black text-slate-400 uppercase">{getProductCount(cat)} produtos vinculados</p>
                </div>
              </div>
              <button 
                onClick={() => handleRemove('product', cat)}
                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIAS FINANCEIRAS */}
      <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-rose-50 p-3 rounded-2xl shadow-sm">
            <TrendingDown className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Fluxo Financeiro</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Categorias de Despesas</p>
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          <input 
            type="text" 
            placeholder="Nova despesa..." 
            value={newExpenseCategory}
            onChange={(e) => setNewExpenseCategory(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-4 focus:ring-rose-500/5 transition-all outline-none"
          />
          <button 
            onClick={() => handleAdd('expense')}
            className="p-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-500/20"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
          {settings.expenseCategories?.map((cat, idx) => (
            <div key={idx} className="group flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:border-rose-100 hover:shadow-sm transition-all">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                <span className="text-sm font-bold text-slate-700">{cat}</span>
              </div>
              <button 
                onClick={() => handleRemove('expense', cat)}
                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MATERIAIS */}
      <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-50 p-3 rounded-2xl shadow-sm">
            <Layers className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Lista de Materiais</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Insumos de Produção</p>
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          <input 
            type="text" 
            placeholder="Novo material..." 
            value={newMaterial}
            onChange={(e) => setNewMaterial(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-4 focus:ring-orange-500/5 transition-all outline-none"
          />
          <button 
            onClick={() => handleAdd('material')}
            className="p-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all active:scale-95 shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
          {settings.materials?.map((mat, idx) => (
            <div key={idx} className="group flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:border-orange-100 hover:shadow-sm transition-all">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                <span className="text-sm font-bold text-slate-700">{mat}</span>
              </div>
              <button 
                onClick={() => handleRemove('material', mat)}
                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
