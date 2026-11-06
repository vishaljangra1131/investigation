import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar, Clock, Moon, Sun, Flame, Filter, AlertTriangle, ArrowRight
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function DateTimeAnalysisView() {
  const { records, formatNumber } = useApp();
  const [incidentDate, setIncidentDate] = useState('2026-10-21');

  // Compute 7 Days x 24 Hours Matrix
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const matrix = useMemo(() => {
    const grid = {};
    days.forEach(d => { grid[d] = Array(24).fill(0); });

    records.forEach(r => {
      const dtStr = r.datetime || `${r.call_date} ${r.call_time}`;
      if (!dtStr) return;
      const dObj = new Date(dtStr);
      if (isNaN(dObj.getTime())) return;
      
      const dayName = days[(dObj.getDay() + 6) % 7]; // Mon=0
      const hour = dObj.getHours();
      if (grid[dayName]) {
        grid[dayName][hour] += 1;
      }
    });

    return grid;
  }, [records]);

  // Max value in matrix for heatmap scaling
  const maxMatrixVal = useMemo(() => {
    let maxV = 1;
    days.forEach(d => {
      matrix[d].forEach(v => { if (v > maxV) maxV = v; });
    });
    return maxV;
  }, [matrix]);

  // Night Calls (23:00 to 05:00)
  const nightCalls = useMemo(() => {
    return records.filter(r => {
      const dtStr = r.datetime || `${r.call_date} ${r.call_time}`;
      const dObj = new Date(dtStr);
      const h = dObj.getHours();
      return h >= 23 || h <= 4;
    });
  }, [records]);

  // Before & After Incident Split
  const incidentAnalysis = useMemo(() => {
    const before = records.filter(r => (r.call_date || r.datetime?.split(' ')[0]) < incidentDate);
    const onDay = records.filter(r => (r.call_date || r.datetime?.split(' ')[0]) === incidentDate);
    const after = records.filter(r => (r.call_date || r.datetime?.split(' ')[0]) > incidentDate);
    return { before, onDay, after };
  }, [records, incidentDate]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          Date & Time Analysis & Diurnal Heatmaps
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Chronological pattern recognition across 24 hours, days of the week, nocturnal windows, and targeted incident event horizons. Original time zone (IST / UTC+05:30) preserved.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total Calls" value={records.length} subtitle="Temporal Events" color="cyan" />
        <StatCard title="Night Activity" value={nightCalls.length} subtitle="23:00 - 05:00 Window" color="amber" icon={Moon} />
        <StatCard title="Night Ratio" value={`${Math.round((nightCalls.length / Math.max(1, records.length)) * 100)}%`} subtitle="Nocturnal Proportion" color="rose" />
        <StatCard title="Incident Date Volume" value={incidentAnalysis.onDay.length} subtitle={`On ${incidentDate}`} color="purple" icon={Flame} />
      </div>

      {/* 24x7 Heatmap Matrix */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Weekly 24-Hour Diurnal Heatmap Matrix
          </h2>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span>Low Intensity</span>
            <div className="flex gap-1">
              <span className="w-3 h-3 rounded bg-slate-950 border border-slate-800"></span>
              <span className="w-3 h-3 rounded bg-cyan-950"></span>
              <span className="w-3 h-3 rounded bg-cyan-800"></span>
              <span className="w-3 h-3 rounded bg-cyan-500"></span>
              <span className="w-3 h-3 rounded bg-cyan-300"></span>
            </div>
            <span>High Intensity</span>
          </div>
        </div>

        <div className="overflow-x-auto pt-2">
          <div className="min-w-[680px] space-y-1 text-[10px] font-mono">
            {/* Hours Header */}
            <div className="grid grid-cols-25 gap-1 text-slate-500 pb-1">
              <div className="text-left font-bold">Day</div>
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="text-center">{i}</div>
              ))}
            </div>

            {/* Matrix Rows */}
            {days.map(d => (
              <div key={d} className="grid grid-cols-25 gap-1 items-center">
                <div className="text-slate-300 font-semibold truncate pr-1">{d.slice(0, 3)}</div>
                {matrix[d].map((val, h) => {
                  const intensity = val / maxMatrixVal;
                  let bg = 'bg-slate-950 border border-slate-800/80';
                  if (val > 0) {
                    if (intensity > 0.75) bg = 'bg-cyan-300 text-slate-950 font-bold';
                    else if (intensity > 0.5) bg = 'bg-cyan-500 text-slate-950 font-bold';
                    else if (intensity > 0.25) bg = 'bg-cyan-800 text-white';
                    else bg = 'bg-cyan-950 text-cyan-300';
                  }
                  return (
                    <div
                      key={h}
                      title={`${d} at ${h}:00 - ${val} calls`}
                      className={`h-7 rounded flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${bg}`}
                    >
                      {val > 0 ? val : ''}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Incident Event Window Filter */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              Event Horizon: Before, During & After Incident Analysis
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Compare communication intensity shifts before and after a specific crime incident timestamp.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-mono text-slate-400">Incident Anchor Date:</label>
            <input
              type="date"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono block uppercase">Phase 1: Pre-Incident Baseline</span>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
              {incidentAnalysis.before.length} Calls
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Calls occurring before {incidentDate}</p>
          </div>

          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/50">
            <span className="text-[10px] text-rose-400 font-mono block uppercase font-bold">Phase 2: Incident Execution Day</span>
            <div className="text-xl font-bold font-mono text-rose-400 mt-1">
              {incidentAnalysis.onDay.length} Calls
            </div>
            <p className="text-[10px] text-slate-400 mt-1">High volume spikes or frantic coordination</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono block uppercase">Phase 3: Post-Incident Activity</span>
            <div className="text-xl font-bold font-mono text-purple-400 mt-1">
              {incidentAnalysis.after.length} Calls
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Burner phone swaps, radio silence, or flight</p>
          </div>
        </div>
      </div>
    </div>
  );
}

