import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Download, ShieldCheck, Monitor, Smartphone, Globe,
  CheckCircle, Hash, ExternalLink, Terminal, Cpu
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function DownloadsView() {
  const { addNotification } = useApp();

  const apps = [
    {
      name: "Investigation Pro – Forensic Desktop Client (64-Bit)",
      os: "Windows 10 / 11 & Windows Server",
      version: "v3.2.0-LTS",
      file_size: "148.5 MB",
      sha256: "8A4B29E1D8374029184756192039485716253417283940591827364510293847",
      description: "Full offline digital forensics workstation. Ingest gigabyte-scale CDR, IPDR, and bank statement dumps with local SQLite indexation and zero cloud upload requirements.",
      icon: Monitor,
      signature: "Digitally signed with Law Enforcement Division Certificate"
    },
    {
      name: "Investigation Pro CLI & Python Automation SDK",
      os: "Cross-Platform (Linux / macOS / Windows)",
      version: "v2.8.4",
      file_size: "12.4 MB",
      sha256: "4E3A2B1C0D9E8F7A6B5C4D3E2F1A0B9C8D7E6F5A4B3C2D1E0F9A8B7C6D5E4F3A",
      description: "Command-line batch processor for cyber police stations. Automate overnight folder ingestion, MD5/SHA-256 mass verification, and automated court dossier drafting.",
      icon: Terminal,
      signature: "PyPI Verified Official Package"
    },
    {
      name: "Investigator Mobile Companion (Android APK)",
      os: "Android 10+",
      version: "v1.9.1 (Restricted Police Distribution)",
      file_size: "24.8 MB",
      sha256: "1C0D9E8F7A6B5C4D3E2F1A0B9C8D7E6F5A4B3C2D1E0F9A8B7C6D5E4F3A2B1C0D",
      description: "On-field investigator app for emergency TSP lookup, cell tower azimuth reference, and rapid QR/VPA merchant risk identification during raids.",
      icon: Smartphone,
      signature: "Restricted Officer Distribution APK"
    },
    {
      name: "Cyber Crime Investigator Chrome Extension",
      os: "Google Chrome / Microsoft Edge / Brave",
      version: "v4.1.0",
      file_size: "4.2 MB",
      sha256: "5C4D3E2F1A0B9C8D7E6F5A4B3C2D1E0F9A8B7C6D5E4F3A2B1C0D9E8F7A6B5C4D",
      description: "One-click webpage forensic preservation. Computes bit-for-bit SHA-256 timestamped snapshot of fraudulent phish URLs pursuant to Section 63 BSA.",
      icon: Globe,
      signature: "Chrome Web Store Verified Manifest V3"
    }
  ];

  const triggerDownload = (app) => {
    // Generate a lightweight real text installer receipt
    const content = `INVESTIGATION PRO - LAW ENFORCEMENT DOWNLOAD PACKAGE
Package: ${app.name}
Version: ${app.version}
Target OS: ${app.os}
Cryptographic SHA-256 Digest: ${app.sha256}
Digital Signature: ${app.signature}
Downloaded by: Law Enforcement Officer (Investigation Pro Workspace)
Timestamp: ${new Date().toISOString()}

INSTRUCTIONS:
1. Verify SHA-256 hash using Investigation Pro Hash Generator before execution.
2. Run installation with administrative privileges.
3. For enterprise deployment across Police HQ, refer to department handbook.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${app.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_installer.txt`;
    a.click();
    addNotification(`Downloaded package receipt & installer for ${app.name}.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-cyan-400" />
            iC Apps & Desktop Downloads – Official Client Ecosystem
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Download genuine standalone desktop tools, command-line forensic utilities, and browser extensions with verified cryptographic SHA-256 checksums.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Available Software" value="4 Clients" subtitle="Desktop / CLI / Mobile" color="cyan" icon={Monitor} />
        <StatCard title="Integrity Check" value="SHA-256" subtitle="Signed Executables" color="emerald" icon={ShieldCheck} />
        <StatCard title="Operating Systems" value="Windows & Linux" subtitle="Cross-Platform Ready" color="purple" icon={Cpu} />
        <StatCard title="License Tier" value="Law Enforcement" subtitle="Authorized Access" color="amber" icon={Download} />
      </div>

      {/* Apps Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apps.map((app, idx) => {
          const IconComp = app.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between hover:border-cyan-500/40 transition-all shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-slate-800 text-cyan-400">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    {app.version}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{app.name}</h3>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-medium">OS: {app.os} • {app.file_size}</div>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2">
                    {app.description}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Hash className="w-3 h-3 text-cyan-400" />
                    SHA-256 Release Digest
                  </span>
                  <div className="text-[10px] text-cyan-300 font-mono break-all font-bold">
                    {app.sha256}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {app.signature}
                </span>

                <button
                  onClick={() => triggerDownload(app)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Build</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
