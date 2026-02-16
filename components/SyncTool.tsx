
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
    setStatusMsg('Chave gerada! Salve-a para conectar outros dispositivos.');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = async () => {
    if (!inputKey.trim() || inputKey.length < 5) {
      setStatusMsg('Por favor, insira uma chave válida.');
      return;
    }
    
    setIsProcessing(true);
    setStatusMsg('Conectando à nuvem...');
    
    try {
      const cloudData = await syncService.download(inputKey.trim());
      
      if (cloudData) {
        if (window.confirm("Dados encontrados na nuvem! Deseja SUBSTITUIR as informações atuais deste computador?")) {
          onImport(cloudData.data);
          onSetKey(inputKey.trim());
          setStatusMsg('Sincronização ativada com sucesso!');
          setTimeout(onClose, 1500);
        }
      } else {
        if (window.confirm("Chave nova detectada. Deseja iniciar uma sincronização usando seus dados atuais como base?")) {
          const success = await syncService.upload(inputKey.trim(), currentData);
          if (success) {
            onSetKey(inputKey.trim());
            setStatusMsg('Nuvem configurada! Agora outros dispositivos podem usar esta chave.');
            setTimeout(onClose, 1500);
          } else {
            setStatusMsg('Erro ao subir dados iniciais. Verifique sua conexão.');
          }
        }
      }
    } catch (e) {
      setStatusMsg('Erro de rede. Tente novamente em instantes.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header Profissional */}
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Cloud className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Sincronização de Dispositivos</h2>
              <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Multi-Device Cloud Sync</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-10 space-y-10">
          <div className="bg-slate-50 border border-slate-100 p-5 rounded-3xl flex items-start gap-4">
            <div className="bg-white p-2 rounded-xl shadow-sm">
              <AlertCircle className="w-6 h-6 text-indigo-500" />
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Mantenha sua loja sincronizada entre o computador da gráfica e o seu celular. 
              <strong> Gere uma chave única</strong> em um aparelho e insira no outro para começar.
            </p>
          </div>

          {statusMsg && (
            <div className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl text-[10px] font-black text-center uppercase tracking-widest border border-emerald-100 animate-in slide-in-from-top-2">
              {statusMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Opção 1: Criar */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg shadow-indigo-200">1</span>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Novo Dispositivo</h3>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-11">Comece gerando uma chave:</p>
              
              <div className="pl-11">
                {!generatedKey ? (
                  <button 
                    onClick={generateNewCloudKey}
                    className="w-full py-4 bg-slate-100 text-slate-600 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2 border-2 border-dashed border-slate-300"
                  >
                    <Key className="w-4 h-4" />
                    Gerar Chave de Acesso
                  </button>
                ) : (
                  <div className="space-y-4 animate-in slide-in-from-bottom-4">
                    <div className="p-6 bg-indigo-50 border-2 border-indigo-100 rounded-[2rem] text-center shadow-inner">
                      <span className="text-3xl font-black tracking-[0.2em] text-indigo-600">{generatedKey}</span>
                    </div>
                    <button 
                      onClick={handleCopy}
                      className={`w-full py-4 ${copied ? 'bg-emerald-500' : 'bg-slate-800'} text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200`}
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      {copied ? 'Chave Copiada!' : 'Copiar Chave'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Opção 2: Conectar */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-xs font-black">2</span>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Parear Outro</h3>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-11">Digite a chave do outro PC:</p>
              
              <div className="pl-11 space-y-4">
                <div className="relative group">
                  <input 
                    type="text"
                    placeholder="EX: ABC-123-XYZ"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value.toUpperCase())}
                    className="w-full px-6 py-5 bg-white border-2 border-slate-200 rounded-[1.5rem] text-center text-xl font-black tracking-[0.2em] text-slate-700 outline-none focus:border-indigo-600 focus:ring-8 focus:ring-indigo-600/5 transition-all placeholder:text-slate-200"
                  />
                </div>
                <button 
                  onClick={handleConnect}
                  disabled={!inputKey.trim() || isProcessing}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-200 disabled:opacity-30 disabled:grayscale"
                >
                  {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Cloud className="w-5 h-5" />}
                  Ativar Nuvem Agora
                </button>
              </div>
            </div>
          </div>

          {/* Visual Assist */}
          <div className="flex justify-between items-center px-10 py-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100">
             <div className="flex flex-col items-center gap-2">
               <div className="p-3 bg-white rounded-2xl shadow-sm"><Laptop className="w-6 h-6 text-slate-400" /></div>
               <span className="text-[8px] font-black text-slate-400 uppercase">Computador A</span>
             </div>
             <div className="flex-1 px-8">
               <div className="h-0.5 w-full bg-slate-200 relative overflow-hidden">
                 <div className="absolute inset-0 bg-indigo-400 animate-slide-left-right"></div>
               </div>
             </div>
             <div className="flex flex-col items-center gap-2">
               <div className="p-3 bg-white rounded-2xl shadow-sm"><Smartphone className="w-6 h-6 text-slate-400" /></div>
               <span className="text-[8px] font-black text-slate-400 uppercase">Computador B</span>
             </div>
          </div>
        </div>

        <div className="p-10 bg-slate-50 flex justify-between items-center border-t border-slate-100">
          <button 
            onClick={() => { if(confirm("Deseja realmente desativar a nuvem? As atualizações não serão mais enviadas nem recebidas.")) { onSetKey(null); setStatusMsg(''); onClose(); } }}
            className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase hover:text-rose-700 transition-colors group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Desconectar Nuvem
          </button>
          <button onClick={onClose} className="px-10 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-all shadow-sm">
            Fechar Painel
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slide-left-right {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-slide-left-right {
          animation: slide-left-right 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
