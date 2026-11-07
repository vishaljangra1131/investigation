import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert, Activity, Landmark, Radio, MapPin, Globe,
  GitMerge, Clock, ArrowRight, ShieldCheck, Download,
  UserCheck, AlertTriangle, FileText, CheckCircle
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function VajraDashboardView() {
  const { caseData, records, bankTransactions, suspects, lbsRecords, addNotification, downloadPdfReport } = useApp();

  const printVajraSummary = () => {
    downloadPdfReport("VAJRA – UNIFIED CASE COMMAND DOSSIER");
    addNotification("Printed Vajra Unified Case Intelligence Dossier.");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold mb-1">
            <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
            <span>VAJRA – MASTER CASE INTELLIGENCE COMMAND CENTER</span>
          </div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Operation CyberTrack ({caseData?.case_id || 'FIR-DEL-2026-8812'})
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Holistic intelligence correlation: Synchronizing Telecom (CDR), Financial (Bank/UPI), Cyber (IPDR/IP), and Movement (LBS) onto one unified timeline.
          </p>
        </div>

        <button
          onClick={printVajraSummary}
          className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Vajra Master Dossier</span>
        </button>
      </div>

      {/* KPI Command Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Telecom Events" value={records.length} subtitle="Voice & SMS Records" color="cyan" icon={Radio} />
        <StatCard title="Financial Flow" value={`₹15.48L`} subtitle={`${bankTransactions.length} Tracked Txns`} color="emerald" icon={Landmark} />
        <StatCard title="LBS Waypoints" value={lbsRecords.length} subtitle="Serving BTS Towers" color="purple" icon={MapPin} />
        <StatCard title="Key Suspects" value={suspects.length} subtitle="Cross-Linked Targets" color="rose" icon={UserCheck} />
      </div>

      {/* Unified Multi-Vector Intelligence Timeline */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Chronological Multi-Vector Correlation Timeline (01-Oct-2026)
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">
            Automated event fusion across telecom, banking, and cell towers
          </span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800 text-xs">
          {/* Event 1 */}
          <div className="relative">
            <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-900"></span>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300">09:15:22 | LBS Cell Observation</span>
                <span className="text-[10px] text-slate-500">Lajpat Nagar Metro BTS</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Target handset (+919876543210) attaches to Lajpat Nagar cell tower (LAC: 1284, Cell: 4821). Suspect departs residence.
              </p>
            </div>
          </div>

          {/* Event 2 */}
          <div className="relative">
            <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-rose-400 border-2 border-slate-900"></span>
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-300">12:35:00 | Cyber Fraud Inflow (Victim Transfer)</span>
                <span className="text-[10px] text-rose-400 font-bold">RTGS INFLOW</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Victim Dr. Ramesh Verma defrauded into transferring <strong>₹7,50,000</strong> to Layer 1 Mule Account (Rohit Enterprise, HDFC 9810293847).
              </p>
            </div>
          </div>

          {/* Event 3 */}
          <div className="relative">
            <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-slate-900"></span>
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300">12:40:00 | Movement Transit Arrival</span>
                <span className="text-[10px] text-slate-400">Connaught Place Block C</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Target mobile connects to Connaught Place 5G tower. Dwells in immediate proximity of HDFC ATM cash dispenser.
              </p>
            </div>
          </div>

          {/* Event 4 */}
          <div className="relative">
            <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-purple-400 border-2 border-slate-900"></span>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-300">13:05:00 | Structuring Layer 2 Transfer</span>
                <span className="text-[10px] text-purple-400">IMPS & UPI DISPERSAL</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Layer 1 account disperses ₹49,000 to Amit Singh (amitsingh99@okaxis) and ₹49,000 to Vikas Yadav (vikas.ydv@paytm) to evade PAN limits.
              </p>
            </div>
          </div>

          {/* Event 5 */}
          <div className="relative">
            <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300">16:30:00 | Law Enforcement Intervention</span>
                <span className="text-[10px] text-emerald-400 font-bold">SECTION 102 CrPC LIEN</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Bank Nodal Officer executes emergency freeze notice. <strong>₹1,99,000 preserved</strong> across HDFC and Axis mule accounts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Vector Action Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="font-bold text-cyan-400 block uppercase">1. Telecom Action</span>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Requisition subscriber CAF and tower dump logs under Section 91 CrPC / Section 94 BNSS from Airtel and Jio nodal officers.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="font-bold text-emerald-400 block uppercase">2. Financial Action</span>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Issue Section 102 CrPC account freeze confirmation to HDFC Bank and serve subpoena to Binance P2P compliance regarding wallet flow.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="font-bold text-rose-400 block uppercase">3. Ground Raid Action</span>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Despatch field team to Lajpat Nagar Part 2 residence for apprehension of primary syndicate organizer Rohit Verma.
          </p>
        </div>
      </div>
    </div>
  );
}

