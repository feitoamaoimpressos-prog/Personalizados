
import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Clock, Check } from 'lucide-react';

interface DateRange {
  start: string;
  end: string;
}

interface DateRangePickerProps {
  range: DateRange;
  onChange: (range: DateRange) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ range, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Helper to get local date string YYYY-MM-DD
  const getLocalDateString = (date: Date): string => {
    const pad = (num: number) => (num < 10 ? '0' : '') + num;
    return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate());
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputInteraction = (e: React.SyntheticEvent<HTMLInputElement>) => {
    try {
      const target = e.currentTarget as any;
      if ('showPicker' in target) {
        target.showPicker();
      }
    } catch (error) {
      console.debug('showPicker not supported');
    }
  };

  const applyPreset = (days: number | 'month') => {
    const now = new Date();
    let start = new Date();
    let end = new Date();
    
    if (days === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else {
      start = new Date();
      start.setDate(now.getDate() - days);
      end = new Date(); // Hoje
    }

    onChange({
      start: getLocalDateString(start),
      end: getLocalDateString(end)
    });
    setIsOpen(false);
  };

  const presets = [
    { label: 'Hoje', value: 0 },
    { label: 'Últimos 7 dias', value: 7 },
    { label: 'Últimos 30 dias', value: 30 },
    { label: 'Este Mês', value: 'month' as const },
  ];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-400 hover:ring-4 hover:ring-blue-500/5 transition-all text-left"
      >
        <div className="bg-blue-50 p-1.5 rounded-lg">
          <Calendar className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Período</span>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span>{formatDate(range.start)}</span>
            <span className="text-slate-300">até</span>
            <span>{formatDate(range.end)}</span>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-72 bg-white border border-slate-100 rounded-3xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-5 border-b border-slate-50 bg-slate-50/50">
            <div className="flex items-center gap-2 text-slate-400 mb-4">
              <Clock className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">Intervalos Rápidos</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => applyPreset(preset.value)}
                  className="px-3 py-2 text-[11px] font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all text-center shadow-sm active:scale-95"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">Personalizado</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Data Inicial</label>
                <input
                  type="date"
                  value={range.start}
                  onClick={handleInputInteraction}
                  onFocus={handleInputInteraction}
                  onChange={(e) => onChange({ ...range, start: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Data Final</label>
                <input
                  type="date"
                  value={range.end}
                  onClick={handleInputInteraction}
                  onFocus={handleInputInteraction}
                  onChange={(e) => onChange({ ...range, end: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
