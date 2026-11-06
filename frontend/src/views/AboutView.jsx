import React from 'react';
import { Info, Radio, ShieldCheck, Scale, Cpu, Globe, Users } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Info className="w-5 h-5 text-cyan-400" />
          About CDR Analysis Pro
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Mission, forensic capabilities, and architectural foundation of the CDR Analysis Pro platform.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Radio className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono">
              CDR ANALYSIS PRO <span className="text-cyan-400 font-normal">v2.0</span>
            </h2>
            <div className="text-[11px] text-slate-400 font-mono">
              Advanced Telecom Intelligence & Digital Forensic Analysis Platform
            </div>
          </div>
        </div>

        <p>
          <b>CDR ANALYSIS PRO</b> is an advanced digital forensic platform engineered specifically to streamline the processing, analytical modeling, and visual representation of telecommunications metadata. Designed for authorized cybercrime investigation cells, police agencies, digital forensics laboratories, and cybersecurity researchers, the platform bridges the gap between raw cellular switch tickets and actionable courtroom evidence.
        </p>

        <h3 className="text-sm font-bold text-white font-mono pt-2">Core Platform Pillars:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block font-mono">1. Absolute Chain of Custody</span>
            <p className="text-[11px] text-slate-400">
              Immediate cryptographic SHA-256 hash anchoring upon ingestion ensures working data is always verifiably authentic against master disk images.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block font-mono">2. Multi-Operator Normalization</span>
            <p className="text-[11px] text-slate-400">
              Intelligent column auto-detection standardizes disparate schemas across GSM, CDMA, VoLTE, and 5G networks into a unified forensic model.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block font-mono">3. Behavioral Anomaly Detection</span>
            <p className="text-[11px] text-slate-400">
              Rule-based heuristics flag burner handset swaps, nocturnal call spikes, repeated ping signaling, and rapid transit speeds.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block font-mono">4. Certified Judicial Reporting</span>
            <p className="text-[11px] text-slate-400">
              One-click generation of court-ready PDF dossiers and multi-sheet Excel analytical workbooks pursuant to Section 63 of Bharatiya Sakshya Adhiniyam, 2023.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

