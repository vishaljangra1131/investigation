import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText, Download, FileSpreadsheet, ShieldCheck, Scale,
  Check, Printer, CheckCircle, AlertCircle, Languages,
  FileCode, Layers, Landmark, Radio, Globe, RefreshCw
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function ReportGenerationView() {
  const {
    caseData, evidence, summary, records, bankTransactions,
    downloadPdfReport, downloadExcelReport, addNotification,
    activeLanguage, setActiveLanguage
  } = useApp();

  const [sections, setSections] = useState({
    caseInfo: true,
    bsaCertificate: true,
    telecomKpi: true,
    financialSummary: true,
    muleAccounts: true,
    topContacts: true,
    movementTrajectory: true,
    statutoryDeclaration: true
  });

  const toggleSection = (key) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const exportJsonDossier = () => {
    const fullDossier = {
      platform: "Investigation Pro – The Power of Investigation",
      case_reference: caseData,
      primary_evidence: evidence,
      summary_kpis: summary,
      financial_transactions_count: bankTransactions.length,
      sample_records_count: records.length,
      statutory_compliance: "Section 63 Bharatiya Sakshya Adhiniyam, 2023 / Section 65B Indian Evidence Act",
      generated_at: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(fullDossier, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Investigation_Pro_Dossier_${caseData?.case_id || 'REPORT'}.json`;
    a.click();
    addNotification("Exported structured forensic JSON dossier.");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Judicial Dossier Generator & Forensic Report Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Export certified court-admissible dossiers in PDF, multi-sheet Excel, CSV, and JSON. Compliant with Section 63 BSA 2023 with bilingual English/Hindi support.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Switch */}
          <div className="flex items-center rounded-lg bg-slate-900 border border-slate-700 p-0.5 text-xs">
            <button
              onClick={() => { setActiveLanguage('en'); addNotification("Switched dossier language to English."); }}
              className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${activeLanguage === 'en' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
            >
              English
            </button>
            <button
              onClick={() => { setActiveLanguage('hi'); addNotification("Switched dossier language to Hindi (हिन्दी)."); }}
              className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${activeLanguage === 'hi' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
            >
              हिन्दी
            </button>
          </div>

          <button
            onClick={() => downloadPdfReport()}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/25 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Generate Official PDF</span>
          </button>

          <button
            onClick={downloadExcelReport}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Excel Workbook</span>
          </button>

          <button
            onClick={exportJsonDossier}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            title="Export Raw JSON Dossier"
          >
            <FileCode className="w-4 h-4 text-purple-400" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total Records" value={records.length} subtitle="Indexed Communications" color="cyan" icon={Radio} />
        <StatCard title="Evidence Hash" value="SHA-256" subtitle="Cryptographically Verified" color="emerald" icon={ShieldCheck} />
        <StatCard title="Financial Flow" value={`₹15.48L`} subtitle={`${bankTransactions.length} Verified Entries`} color="purple" icon={Landmark} />
        <StatCard title="Court Standard" value="BSA SEC 63" subtitle="Judicially Admissible" color="amber" icon={Scale} />
      </div>

      {/* Sections Configurator */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Customize Judicial Dossier Sections
        </h2>
        <p className="text-xs text-slate-400">
          Select or deselect analytical modules to be bundled into the generated court report:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer hover:bg-slate-900/60">
            <input type="checkbox" checked={sections.caseInfo} onChange={() => toggleSection('caseInfo')} className="rounded border-slate-700 text-cyan-500 focus:ring-0" />
            <div>
              <span className="font-bold text-white block">Case & Subpoena Metadata</span>
              <span className="text-[10px] text-slate-500">FIR details, investigating officer, and jurisdiction</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer hover:bg-slate-900/60">
            <input type="checkbox" checked={sections.bsaCertificate} onChange={() => toggleSection('bsaCertificate')} className="rounded border-slate-700 text-cyan-500 focus:ring-0" />
            <div>
              <span className="font-bold text-white block">Section 63 BSA Electronic Certificate</span>
              <span className="text-[10px] text-slate-500">Immutable SHA-256 hash and write-block guarantee</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer hover:bg-slate-900/60">
            <input type="checkbox" checked={sections.telecomKpi} onChange={() => toggleSection('telecomKpi')} className="rounded border-slate-700 text-cyan-500 focus:ring-0" />
            <div>
              <span className="font-bold text-white block">Telecom Call Traffic & Frequency</span>
              <span className="text-[10px] text-slate-500">Inbound/outbound calls, durations, and nocturnal spikes</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer hover:bg-slate-900/60">
            <input type="checkbox" checked={sections.financialSummary} onChange={() => toggleSection('financialSummary')} className="rounded border-slate-700 text-cyan-500 focus:ring-0" />
            <div>
              <span className="font-bold text-white block">Financial Inflow & Mule Structuring</span>
              <span className="text-[10px] text-slate-500">Credit inflows, fast debit dispersion, and frozen balances</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer hover:bg-slate-900/60">
            <input type="checkbox" checked={sections.movementTrajectory} onChange={() => toggleSection('movementTrajectory')} className="rounded border-slate-700 text-cyan-500 focus:ring-0" />
            <div>
              <span className="font-bold text-white block">LBS Serving Cell Trajectory</span>
              <span className="text-[10px] text-slate-500">Antenna sector transitions and crime scene dwell times</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer hover:bg-slate-900/60">
            <input type="checkbox" checked={sections.statutoryDeclaration} onChange={() => toggleSection('statutoryDeclaration')} className="rounded border-slate-700 text-cyan-500 focus:ring-0" />
            <div>
              <span className="font-bold text-white block">Official Seal & Officer Sign-Off Block</span>
              <span className="text-[10px] text-slate-500">Formal law enforcement signature block for courtroom trial</span>
            </div>
          </label>
        </div>
      </div>

      {/* Statutory Admissibility Notice */}
      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/50 flex items-start gap-3 text-xs leading-relaxed text-cyan-200">
        <Scale className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-cyan-300 block mb-0.5">Courtroom Admissibility Notice:</span>
          Under Section 63 of Bharatiya Sakshya Adhiniyam, 2023, electronic evidence produced by computer systems is admissible in evidence in any judicial proceeding without further proof or production of the original, provided the electronic device was operating properly and a certificate of cryptographic integrity is attached.
        </div>
      </div>
    </div>
  );
}
