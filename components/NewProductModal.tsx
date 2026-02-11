import React, { useState, useEffect } from 'react';
import { X, Box, Tag, Layers, Database, Save, ChevronDown, Loader2, Ruler, BoxSelect, Sparkles, TrendingDown, Percent, Info, DollarSign } from 'lucide-react';
import { Product } from '../types';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
  productToEdit?: Product | null;
  configuredMaterials?: string[];
  configuredCategories?: string[];
}

export const NewProductModal: React.FC<NewProductModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  productToEdit, 
  configuredMaterials = [],
  configuredCategories = ['Papelaria', 'Grandes Formatos', 'Brindes', 'Comunicação Visual', 'Outros']
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(configuredCategories[0] || 'Outros');
  const [price, setPrice] = useState<number>(0);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [size, setSize] = useState('');
  const [material, setMaterial] = useState('');
  const [finishing, setFinishing] = useState('');
  const [status, setStatus] = useState<'Disponível' | 'Indisponível'>('Disponível');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Resetar estados ao abrir/fechar ou ao receber produto para edição
  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        setName(productToEdit.name);
        setCategory(productToEdit.category);
        setPrice(productToEdit.price);
        setCostPrice(productToEdit.costPrice || 0);
        setStock(productToEdit.stock);
        setSize(productToEdit.size || '');
        setMaterial(productToEdit.material || '');
        setFinishing(productToEdit.finishing || '');
        setStatus(productToEdit.status);
      } else {
        setName('');
        setCategory(configuredCategories[0] || 'Outros');
        setPrice(0);
        setCostPrice(0);
        setStock(0);
        setSize('');
        setMaterial('');
        setFinishing('');
        setStatus('Disponível');
      }
      setError('');
      setIsSaving(false);
    }
  }, [isOpen, productToEdit, configuredCategories]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('O nome do produto é obrigatório.');
      return;
    }

    setIsSaving(true);
    setError('');

    // Simula um delay de salvamento para feedback visual
    setTimeout(() => {
      onSave({
        name,
        category,
        price,
        costPrice,
        stock,
        size,
        material,
        finishing,
        status,
        updatedAt: new Date().toISOString()
      });
      setIsSaving(false);
    }, 400);
  };

  const margin = price > 0 ? ((price - costPrice) / price) * 100 : 0;
  const markup = costPrice > 0 ? ((price / costPrice) - 1) * 100 : 0;
  const profit = price - costPrice;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col my-8 transform transition-all animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 p-2 rounded-lg">
              <Box className="w-5 h-5 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              {productToEdit ? 'Editar Produto' : 'Cadastrar Novo Produto'}
            </h2>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl text-xs font-bold animate-pulse">
              {error}
            </div>
          )}

          {/* Seção de Especificações */}
          <div className="space-y-6">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Especificações Técnicas</label>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Nome do Produto / Serviço *</label>
              <input 
                autoFocus
                type="text" 
                placeholder="Ex: Cartão de Visita 250g"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Tamanho</label>
                <div className="relative">
                  <Ruler className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" value={size} onChange={(e) => setSize(e.target.value)} placeholder="Ex: 9x5cm" className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/5 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Material</label>
                <div className="relative">
                  <BoxSelect className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    list="material-suggestions"
                    type="text" 
                    value={material} 
                    onChange={(e) => setMaterial(e.target.value)} 
                    placeholder="Ex: Couchê 250g" 
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/5 outline-none transition-all" 
                  />
                  <datalist id="material-suggestions">
                    {configuredMaterials.map((mat, idx) => (
                      <option key={idx} value={mat} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Categoria</label>
                <div className="relative">
                  <Layers className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm appearance-none focus:ring-4 focus:ring-blue-500/5 outline-none"
                  >
                    {configuredCategories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                    {configuredCategories.length === 0 && <option value="Outros">Outros</option>}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Status de Venda</label>
                <div className="relative">
                  <Tag className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm appearance-none focus:ring-4 focus:ring-blue-500/5 outline-none"
                  >
                    <option value="Disponível">Disponível</option>
                    <option value="Indisponível">Indisponível</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* CARD DE PRECIFICAÇÃO */}
          <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 shadow-inner">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Card de Precificação</h3>
              <span title="Configure seus custos para calcular a margem real.">
                <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Preço de Custo (Unidade)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 font-bold text-xs">R$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      value={costPrice}
                      onChange={(e) => setCostPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-rose-600 outline-none focus:ring-4 focus:ring-rose-500/5"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Preço de Venda (Unidade)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-xs">R$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-emerald-600 outline-none focus:ring-4 focus:ring-emerald-500/5"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Estoque em Unidades</label>
                  <div className="relative">
                    <Database className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="number" 
                      value={stock}
                      onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5"
                    />
                  </div>
                </div>
              </div>

              {/* Bloco de Resultados Financeiros */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Lucro Líquido / Unid.</span>
                  <span className="text-sm font-black text-emerald-600">+ R$ {profit.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Markup Estimado</span>
                  <span className="text-sm font-black text-blue-600">{markup.toFixed(0)}%</span>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Margem de Lucro Real</p>
                  <div className="relative h-20 w-20 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                      <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={213.6} strokeDashoffset={213.6 - (213.6 * Math.min(100, margin) / 100)} className={margin > 40 ? 'text-emerald-500' : margin > 20 ? 'text-amber-500' : 'text-rose-500'} />
                    </svg>
                    <span className="absolute text-sm font-black text-slate-800">{margin.toFixed(0)}%</span>
                  </div>
                </div>

                <div className={`mt-2 p-3 rounded-xl text-center text-[10px] font-black uppercase tracking-widest ${
                  margin > 40 ? 'bg-emerald-50 text-emerald-600' : margin > 20 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {margin > 40 ? 'Excelente Rentabilidade' : margin > 20 ? 'Margem Aceitável' : 'Atenção: Margem Baixa'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-50 flex flex-col sm:flex-row justify-end gap-3 bg-slate-50/30">
          <button 
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="flex items-center justify-center gap-2 px-10 py-3 bg-orange-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-500/20"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
};