import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle, ShieldAlert, CheckCircle, Info, Flame, 
  Smartphone, Clock, Navigation, Check, X
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function PatternDetectionView() {
  const { anomalies, records, formatNumber } = useApp();
  const [reviewStatus, setReviewStatus] = useState({});

  const handleStatusChange = (id, status) => {
    setReviewStatus(prev => ({ ...prev, [id]: status }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          Rule-Based Pattern & Anomaly Detection Engine
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Algorithmic heuristics designed to isolate anomalous telecommunications signatures: nocturnal bursts, burner device swaps, signaling pings, and unnatural geographical velocity.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Active Flags" value={anomalies.length} subtitle="Detected Indicators" color="rose" icon={AlertTriangle} />
        <StatCard title="Critical Severity" value={anomalies.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH').length} subtitle="Priority Leads" color="purple" icon={Flame} />
        <StatCard title="Under Review" value={Object.keys(reviewStatus).length} subtitle="Investigator Validated" color="cyan" icon={CheckCircle} />
        <StatCard title="False Positives" value={Object.values(reviewStatus).filter(s => s === 'DISMISSED').length} subtitle="Analyst Cleared" color="amber" />
      </div>

      {/* Anomaly Cards List */}
      <div className="space-y-4">
        {anomalies.map((ano, idx) => {
          const currentStatus = reviewStatus[ano.anomaly_id] || 'PENDING_REVIEW';
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  <span className="font-mono text-cyan-400 font-bold text-xs">{ano.anomaly_id}</span>
                  <span className="text-sm font-bold text-white">{ano.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    ano.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    ano.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {ano.severity} SEVERITY
                  </span>

                  <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300">
                    Confidence: {ano.confidence || 'HIGH'}
                  </span>
                </div>
              </div>

              {/* Indicator & Forensic Reasoning */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 text-[10px] font-mono block uppercase">Observable Switch Indicator:</span>
                  <p className="text-slate-200 mt-0.5 leading-relaxed font-mono">{ano.indicator}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 text-[10px] font-mono block uppercase">Investigative Lead Explanation:</span>
                  <p className="text-slate-300 mt-0.5 leading-relaxed italic">{ano.explanation}</p>
                </div>
              </div>

              {/* Supporting Records Sample */}
              {ano.supporting_sample && ano.supporting_sample.length > 0 && (
                <div className="pt-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                    Supporting Log Excerpt ({ano.supporting_sample.length} events):
                  </span>
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                    {ano.supporting_sample.map((s, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400">
                        {s.datetime || s.time_window || 'Event'} &bull; {s.duration !== undefined ? `${s.duration}s` : s.speed_kmh ? `${s.speed_kmh} km/h` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Investigator Action Bar */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="text-[11px] text-slate-400">
                  Status: <span className="font-mono text-cyan-400 font-bold">{currentStatus}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStatusChange(ano.anomaly_id, 'VERIFIED_LEAD')}
                    className="px-2.5 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>Confirm Lead</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange(ano.anomaly_id, 'DISMISSED')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    <span>Dismiss</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Legal Safeguard Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/50 flex items-start gap-3 text-xs text-amber-300/90 leading-relaxed">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Evidentiary Distinction:</span> Anomaly indicators generated by algorithmic rules are purely investigative leads to assist digital forensic examiners in prioritizing review. They do not constitute judicial proof of guilt or wrongdoing. Corroborative material evidence must be independently verified.
        </div>
      </div>
    </div>
  );
}

