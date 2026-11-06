import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Share2, Users, ArrowUpRight, ArrowDownLeft, RefreshCw, Award } from 'lucide-react';
import StatCard from '../components/StatCard';

export default function ContactAnalysisView() {
  const { records, formatNumber, setCurrentView } = useApp();

  const contactMetrics = useMemo(() => {
    const contacts = {};

    records.forEach(r => {
      const src = r.calling_number;
      const dst = r.called_number;
      if (!src || !dst || src === 'UNKNOWN' || dst === 'UNKNOWN') return;

      // Track src
      if (!contacts[src]) contacts[src] = { number: src, incoming: 0, outgoing: 0, total: 0, counterparties: new Set() };
      contacts[src].outgoing += 1;
      contacts[src].total += 1;
      contacts[src].counterparties.add(dst);

      // Track dst
      if (!contacts[dst]) contacts[dst] = { number: dst, incoming: 0, outgoing: 0, total: 0, counterparties: new Set() };
      contacts[dst].incoming += 1;
      contacts[dst].total += 1;
      contacts[dst].counterparties.add(src);
    });

    const list = Object.values(contacts).map(c => ({
      ...c,
      uniquePeers: c.counterparties.size,
      isMutual: c.incoming > 0 && c.outgoing > 0
    })).sort((a, b) => b.total - a.total);

    const mutualCount = list.filter(c => c.isMutual).length;
    const oneWayCount = list.length - mutualCount;

    return { list, mutualCount, oneWayCount };
  }, [records]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Share2 className="w-5 h-5 text-cyan-400" />
          Contact Ranking & Communication Network Profiling
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Rank telephone numbers by interaction volume, distinguish mutual bilateral communications from one-way broadcasting, and map network degrees.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Observed Entities" value={contactMetrics.list.length} subtitle="Unique Telephone Nodes" color="cyan" icon={Users} />
        <StatCard title="Mutual Links" value={contactMetrics.mutualCount} subtitle="Two-Way Bilateral" color="emerald" icon={RefreshCw} />
        <StatCard title="One-Way Links" value={contactMetrics.oneWayCount} subtitle="Unilateral Traffic" color="amber" />
        <StatCard title="Top Entity" value={contactMetrics.list[0]?.number ? formatNumber(contactMetrics.list[0].number).slice(-8) : "N/A"} subtitle={`${contactMetrics.list[0]?.total || 0} Total Events`} color="purple" icon={Award} />
      </div>

      {/* Contacts Table */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          Subscriber Contact Ranking & Reciprocity Breakdown
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-800 text-[11px] font-mono">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2.5">Rank</th>
                <th className="p-2.5">Phone Number</th>
                <th className="p-2.5">Total Events</th>
                <th className="p-2.5">Outgoing Leg</th>
                <th className="p-2.5">Incoming Leg</th>
                <th className="p-2.5">Network Degree (Peers)</th>
                <th className="p-2.5">Traffic Symmetry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {contactMetrics.list.map((c, i) => (
                <tr key={c.number} className="hover:bg-slate-900/40">
                  <td className="p-2.5 text-slate-500 font-bold">{i + 1}</td>
                  <td className="p-2.5 text-cyan-300 font-bold">{formatNumber(c.number)}</td>
                  <td className="p-2.5 text-emerald-400 font-bold">{c.total}</td>
                  <td className="p-2.5 text-blue-400">{c.outgoing}</td>
                  <td className="p-2.5 text-emerald-400">{c.incoming}</td>
                  <td className="p-2.5 text-purple-300 font-bold">{c.uniquePeers} associates</td>
                  <td className="p-2.5">
                    {c.isMutual ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        MUTUAL (TWO-WAY)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">
                        ONE-WAY (UNILATERAL)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

