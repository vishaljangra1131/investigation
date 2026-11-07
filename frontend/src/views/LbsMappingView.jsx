import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Map, MapPin, Compass, Clock, Navigation, Download,
  Upload, Activity, ShieldCheck, AlertTriangle, Play,
  Pause, RotateCcw, Search, Eye
} from 'lucide-react';
import StatCard from '../components/StatCard';
import MapComponent from '../components/MapComponent';

export default function LbsMappingView() {
  const { lbsRecords, setLbsRecords, addNotification, formatNumber } = useApp();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterSubscriber, setFilterSubscriber] = useState('ALL');
  const [speedThreshold, setSpeedThreshold] = useState(60);

  const formattedTowers = useMemo(() => {
    return (lbsRecords || []).map(r => ({
      name: r.tower_name,
      cell_id: r.cell_id,
      lat: r.latitude,
      lon: r.longitude,
      calls_count: r.dwell_time_mins || 15
    }));
  }, [lbsRecords]);

  const trajectory = useMemo(() => {
    return (lbsRecords || [])
      .filter(r => r.latitude && r.longitude)
      .map(r => [r.latitude, r.longitude]);
  }, [lbsRecords]);

  const totalTransitKm = 34.8;
  const maxSpeedKmh = useMemo(() => {
    return Math.max(...(lbsRecords || []).map(r => r.speed_kmh || 0), 0);
  }, [lbsRecords]);

  const exportLbsReport = () => {
    window.print();
    addNotification("Exported LBS Trajectory and Movement Intelligence Report.");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Map className="w-5 h-5 text-cyan-400" />
            LBS 2.0 – Location Based Services & Movement Trajectory Reconstruction
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Chronological cellular serving cell mapping, speed velocity checks between sequential antenna handovers, suspect dwell-time analysis, and co-location verification.
          </p>
        </div>

        <button
          onClick={exportLbsReport}
          className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Export Movement Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total Observations" value={lbsRecords.length} subtitle="Serving BTS Towers" color="cyan" icon={MapPin} />
        <StatCard title="Est. Transit Distance" value={`${totalTransitKm} km`} subtitle="Geodesic Polylines" color="purple" icon={Navigation} />
        <StatCard title="Peak Velocity" value={`${maxSpeedKmh} km/h`} subtitle="Inter-Tower Transit Speed" color="amber" icon={Activity} />
        <StatCard title="High Dwell Sector" value="Connaught Place" subtitle="95 mins dwell time (ATM)" color="rose" icon={Clock} />
      </div>

      {/* Map View & Timeline Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaflet Map Interactive Box */}
        <div className="lg:col-span-2 space-y-3">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Navigation className="w-4 h-4 text-cyan-400" />
                Chronological Movement Path (Serving Cell Handovers)
              </h2>
              <span className="text-[11px] text-cyan-400">
                Target: {formatNumber("+919876543210")}
              </span>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-800 h-[420px] relative">
              <MapComponent towers={formattedTowers} trajectory={trajectory} />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>● Blue circles indicate 800m antenna sector coverage footprints</span>
              <span>Lines represent sequential transit route</span>
            </div>
          </div>
        </div>

        {/* Selected Point & Speed Alert */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Suspect Dwell-Time Analysis
            </h2>

            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-300">Connaught Place Metro BTS</span>
                  <span className="text-[10px] bg-rose-500/20 px-1.5 py-0.5 rounded text-rose-300 font-bold">95 MINS</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Suspect remained stationary from 12:40 to 14:15. Directly overlaps with ₹1,00,000 ATM cash out at 13:45.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">Karol Bagh Market</span>
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">30 MINS</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Secondary dwell between 15:10 and 15:40. Suspected handset repair & SIM swapping market.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
            <span className="font-bold text-cyan-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Co-Location Engine
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Cross-referencing Suspect 1 (+919876543210) and Suspect 2 (+919811223344) revealed mutual ping to Connaught Place Tower (LAC: 1302, Cell: 3910) at 13:05, confirming physical conspiracy.
            </p>
          </div>
        </div>
      </div>

      {/* Sequential Movement Log Table */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          Sequential Cellular Tower Observations ({lbsRecords.length} Waypoints)
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-800 text-[11px]">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2.5">Event</th>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">Serving Base Station (BTS)</th>
                <th className="p-2.5">Cell ID / LAC</th>
                <th className="p-2.5">Coordinates</th>
                <th className="p-2.5">Azimuth</th>
                <th className="p-2.5">Transit Velocity</th>
                <th className="p-2.5">Dwell Time</th>
                <th className="p-2.5">Investigative Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {lbsRecords.map((r, i) => (
                <tr key={i} className="hover:bg-slate-900/40">
                  <td className="p-2.5 text-cyan-400 font-bold">{r.event_id}</td>
                  <td className="p-2.5 text-slate-400">{r.timestamp}</td>
                  <td className="p-2.5 text-white font-medium">{r.tower_name}</td>
                  <td className="p-2.5 text-slate-400">{r.cell_id}</td>
                  <td className="p-2.5 text-cyan-300">{r.latitude}, {r.longitude}</td>
                  <td className="p-2.5">{r.azimuth}°</td>
                  <td className="p-2.5 text-amber-400 font-bold">{r.speed_kmh} km/h</td>
                  <td className="p-2.5 text-emerald-400 font-bold">{r.dwell_time_mins} mins</td>
                  <td className="p-2.5 text-slate-400 max-w-xs">{r.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

