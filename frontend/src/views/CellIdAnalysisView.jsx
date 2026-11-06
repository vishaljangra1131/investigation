import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Radio, TowerControl, GitCommit, ArrowRight, Info, AlertCircle } from 'lucide-react';
import StatCard from '../components/StatCard';

export default function CellIdAnalysisView() {
  const { records } = useApp();

  // Cell ID transitions & frequency
  const { cellCounts, transitions } = useMemo(() => {
    const cMap = {};
    const trans = [];
    let lastCell = null;
    let lastTower = null;
    let lastDt = null;

    records.forEach(r => {
      const cell = (r.first_cell_id || '').trim();
      const tower = r.tower_name || 'Unknown Site';
      const dt = r.datetime || `${r.call_date} ${r.call_time}`;
      if (!cell) return;

      cMap[cell] = (cMap[cell] || 0) + 1;

      if (lastCell && cell !== lastCell) {
        trans.push({
          fromCell: lastCell,
          fromTower: lastTower,
          toCell: cell,
          toTower: tower,
          datetime: dt,
          prevDatetime: lastDt,
          callType: r.call_type
        });
      }
      lastCell = cell;
      lastTower = tower;
      lastDt = dt;
    });

    const sortedCells = Object.entries(cMap)
      .map(([cell, count]) => ({ cell, count }))
      .sort((a, b) => b.count - a.count);

    return { cellCounts: sortedCells, transitions: trans.slice(-15) };
  }, [records]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Radio className="w-5 h-5 text-cyan-400" />
          Cell ID & Serving Radio Sector Analysis
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Detailed analysis of physical serving cell antenna sectors, Cell Global Identity (CGI), and radio handovers between base stations.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard title="Unique Cell Sectors" value={cellCounts.length} subtitle="Observed Radio Cells" color="cyan" icon={Radio} />
        <StatCard title="Cell Transitions" value={transitions.length} subtitle="Handovers Observed" color="amber" icon={GitCommit} />
        <StatCard title="Most Active Sector" value={cellCounts[0]?.cell ? `${cellCounts[0].cell.slice(-8)}` : "N/A"} subtitle={`${cellCounts[0]?.count || 0} Events`} color="emerald" />
      </div>

      {/* Top Cell IDs Table */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          Serving Cell ID Sector Frequency Ranking
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-800 text-[11px] font-mono">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2.5">Rank</th>
                <th className="p-2.5">Cell ID / CGI</th>
                <th className="p-2.5">Event Count</th>
                <th className="p-2.5">Proportion</th>
                <th className="p-2.5">Sector Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {cellCounts.map((item, i) => (
                <tr key={item.cell} className="hover:bg-slate-900/40">
                  <td className="p-2.5 text-slate-500 font-bold">{i + 1}</td>
                  <td className="p-2.5 text-cyan-400 font-bold">{item.cell}</td>
                  <td className="p-2.5 text-emerald-400 font-bold">{item.count} events</td>
                  <td className="p-2.5 text-slate-400">{Math.round((item.count / Math.max(1, records.length)) * 100)}% of total</td>
                  <td className="p-2.5 text-slate-300">Directional Sector (120° Beamwidth)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Serving Cell Transitions */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-amber-400" />
          Serving Cell Handover Sequence Log
        </h2>

        <div className="space-y-2">
          {transitions.map((t, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-semibold">{t.fromTower}</span>
                <span className="text-slate-500 text-[10px]">({t.fromCell})</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-cyan-400 font-semibold">{t.toTower}</span>
                <span className="text-slate-500 text-[10px]">({t.toCell})</span>
              </div>
              <div className="text-[10px] text-slate-400">
                <span>{t.datetime}</span> | <span className="text-emerald-400">{t.callType}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

