import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings, UserCheck, Shield, Eye, Moon, Sun, 
  Trash2, RefreshCw, CheckCircle, Database
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function SettingsView() {
  const { 
    theme, setTheme, userRole, setUserRole, maskNumbers, 
    setMaskNumbers, caseData, addNotification, loadDemoData 
  } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          System Preferences & Role-Based Access Controls
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure analytical privacy masks, access control tiers, and workstation caching preferences.
        </p>
      </div>

      <div className="space-y-4">
        {/* Role-Based Access Control Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            Active User Role Tier: <span className="text-cyan-400 font-bold font-mono">{userRole}</span>
          </h2>
          <p className="text-xs text-slate-400">
            Select an operational role profile to simulate access tier privileges across the digital forensics platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {[
              { role: 'ADMIN', label: 'Administrator', desc: 'Full access to case management, user auditing, and raw evidence deletion controls.' },
              { role: 'ANALYST', label: 'Forensic Analyst', desc: 'Complete investigative suite: pattern detection, mapping, and certified report generation.' },
              { role: 'VIEWER', label: 'Judicial / Viewer', desc: 'Read-only access to view synthesized link charts, timeline, and audit logs without modification rights.' }
            ].map(item => (
              <div
                key={item.role}
                onClick={() => { setUserRole(item.role); addNotification(`Role updated to ${item.role}`); }}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                  userRole === item.role
                    ? 'bg-cyan-950/30 border-cyan-400 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white">{item.label}</span>
                  {userRole === item.role && <CheckCircle className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Display Preferences */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            Data Privacy & Demonstration Masking
          </h2>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <div className="font-semibold text-xs text-white">Mask Telephone Numbers (Privacy Guard Mode)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Automatically mask middle digits of MSISDNs (e.g. +91-98****3210) during presentations, training, or court demonstrations.
              </div>
            </div>
            <button
              onClick={() => setMaskNumbers(!maskNumbers)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                maskNumbers ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {maskNumbers ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        </div>

        {/* Local Caching & Reset */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            Data Management & Cache Controls
          </h2>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-xs text-slate-400">
              Reload default synthetic dataset or clear active in-memory working records.
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => loadDemoData('case_1')}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reload Demo Case 1</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

