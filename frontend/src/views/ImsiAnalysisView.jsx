import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Cpu, Globe, Radio, Info, AlertCircle, ShieldCheck } from 'lucide-react';
import StatCard from '../components/StatCard';

export default function ImsiAnalysisView() {
  const { records, formatNumber } = useApp();

  const imsiData = useMemo(() => {
    const imsiMap = {};
    records.forEach(r => {
      const imsi = (r.imsi || '').trim();
      if (!imsi) return;
      if (!imsiMap[imsi]) {
        imsiMap[imsi] = {
          imsi,
          mcc: imsi.slice(0, 3) || '404',
          mnc: imsi.slice(3, 5) || '45',
          msin: imsi.slice(5) || 'N/A',
          numbers: new Set(),
          imeis: new Set(),
          events: 0,
          firstSeen: r.datetime,
          lastSeen: r.datetime
        };
      }
      if (r.calling_number) imsiMap[imsi].numbers.add(r.calling_number);
      if (r.imei) imsiMap[imsi].imeis.add(r.imei);
      imsiMap[imsi].events += 1;
      imsiMap[imsi].lastSeen = r.datetime;
    });

    return Object.values(imsiMap).map(item => ({
      ...item,
      numbers: Array.from(item.numbers),
      imeis: Array.from(item.imeis),
      country: item.mcc === '404' || item.mcc === '405' ? 'India (MCC 404/405)' : 'International',
      operator: item.mcc === '404' ? 'Airtel / Jio / Vi (Delhi NCR Circle)' : 'Unknown Circle'
    }));
  }, [records]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-400" />
          IMSI Analysis & Subscriber SIM Card Profiling
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Deconstruct the 15-digit International Mobile Subscriber Identity (IMSI) stored on the SIM card to isolate carrier network codes, subscriber identity swaps, and roaming status.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Observed SIMs" value={imsiData.length} subtitle="Unique IMSIs" color="purple" icon={Cpu} />
        <StatCard title="Domestic SIMs" value={imsiData.filter(i => i.mcc === '404' || i.mcc === '405').length} subtitle="MCC 404 / 405 (India)" color="cyan" icon={Globe} />
        <StatCard title="International SIMs" value={imsiData.filter(i => i.mcc !== '404' && i.mcc !== '405').length} subtitle="Foreign Roamers" color="amber" />
        <StatCard title="Total SIM Events" value={imsiData.reduce((acc, i) => acc + i.events, 0)} subtitle="Logged SIM Activations" color="emerald" />
      </div>

      {/* IMSI Inventory Table */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400" />
          Subscriber SIM Card (IMSI) Master Inventory
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-800 text-[11px] font-mono">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2.5">IMSI Number (15 Digits)</th>
                <th className="p-2.5">MCC (Country)</th>
                <th className="p-2.5">MNC (Network)</th>
                <th className="p-2.5">Associated Phone Numbers</th>
                <th className="p-2.5">Observed Handsets (IMEIs)</th>
                <th className="p-2.5">Events</th>
                <th className="p-2.5">Operator & Telecom Circle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {imsiData.map((item, i) => (
                <tr key={i} className="hover:bg-slate-900/40">
                  <td className="p-2.5 text-purple-300 font-bold">{item.imsi}</td>
                  <td className="p-2.5 text-slate-300">{item.mcc} ({item.country})</td>
                  <td className="p-2.5 text-slate-300">{item.mnc}</td>
                  <td className="p-2.5 text-cyan-300">
                    {item.numbers.map(n => formatNumber(n)).join(', ') || 'N/A'}
                  </td>
                  <td className="p-2.5 text-slate-400">{item.imeis.join(', ') || 'N/A'}</td>
                  <td className="p-2.5 text-emerald-400 font-bold">{item.events}</td>
                  <td className="p-2.5 text-slate-300">{item.operator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Educational Box: Anatomy of an IMSI */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
        <h2 className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider flex items-center gap-2">
          <Info className="w-4 h-4 text-purple-400" />
          Technical Reference: Structure of an ITU-T E.212 IMSI
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-purple-400 font-bold block">1. MCC (Digits 1 to 3)</span>
            <p className="text-[11px] text-slate-400 mt-1">
              Mobile Country Code: 404 and 405 designate India. Identifies the home country of the subscriber SIM.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-purple-400 font-bold block">2. MNC (Digits 4 to 5 or 6)</span>
            <p className="text-[11px] text-slate-400 mt-1">
              Mobile Network Code: Identifies the cellular carrier (e.g. 45 for Airtel Delhi, 840 for Reliance Jio).
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-purple-400 font-bold block">3. MSIN (Remaining Digits)</span>
            <p className="text-[11px] text-slate-400 mt-1">
              Mobile Subscription Identification Number: The internal operator account number mapped in the HLR/HSS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

