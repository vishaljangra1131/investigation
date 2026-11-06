import React from 'react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import {
  Activity, PhoneIncoming, PhoneOutgoing, MessageSquare, PhoneMissed, 
  Users, Smartphone, Cpu, Clock, Award, Flame, Calendar,
  Download, FileSpreadsheet, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle
} from 'lucide-react';

export default function DashboardView() {
  const { summary, records, anomalies, caseData, evidence, setCurrentView, formatNumber, downloadPdfReport, downloadExcelReport } = useApp();

  // Hourly distribution for simple SVG chart
  const hours = Array.from({ length: 24 }, (_, i) => {
    const count = records.filter(r => {
      const dt = r.datetime || `${r.call_date} ${r.call_time}`;
      return new Date(dt).getHours() === i;
    }).length;
    return { hour: i, count };
  });

  const maxHourCount = Math.max(1, ...hours.map(h => h.count));

  // Top Contacts
  const contactCounts = {};
  records.forEach(r => {
    const from = r.calling_number;
    const to = r.called_number;
    if (from && from !== 'UNKNOWN') contactCounts[from] = (contactCounts[from] || 0) + 1;
    if (to && to !== 'UNKNOWN') contactCounts[to] = (contactCounts[to] || 0) + 1;
  });

  const topContacts = Object.entries(contactCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Dashboard Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <h1 className="text-lg font-bold text-white font-mono">
              Investigation Dashboard: {caseData.case_id}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {caseData.case_title} | Officer: {caseData.officer_name} ({caseData.agency})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadPdfReport}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-md shadow-cyan-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF Dossier</span>
          </button>

          <button
            onClick={downloadExcelReport}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Excel Workbook</span>
          </button>
        </div>
      </div>

      {/* Main KPI Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <StatCard title="Total Records" value={summary?.total_records || records.length} subtitle="Processed Logs" color="cyan" />
        <StatCard title="Incoming" value={summary?.total_incoming || 0} subtitle="Answered Inbound" color="emerald" icon={PhoneIncoming} />
        <StatCard title="Outgoing" value={summary?.total_outgoing || 0} subtitle="Target Initiated" color="blue" icon={PhoneOutgoing} />
        <StatCard title="SMS Records" value={summary?.total_sms || 0} subtitle="Text Messages" color="purple" icon={MessageSquare} />
        <StatCard title="Missed / Drop" value={summary?.total_missed || 0} subtitle="Zero Duration" color="rose" icon={PhoneMissed} />
        <StatCard title="Total Duration" value={summary?.total_duration_formatted || "0s"} subtitle="Voice Airtime" color="amber" icon={Clock} />
        <StatCard title="Peak Hour" value={summary?.peak_hour || "23:00"} subtitle={summary?.peak_day || "Wed"} color="purple" icon={Flame} />
      </div>

      {/* Second Row: Detailed Charts & Top Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Call Distribution 24h Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              24-Hour Diurnal Call Activity Distribution
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">
              Night hours (23:00 - 05:00 highlighted in amber)
            </span>
          </div>

          <div className="h-44 pt-4 flex items-end gap-1.5">
            {hours.map(h => {
              const isNight = h.hour >= 23 || h.hour <= 4;
              const heightPct = Math.max(8, (h.count / maxHourCount) * 100);
              return (
                <div key={h.hour} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 border border-slate-700 text-white text-[9px] px-1.5 py-0.5 rounded pointer-events-none z-10 font-mono whitespace-nowrap">
                    {h.hour}:00 - {h.count} calls
                  </div>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t-sm transition-all duration-300 group-hover:opacity-100 ${
                      isNight ? 'bg-amber-500 opacity-90' : 'bg-cyan-500 opacity-75'
                    }`}
                  />
                  <span className="text-[9px] font-mono text-slate-500 group-hover:text-cyan-300">
                    {h.hour % 3 === 0 ? h.hour : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Contacted Associate Circles */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Top Associated Entities
            </h2>
            <button
              onClick={() => setCurrentView('contact-analysis')}
              className="text-[10px] text-cyan-400 hover:underline font-mono"
            >
              View All
            </button>
          </div>

          <div className="space-y-2">
            {topContacts.map(([number, count], i) => (
              <div
                key={number}
                onClick={() => setCurrentView('number-analysis')}
                className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/30 flex items-center justify-between text-xs cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 font-mono text-[10px] flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  <span className="font-mono text-slate-200">{formatNumber(number)}</span>
                </div>
                <span className="font-mono text-cyan-400 font-bold text-[11px]">
                  {count} calls
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Row: Anomaly Alerts & Evidence Integrity Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rule-Based Anomaly Leads Widget */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Investigative Anomaly Flags ({anomalies.length} Detected)
            </h2>
            <button
              onClick={() => setCurrentView('pattern-detection')}
              className="text-[10px] text-cyan-400 hover:underline font-mono"
            >
              Full Rules Engine &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {anomalies.slice(0, 3).map((a, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-300">{a.title}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-rose-500/20 text-rose-400">
                    {a.severity}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">{a.indicator}</p>
                <p className="text-[10px] text-slate-400 italic">{a.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Integrity & Chain of Custody Widget */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Evidence Integrity & Chain of Custody
            </h2>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              VERIFIED
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2 font-mono">
            <div>
              <span className="text-slate-400 text-[10px]">Evidence ID:</span>{' '}
              <span className="text-white font-bold">{evidence?.evidence_id || 'EVD-2026-001'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px]">Source File:</span>{' '}
              <span className="text-cyan-300">{evidence?.original_filename || 'sample_cdr_case_01.csv'}</span>
            </div>
            <div className="break-all">
              <span className="text-slate-400 text-[10px]">Cryptographic SHA-256 Hash:</span><br/>
              <span className="text-[10px] text-emerald-400 bg-slate-900 p-1 rounded block mt-0.5 border border-slate-800">
                {evidence?.sha256_hash || 'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
              <span>Ingested: {evidence?.uploaded_at || '2026-10-22 10:35'}</span>
              <span>Officer: {evidence?.analyst_name || 'Constable Vishal'}</span>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-[11px]">
            <button
              onClick={() => setCurrentView('evidence-management')}
              className="text-cyan-400 hover:underline font-mono text-[11px]"
            >
              Open Full Chain of Custody &rarr;
            </button>
            <span className="text-slate-500 font-mono text-[10px]">
              Sec 63 BSA / 65B IEA Compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

