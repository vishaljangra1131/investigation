import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { GitMerge, Users, Share2, Layers, ArrowRight, ShieldAlert, CheckCircle } from 'lucide-react';
import NetworkGraph from '../components/NetworkGraph';
import StatCard from '../components/StatCard';

export default function LinkAnalysisView() {
  const { records, formatNumber, setCurrentView } = useApp();

  const uniqueNumbers = useMemo(() => {
    const s = new Set();
    records.forEach(r => {
      if (r.calling_number && r.calling_number !== 'UNKNOWN') s.add(r.calling_number);
      if (r.called_number && r.called_number !== 'UNKNOWN') s.add(r.called_number);
    });
    return Array.from(s);
  }, [records]);

  const [targetA, setTargetA] = useState(uniqueNumbers[0] || '+919876543210');
  const [targetB, setTargetB] = useState(uniqueNumbers[1] || '+919811223344');

  // Multi-target link comparison
  const linkData = useMemo(() => {
    const contactsA = new Set();
    const towersA = new Set();
    records.forEach(r => {
      if (r.calling_number === targetA) {
        contactsA.add(r.called_number);
        if (r.tower_name) towersA.add(r.tower_name);
      } else if (r.called_number === targetA) {
        contactsA.add(r.calling_number);
        if (r.tower_name) towersA.add(r.tower_name);
      }
    });

    const contactsB = new Set();
    const towersB = new Set();
    records.forEach(r => {
      if (r.calling_number === targetB) {
        contactsB.add(r.called_number);
        if (r.tower_name) towersB.add(r.tower_name);
      } else if (r.called_number === targetB) {
        contactsB.add(r.calling_number);
        if (r.tower_name) towersB.add(r.tower_name);
      }
    });

    // Mutual contacts (Common associates)
    const commonContacts = Array.from(contactsA).filter(c => contactsB.has(c) && c !== targetA && c !== targetB);
    const sharedTowers = Array.from(towersA).filter(t => towersB.has(t));

    // Direct communications between Target A and Target B
    const directCalls = records.filter(r => 
      (r.calling_number === targetA && r.called_number === targetB) ||
      (r.calling_number === targetB && r.called_number === targetA)
    );

    return { commonContacts, sharedTowers, directCalls };
  }, [records, targetA, targetB]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-cyan-400" />
            Link Analysis & Multi-Target Co-Conspiracy Mapping
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Isolate shared contacts, direct communications, and co-locations between two target telephone subscribers.
          </p>
        </div>

        {/* Target Selectors */}
        <div className="flex items-center gap-2">
          <select
            value={targetA}
            onChange={(e) => setTargetA(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-cyan-500/40 rounded-lg text-cyan-300 font-mono text-xs focus:outline-none"
          >
            {uniqueNumbers.map(n => (
              <option key={n} value={n}>Target A: {formatNumber(n)}</option>
            ))}
          </select>

          <span className="text-slate-500 font-bold">&harr;</span>

          <select
            value={targetB}
            onChange={(e) => setTargetB(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-purple-500/40 rounded-lg text-purple-300 font-mono text-xs focus:outline-none"
          >
            {uniqueNumbers.map(n => (
              <option key={n} value={n}>Target B: {formatNumber(n)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard title="Direct Calls" value={linkData.directCalls.length} subtitle="Bilateral Communications" color="rose" icon={GitMerge} />
        <StatCard title="Mutual Contacts" value={linkData.commonContacts.length} subtitle="Shared Counterparties" color="emerald" icon={Users} />
        <StatCard title="Shared Cell Towers" value={linkData.sharedTowers.length} subtitle="Common Radio Footprints" color="cyan" icon={Layers} />
      </div>

      {/* Network Graph Visualizer */}
      <div className="space-y-2">
        <NetworkGraph records={records} />
      </div>

      {/* Intermediaries & Shared Links Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Common Associates Box */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              Shared Intermediary Contacts ({linkData.commonContacts.length})
            </h2>
            <span className="text-[10px] text-emerald-400 font-mono">2nd Degree Ties</span>
          </div>

          {linkData.commonContacts.length > 0 ? (
            <div className="space-y-2">
              {linkData.commonContacts.map(c => (
                <div key={c} className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold">{formatNumber(c)}</span>
                  <span className="text-[10px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                    Intermediary / Fixer
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-slate-500 text-xs font-mono">
              No shared contacts found between the two selected numbers.
            </div>
          )}
        </div>

        {/* Shared Towers Box */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Shared Cell Tower Base Stations ({linkData.sharedTowers.length})
            </h2>
            <span className="text-[10px] text-cyan-400 font-mono">Co-Location Indicator</span>
          </div>

          {linkData.sharedTowers.length > 0 ? (
            <div className="space-y-2">
              {linkData.sharedTowers.map(t => (
                <div key={t} className="p-3 rounded-xl bg-slate-950/60 border border-cyan-500/20 flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold">{t}</span>
                  <span className="text-[10px] text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10">
                    Shared Base Station
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-slate-500 text-xs font-mono">
              No overlapping tower presence detected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

