import React, { useState } from 'react';
import { PRACTICAL_CASE_STUDIES } from '../data/telecomData';
import { BookOpen, CheckCircle, AlertTriangle, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

export default function CaseStudiesView() {
  const [selectedCase, setSelectedCase] = useState(PRACTICAL_CASE_STUDIES[0]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          Practical Forensic Case Studies (Synthetic Training Scenarios)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore realistic investigative scenarios illustrating how Call Detail Records (CDR) and cell tower data are synthesized to resolve complex cybercrime and organized syndicate inquiries.
        </p>
      </div>

      {/* Case Tabs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {PRACTICAL_CASE_STUDIES.map(cs => {
          const isSelected = selectedCase.id === cs.id;
          return (
            <button
              key={cs.id}
              onClick={() => setSelectedCase(cs)}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">{cs.id}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                  {cs.category}
                </span>
              </div>
              <div className="font-bold text-xs text-white line-clamp-2">{cs.title}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Case Deep Dive */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="inline-block px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-bold mb-2">
            {selectedCase.category}
          </div>
          <h2 className="text-lg font-bold text-white tracking-wide">
            {selectedCase.title}
          </h2>
          <div className="text-xs font-mono text-slate-400 mt-1">
            Target MSISDN Profile: <span className="text-cyan-300 font-bold">{selectedCase.sampleTarget}</span>
          </div>
        </div>

        {/* Investigative Scenario Narrative */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            1. Problem Statement & Incident Scenario
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            {selectedCase.scenario}
          </p>
        </div>

        {/* Key Forensic Discoveries */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            2. Key Forensic Findings & Telephony Patterns
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedCase.keyFindings.map((finding, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-xs text-slate-200 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-[10px] flex items-center justify-center font-bold shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-snug">{finding}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology & Conclusions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block uppercase text-[10px]">Analytical Method Applied:</span>
            <p className="text-slate-300 font-sans leading-relaxed">{selectedCase.analyticalMethod}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-purple-400 font-bold block uppercase text-[10px]">Investigative Conclusion:</span>
            <p className="text-slate-300 font-sans leading-relaxed">{selectedCase.conclusion}</p>
          </div>
        </div>

        {/* Fictional Disclaimer */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[10px] font-mono text-slate-500">
          NOTE: All individuals, telephone numbers, cell sites, and events portrayed in these case studies are entirely fictional and synthesized solely for educational and training demonstrations.
        </div>
      </div>
    </div>
  );
}

