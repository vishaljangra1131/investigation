import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCheck, Search, PhoneIncoming, PhoneOutgoing, Clock, 
  Smartphone, Cpu, TowerControl, Calendar, AlertCircle
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function NumberAnalysisView() {
  const { records, formatNumber } = useApp();

  // Extract unique numbers
  const uniqueNumbers = useMemo(() => {
    const s = new Set();
    records.forEach(r => {
      if (r.calling_number && r.calling_number !== 'UNKNOWN') s.add(r.calling_number);
      if (r.called_number && r.called_number !== 'UNKNOWN') s.add(r.called_number);
    });
    return Array.from(s);
  }, [records]);

  const [selectedNumber, setSelectedNumber] = useState(uniqueNumbers[0] || '+919876543210');
  const [customInput, setCustomInput] = useState('');

  // Target Profile Metrics
  const profile = useMemo(() => {
    const target = (customInput.trim() || selectedNumber).trim();
    const matched = records.filter(r => r.calling_number === target || r.called_number === target);

    if (matched.length === 0) return null;

    const incoming = matched.filter(r => r.called_number === target);
    const outgoing = matched.filter(r => r.calling_number === target);
    const totalDuration = matched.reduce((acc, r) => acc + (r.duration || 0), 0);

    // Counterparties
    const counterparties = {};
    matched.forEach(r => {
      const other = r.calling_number === target ? r.called_number : r.calling_number;
      if (other && other !== target) {
        counterparties[other] = (counterparties[other] || 0) + 1;
      }
    });

    const topAssociates = Object.entries(counterparties)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    const imeis = Array.from(new Set(matched.map(r => r.imei).filter(Boolean)));
    const imsis = Array.from(new Set(matched.map(r => r.imsi).filter(Boolean)));
    const towers = Array.from(new Set(matched.map(r => r.tower_name).filter(Boolean))).slice(0, 5);

    const sorted = [...matched].sort((a, b) => (a.datetime || '').localeCompare(b.datetime || ''));

    return {
      target,
      total: matched.length,
      incomingCount: incoming.length,
      outgoingCount: outgoing.length,
      ratio: (incoming.length / Math.max(1, outgoing.length)).toFixed(2),
      totalDuration,
      firstSeen: sorted[0]?.datetime || 'N/A',
      lastSeen: sorted[sorted.length - 1]?.datetime || 'N/A',
      topAssociates,
      imeis,
      imsis,
      towers,
      recent: sorted.slice(-10)
    };
  }, [records, selectedNumber, customInput]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-cyan-400" />
            Target Subscriber / Phone Number Deep Profile
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Isolate any MSISDN to extract counterparty contact circles, inbound/outbound ratio, and device associations.
          </p>
        </div>

        {/* Quick Select & Search */}
        <div className="flex items-center gap-2">
          <select
            value={selectedNumber}
            onChange={(e) => { setSelectedNumber(e.target.value); setCustomInput(''); }}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
          >
            {uniqueNumbers.map(n => (
              <option key={n} value={n}>{formatNumber(n)}</option>
            ))}
          </select>
        </div>
      </div>

      {profile ? (
        <>
          {/* Target Profile Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/30 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider block">Target MSISDN Under Review</span>
                <div className="text-2xl font-bold font-mono text-white tracking-wide">
                  {formatNumber(profile.target)}
                </div>
              </div>
              <div className="text-xs font-mono text-slate-400 text-right">
                <div>First Observed: <span className="text-white">{profile.firstSeen}</span></div>
                <div>Last Observed: <span className="text-white">{profile.lastSeen}</span></div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
              <StatCard title="Total Calls" value={profile.total} subtitle="Interaction Count" color="cyan" />
              <StatCard title="Incoming Leg" value={profile.incomingCount} subtitle="Received Calls" color="emerald" icon={PhoneIncoming} />
              <StatCard title="Outgoing Leg" value={profile.outgoingCount} subtitle="Initiated Calls" color="blue" icon={PhoneOutgoing} />
              <StatCard title="In/Out Ratio" value={profile.ratio} subtitle="Reciprocity Balance" color="purple" />
            </div>
          </div>

          {/* Details Row: Associated Devices & Top Counterparties */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Counterparties */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                Frequently Contacted Counterparties
              </h2>

              <div className="space-y-2">
                {profile.topAssociates.map(([num, count], i) => (
                  <div
                    key={num}
                    onClick={() => { setSelectedNumber(num); setCustomInput(''); }}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 flex items-center justify-between text-xs cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 font-mono text-[10px] flex items-center justify-center font-bold">
                        {i + 1}
                      </span>
                      <span className="font-mono text-slate-200">{formatNumber(num)}</span>
                    </div>
                    <span className="font-mono text-cyan-400 font-bold">
                      {count} calls
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Associated IMEIs, IMSIs, Towers */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                Observed Physical Hardware & SIM Associations
              </h2>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">Observed IMEIs (Handsets):</span>
                  {profile.imeis.map(imei => (
                    <div key={imei} className="text-cyan-300 font-bold">{imei}</div>
                  ))}
                  {profile.imeis.length > 1 && (
                    <span className="text-[10px] text-amber-400 font-bold block pt-1">
                      &bull; Warning: Target observed switching across multiple physical devices!
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">Observed IMSIs (SIM Cards):</span>
                  {profile.imsis.map(imsi => (
                    <div key={imsi} className="text-purple-300 font-bold">{imsi}</div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">Frequent Tower Base Stations:</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {profile.towers.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-8 text-center text-slate-400 text-xs">
          No records found for the selected phone number.
        </div>
      )}

      {/* Forensic Identity Disclaimer */}
      <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-300">Identity Notice:</span> MSISDN and subscriber associations represent metadata observations recorded in the telecommunications switch logs. They do not constitute conclusive real-world identity verification unless corroborated by Subscriber Acquisition Forms (CAF/SDR) lawfully obtained from the telecom provider.
        </div>
      </div>
    </div>
  );
}

