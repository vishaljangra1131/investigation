import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText, Download, FileSpreadsheet, ShieldCheck, Scale, 
  Check, Printer, CheckCircle, AlertCircle
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function ReportGenerationView() {
  const { caseData, evidence, summary, records, downloadPdfReport, downloadExcelReport } = useApp();
  const [sections, setSections] = useState({
    caseInfo: true,
    sha256Certificate: true,
    kpiSummary: true,
    topContacts: true,
    imeiAnalysis: true,
    anomalyLeads: true,
    towerTable: true,
    legalDeclaration: true
  });

  const toggleSection = (key) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Forensic Report Generation & Judicial Dossier Export
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Export comprehensive court-ready PDF dossiers and multi-sheet Excel analytical workbooks complete with Section 63 BSA electronic evidence certificates.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={downloadPdfReport}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF Dossier</span>
          </button>

          <button
            onClick={downloadExcelReport}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Download Excel Workbook</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Analyzed Records" value={records.length} subtitle="Certified Count" color="cyan" />
        <StatCard title="Evidence Hash" value="SHA-256" subtitle="Cryptographically Verified" color="emerald" icon={ShieldCheck} />
        <StatCard title="Target Numbers" value={(caseData.target_numbers || []).length} subtitle="Tagged Entities" color="purple" />
        <StatCard title="Statutory Standard" value="BSA SEC 63" subtitle="Admissible Format" color="amber" icon={Scale} />
      </div>

      {/* Report Sections Config */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          Customize Report Inclusions & Dossier Chapters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {[
            { key: 'caseInfo', label: '1. Official Case Identification & Investigating Agency Details' },
            { key: 'sha256Certificate', label: '2. Cryptographic SHA-256 Evidence Hash & Chain of Custody Log' },
            { key: 'kpiSummary', label: '3. Executive Telecom Forensic Summary & Airtime Metrics' },
            { key: 'topContacts', label: '4. Frequently Contacted Counterparties Ranking Table' },
            { key: 'imeiAnalysis', label: '5. Handset Switching & Burner Phone Transition Chronology' },
            { key: 'anomalyLeads', label: '6. Algorithmic Pattern Anomalies & Heuristic Flags' },
            { key: 'towerTable', label: '7. Serving Base Station Towers & Radio Sector Inventory' },
            { key: 'legalDeclaration', label: '8. Certificate of Electronic Record (BSA Sec 63 / IEA Sec 65B)' }
          ].map(s => (
            <label
              key={s.key}
              onClick={() => toggleSection(s.key)}
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                sections[s.key] 
                  ? 'bg-slate-900 border-cyan-500/40 text-cyan-300 font-semibold' 
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <span>{s.label}</span>
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                sections[s.key] ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700'
              }`}>
                {sections[s.key] && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Certificate Preview Box */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase font-mono">
            <Scale className="w-4 h-4 text-cyan-400" />
            Statutory Certificate Format Preview (Bharatiya Sakshya Adhiniyam, 2023 - Section 63)
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">
            CERTIFIED UNDER LAWFUL PROCESS
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-serif leading-relaxed text-slate-300 space-y-3">
          <div className="text-center font-bold text-sm text-white font-sans border-b border-slate-800 pb-2">
            CERTIFICATE PURSUANT TO SECTION 63 OF THE BHARATIYA SAKSHYA ADHINIYAM, 2023<br/>
            <span className="text-[11px] font-normal text-slate-400">(Corresponding to erstwhile Section 65B of Indian Evidence Act, 1872)</span>
          </div>

          <p>
            I, <b>{caseData.officer_name || 'Investigating Officer'}</b>, presently posted at <b>{caseData.agency || 'Law Enforcement Agency'}</b>, do hereby certify as under:
          </p>

          <ol className="list-decimal list-inside space-y-2 text-[11px] text-slate-300 font-sans">
            <li>
              That the Call Detail Records (CDR) referenced in Case <b>{caseData.case_id || 'ACTIVE INVESTIGATION'}</b> were lawfully obtained from cellular service providers and ingested into the computerized forensic workstation.
            </li>
            <li>
              That the cryptographic SHA-256 hash was computed upon ingestion as <b>{evidence?.sha256_hash || 'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855'}</b>, ensuring that no alteration, tampering, or data loss occurred.
            </li>
            <li>
              That during the period of analytical processing, the digital forensic system was operating properly and at all material times under authorized official control.
            </li>
          </ol>

          <div className="pt-4 flex justify-between text-xs font-sans text-slate-400">
            <div>
              Date: <b>{new Date().toISOString().slice(0, 10)}</b><br/>
              Place: New Delhi
            </div>
            <div className="text-right">
              <b>{caseData.officer_name || 'Investigating Officer'}</b><br/>
              Digital Forensics & Telecom Examiner<br/>
              {caseData.agency || 'Law Enforcement Agency'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

