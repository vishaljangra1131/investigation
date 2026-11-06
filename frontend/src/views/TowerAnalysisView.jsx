import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TowerControl, MapPin, Radio, Calendar, Info } from 'lucide-react';
import StatCard from '../components/StatCard';

export default function TowerAnalysisView() {
  const { records } = useApp();

  const towers = useMemo(() => {
    const tMap = {};
    records.forEach(r => {
      const name = r.tower_name || 'Unknown Site';
      if (!tMap[name]) {
        tMap[name] = {
          name,
          lac: r.lac || 'N/A',
          firstCell: r.first_cell_id || 'N/A',
          operator: r.operator || 'Telecom',
          count: 0,
          lat: r.latitude,
          lon: r.longitude,
          firstSeen: r.datetime,
          lastSeen: r.datetime
        };
      }
      tMap[name].count += 1;
      tMap[name].lastSeen = r.datetime;
    });

    return Object.values(tMap).sort((a, b) => b.count - a.count);
  }, [records]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <TowerControl className="w-5 h-5 text-cyan-400" />
          Base Transceiver Station (BTS) & Cell Tower Site Analysis
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Physical installation sites, site traffic volumes, first/last recorded connections, and operator infrastructure sharing.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard title="Total Tower Sites" value={towers.length} subtitle="Physical Base Stations" color="cyan" icon={TowerControl} />
        <StatCard title="Primary Base Station" value={towers[0]?.name ? towers[0].name.slice(0, 15) : "N/A"} subtitle={`${towers[0]?.count || 0} Connected Events`} color="emerald" />
        <StatCard title="Total Cellular Events" value={records.length} subtitle="Radio Bearer Sessions" color="blue" />
      </div>

      {/* Towers Table */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <TowerControl className="w-4 h-4 text-cyan-400" />
          Cell Tower Site Activity Ranking
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-800 text-[11px] font-mono">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2.5">Tower Site Name</th>
                <th className="p-2.5">LAC / TAC</th>
                <th className="p-2.5">Operator</th>
                <th className="p-2.5">Coordinates (Lat, Lon)</th>
                <th className="p-2.5">Connected Calls</th>
                <th className="p-2.5">First Connected</th>
                <th className="p-2.5">Last Connected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {towers.map((t, i) => (
                <tr key={t.name} className="hover:bg-slate-900/40">
                  <td className="p-2.5 text-cyan-300 font-bold">{t.name}</td>
                  <td className="p-2.5 text-slate-400">{t.lac}</td>
                  <td className="p-2.5 text-white">{t.operator}</td>
                  <td className="p-2.5 text-slate-400">
                    {t.lat && t.lon ? `${t.lat.toFixed(4)}, ${t.lon.toFixed(4)}` : 'N/A'}
                  </td>
                  <td className="p-2.5 text-emerald-400 font-bold">{t.count} events</td>
                  <td className="p-2.5 text-slate-400">{t.firstSeen}</td>
                  <td className="p-2.5 text-slate-400">{t.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

