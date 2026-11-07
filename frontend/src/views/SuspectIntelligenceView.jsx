import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCheck, Shield, Phone, Smartphone, CreditCard, Landmark,
  AlertTriangle, Search, Plus, Download, ExternalLink,
  MapPin, FileText, CheckCircle, Eye, Lock
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function SuspectIntelligenceView() {
  const { suspects, setSuspects, formatNumber, addNotification } = useApp();
  const [selectedSuspect, setSelectedSuspect] = useState(suspects[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const filteredSuspects = suspects.filter(s => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.alias && s.alias.toLowerCase().includes(q)) ||
      (s.primary_phone && s.primary_phone.includes(q)) ||
      (s.pan && s.pan.toLowerCase().includes(q)) ||
      (s.role && s.role.toLowerCase().includes(q))
    );
  });

  const exportDossier = (suspect) => {
    window.print();
    addNotification(`Exported official suspect intelligence dossier for ${suspect.name}.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-rose-400" />
            Suspect Intelligence – Case-Linked Subject Profiler & Dossier
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Lawful case-linked subject dossiers: telecom identifiers, associated mule bank accounts, IMEI handset swaps, criminal history, and bilingual judicial dossier output.
          </p>
        </div>

        {selectedSuspect && (
          <button
            onClick={() => exportDossier(selectedSuspect)}
            className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Download className="w-3.5 h-3.5 text-rose-400" />
            <span>Export Official Dossier (PDF)</span>
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Identified Suspects" value={suspects.length} subtitle="Active Targets" color="rose" icon={UserCheck} />
        <StatCard title="Mule Accounts Linked" value={suspects.reduce((acc, s) => acc + (s.linked_accounts?.length || 0), 0)} subtitle="Commercial Banks" color="cyan" icon={Landmark} />
        <StatCard title="Associated Handsets" value={suspects.reduce((acc, s) => acc + (s.imeis?.length || 0), 0)} subtitle="Tracked IMEIs" color="purple" icon={Smartphone} />
        <StatCard title="Surveillance Status" value="2 Active / 1 Wanted" subtitle="Section 41A Notices" color="amber" icon={AlertTriangle} />
      </div>

      {/* Main Suspect Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Suspects Directory List */}
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2 text-xs">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search suspect name, alias, phone, PAN..."
              className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            {filteredSuspects.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSuspect(s)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedSuspect?.id === s.id
                    ? 'bg-rose-950/30 border-rose-500/60 shadow-lg shadow-rose-950/30'
                    : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                    <UserCheck className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm truncate">{s.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        s.threat_level === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {s.threat_level}
                      </span>
                    </div>
                    <div className="text-[11px] text-rose-300/90 font-medium">Alias: {s.alias}</div>
                    <div className="text-[10px] text-slate-400 truncate">{s.role}</div>
                    <div className="text-[10px] text-cyan-400 font-mono">{formatNumber(s.primary_phone)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detailed Suspect Dossier File */}
        {selectedSuspect && (
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
              {/* Profile Card Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl bg-slate-800 border-2 border-rose-500/40 overflow-hidden flex items-center justify-center">
                    <UserCheck className="w-10 h-10 text-rose-400" />
                  </div>
                  <div>
                    <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 mb-1">
                      SUSPECT ID: {selectedSuspect.id}
                    </div>
                    <h2 className="text-xl font-extrabold text-white">{selectedSuspect.name}</h2>
                    <p className="text-xs text-rose-300">Alias: {selectedSuspect.alias}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedSuspect.role}</p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">Legal Status</span>
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-block">
                    {selectedSuspect.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Personal & Statutory Identifiers */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Father's Name</span>
                  <span className="font-bold text-white">{selectedSuspect.father_name}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Date of Birth</span>
                  <span className="font-bold text-white">{selectedSuspect.dob}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Masked Aadhaar</span>
                  <span className="font-mono text-cyan-300 font-bold">{selectedSuspect.aadhaar_masked}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Income Tax PAN</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedSuspect.pan}</span>
                </div>
              </div>

              {/* Telecom & Hardware Identifiers */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-cyan-400 flex items-center gap-1.5 uppercase text-[11px]">
                  <Phone className="w-3.5 h-3.5" />
                  Telecom & Mobile Hardware Association
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Telephone Numbers</span>
                    <span className="font-mono text-white block">{formatNumber(selectedSuspect.primary_phone)} (Primary)</span>
                    {(selectedSuspect.alternate_phones || []).map((p, i) => (
                      <span key={i} className="font-mono text-slate-400 block text-[11px]">{formatNumber(p)}</span>
                    ))}
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">IMEI Hardware Identifiers</span>
                    {(selectedSuspect.imeis || []).map((imei, i) => (
                      <span key={i} className="font-mono text-purple-300 block text-[11px]">{imei}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Financial Mule Accounts */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase text-[11px]">
                  <Landmark className="w-3.5 h-3.5" />
                  Linked Bank Accounts & UPI Handles
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Bank Accounts</span>
                    {(selectedSuspect.linked_accounts || []).map((acc, i) => (
                      <div key={i} className="flex items-center justify-between py-0.5">
                        <span className="text-white font-mono">{acc.bank}: {acc.account}</span>
                        <span className={`text-[9px] px-1 rounded font-bold ${acc.status === 'FROZEN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                          {acc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Virtual Payment Addresses (UPI)</span>
                    {(selectedSuspect.linked_upis || []).map((upi, i) => (
                      <span key={i} className="font-mono text-cyan-300 block">{upi}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Investigation Notes */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Investigative Intelligence Briefing</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {selectedSuspect.notes}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
