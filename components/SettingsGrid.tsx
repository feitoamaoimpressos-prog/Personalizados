
import React, { useState, useRef } from 'react';
import { Settings, Building2, Bell, ShieldCheck, Palette, Save, CreditCard, Clock, FileText, Smartphone, Image as ImageIcon, Trash2, Layers, Plus, Tag, Layout } from 'lucide-react';
import { CompanySettings } from '../types';

interface SettingsGridProps {
  settings: CompanySettings;
  onSaveSettings: (settings: CompanySettings) => void;
}

export const SettingsGrid: React.FC<SettingsGridProps> = ({ settings, onSaveSettings }) => {
  const [formData, setFormData] = useState<CompanySettings>(settings);
  const [newMaterial, setNewMaterial] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSaveSettings(formData);
    alert('Configurações salvas com sucesso!');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setFormData({ ...formData, logo: '' });
  };

  const handleAddMaterial = () => {
    if (!newMaterial.trim()) return;
    const materials = formData.materials || [];
    if (materials.includes(newMaterial.trim())) {
      alert('Este material já está na lista.');
      return;
    }
    setFormData({
      ...formData,
      materials: [...materials, newMaterial.trim()]
    });
    setNewMaterial('');
  };

  const handleRemoveMaterial = (index: number) => {
    const materials = [...(formData.materials || [])];
    materials.splice(index, 1);
    setFormData({ ...formData, materials });
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    const categories = formData.categories || [];
    if (categories.includes(newCategory.trim())) {
      alert('Esta categoria já está na lista.');
      return;
    }
    setFormData({
      ...formData,
      categories: [...categories, newCategory.trim()]
    });
    setNewCategory('');
  };

  const handleRemoveCategory = (index: number) => {
    const categories = [...(formData.categories || [])];
    categories.splice(index, 1);
    setFormData({ ...formData, categories });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center gap-3">
          <div className="bg-slate-100 p-2 rounded-lg">
            <Settings className="w-5 h-5 text-slate-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Configurações do Sistema</h2>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Perfil da Gráfica / Configuração do PDF */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Configuração do PDF & Documentos</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Nome da Empresa (Cabeçalho PDF)</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Endereço Completo</label>
                <input 
                  type="text" 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Cidade/UF</label>
                  <input 
                    type="text" 
                    value={formData.city} 
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Telefone de Contato</label>
                  <input 
                    type="text" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">E-mail de Contato</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                />
              </div>
            </div>

            {/* Nova Seção: Personalização do Painel */}
            <div className="pt-8 border-t border-slate-100 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Layout className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Personalização do Painel (Dashboard)</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Título do Painel</label>
                  <input 
                    type="text" 
                    value={formData.dashboardTitle} 
                    onChange={(e) => setFormData({...formData, dashboardTitle: e.target.value})}
                    placeholder="Ex: Dashboard de Gestão"
                    className="w-full px-4 py-2.5 bg-blue-50/30 border border-blue-100 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Subtítulo do Painel</label>
                  <input 
                    type="text" 
                    value={formData.dashboardSubtitle} 
                    onChange={(e) => setFormData({...formData, dashboardSubtitle: e.target.value})}
                    placeholder="Ex: Gestão de Gráfica Rápida"
                    className="w-full px-4 py-2.5 bg-blue-50/30 border border-blue-100 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Gestão de Materiais */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Gestão de Materiais</h3>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Novo material (ex: Couchê 250g)"
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddMaterial()}
                  className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
                <button 
                  onClick={handleAddMaterial}
                  className="p-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2">
                {formData.materials && formData.materials.length > 0 ? (
                  formData.materials.map((mat, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200 group">
                      <span className="text-sm font-medium text-slate-700">{mat}</span>
                      <button 
                        onClick={() => handleRemoveMaterial(idx)}
                        className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-4">Nenhum material configurado.</p>
                )}
              </div>
            </div>

            {/* Gestão de Categorias */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-purple-500" />
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Gestão de Categorias</h3>
              </div>
              
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  placeholder="Nova categoria (ex: Adesivos)"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
                <button 
                  onClick={handleAddCategory}
                  className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2">
                {formData.categories && formData.categories.length > 0 ? (
                  formData.categories.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200 group">
                      <span className="text-sm font-medium text-slate-700">{cat}</span>
                      <button 
                        onClick={() => handleRemoveCategory(idx)}
                        className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-4">Nenhuma categoria configurada.</p>
                )}
              </div>
            </div>
          </div>

          {/* Financeiro no Documento */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Dados Financeiros no PDF</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Chave PIX (Para Recebimento)</label>
                <div className="relative group">
                   <Smartphone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                   <input 
                    type="text" 
                    value={formData.pixKey} 
                    onChange={(e) => setFormData({...formData, pixKey: e.target.value})}
                    placeholder="E-mail, CPF, CNPJ ou Celular"
                    className="w-full pl-11 pr-4 py-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-sm font-black text-emerald-700 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-2 italic font-medium">Esta chave será exibida no rodapé de todos os Pedidos e Orçamentos.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {formData.logo ? (
                        <div className="relative w-12 h-12 bg-white rounded-lg border border-slate-200 overflow-hidden group/logo">
                          <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                          <button 
                            onClick={handleRemoveLogo}
                            className="absolute inset-0 bg-rose-500/80 text-white flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-white border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-300">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-slate-700">Logo no Documento</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {formData.logo ? 'Imagem carregada' : 'Atualmente usa iniciais (G)'}
                        </p>
                      </div>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 transition-colors"
                    >
                      Alterar
                    </button>
                 </div>
              </div>
            </div>
          </div>

          {/* Segurança e Aparência */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-4 h-4 text-purple-500" />
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Aparência e Acesso</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors group">
                <ShieldCheck className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
                <span className="text-xs font-bold text-slate-600">Permissões</span>
              </button>
              <button className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors group">
                <Palette className="w-6 h-6 text-slate-400 group-hover:text-purple-500" />
                <span className="text-xs font-bold text-slate-600">Tema Visual</span>
              </button>
              <button className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors group">
                <Bell className="w-6 h-6 text-slate-400 group-hover:text-orange-500" />
                <span className="text-xs font-bold text-slate-600">Notificações</span>
              </button>
              <button className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors group">
                <ShieldCheck className="w-6 h-6 text-slate-400 group-hover:text-emerald-500" />
                <span className="text-xs font-bold text-slate-600">Backup</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};
