import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Radio, Shield, Database, Activity, FileText, ArrowRight, 
  MapPin, Share2, AlertTriangle, Layers, BookOpen, Clock, 
  CheckCircle, Lock, Cpu, Sparkles
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function HomeView() {
  const { setCurrentView, summary, records, loadDemoData, resetDatabase } = useApp();

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c152e] via-[#090f20] to-[#060a14] border border-cyan-500/20 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>ADVANCED TELECOM FORENSICS & METADATA INTELLIGENCE</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            CDR ANALYSIS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">PRO</span>
          </h1>

          <p className="text-lg text-slate-300 font-light leading-relaxed">
            Call Detail Record Analysis & Telecom Forensics Platform for Digital Forensic Investigators, Cybercrime Units, Law Enforcement, and Cybersecurity Researchers.
          </p>

          <p className="text-xs text-slate-400 leading-relaxed">
            Transform raw telecommunications switch data into actionable investigative intelligence. Perform deep counterparty link analysis, IMEI/IMSI handset switching detection, chronological serving cell reconstruction, and rule-based anomaly detection with full cryptographic chain of custody.
          </p>

          {/* Quick Action Buttons */}
          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentView('new-investigation')}
              className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>1. Start New Investigation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentView('upload-cdr')}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span>2. Upload CDR File</span>
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>3. Open Analysis Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentView('learning-center')}
              className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>4. Learn CDR Analysis</span>
            </button>

            <button
              onClick={() => setCurrentView('report-generation')}
              className="px-4 py-2.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>5. Generate Forensic Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Sample Stats Preview Banner */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Active Telecom Intelligence Overview
            </h2>
            <p className="text-xs text-slate-400">
              Real-time summary computed dynamically from active working records (Clearly labelled as fictional training dataset).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadDemoData('case_1')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono underline cursor-pointer"
            >
              Reload Case 1 Demo Data
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset? This will remove all uploaded CDR files, forensic evidence, and case details (Case No, Officer, Agency, Title, Brief).")) {
                  resetDatabase();
                }
              }}
              className="text-xs text-rose-400 hover:text-rose-300 font-mono underline cursor-pointer"
            >
              Reset Database
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard title="Total Records" value={summary ? summary.total_records : records.length} subtitle="CDR Transactions" color="cyan" />
          <StatCard title="Incoming Calls" value={summary ? summary.total_incoming : 0} subtitle="Mobile Terminated" color="emerald" />
          <StatCard title="Outgoing Calls" value={summary ? summary.total_outgoing : 0} subtitle="Mobile Originated" color="blue" />
          <StatCard title="Unique Numbers" value={summary ? summary.unique_numbers : 0} subtitle="Counterparty Nodes" color="purple" />
          <StatCard title="Observed IMEIs" value={summary ? summary.unique_imeis : 0} subtitle="Physical Handsets" color="amber" />
          <StatCard title="Total Duration" value={summary?.total_duration_formatted || "00h 00m"} subtitle="Airtime Logged" color="rose" />
        </div>
      </div>

      {/* 5-Stage Forensic Workflow */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            Standard Telecom Forensics Investigation Workflow
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Follows accepted digital forensics principles and Section 63 of Bharatiya Sakshya Adhiniyam, 2023.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            { step: "01", title: "Data Ingestion", desc: "Upload CSV, XLS, XLSX, JSON, or TXT CDR files from any telecom provider." },
            { step: "02", title: "Integrity Verification", desc: "Automatic SHA-256 cryptographic hashing to maintain digital chain of custody." },
            { step: "03", title: "Schema Normalization", desc: "Smart column auto-detection and data cleaning on a separate working copy." },
            { step: "04", title: "Forensic Analysis", desc: "Counterparty link mapping, IMEI swaps, cell tower sequences, and anomaly flags." },
            { step: "05", title: "Certified Reporting", desc: "Export court-ready PDF dossiers and multi-sheet Excel analytical workbooks." }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all">
              <div className="text-xs font-mono font-bold text-cyan-400 mb-1">{item.step}</div>
              <div className="text-xs font-semibold text-white mb-1">{item.title}</div>
              <div className="text-[11px] text-slate-400 leading-snug">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Features Grid */}
      <div className="space-y-4">
        <div className="border-b border-slate-800 pb-2">
          <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            Key Investigation Modules
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Call & Duration Breakdown",
              icon: Activity,
              desc: "Incoming, outgoing, missed call analysis, 24-hour distribution, and duration histograms.",
              action: () => setCurrentView('call-analysis')
            },
            {
              title: "Target Number Deep Profile",
              icon: Share2,
              desc: "Complete 360-degree subscriber profile: counterparty rankings, inbound/outbound ratio, and timeline.",
              action: () => setCurrentView('number-analysis')
            },
            {
              title: "IMEI & Handset Transition",
              icon: Cpu,
              desc: "Identify TAC manufacturers and detect burner phone handset swaps across single phone numbers.",
              action: () => setCurrentView('imei-analysis')
            },
            {
              title: "Serving Cell Geolocation",
              icon: MapPin,
              desc: "Interactive Leaflet mapping of antenna sectors and chronological cell handover trajectories.",
              action: () => setCurrentView('geolocation-analysis')
            },
            {
              title: "Rule-Based Pattern Anomaly",
              icon: AlertTriangle,
              desc: "Identify nocturnal communication bursts, signal pinging, rapid transit velocity, and volume spikes.",
              action: () => setCurrentView('pattern-detection')
            },
            {
              title: "Multi-Target CDR Comparison",
              icon: Layers,
              desc: "Cross-link two distinct target subscriber records to identify mutual accomplices and shared cell towers.",
              action: () => setCurrentView('cdr-comparison')
            }
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                onClick={f.action}
                className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
              >
                <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {f.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {f.desc}
                </p>
                <div className="mt-3 flex items-center text-[10px] text-cyan-400 font-mono font-medium gap-1 group-hover:underline">
                  <span>Explore Module</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

