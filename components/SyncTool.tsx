
import React, { useState } from 'react';
import { X, Cloud, Copy, RefreshCw, Upload, Smartphone, Laptop, Check, AlertCircle, Key, LogOut } from 'lucide-react';
import { syncService } from '../services/syncService';

interface SyncToolProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any) => void;
  onSetKey: (key: string | null) => void;
  currentData: any;
}

export const SyncTool: React.FC<SyncToolProps> = ({ isOpen, onClose, onImport, onSetKey, currentData }) => {
  const [inputKey, setInputKey] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const generateNewCloudKey = () => {
    const key = syncService.generateKey();
    setGeneratedKey(key);
    setStatusMsg('Chave gerada! Copie e use no outro computador.');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = async () => {
    if (!inputKey.trim()) return;
    setIsProcessing(true);
    setStatusMsg('Buscando dados na nuvem...');
    
    try {
      const cloudData = await syncService.download(inputKey.trim());
      
      if (cloudData) {
        if (window.confirm("Dados encontrados! Deseja substituir as informações atuais deste computador?")) {
          onImport(cloudData.data);
          onSetKey(inputKey.trim());
          setStatusMsg('Sincronização ativa!');
          setTimeout(onClose, 1000);
        }
      } else {
        if (window.confirm("Chave nova detectada. Deseja iniciar uma nova sincronização com seus dados atuais?")) {
          const success = await syncService.upload(inputKey.trim(), currentData);
          if (success) {
            onSetKey(inputKey.trim());
            setStatusMsg('Sincronização configurada!');
            setTimeout(onClose, 1000);
          } else {
            setStatusMsg('Erro ao subir dados iniciais.');
          }
        }
      }
    } catch (e) {
      setStatusMsg('Erro na conexão com o servidor.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <Cloud className="w-6 h-6" />
            <h2 className="text-xl font-black uppercase tracking-tight">Nuvem Sync Pro</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-700 font-bold leading-relaxed">
              <strong>Como funciona:</strong> Ao ativar a nuvem, este computador enviará mudanças automaticamente a cada 2 minutos e verificará atualizações de outros computadores em tempo real.
            </p>
          </div>

          {statusMsg && (
            <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-black text-center uppercase tracking-widest border border-emerald-100 animate-pulse">
              {statusMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-black text-slate-500">1</span>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Dispositivo A</h3>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Gere a chave neste computador:</p>
              
              {!generatedKey ? (
                <button 
                  onClick={generateNewCloudKey}
                  className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Gerar Chave Única
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="p-5 bg-indigo-50 border-2 border-indigo-200 rounded-2xl text-center">
                    <span className="text-2xl font-black tracking-[0.2em] text-indigo-600">{generatedKey}</span>
                  </div>
                  <button 
                    onClick={handleCopy}
                    className={`w-full py-3 ${copied ? 'bg-emerald-500' : 'bg-slate-800'} text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copiado!' : 'Copiar Chave'}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-black text-slate-500">2</span>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Dispositivo B</h3>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Insira a chave gerada:</p>
              
              <div className="space-y-3">
                <input 
                  type="text"
                  placeholder="CHAVE-AQUI"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value.toUpperCase())}
                  className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center text-lg font-black tracking-[0.2em] text-slate-700 outline-none focus:border-indigo-500 transition-all"
                />
                <button 
                  onClick={handleConnect}
                  disabled={!inputKey.trim() || isProcessing}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
                  Ativar Sincronização
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-12 opacity-40 grayscale pt-4 border-t border-slate-50">
             <div className="flex items-center gap-2">
               <Laptop className="w-5 h-5" />
               <span className="text-[10px] font-black uppercase">Loja</span>
             </div>
             <div className="flex items-center text-indigo-600 opacity-100">
               <RefreshCw className="w-5 h-5 animate-spin-slow" />
             </div>
             <div className="flex items-center gap-2">
               <Smartphone className="w-5 h-5" />
               <span className="text-[10px] font-black uppercase">Casa</span>
             </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 flex justify-between items-center">
          <button 
            onClick={() => { if(confirm("Desativar nuvem? Os dados locais ficam salvos, mas não serão mais compartilhados.")) { onSetKey(null); setStatusMsg(''); onClose(); } }}
            className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase hover:text-rose-700 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Parar Nuvem
          </button>
          <button onClick={onClose} className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-colors">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
