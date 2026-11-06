import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Navigation, Calendar, AlertTriangle, Layers, Table } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import StatCard from '../components/StatCard';

export default function GeolocationView() {
  const { records } = useApp();
  const [dateFilter, setDateFilter] = useState('ALL');

  // Extract unique dates for filtering
  const availableDates = useMemo(() => {
    const s = new Set();
    records.forEach(r => {
      const d = r.call_date || (r.datetime ? r.datetime.split(' ')[0] : '');
      if (d) s.add(d);
    });
    return ['ALL', ...Array.from(s).sort()];
  }, [records]);

  // Geocoded towers and trajectory
  const { towerList, trajectory, geoEvents } = useMemo(() => {
    const filtered = records.filter(r => {
      if (dateFilter !== 'ALL') {
        const d = r.call_date || (r.datetime ? r.datetime.split(' ')[0] : '');
        if (d !== dateFilter) return false;
      }
      return r.latitude && r.longitude;
    });

    const tMap = {};
    const traj = [];
    let lastCoord = null;

    filtered.forEach(r => {
      const key = `${r.latitude},${r.longitude}`;
      if (!tMap[key]) {
        tMap[key] = {
          lat: r.latitude,
          lon: r.longitude,
          tower_name: r.tower_name || 'Cell Site',
          cell_id: r.first_cell_id || 'N/A',
          lac: r.lac || 'N/A',
          event_count: 0
        };
      }
      tMap[key].event_count += 1;

      const c = `${r.latitude},${r.longitude}`;
      if (c !== lastCoord) {
        traj.push({
          lat: r.latitude,
          lon: r.longitude,
          tower_name: r.tower_name,
          datetime: r.datetime
        });
        lastCoord = c;
      }
    });

    return {
      towerList: Object.values(tMap),
      trajectory: traj,
      geoEvents: filtered
    };
  }, [records, dateFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            Geolocation & Serving Cell Trajectory Mapping
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Interactive geographical visualization of serving cellular antenna sectors and chronological transit sequences.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-slate-400">Filter By Date:</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
          >
            {availableDates.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Geocoded Events" value={geoEvents.length} subtitle="Records with Lat/Lon" color="cyan" icon={MapPin} />
        <StatCard title="Mapped Tower Sites" value={towerList.length} subtitle="Unique Base Stations" color="emerald" icon={Layers} />
        <StatCard title="Sector Transitions" value={trajectory.length} subtitle="Chronological Points" color="amber" icon={Navigation} />
        <StatCard title="Filter Scope" value={dateFilter} subtitle="Active Timeline" color="purple" icon={Calendar} />
      </div>

      {/* Map View Container */}
      <div className="h-[520px] w-full">
        <MapComponent towers={towerList} trajectory={trajectory} />
      </div>

      {/* Table of Geocoded Sites */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <Table className="w-4 h-4 text-cyan-400" />
          Mapped Cell Tower Coordinates & Activity Ledger
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-800 text-[11px] font-mono">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2.5">Tower Site Name</th>
                <th className="p-2.5">Cell ID (CGI)</th>
                <th className="p-2.5">Latitude</th>
                <th className="p-2.5">Longitude</th>
                <th className="p-2.5">Events Count</th>
                <th className="p-2.5">Est. Sector Radius</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {towerList.map((t, i) => (
                <tr key={i} className="hover:bg-slate-900/40">
                  <td className="p-2.5 text-cyan-300 font-bold">{t.tower_name}</td>
                  <td className="p-2.5 text-slate-400">{t.cell_id}</td>
                  <td className="p-2.5 text-white">{t.lat.toFixed(5)}</td>
                  <td className="p-2.5 text-white">{t.lon.toFixed(5)}</td>
                  <td className="p-2.5 text-emerald-400 font-bold">{t.event_count} calls</td>
                  <td className="p-2.5 text-slate-400">~800m (Dense Urban)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

