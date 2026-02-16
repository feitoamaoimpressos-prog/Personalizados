
import React, { useState } from 'react';
import { X, Cloud, Copy, RefreshCw, Upload, Smartphone, Laptop, Check, AlertCircle } from 'lucide-react';

interface SyncToolProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any) => void;
  currentData: any;
}

export const SyncTool: React.FC<SyncToolProps> = ({ isOpen, onClose, onImport, currentData }) => {
  const [syncCode, setSyncCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const generateCode = () => {
    setIsProcessing(true);
    setTimeout(() => {
      try {
        const json = JSON.stringify(currentData);
        // Base64 robusto
        const encoded = btoa(unescape(encodeURIComponent(json)));
        setGeneratedCode(encoded);
        setIsProcessing(false);
      } catch (e) {
        alert("Erro ao gerar código. Dados muito grandes?");
        setIsProcessing(false);
      }
    }, 500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    if (!syncCode.trim()) return;
    try {
      if (window.confirm("Isso irá substituir todos os dados deste computador pelos dados do código. Deseja continuar?")) {
        const decoded = decodeURIComponent(escape(atob(syncCode.trim())));
        const data = JSON.parse(decoded);
        onImport(data);
        onClose();
      }
    } catch (e) {
      alert("Código de sincronização inválido ou corrompido.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <Cloud className="w-6 h-6" />
            <h2 className="text-xl font-black uppercase tracking-tight">Sincronização em Nuvem</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-700 font-bold leading-relaxed">
              Como este sistema roda localmente no seu navegador, seus dados não são compartilhados automaticamente entre computadores. 
              Use esta ferramenta para mover seus dados para outro PC ou celular sem usar arquivos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Passo 1: Gerar */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-black text-slate-500">1</span>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">De onde quer levar?</h3>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Neste PC, gere seu código único:</p>
              
              {!generatedCode ? (
                <button 
                  onClick={generateCode}
                  disabled={isProcessing}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Gerar Chave de Sync
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl break-all text-[8px] font-mono max-h-24 overflow-y-auto">
                    {generatedCode}
                  </div>
                  <button 
                    onClick={handleCopy}
                    className={`w-full py-3 ${copied ? 'bg-emerald-500' : 'bg-slate-800'} text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Código Copiado!' : 'Copiar Código'}
                  </button>
                </div>
              )}
            </div>

            {/* Passo 2: Receber */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-black text-slate-500">2</span>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Para onde quer levar?</h3>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No outro PC, cole o código gerado:</p>
              
              <div className="space-y-3">
                <textarea 
                  placeholder="Cole aqui o código que você copiou do outro computador..."
                  value={syncCode}
                  onChange={(e) => setSyncCode(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 min-h-[96px] placeholder:text-slate-300"
                />
                <button 
                  onClick={handleImport}
                  disabled={!syncCode.trim()}
                  className="w-full py-4 bg-white border-2 border-indigo-600 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:border-slate-300 disabled:text-slate-300"
                >
                  <Upload className="w-4 h-4" />
                  Sincronizar Dados
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-12 opacity-40 grayscale pt-4 border-t border-slate-50">
             <div className="flex items-center gap-2">
               <Laptop className="w-5 h-5" />
               <span className="text-[10px] font-black uppercase">PC Casa</span>
             </div>
             <div className="flex items-center gap-2">
               <Smartphone className="w-5 h-5" />
               <span className="text-[10px] font-black uppercase">Celular</span>
             </div>
             <div className="flex items-center gap-2">
               <Laptop className="w-5 h-5" />
               <span className="text-[10px] font-black uppercase">PC Gráfica</span>
             </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 flex justify-end">
          <button onClick={onClose} className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-colors">
            Cancelar / Voltar
          </button>
        </div>
      </div>
    </div>
  );
};
