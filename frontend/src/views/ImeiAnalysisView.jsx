import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Smartphone, Cpu, AlertTriangle, Search, Info, ShieldCheck, 
  ArrowRight, Clock, CheckCircle
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function ImeiAnalysisView() {
  const { records, formatNumber } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Extract IMEI mappings
  const { imeiInventory, handsetSwitches } = useMemo(() => {
    const imeiToNumbers = {};
    const numberToImeis = {};
    const imeiTimeline = {};

    records.forEach(r => {
      const imei = (r.imei || '').trim();
      if (!imei) return;

      const from = r.calling_number;
      const to = r.called_number;

      if (!imeiToNumbers[imei]) imeiToNumbers[imei] = new Set();
      if (!imeiTimeline[imei]) imeiTimeline[imei] = [];

      if (from && from !== 'UNKNOWN') {
        imeiToNumbers[imei].add(from);
        if (!numberToImeis[from]) numberToImeis[from] = new Set();
        numberToImeis[from].add(imei);
      }
      if (to && to !== 'UNKNOWN') {
        if (!numberToImeis[to]) numberToImeis[to] = new Set();
        numberToImeis[to].add(imei);
      }

      imeiTimeline[imei].push(r);
    });

    // Detect Handset Switches (Multiple IMEIs on single number)
    const switches = [];
    Object.entries(numberToImeis).forEach(([num, imeis]) => {
      if (imeis.size > 1 && num !== 'UNKNOWN') {
        switches.push({
          number: num,
          imeis: Array.from(imeis),
          count: imeis.size
        });
      }
    });

    // Format Inventory
    const inventory = Object.entries(imeiToNumbers).map(([imei, numbersSet]) => {
      const tac = imei.slice(0, 8);
      let model = "Generic 4G/5G Cellular Handset";
      if (tac.startsWith("867543")) model = "Samsung Galaxy S22 Ultra (TAC: 867543)";
      else if (tac.startsWith("354129")) model = "OnePlus Nord / Burner Device (TAC: 354129)";
      else if (tac.startsWith("869104")) model = "Xiaomi Redmi Note 12 (TAC: 869104)";

      const events = imeiTimeline[imei] || [];
      const sorted = [...events].sort((a, b) => (a.datetime || '').localeCompare(b.datetime || ''));

      return {
        imei,
        tac,
        model,
        associatedNumbers: Array.from(numbersSet),
        eventCount: events.length,
        firstSeen: sorted[0]?.datetime || 'N/A',
        lastSeen: sorted[sorted.length - 1]?.datetime || 'N/A'
      };
    });

    return { imeiInventory: inventory, handsetSwitches: switches };
  }, [records]);

  const filteredInventory = imeiInventory.filter(item => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return item.imei.toLowerCase().includes(q) || item.model.toLowerCase().includes(q) || item.associatedNumbers.some(n => n.includes(q));
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            IMEI Analysis & Handset Switching Detection
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track physical cellular devices through their 15-digit International Mobile Equipment Identity (IMEI), isolate burner handset swaps, and decode Type Allocation Codes (TAC).
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search IMEI, TAC, or Phone..."
            className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard title="Observed Handsets" value={imeiInventory.length} subtitle="Unique Physical IMEIs" color="cyan" />
        <StatCard title="Handset Switches" value={handsetSwitches.length} subtitle="Multiple IMEIs per SIM" color="rose" icon={AlertTriangle} />
        <StatCard title="Primary Target IMEI" value={imeiInventory[0]?.imei ? `${imeiInventory[0].imei.slice(0,8)}...` : "N/A"} subtitle="First Observed Handset" color="blue" />
      </div>

      {/* Burner Phone / Handset Swapping Alerts */}
      {handsetSwitches.length > 0 && (
        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-rose-300 uppercase font-mono tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Critical Forensic Lead: Handset / Burner Swapping Detected ({handsetSwitches.length})
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-rose-500/20 text-rose-400">
              HIGH CONFIDENCE
            </span>
          </div>
          <p className="text-xs text-slate-300">
            The following telephone number was observed operating on multiple physical handsets during the investigation timeframe:
          </p>

          <div className="space-y-2 pt-1">
            {handsetSwitches.map((s, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-rose-900/40 text-xs font-mono space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">{formatNumber(s.number)}</span>
                  <span className="text-rose-400 font-bold">{s.count} Physical Devices Swapped</span>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {s.imeis.map((im, idx) => (
                    <span key={im} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300">
                      Handset {idx + 1}: {im}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IMEI Inventory Table */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-cyan-400" />
          Physical Device & TAC Identification Master Table
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-800 text-[11px] font-mono">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2.5">IMEI Number (15 Digits)</th>
                <th className="p-2.5">TAC Code</th>
                <th className="p-2.5">Decoded Device Model</th>
                <th className="p-2.5">Associated Phone Numbers</th>
                <th className="p-2.5">Total Events</th>
                <th className="p-2.5">First Seen</th>
                <th className="p-2.5">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredInventory.map((item, i) => (
                <tr key={i} className="hover:bg-slate-900/40">
                  <td className="p-2.5 text-cyan-400 font-bold">{item.imei}</td>
                  <td className="p-2.5 text-slate-400">{item.tac}</td>
                  <td className="p-2.5 text-white font-medium">{item.model}</td>
                  <td className="p-2.5">
                    {item.associatedNumbers.map(n => formatNumber(n)).join(', ')}
                  </td>
                  <td className="p-2.5 text-emerald-400 font-bold">{item.eventCount}</td>
                  <td className="p-2.5 text-slate-400">{item.firstSeen}</td>
                  <td className="p-2.5 text-slate-400">{item.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Educational Box: Anatomy of an IMEI */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
        <h2 className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          Technical Reference: Anatomy of a 15-Digit IMEI
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-cyan-400 font-bold block">1. TAC (Digits 1 to 8)</span>
            <p className="text-[11px] text-slate-400 mt-1">
              Type Allocation Code: Identifies the exact device manufacturer and model registered with the GSMA.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-cyan-400 font-bold block">2. SNR (Digits 9 to 14)</span>
            <p className="text-[11px] text-slate-400 mt-1">
              Serial Number: Unique sequential manufacturer serial number identifying the individual physical handset.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-cyan-400 font-bold block">3. CD (Digit 15)</span>
            <p className="text-[11px] text-slate-400 mt-1">
              Check Digit: Calculated using the Luhn algorithm to protect against manual transcription errors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

