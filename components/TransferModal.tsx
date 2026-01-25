
import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, ArrowRight, Wallet, Loader2, AlertCircle } from 'lucide-react';
import { BankAccount } from '../types';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: BankAccount[];
  onTransfer: (fromId: string, toId: string, amount: number) => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose, accounts, onTransfer }) => {
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFromId(accounts[0]?.id || '');
      setToId(accounts[1]?.id || '');
      setAmount(0);
      setError('');
      setIsProcessing(false);
    }
  }, [isOpen, accounts]);

  const handleTransfer = () => {
    if (fromId === toId) {
      setError('A conta de origem e destino não podem ser iguais.');
      return;
    }
    if (amount <= 0) {
      setError('Insira um valor válido para transferência.');
      return;
    }

    const sourceAccount = accounts.find(a => a.id === fromId);
    if (sourceAccount && sourceAccount.balance < amount) {
      setError('Saldo insuficiente na conta de origem.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      onTransfer(fromId, toId, amount);
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <ArrowRightLeft className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Transferência</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Origem (Sair de)</label>
                <select 
                  value={fromId}
                  onChange={(e) => setFromId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (Saldo: R$ {acc.balance.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center -my-2 relative z-10">
                <div className="bg-white p-2 rounded-full border border-slate-100 shadow-sm">
                  <ArrowRight className="w-4 h-4 text-slate-300 rotate-90" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Destino (Ir para)</label>
                <select 
                  value={toId}
                  onChange={(e) => setToId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4">
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-2 tracking-widest text-center">Valor da Transferência</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 font-bold">R$</div>
                <input 
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0,00"
                  className="w-full pl-12 pr-4 py-5 bg-blue-50 border border-blue-100 rounded-2xl text-3xl font-black text-blue-600 text-center outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-blue-200"
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
            disabled={isProcessing}
            onClick={handleTransfer}
            className="flex-[2] py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
            {isProcessing ? 'Processando...' : 'Confirmar Transferência'}
          </button>
        </div>
      </div>
    </div>
  );
};
