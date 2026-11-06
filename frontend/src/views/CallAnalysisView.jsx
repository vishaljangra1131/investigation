import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, 
  BarChart3, PieChart, ArrowUpRight, ArrowDownLeft, AlertCircle
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function CallAnalysisView() {
  const { records, formatNumber } = useApp();
  const [filterType, setFilterType] = useState('ALL');

  const stats = useMemo(() => {
    const total = records.length;
    const incoming = records.filter(r => r.call_type === 'INCOMING');
    const outgoing = records.filter(r => r.call_type === 'OUTGOING');
    const missed = records.filter(r => r.call_type === 'MISSED');
    const sms = records.filter(r => r.call_type.includes('SMS'));

    const durations = {
      zero: records.filter(r => r.duration === 0).length,
      short: records.filter(r => r.duration > 0 && r.duration <= 30).length,
      medium: records.filter(r => r.duration > 30 && r.duration <= 120).length,
      long: records.filter(r => r.duration > 120 && r.duration <= 600).length,
      veryLong: records.filter(r => r.duration > 600).length,
    };

    const longestCalls = [...records]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 8);

    const shortRepeated = records
      .filter(r => r.duration > 0 && r.duration <= 15)
      .slice(0, 8);

    return { total, incoming, outgoing, missed, sms, durations, longestCalls, shortRepeated };
  }, [records]);

  const maxBucket = Math.max(1, ...Object.values(stats.durations));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-cyan-400" />
          Call Analysis & Voice Traffic Characterization
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Detailed decomposition of incoming, outgoing, missed, and short-duration signaling patterns.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total Calls" value={stats.total} subtitle="Aggregate Events" color="cyan" />
        <StatCard title="Incoming" value={stats.incoming.length} subtitle={`${Math.round((stats.incoming.length/Math.max(1,stats.total))*100)}% Inbound`} color="emerald" icon={PhoneIncoming} />
        <StatCard title="Outgoing" value={stats.outgoing.length} subtitle={`${Math.round((stats.outgoing.length/Math.max(1,stats.total))*100)}% Target Originated`} color="blue" icon={PhoneOutgoing} />
        <StatCard title="Missed / Drop" value={stats.missed.length} subtitle={`${Math.round((stats.missed.length/Math.max(1,stats.total))*100)}% Zero Duration`} color="rose" icon={PhoneMissed} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Duration Buckets */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Call Duration Frequency Distribution
          </h2>

          <div className="space-y-3 pt-2">
            {[
              { label: "Zero / Missed (0s)", count: stats.durations.zero, color: "bg-slate-600" },
              { label: "Brief Signal (< 30s)", count: stats.durations.short, color: "bg-amber-500" },
              { label: "Standard (30s - 2m)", count: stats.durations.medium, color: "bg-cyan-500" },
              { label: "Substantive (2m - 10m)", count: stats.durations.long, color: "bg-blue-600" },
              { label: "Extended (> 10m)", count: stats.durations.veryLong, color: "bg-purple-600" },
            ].map((b, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{b.label}</span>
                  <span className="text-cyan-400 font-bold">{b.count} calls ({Math.round((b.count / Math.max(1, stats.total)) * 100)}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    style={{ width: `${(b.count / maxBucket) * 100}%` }}
                    className={`h-full rounded-full ${b.color} transition-all duration-500`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Short Duration Signaling Alerts */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Repeated Short-Duration Signaling Calls (≤ 15s)
            </h2>
            <span className="text-[10px] text-amber-400 font-mono">Potential Covert Ping Codes</span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {stats.shortRepeated.map((r, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-950/60 border border-amber-900/40 text-xs flex items-center justify-between font-mono">
                <div>
                  <div className="text-white font-bold">{formatNumber(r.calling_number)} &rarr; {formatNumber(r.called_number)}</div>
                  <div className="text-[10px] text-slate-500">{r.datetime || `${r.call_date} ${r.call_time}`}</div>
                </div>
                <span className="text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10">
                  {r.duration}s
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Longest Conversations Table */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          Top Longest Communications (Key Substantive Dialogues)
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-800 text-[11px] font-mono">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2.5">Date & Time</th>
                <th className="p-2.5">Calling Party</th>
                <th className="p-2.5">Called Party</th>
                <th className="p-2.5">Duration</th>
                <th className="p-2.5">Type</th>
                <th className="p-2.5">Serving Tower</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {stats.longestCalls.map((r, i) => (
                <tr key={i} className="hover:bg-slate-900/40">
                  <td className="p-2.5 text-slate-400">{r.datetime || `${r.call_date} ${r.call_time}`}</td>
                  <td className="p-2.5 text-white font-medium">{formatNumber(r.calling_number)}</td>
                  <td className="p-2.5 text-slate-200">{formatNumber(r.called_number)}</td>
                  <td className="p-2.5 text-emerald-400 font-bold">{Math.floor(r.duration / 60)}m {r.duration % 60}s ({r.duration}s)</td>
                  <td className="p-2.5">{r.call_type}</td>
                  <td className="p-2.5 text-slate-400">{r.tower_name || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

