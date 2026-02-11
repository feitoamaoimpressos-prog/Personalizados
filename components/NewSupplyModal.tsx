
import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Layers, Tag, Database, ShoppingBag, Ruler, DollarSign, AlertTriangle } from 'lucide-react';
import { Supply } from '../types';

interface NewSupplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supply: any) => void;
  supplyToEdit?: Supply | null;
}

export const NewSupplyModal: React.FC<NewSupplyModalProps> = ({ isOpen, onClose, onSave, supplyToEdit }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [minQuantity, setMinQuantity] = useState(0);
  const [unit, setUnit] = useState('un');
  const [costPrice, setCostPrice] = useState(0);
  const [supplier, setSupplier] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const units = ['un', 'kg', 'm', 'cm', 'l', 'ml', 'folha', 'pacote', 'caixa', 'rolo'];

  useEffect(() => {
    if (isOpen) {
      if (supplyToEdit) {
        setName(supplyToEdit.name);
        setCategory(supplyToEdit.category);
        setQuantity(supplyToEdit.quantity);
        setMinQuantity(supplyToEdit.minQuantity);
        setUnit(supplyToEdit.unit);
        setCostPrice(supplyToEdit.costPrice);
        setSupplier(supplyToEdit.supplier || '');
      } else {
        setName('');
        setCategory('');
        setQuantity(0);
        setMinQuantity(0);
        setUnit('un');
        setCostPrice(0);
        setSupplier('');
      }
      setError('');
      setIsSaving(false);
    }
  }, [isOpen, supplyToEdit]);

  const handleSave = () => {
    if (!name.trim()) return setError('Nome é obrigatório.');
    if (!category.trim()) return setError('Categoria é obrigatória.');
    
    setIsSaving(true);
    setTimeout(() => {
      onSave({
        name,
        category,
        quantity,
        minQuantity,
        unit,
        costPrice,
        supplier,
        lastRestock: new Date().toISOString()
      });
      setIsSaving(false);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 p-2 rounded-lg">
              <Layers className="w-5 h-5 text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">{supplyToEdit ? 'Editar Insumo' : 'Novo Insumo'}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {error && <div className="bg-rose-50 text-rose-600 px-4 py-3 rounded-xl text-xs font-bold animate-pulse">{error}</div>}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Material</label>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Ex: Papel Fotográfico 180g"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
                <input 
                  type="text" 
                  placeholder="Ex: Papéis"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Unidade</label>
                <select 
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none appearance-none"
                >
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Qtd Atual</label>
                <div className="relative">
                  <Database className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-orange-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                  Estoque Mínimo
                  <AlertTriangle className="w-3 h-3" />
                </label>
                <div className="relative">
                  <Ruler className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" />
                  <input 
                    type="number" 
                    value={minQuantity}
                    onChange={(e) => setMinQuantity(Number(e.target.value))}
                    className="w-full pl-11 pr-4 py-3 bg-orange-50/30 border border-orange-100 rounded-2xl text-sm font-bold text-orange-600 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Preço de Custo (Unid)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                  <input 
                    type="number" 
                    step="0.01"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-emerald-600 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Fornecedor Padrão</label>
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Nome da Loja"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-50 flex justify-end gap-3 bg-slate-50/30">
          <button onClick={onClose} className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-colors">Cancelar</button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="px-10 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Salvando...' : 'Salvar Insumo'}
          </button>
        </div>
      </div>
    </div>
  );
};
