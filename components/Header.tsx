
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle2, Database, Cloud, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';
import { DateRangePicker } from './DateRangePicker';

interface HeaderProps {
  hideValues: boolean;
  onToggleHide: () => void;
  dateRange: { start: string; end: string };
  onDateChange: (range: { start: string; end: string }) => void;
  onNewOrder: () => void;
  onOpenSync: () => void;
  title?: string;
  subtitle?: string;
  greeting?: string;
  lastSaved?: Date | null;
  syncStatus?: 'synced' | 'syncing' | 'error' | 'idle';
  showHideButton: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  hideValues, 
  onToggleHide, 
  dateRange, 
  onDateChange, 
  onOpenSync,
  title = 'Dashboard',
  subtitle = 'Gestão de Gráfica Rápida',
  greeting = 'Olá, Bem-vindo!',
  lastSaved,
  syncStatus = 'idle',
  showHideButton
}) => {
  const [showSavedStatus, setShowSavedStatus] = useState(false);

  useEffect(() => {
    if (lastSaved) {
      setShowSavedStatus(true);
      const timer = setTimeout(() => setShowSavedStatus(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastSaved]);

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'syncing': return <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />;
      case 'synced': return <Cloud className="w-3.5 h-3.5 text-emerald-500" />;
      case 'error': return <AlertCircle className="w-3.5 h-3.5 text-rose-500" />;
      default: return <CloudOff className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getSyncLabel = () => {
    switch (syncStatus) {
      case 'syncing': return 'Sincronizando...';
      case 'synced': return 'Nuvem Ativa';
      case 'error': return 'Erro de Sync';
      default: return 'Ativar Nuvem';
    }
  };

  const getSyncBg = () => {
    switch (syncStatus) {
      case 'syncing': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'synced': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'error': return 'bg-rose-50 text-rose-600 border border-rose-100';
      default: return 'bg-slate-100 text-slate-500 border border-slate-200';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h1>
            {showSavedStatus && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg animate-in fade-in slide-in-from-left-2 duration-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">Salvo</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-500 rounded-lg border border-blue-100" title="Banco de dados local operando via navegador">
              <Database className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest">Local</span>
            </div>
            
            <button 
              onClick={onOpenSync}
              className={`flex items-center gap-2 px-2.5 py-0.5 rounded-lg transition-all active:scale-95 group ${getSyncBg()}`}
              title="Clique para gerenciar a sincronização entre dispositivos"
            >
              {getSyncIcon()}
              <span className="text-[9px] font-black uppercase tracking-widest">{getSyncLabel()}</span>
            </button>
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{subtitle}</p>
            <p className="text-[10px] font-bold text-blue-500 uppercase mt-1 tracking-widest">{greeting}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <DateRangePicker 
          range={dateRange} 
          onChange={onDateChange} 
        />

        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          {showHideButton && (
            <button 
              onClick={onToggleHide}
              className="flex items-center gap-3 px-6 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all group animate-in fade-in zoom-in duration-300"
              title={hideValues ? 'Mostrar Valores' : 'Ocultar Valores'}
            >
              {hideValues ? (
                <EyeOff className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              ) : (
                <Eye className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              )}
              <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
                {hideValues ? 'Oculto' : 'Visível'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
