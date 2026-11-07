import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Radio, Shield, Database, Activity, FileText, ArrowRight,
  MapPin, Share2, AlertTriangle, Layers, BookOpen, Clock,
  CheckCircle, Lock, Cpu, Sparkles, Globe, Landmark,
  GitMerge, UserCheck, Search, Download, HelpCircle, Scale
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function HomeView() {
  const { setCurrentView, summary, records, loadDemoData, userAuth } = useApp();

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16 font-mono">
      {/* 1. Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#070d1e] via-[#091126] to-[#040813] border border-cyan-500/30 p-8 md:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>INVESTIGATION PRO – THE POWER OF INVESTIGATION</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            THE POWER OF <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
              DIGITAL INVESTIGATION
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-cyan-200/90 font-semibold tracking-wide">
            One Platform. Complete Intelligence. Faster Investigations.
          </p>

          <p className="text-sm text-slate-300 leading-relaxed font-sans max-w-3xl">
            A unified digital investigation workspace for telecom analysis, financial intelligence, cybercrime investigation, OSINT, digital evidence management, and courtroom case documentation. Designed strictly pursuant to Section 63 Bharatiya Sakshya Adhiniyam, 2023.
          </p>

          {/* Quick Action Buttons */}
          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentView('tools-directory')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Explore Investigation Tools</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentView('officer-auth')}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Officer Login / 2FA</span>
            </button>

            <button
              onClick={() => setCurrentView('officer-auth')}
              className="px-5 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Register Now</span>
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-5 py-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Open Live Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Platform Statistics Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            National Digital Investigation Deployment Metrics
          </h2>
          <span className="text-[11px] text-slate-500">Live Database Counters</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-xl font-black text-cyan-400 block">1,480+</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Registered Officers</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-xl font-black text-emerald-400 block">36</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">States & UTs</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-xl font-black text-purple-400 block">750+</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Districts Covered</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-xl font-black text-amber-400 block">36+</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Investigation Tools</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-xl font-black text-rose-400 block">12,450+</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Cases Analysed</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-xl font-black text-sky-400 block">38,900+</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Reports Generated</span>
          </div>
        </div>
      </div>

      {/* 3. Investigation Tools Preview Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Core Investigation Modules & Forensic Engines
            </h2>
            <p className="text-xs text-slate-400">
              Select a specialized module to launch immediate analysis on authorized case data.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('tools-directory')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>View All 36+ Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Card 1: CDR 2.0 */}
          <div
            onClick={() => setCurrentView('cdr-overview')}
            className="p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 group-hover:bg-cyan-500/20">
                <Radio className="w-5 h-5" />
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                FLAGSHIP
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300">CDR 2.0 Analysis</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Telephony call traffic, nocturnal 23:00-05:00 patterns, handset switching, and cell tower mapping.
              </p>
            </div>
          </div>

          {/* Card 2: IPDR */}
          <div
            onClick={() => setCurrentView('ipdr-analysis')}
            className="p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-slate-800 text-purple-400 group-hover:bg-purple-500/20">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                POPULAR
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300">IPDR Analysis</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Packet data sessions, destination IPs, transport ports, and Tor/VPN/VoIP protocol recognition.
              </p>
            </div>
          </div>

          {/* Card 3: Arthagya Bank Statements */}
          <div
            onClick={() => setCurrentView('arthagya-bank')}
            className="p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 group-hover:bg-emerald-500/20">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                FINTECH
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300">Arthagya Bank Intelligence</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Automated bank statement parsing, structuring detection, rapid mule velocity, and UPI tracking.
              </p>
            </div>
          </div>

          {/* Card 4: NCRP Graph */}
          <div
            onClick={() => setCurrentView('ncrp-graph')}
            className="p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 group-hover:bg-cyan-500/20">
                <GitMerge className="w-5 h-5" />
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                GRAPH
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300">NCRP Money Trail</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Multi-layer cyber fraud fund-flow graphs: Layer 1/2 mule accounts, liens, and cash out sinks.
              </p>
            </div>
          </div>

          {/* Card 5: IP Intelligence */}
          <div
            onClick={() => setCurrentView('ip-intelligence')}
            className="p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-slate-800 text-rose-400 group-hover:bg-rose-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                OSINT
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-rose-300">IP Intelligence</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                ASN lookup, ISP network attribution, Tor exit node detection, and abuse reputation scoring.
              </p>
            </div>
          </div>

          {/* Card 6: Domain Intelligence */}
          <div
            onClick={() => setCurrentView('domain-intelligence')}
            className="p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-slate-800 text-sky-400 group-hover:bg-sky-500/20">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                WHOIS
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-sky-300">Domain Intelligence</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                WHOIS/RDAP, DNS records, SPF/DKIM/DMARC email security, and SSL certificate audit.
              </p>
            </div>
          </div>

          {/* Card 7: LBS Movement Mapping */}
          <div
            onClick={() => setCurrentView('lbs-mapping')}
            className="p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-slate-800 text-amber-400 group-hover:bg-amber-500/20">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                LOCATION
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300">LBS Movement Mapping</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Chronological cell tower trajectory, transit speeds, crime scene dwell times, and co-location.
              </p>
            </div>
          </div>

          {/* Card 8: Suspect Intelligence */}
          <div
            onClick={() => setCurrentView('suspect-intelligence')}
            className="p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-slate-800 text-rose-400 group-hover:bg-rose-500/20">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                DOSSIER
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-rose-300">Suspect Intelligence</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Subject dossiers: telephone aliases, linked IMEIs, masked Aadhaar/PAN, and bilingual reports.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. How It Works Section */}
      <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
            Standard Operating Procedure
          </span>
          <h2 className="text-xl font-bold text-white">How Investigation Pro Works</h2>
          <p className="text-xs text-slate-400">
            A structured 7-step forensic workflow from evidence ingestion to courtroom dossier.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block text-sm">01</span>
            <span className="font-bold text-white block">Register</span>
            <p className="text-[11px] text-slate-400">Create officer account with official credentials.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block text-sm">02</span>
            <span className="font-bold text-white block">Verify</span>
            <p className="text-[11px] text-slate-400">Clear official law enforcement eligibility.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block text-sm">03</span>
            <span className="font-bold text-white block">Login</span>
            <p className="text-[11px] text-slate-400">Secure 2FA authentication to command dashboard.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block text-sm">04</span>
            <span className="font-bold text-white block">Select Tool</span>
            <p className="text-[11px] text-slate-400">Choose from 36+ specialized forensic engines.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block text-sm">05</span>
            <span className="font-bold text-white block">Upload</span>
            <p className="text-[11px] text-slate-400">Ingest subpoenaed CDR, IPDR, or bank records.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block text-sm">06</span>
            <span className="font-bold text-white block">Analyse</span>
            <p className="text-[11px] text-slate-400">Interactive link graphs, heatmaps & structuring.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block text-sm">07</span>
            <span className="font-bold text-white block">Report</span>
            <p className="text-[11px] text-slate-400">Generate certified Section 63 BSA dossiers.</p>
          </div>
        </div>
      </div>

      {/* 5. Statutory Compliance Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0a1226] to-slate-950 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-cyan-950 text-cyan-400 shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Legal Compliance & Statutory Safeguards
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Strictly compliant with Bharatiya Sakshya Adhiniyam, 2023 (Section 63), Information Technology Act, 2000, and Digital Personal Data Protection Act, 2023. Synthetic demo datasets are clearly marked to ensure zero unauthorized disclosure.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('evidence-management')}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow"
        >
          <span>Open Evidence Locker</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
