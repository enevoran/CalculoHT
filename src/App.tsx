import React, { useState } from 'react';
import { Clock, DollarSign, Calculator, Trash2, Calendar } from 'lucide-react';

interface DaySchedule {
  day: string;
  entryH: string;
  entryM: string;
  exitH: string;
  exitM: string;
}

const DAYS = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
];

export default function App() {
  const [schedules, setSchedules] = useState<DaySchedule[]>(
    DAYS.map(day => ({ day, entryH: '', entryM: '', exitH: '', exitM: '' }))
  );
  const [hourlyRate, setHourlyRate] = useState<number | string>('');
  const [results, setResults] = useState<{ totalHours: number; totalPay: number } | null>(null);

  const handleTimeChange = (index: number, field: keyof DaySchedule, value: string) => {
    const digits = value.replace(/\D/g, '');
    const newSchedules = [...schedules];
    (newSchedules[index] as any)[field] = digits;
    setSchedules(newSchedules);
  };

  const calculateResults = () => {
    let totalMinutes = 0;
    let hasValidEntry = false;

    schedules.forEach(schedule => {
      const eh = parseInt(schedule.entryH, 10);
      const em = parseInt(schedule.entryM, 10) || 0;
      const xh = parseInt(schedule.exitH, 10);
      const xm = parseInt(schedule.exitM, 10) || 0;

      if (!isNaN(eh) && !isNaN(xh)) {
        hasValidEntry = true;
        const entryTotal = eh * 60 + em;
        const exitTotal = xh * 60 + xm;
        
        let diff = exitTotal - entryTotal;
        if (diff < 0) diff += 24 * 60;
        totalMinutes += diff;
      }
    });

    if (!hasValidEntry) {
      alert('Por favor, ingresa al menos una hora de entrada y salida.');
      return;
    }

    const totalHours = totalMinutes / 60;
    const rate = typeof hourlyRate === 'string' ? parseFloat(hourlyRate) || 0 : hourlyRate;
    const totalPay = totalHours * rate;

    setResults({ totalHours, totalPay });
    
    setTimeout(() => {
      const el = document.getElementById('results-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const repeatMonday = () => {
    const monday = schedules[0];
    if (!monday.entryH && !monday.exitH) return;
    
    const newSchedules = schedules.map((s, i) => 
      i === 0 ? s : { ...s, entryH: monday.entryH, entryM: monday.entryM, exitH: monday.exitH, exitM: monday.exitM }
    );
    setSchedules(newSchedules);
  };

  const clearAll = () => {
    setSchedules(DAYS.map(day => ({ day, entryH: '', entryM: '', exitH: '', exitM: '' })));
    setHourlyRate('');
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Calculadora de Horas
          </h1>
          <p className="mt-2 text-slate-500">
            Ingresa tus horarios semanales para calcular tu paga
          </p>
        </header>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-6">
              {/* Hourly Rate Input */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <label htmlFor="hourlyRate" className="font-semibold text-slate-700">
                    Valor por hora trabajada
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input
                    id="hourlyRate"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all w-full sm:w-40"
                  />
                </div>
              </div>

              {/* Weekly Schedule */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-4">
                  <div className="hidden sm:grid grid-cols-12 gap-4 flex-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <div className="col-span-4">Día</div>
                    <div className="col-span-4 text-center">Entrada (24h)</div>
                    <div className="col-span-4 text-center">Salida (24h)</div>
                  </div>
                  <button 
                    onClick={repeatMonday}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    Repetir Lunes a todos
                  </button>
                </div>

                {schedules.map((schedule, index) => (
                  <div 
                    key={schedule.day}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-white transition-all group"
                  >
                    <div className="col-span-1 sm:col-span-4 flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      <span className="font-medium text-slate-700">{schedule.day}</span>
                    </div>
                    
                    <div className="col-span-1 sm:col-span-4 flex flex-col items-center gap-1">
                      <span className="sm:hidden text-[10px] text-slate-400 font-bold uppercase">Entrada:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          placeholder="HH"
                          value={schedule.entryH}
                          onChange={(e) => handleTimeChange(index, 'entryH', e.target.value)}
                          className="w-14 px-2 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-center font-mono"
                          inputMode="numeric"
                        />
                        <span className="text-slate-300 font-bold">:</span>
                        <input
                          type="number"
                          placeholder="MM"
                          value={schedule.entryM}
                          onChange={(e) => handleTimeChange(index, 'entryM', e.target.value)}
                          className="w-14 px-2 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-center font-mono"
                          inputMode="numeric"
                        />
                      </div>
                    </div>

                    <div className="col-span-1 sm:col-span-4 flex flex-col items-center gap-1">
                      <span className="sm:hidden text-[10px] text-slate-400 font-bold uppercase">Salida:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          placeholder="HH"
                          value={schedule.exitH}
                          onChange={(e) => handleTimeChange(index, 'exitH', e.target.value)}
                          className="w-14 px-2 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-center font-mono"
                          inputMode="numeric"
                        />
                        <span className="text-slate-300 font-bold">:</span>
                        <input
                          type="number"
                          placeholder="MM"
                          value={schedule.exitM}
                          onChange={(e) => handleTimeChange(index, 'exitM', e.target.value)}
                          className="w-14 px-2 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-center font-mono"
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-4 border-t border-slate-100">
                <button
                  onClick={calculateResults}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-200 active:scale-95"
                >
                  <Calculator className="w-5 h-5" />
                  Calcular Total
                </button>
                <button
                  onClick={clearAll}
                  className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-500 font-semibold py-4 px-6 rounded-2xl border border-slate-200 transition-all active:scale-95"
                >
                  <Trash2 className="w-5 h-5" />
                  Limpiar
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {results && (
            <div
              id="results-section"
              className="bg-indigo-50 border-t border-indigo-100"
            >
              <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-1">Total Horas</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-indigo-900">{results.totalHours.toFixed(2)}</span>
                    <span className="text-indigo-600 font-medium">horas</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-1">Importe a Abonar</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-indigo-600">$</span>
                    <span className="text-4xl font-black text-indigo-900">
                      {results.totalPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Calculadora de Horas Semanales</p>
        </footer>
      </div>
    </div>
  );
}
