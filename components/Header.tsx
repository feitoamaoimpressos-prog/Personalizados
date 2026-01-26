
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Plus, CheckCircle2 } from 'lucide-react';
import { DateRangePicker } from './DateRangePicker';

interface HeaderProps {
  hideValues: boolean;
  onToggleHide: () => void;
  dateRange: { start: string; end: string };
  onDateChange: (range: { start: string; end: string }) => void;
  onNewOrder: () => void;
  title?: string;
  subtitle?: string;
  greeting?: string;
  lastSaved?: Date | null;
}

export const Header: React.FC<HeaderProps> = ({ 
  hideValues, 
  onToggleHide, 
  dateRange, 
  onDateChange, 
  onNewOrder,
  title = 'Dashboard',
  subtitle = 'Gestão de Gráfica Rápida',
  greeting = 'Olá, Bem-vindo!',
  lastSaved
}) => {
  const [showSavedStatus, setShowSavedStatus] = useState(false);

  useEffect(() => {
    if (lastSaved) {
      setShowSavedStatus(true);
      const timer = setTimeout(() => setShowSavedStatus(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastSaved]);

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
          <button 
            onClick={onToggleHide}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all group"
            title={hideValues ? 'Mostrar Valores' : 'Ocultar Valores'}
          >
            {hideValues ? (
              <EyeOff className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            ) : (
              <Eye className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            )}
            <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest hidden sm:inline">
              {hideValues ? 'Oculto' : 'Visível'}
            </span>
          </button>

          <button 
            onClick={onNewOrder}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.02] transition-all active:scale-95 group"
          >
            <div className="bg-white/20 p-1 rounded-lg group-hover:bg-white/30 transition-colors">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-black uppercase tracking-widest">Novo Pedido</span>
          </button>
        </div>
      </div>
    </div>
  );
};
