
import React, { useState, useRef } from 'react';
import { 
  Settings, Building2, Save, FileText, Layout, Layers, Plus, Trash2, 
  Globe, Instagram, CreditCard, Landmark, Smartphone, Image as ImageIcon,
  ShieldCheck, Upload, Download, Database, Mail, Phone, MapPin, LayoutGrid, Truck, Wrench, AlertTriangle, TrendingDown, Copy, RefreshCw
} from 'lucide-react';
import { CompanySettings, Carrier } from '../types';

interface SettingsGridProps {
  settings: CompanySettings;
  carriers: Carrier[];
  onSaveSettings: (settings: CompanySettings) => void;
  onSaveCarriers: (carriers: Carrier[]) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onClearData: (type: 'orders' | 'financeiro' | 'all') => void;
  currentFullData: any;
}

export const SettingsGrid: React.FC<SettingsGridProps> = ({ settings, carriers, onSaveSettings, onSaveCarriers, onExport, onImport, onClearData, currentFullData }) => {
  const [formData, setFormData] = useState<CompanySettings>(settings);
  const [carriersList, setCarriersList] = useState<Carrier[]>(carriers);
  const [newMaterial, setNewMaterial] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('');
  const [newCarrier, setNewCarrier] = useState({ name: '', type: 'Motoboy' as any });
  const [syncCode, setSyncCode] = useState('');
  
  const backupInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const maskPhone = (value: string) => {
    let v = value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length <= 2) return v.length > 0 ? `(${v}` : v;
    if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length <= 10) return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
    return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
  };

  const maskCnpj = (value: string) => {
    let v = value.replace(/\D/g, "").substring(0, 14);
    if (v.length <= 2) return v;
    if (v.length <= 5) return `${v.slice(0, 2)}.${v.slice(2)}`;
    if (v.length <= 8) return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5)}`;
    if (v.length <= 12) return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(8)}`;
    return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(8, 12)}-${v.slice(12)}`;
  };

  const handleSave = () => {
    onSaveSettings(formData);
    onSaveCarriers(carriersList);
    alert('Todas as configurações e categorias foram salvas com sucesso!');
  };

  const generateSyncCode = () => {
    try {
      const json = JSON.stringify(currentFullData);
      const encoded = btoa(unescape(encodeURIComponent(json)));
      setSyncCode(encoded);
    } catch (e) {
      alert("Erro ao gerar código. Tente usar o backup em arquivo.");
    }
  };

  const importSyncCode = () => {
    if (!syncCode) return;
    try {
      const decoded = decodeURIComponent(escape(atob(syncCode)));
      const data = JSON.parse(decoded);
      if (confirm("Isso irá substituir todos os dados atuais. Continuar?")) {
        const file = new File([decoded], "sync.json", { type: 'application/json' });
        onImport(file);
        setSyncCode('');
      }
    } catch (e) {
      alert("Código de sincronização inválido.");
    }
  };

  const handleAddCarrier = () => {
    if (!newCarrier.name.trim()) return;
    const c: Carrier = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCarrier.name,
      type: newCarrier.type,
      phone: '',
      status: 'Ativo'
    };
    setCarriersList([...carriersList, c]);
    setNewCarrier({ name: '', type: 'Motoboy' });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { 
        alert("A logo é muito grande. Use uma imagem menor que 1MB para não sobrecarregar o banco de dados local.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* SEÇÃO PRINCIPAL: IDENTIDADE E LOGO */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Identidade da Gráfica</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Informações base e branding</p>
            </div>
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            Salvar Tudo
          </button>
        </div>

        <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Logo Upload */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div 
              onClick={() => logoInputRef.current?.click()}
              className="w-48 h-48 rounded-[2rem] border-4 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group overflow-hidden relative"
            >
              {formData.logo ? (
                <img src={formData.logo} alt="Logo" className="w-full h-full object-contain p-4" />
              ) : (
                <>
                  <ImageIcon className="w-10 h-10 text-slate-300 group-hover:text-blue-400 mb-2" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">Carregar Logo</span>
                </>
              )}
            </div>
            <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
          </div>

          {/* Form Content */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Fantasia</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefone / WhatsApp</label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: maskPhone(e.target.value)})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cidade / Estado</label>
              <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Endereço Completo</label>
              <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* DADOS FISCAIS E FINANCEIROS */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Documentação e Redes</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CNPJ</label>
                <input type="text" value={formData.taxId} onChange={(e) => setFormData({...formData, taxId: maskCnpj(e.target.value)})} placeholder="00.000.000/0000-00" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Inscrição Estadual</label>
                <input type="text" value={formData.stateRegistration} onChange={(e) => setFormData({...formData, stateRegistration: e.target.value})} placeholder="Isento ou Número" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Website</label>
                <input type="text" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} placeholder="www.grafica.com" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Instagram</label>
                <input type="text" value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})} placeholder="@seuinsta" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Pagamento Padrão (PIX)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chave PIX</label>
                <input type="text" value={formData.pixKey} onChange={(e) => setFormData({...formData, pixKey: e.target.value})} placeholder="Celular, E-mail ou CNPJ" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Banco</label>
                <input type="text" value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} placeholder="Ex: Nubank, Itaú..." className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5" />
              </div>
            </div>
          </div>
        </div>

        {/* TRANSPORTADORAS E PERSONALIZAÇÃO */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
            <div className="flex items-center gap-3">
              <Layout className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Interface do Dashboard</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título do Painel</label>
                <input type="text" value={formData.dashboardTitle} onChange={(e) => setFormData({...formData, dashboardTitle: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subtítulo</label>
                <input type="text" value={formData.dashboardSubtitle} onChange={(e) => setFormData({...formData, dashboardSubtitle: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Saudação Personalizada</label>
                <input type="text" value={formData.dashboardGreeting} onChange={(e) => setFormData({...formData, dashboardGreeting: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" placeholder="Ex: Olá, Bem-vindo!" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Gestão de Transportadoras</h3>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input type="text" placeholder="Nome da Transportadora" value={newCarrier.name} onChange={(e) => setNewCarrier({...newCarrier, name: e.target.value})} className="flex-1 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" />
                <select value={newCarrier.type} onChange={(e) => setNewCarrier({...newCarrier, type: e.target.value as any})} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold">
                  <option value="Motoboy">Motoboy</option>
                  <option value="Transportadora">Transportadora</option>
                  <option value="Correios">Correios</option>
                  <option value="Retirada">Retirada</option>
                </select>
                <button onClick={handleAddCarrier} className="p-2 bg-blue-600 text-white rounded-xl"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {carriersList.map(c => (
                  <div key={c.id} className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-lg">
                    <span className="text-[10px] font-black text-blue-700 uppercase">{c.name} ({c.type})</span>
                    <button onClick={() => setCarriersList(carriersList.filter(item => item.id !== c.id))} className="text-blue-400 hover:text-rose-500"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LISTA DE MATERIAIS */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-orange-600" />
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Lista de Materiais</h3>
          </div>
          <div className="flex gap-4">
            <input type="text" placeholder="Novo material..." value={newMaterial} onChange={(e) => setNewMaterial(e.target.value)} className="flex-1 px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
            <button onClick={() => {if(newMaterial.trim()){setFormData({...formData, materials: [...(formData.materials || []), newMaterial.trim()]}); setNewMaterial('');}}} className="px-6 bg-orange-600 text-white rounded-2xl"><Plus className="w-5 h-5" /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.materials?.map((m, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-600">{m}</span>
                <button onClick={() => setFormData({...formData, materials: formData.materials?.filter((_, idx) => idx !== i)})} className="text-slate-300 hover:text-rose-500"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* GESTÃO DE CATEGORIAS DE VENDA */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Categorias de Venda (Produtos)</h3>
          </div>
          <div className="flex gap-4">
            <input type="text" placeholder="Nova categoria de venda..." value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="flex-1 px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
            <button onClick={() => {if(newCategory.trim()){setFormData({...formData, categories: [...(formData.categories || []), newCategory.trim()]}); setNewCategory('');}}} className="px-6 bg-indigo-600 text-white rounded-2xl"><Plus className="w-5 h-5" /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.categories?.map((c, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-600">{c}</span>
                <button onClick={() => setFormData({...formData, categories: formData.categories?.filter((_, idx) => idx !== i)})} className="text-slate-300 hover:text-rose-500"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* GESTÃO DE CATEGORIAS FINANCEIRAS */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
          <div className="flex items-center gap-3">
            <TrendingDown className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Categorias Financeiras (Despesas)</h3>
          </div>
          <div className="flex gap-4">
            <input type="text" placeholder="Nova categoria de despesa..." value={newExpenseCategory} onChange={(e) => setNewExpenseCategory(e.target.value)} className="flex-1 px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
            <button onClick={() => {if(newExpenseCategory.trim()){setFormData({...formData, expenseCategories: [...(formData.expenseCategories || []), newExpenseCategory.trim()]}); setNewExpenseCategory('');}}} className="px-6 bg-rose-600 text-white rounded-2xl"><Plus className="w-5 h-5" /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.expenseCategories?.map((c, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-600">{c}</span>
                <button onClick={() => setFormData({...formData, expenseCategories: formData.expenseCategories?.filter((_, idx) => idx !== i)})} className="text-slate-300 hover:text-rose-500"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* GESTÃO DE DADOS DO DASHBOARD */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
          <div className="flex items-center gap-3">
            <Wrench className="w-5 h-5 text-slate-600" />
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Manutenção e Sincronização</h3>
          </div>
          
          {/* Transferência Rápida */}
          <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-[2rem] space-y-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-600" />
              <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Sincronização Rápida (Sem Arquivo)</p>
            </div>
            <div className="flex flex-col gap-3">
              <textarea 
                placeholder="Cole aqui seu código de sincronização de outra conta..."
                value={syncCode}
                onChange={(e) => setSyncCode(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-blue-200 rounded-2xl text-[10px] font-mono outline-none focus:ring-4 focus:ring-blue-500/10 min-h-[80px]"
              />
              <div className="flex gap-2">
                <button 
                  onClick={generateSyncCode}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
                >
                  <Copy className="w-3.5 h-3.5" /> Gerar Código
                </button>
                <button 
                  onClick={importSyncCode}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-blue-300 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all"
                >
                  <Upload className="w-3.5 h-3.5" /> Importar Código
                </button>
              </div>
              <p className="text-[8px] text-blue-400 font-bold uppercase leading-tight italic">
                * O código de sincronização permite mover todos os seus dados entre navegadores ou computadores sem precisar de arquivos. Basta gerar o código em uma máquina e colar na outra.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={onExport} className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl hover:bg-emerald-100 transition-all">
              <Download className="w-5 h-5 text-emerald-600" />
              <div className="text-left">
                <p className="text-[9px] font-black text-emerald-700 uppercase">Exportar Backup</p>
                <p className="text-[7px] text-emerald-600 font-bold uppercase">Salvar tudo em JSON</p>
              </div>
            </button>
            <button onClick={() => backupInputRef.current?.click()} className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl hover:bg-blue-100 transition-all">
              <Upload className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="text-[9px] font-black text-blue-700 uppercase">Importar Backup</p>
                <p className="text-[7px] text-blue-600 font-bold uppercase">Restaurar sistema</p>
              </div>
            </button>
            <input type="file" ref={backupInputRef} className="hidden" accept=".json" onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
          </div>

          <div className="pt-4 border-t border-slate-50 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Ações Irreversíveis</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                onClick={() => onClearData('orders')}
                className="px-4 py-2.5 bg-white border border-rose-100 rounded-xl text-[10px] font-bold text-rose-600 hover:bg-rose-50 transition-all text-left"
              >
                Limpar Pedidos
              </button>
              <button 
                onClick={() => onClearData('financeiro')}
                className="px-4 py-2.5 bg-white border border-rose-100 rounded-xl text-[10px] font-bold text-rose-600 hover:bg-rose-50 transition-all text-left"
              >
                Limpar Financeiro
              </button>
              <button 
                onClick={() => onClearData('all')}
                className="sm:col-span-2 px-4 py-2.5 bg-rose-600 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/20"
              >
                Reset Total de Fábrica
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
