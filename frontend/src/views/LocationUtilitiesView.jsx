import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin, Navigation, Compass, Truck, Clock, Search,
  CheckCircle, AlertTriangle, Download, RefreshCw
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function LocationUtilitiesView({ initialTab = 'cctv' }) {
  const { addNotification } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab);

  // CCTV Calculator State
  const [dvrTime, setDvrTime] = useState('2026-10-01 13:22:15');
  const [actualTime, setActualTime] = useState('2026-10-01 13:45:00');
  const [targetDvrFootage, setTargetDvrFootage] = useState('2026-10-01 13:22:15');
  const [cctvResult, setCctvResult] = useState({
    offsetMinutes: '+22 minutes 45 seconds',
    correctedActualTime: '2026-10-01 13:45:00',
    remarks: 'DVR was running 22 minutes behind actual standard Indian time (IST). Corrected timestamp perfectly matches ATM transaction log.'
  });

  // Toll Plaza State
  const [tollLogs, setTollLogs] = useState([
    { plaza: 'Badarpur Border Toll Plaza (Delhi-Faridabad)', vehicle: 'DL-01-AB-8812', time: '2026-10-01 08:30:12', speed_est: '55 km/h', lane: 'Lane 04 (FASTag)' },
    { plaza: 'Kherki Daula Toll Plaza (NH-48 Gurugram)', vehicle: 'DL-01-AB-8812', time: '2026-10-01 09:42:05', speed_est: '68 km/h', lane: 'Lane 02 (FASTag)' },
    { plaza: 'Shahjahanpur Toll Barrier (Rajasthan Border)', vehicle: 'DL-01-AB-8812', time: '2026-10-01 11:15:40', speed_est: '72 km/h', lane: 'Lane 06 (FASTag)' }
  ]);

  const calculateCctv = (e) => {
    e.preventDefault();
    const dvrD = new Date(dvrTime.replace(' ', 'T'));
    const actD = new Date(actualTime.replace(' ', 'T'));
    const diffSec = Math.round((actD.getTime() - dvrD.getTime()) / 1000);

    const mins = Math.floor(Math.abs(diffSec) / 60);
    const secs = Math.abs(diffSec) % 60;
    const sign = diffSec >= 0 ? '+' : '-';

    const footD = new Date(targetDvrFootage.replace(' ', 'T'));
    const correctedD = new Date(footD.getTime() + diffSec * 1000);

    setCctvResult({
      offsetMinutes: `${sign}${mins} minutes ${secs} seconds`,
      correctedActualTime: correctedD.toISOString().replace('T', ' ').substring(0, 19),
      remarks: `DVR clock drift: ${sign}${mins}m ${secs}s. Corrected actual standard time calculated for courtroom submission.`
    });
    addNotification("CCTV clock offset correction calculated.");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Navigation className="w-5 h-5 text-amber-400" />
          Location & Movement Forensics Utilities
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Surveillance & highway movement tools: CCTV clock drift offset calculator, FASTag highway toll plaza chronology, and GPS coordinate route planners.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('cctv')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'cctv' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          1. CCTV Clock Offset Calculator
        </button>
        <button
          onClick={() => setActiveTab('toll')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'toll' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          2. Toll Plaza & FASTag Sequence
        </button>
      </div>

      {/* Tab 1: CCTV Time Calculator */}
      {activeTab === 'cctv' && (
        <div className="space-y-4">
          <form onSubmit={calculateCctv} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              DVR / NVR Time Calibration Input
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Time Displayed on CCTV Camera (DVR Clock)</label>
                <input
                  type="text"
                  required
                  value={dvrTime}
                  onChange={(e) => setDvrTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Actual Reference Standard Time (Officer Watch / Mobile)</label>
                <input
                  type="text"
                  required
                  value={actualTime}
                  onChange={(e) => setActualTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Target Incident Footage Timestamp</label>
                <input
                  type="text"
                  required
                  value={targetDvrFootage}
                  onChange={(e) => setTargetDvrFootage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg cursor-pointer"
            >
              Compute Real-World Actual Time
            </button>
          </form>

          {cctvResult && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Corrected Incident Timestamp for Judicial Admissibility
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Calculated DVR Clock Drift</span>
                  <span className="font-bold text-amber-400 text-sm font-mono">{cctvResult.offsetMinutes}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">True Actual Occurrence Time (IST)</span>
                  <span className="font-bold text-emerald-400 text-sm font-mono">{cctvResult.correctedActualTime}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                {cctvResult.remarks}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Toll Plaza FASTag */}
      {activeTab === 'toll' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                FASTag Toll Plaza Chronological Transit Trajectory
              </h2>
              <span className="text-[11px] text-emerald-400 font-bold">Suspect Vehicle: DL-01-AB-8812</span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-800 text-[11px]">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Toll Plaza Barrier</th>
                    <th className="p-2.5">Timestamp</th>
                    <th className="p-2.5">FASTag RFID Lane</th>
                    <th className="p-2.5">Estimated Velocity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {tollLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-slate-900/40">
                      <td className="p-2.5 text-white font-bold">{log.plaza}</td>
                      <td className="p-2.5 text-cyan-300 font-mono">{log.time}</td>
                      <td className="p-2.5 text-slate-300">{log.lane}</td>
                      <td className="p-2.5 text-amber-400 font-bold">{log.speed_est}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

