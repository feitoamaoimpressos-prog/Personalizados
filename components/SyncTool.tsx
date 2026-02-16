
import React, { useState } from 'react';
import { X, Cloud, Copy, RefreshCw, Smartphone, Laptop, Check, AlertCircle, Key, LogOut, WifiOff } from 'lucide-react';
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
  const [errorMessage, setErrorMessage] = useState('');

  const generateNewCloudKey = () => {
    const key = syncService.generateKey();
    setGeneratedKey(key);
    setErrorMessage('');
    setStatusMsg('Chave gerada! Salve-a para conectar outros dispositivos.');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = async () => {
    const key = inputKey.trim().toUpperCase();
    if (!key || key.length < 5) {
      setErrorMessage('Por favor, insira uma chave válida.');
      return;
    }
    
    setIsProcessing(true);
    setErrorMessage('');
    setStatusMsg('Verificando nuvem...');
    
    try {
      const cloudData = await syncService.download(key);
      
      if (cloudData) {
        // Cenário A: A chave já existe e tem dados (Pareando computador novo)
        if (window.confirm("Dados encontrados na nuvem! Deseja BAIXAR e substituir os dados deste computador pelos da nuvem?")) {
          onImport(cloudData.data);
          onSetKey(key);
          setStatusMsg('Sincronização ativada!');
          setTimeout(onClose, 1500);
        }
      } else {
        // Cenário B: Chave não existe ou está vazia (Iniciando nuvem pela primeira vez)
        if (window.confirm("Esta chave é nova. Deseja iniciar a sincronização usando seus dados atuais como base?")) {
          const result = await syncService.upload(key, currentData);
          if (result.success) {
            onSetKey(key);
            setStatusMsg('Nuvem configurada com sucesso!');
            setTimeout(onClose, 1500);
          } else {
            setErrorMessage(result.error || 'Erro ao subir dados iniciais.');
          }
        }
      }
    } catch (e) {
      setErrorMessage('Erro técnico ao conectar. Verifique sua internet.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Cloud className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Sincronização</h2>
              <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Multi-Device Sync v2.1</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-10 space-y-8">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 animate-bounce">
              <WifiOff className="w-5 h-5 text-rose-500" />
              <p className="text-xs font-black text-rose-600 uppercase tracking-widest">{errorMessage}</p>
            </div>
          )}

          {statusMsg && !errorMessage && (
            <div className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl text-[10px] font-black text-center uppercase tracking-widest border border-emerald-100">
              {statusMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-black">1</span>
                <h3 className="text-sm font-black text-slate-800 uppercase">Gerar Chave</h3>
              </div>
              <div className="pl-11 space-y-4">
                {!generatedKey ? (
                  <button 
                    onClick={generateNewCloudKey}
                    className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:text-indigo-500 transition-all"
                  >
                    Gerar Novo Acesso
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-indigo-50 border-2 border-indigo-100 rounded-2xl text-center">
                      <span className="text-2xl font-black tracking-widest text-indigo-600">{generatedKey}</span>
                    </div>
                    <button onClick={handleCopy} className={`w-full py-3 ${copied ? 'bg-emerald-500' : 'bg-slate-800'} text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2`}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-xs font-black">2</span>
                <h3 className="text-sm font-black text-slate-800 uppercase">Conectar</h3>
              </div>
              <div className="pl-11 space-y-3">
                <input 
                  type="text"
                  placeholder="COLE A CHAVE AQUI"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value.toUpperCase())}
                  className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center text-lg font-black tracking-widest text-slate-700 outline-none focus:border-indigo-500 transition-all"
                />
                <button 
                  onClick={handleConnect}
                  disabled={isProcessing || !inputKey}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 disabled:opacity-50"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Parear Dispositivos'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 bg-slate-50 flex justify-between items-center border-t border-slate-100">
          <button 
            onClick={() => { if(confirm("Desativar nuvem?")) { onSetKey(null); onClose(); } }}
            className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase hover:text-rose-700"
          >
            <LogOut className="w-4 h-4" />
            Parar Sync
          </button>
          <button onClick={onClose} className="px-10 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
