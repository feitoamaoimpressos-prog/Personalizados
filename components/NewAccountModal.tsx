
import React, { useState, useEffect } from 'react';
/* Added ChevronDown to imports */
import { X, CreditCard, Wallet, Landmark, Save, Loader2, Coins, ChevronDown } from 'lucide-react';
import { BankAccount } from '../types';

interface NewAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Omit<BankAccount, 'id'>) => void;
}

export const NewAccountModal: React.FC<NewAccountModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Carteira Digital');
  const [balance, setBalance] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setType('Carteira Digital');
      setBalance(0);
      setError('');
      setIsSaving(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!name.trim()) {
      setError('O nome da conta é obrigatório.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      onSave({
        name,
        type,
        balance
      });
      setIsSaving(false);
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 p-2 rounded-lg">
              <Landmark className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Nova Conta Bancária</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl text-xs font-bold">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Nome da Conta / Banco</label>
              <input 
                type="text" 
                placeholder="Ex: Banco do Brasil, Bradesco, Cofre..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Tipo de Conta</label>
              <div className="relative">
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all appearance-none"
                >
                  <option value="Carteira Digital">Carteira Digital</option>
                  <option value="Conta Corrente">Conta Corrente</option>
                  <option value="Caixa">Caixa (Dinheiro Vivo)</option>
                  <option value="Poupança">Poupança</option>
                  <option value="Investimento">Investimento</option>
                </select>
                {/* Fixed missing ChevronDown */}
                <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="pt-4">
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-2 tracking-widest text-center">Saldo Inicial</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">R$</div>
                <input 
                  type="number"
                  value={balance || ''}
                  onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                  placeholder="0,00"
                  className="w-full pl-12 pr-4 py-5 bg-white border border-emerald-100 rounded-2xl text-3xl font-black text-emerald-600 text-center outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-emerald-200"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            disabled={isSaving}
            onClick={handleSave}
            className="flex-[2] py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Salvando...' : 'Criar Conta'}
          </button>
        </div>
      </div>
    </div>
  );
};
