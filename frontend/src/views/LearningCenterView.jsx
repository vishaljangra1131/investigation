import React, { useState } from 'react';
import { LEARNING_MODULES } from '../data/telecomData';
import { GraduationCap, BookOpen, CheckCircle, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LearningCenterView() {
  const [activeModule, setActiveModule] = useState(LEARNING_MODULES[0]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-cyan-400" />
          Telecom Forensics & CDR Educational Learning Center
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Comprehensive curriculum for cybercrime officers, digital forensic analysts, law students, and judicial authorities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Nav List */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider px-1">
            Curriculum Modules:
          </div>

          <div className="space-y-1.5">
            {LEARNING_MODULES.map(m => {
              const isSelected = activeModule.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-cyan-400">{m.id}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                      {m.badge}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-white leading-tight">{m.title}</div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{m.summary}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Module Reading Panel */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-bold">
              {activeModule.badge}
            </span>
            <h2 className="text-lg font-bold text-white mt-2">
              {activeModule.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {activeModule.summary}
            </p>
          </div>

          {/* Module Content */}
          <div className="prose prose-invert prose-sm max-w-none text-xs text-slate-300 leading-relaxed space-y-4 font-sans">
            {activeModule.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return <h3 key={idx} className="text-sm font-bold text-cyan-300 font-mono pt-2">{paragraph.replace('### ', '')}</h3>;
              } else if (paragraph.startsWith('> [!IMPORTANT]') || paragraph.startsWith('> [!CAUTION]')) {
                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/40 text-amber-300 font-mono text-[11px] leading-relaxed">
                    {paragraph.replace(/> \[\!(IMPORTANT|CAUTION)\]\s*\n*> /, '')}
                  </div>
                );
              } else if (paragraph.startsWith('- ')) {
                return (
                  <ul key={idx} className="list-disc list-inside space-y-1 text-slate-300">
                    {paragraph.split('\n').map((item, i) => (
                      <li key={i}>{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              } else if (/^\d+\./.test(paragraph)) {
                return (
                  <ol key={idx} className="list-decimal list-inside space-y-1.5 text-slate-300">
                    {paragraph.split('\n').map((item, i) => (
                      <li key={i}>{item.replace(/^\d+\.\s*/, '')}</li>
                    ))}
                  </ol>
                );
              }
              return <p key={idx}>{paragraph}</p>;
            })}
          </div>

          {/* Common Mistakes & Pitfalls */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-rose-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Common Analytical Pitfalls in Courtroom Evidence
            </h4>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400 font-sans">
              <li>Confusing serving antenna location with exact GPS coordinates of a person.</li>
              <li>Assuming the registered SIM subscriber is identical to the physical user at the crime scene.</li>
              <li>Failing to preserve the original SHA-256 hash immediately upon file receipt.</li>
              <li>Neglecting cellular handovers caused by radio tower congestion or tall buildings.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

