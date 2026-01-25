
import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

interface NewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: any) => void;
}

export const NewCustomerModal: React.FC<NewCustomerModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [taxId, setTaxId] = useState('');
  const [responsible, setResponsible] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [observations, setObservations] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setPhone('');
      setEmail('');
      setTaxId('');
      setResponsible('');
      setAddress('');
      setNeighborhood('');
      setCity('');
      setObservations('');
      setError('');
    }
  }, [isOpen]);

  const maskPhone = (value: string) => {
    if (!value) return "";
    let v = value.replace(/\D/g, ""); // Remove tudo o que não é dígito
    v = v.substring(0, 11); // Limita a 11 dígitos
    
    if (v.length <= 2) {
      return v.length > 0 ? `(${v}` : v;
    }
    if (v.length <= 7) {
      return `(${v.substring(0, 2)}) ${v.substring(2)}`;
    }
    return `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = maskPhone(e.target.value);
    setPhone(formatted);
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError('O nome do cliente é obrigatório.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      onSave({
        name,
        phone,
        email,
        taxId,
        responsible,
        address,
        neighborhood,
        city,
        observations,
      });
      setIsSaving(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-[640px] rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
        {/* Header conforme a imagem */}
        <div className="px-6 py-4 flex items-center justify-between">
          <h2 className="text-[22px] font-bold text-slate-900">Novo Cliente</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-md transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-2 rounded-md text-xs font-bold">
              {error}
            </div>
          )}

          {/* Nome e Telefone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-800">Nome Completo *</label>
              <input 
                type="text" 
                autoFocus
                placeholder="Nome do cliente"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 outline-none focus:border-slate-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-800">Telefone</label>
              <input 
                type="text" 
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 outline-none focus:border-slate-500 transition-all"
              />
            </div>
          </div>

          {/* Email e CPF/CNPJ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-800">Email</label>
              <input 
                type="email" 
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 outline-none focus:border-slate-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-800">CPF/CNPJ</label>
              <input 
                type="text" 
                placeholder="000.000.000-00"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 outline-none focus:border-slate-500 transition-all"
              />
            </div>
          </div>

          {/* Responsável */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-800">Responsável</label>
            <input 
              type="text" 
              placeholder="Nome do responsável pelo cliente"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 outline-none focus:border-slate-500 transition-all"
            />
          </div>

          {/* Endereço */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-800">Endereço</label>
            <input 
              type="text" 
              placeholder="Rua e número"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 outline-none focus:border-slate-500 transition-all"
            />
          </div>

          {/* Bairro e Cidade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-800">Bairro</label>
              <input 
                type="text" 
                placeholder="Bairro"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 outline-none focus:border-slate-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-800">Cidade</label>
              <input 
                type="text" 
                placeholder="Cidade"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 outline-none focus:border-slate-500 transition-all"
              />
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-800">Observações</label>
            <textarea 
              rows={4}
              placeholder="Informações adicionais sobre o cliente"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 outline-none focus:border-slate-500 transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer conforme a imagem */}
        <div className="px-6 py-4 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white border border-slate-300 rounded-md text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            disabled={isSaving}
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-[#86efac] text-white rounded-md text-sm font-bold hover:bg-[#4ade80] transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
