import React, { useState } from 'react';
import { CDR_FIELDS_32 } from '../data/telecomData';
import { HelpCircle, Search, Radio, Shield, BookOpen, ChevronRight } from 'lucide-react';

export default function GlossaryView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState(CDR_FIELDS_32[0]);

  const filteredFields = CDR_FIELDS_32.filter(f => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.fullForm.toLowerCase().includes(q) ||
      f.definition.toLowerCase().includes(q) ||
      f.forensicImportance.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            Complete 32 CDR Fields & Parameters Reference Guide
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive encyclopedia explaining the forensic definition, purpose, analytical application, and evidentiary weight of all 32 core telecommunications parameters.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search all 32 CDR fields..."
            className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-cyan-500 focus:outline-none w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Field List */}
        <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
          <div className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider px-1">
            Parameters Index ({filteredFields.length} of 32):
          </div>

          <div className="space-y-1">
            {filteredFields.map(f => {
              const isSelected = selectedField.id === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedField(f)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 text-cyan-300 font-semibold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded bg-slate-800 text-slate-400 font-mono text-[10px] flex items-center justify-center font-bold shrink-0">
                      {f.id}
                    </span>
                    <span className="truncate">{f.name}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Field Deep Detail Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[10px] font-bold">
                PARAMETER #{selectedField.id}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">
              {selectedField.name}
            </h2>
            <div className="text-xs font-mono text-cyan-300 mt-1">
              Full Form: {selectedField.fullForm}
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Definition & Purpose */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">Definition:</span>
                <p className="text-slate-200 leading-relaxed font-sans">{selectedField.definition}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">Telecommunications Purpose:</span>
                <p className="text-slate-200 leading-relaxed font-sans">{selectedField.purpose}</p>
              </div>
            </div>

            {/* Example Value */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Realistic Record Example:</span>
              <div className="text-emerald-400 font-bold text-xs">{selectedField.example}</div>
            </div>

            {/* Forensic Importance & Analytical Application */}
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-900/40 space-y-1">
                <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase block">
                  Forensic Evidentiary Importance:
                </span>
                <p className="text-slate-300 leading-relaxed font-sans">{selectedField.forensicImportance}</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/40 space-y-1">
                <span className="text-[10px] text-purple-400 font-mono font-bold uppercase block">
                  Analytical Investigation Application:
                </span>
                <p className="text-slate-300 leading-relaxed font-sans">{selectedField.analyticalUse}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

