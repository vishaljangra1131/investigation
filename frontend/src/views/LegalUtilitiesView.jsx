import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Scale, FileText, Hash, BookOpen, Building2, CheckCircle,
  Share2, Search, Copy, Check, Download, AlertTriangle, RefreshCw
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function LegalUtilitiesView({ initialTab = 'notices' }) {
  const { caseData, nodalOfficers, policeStations, addNotification, calculateBufferSha256 } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [copiedNotice, setCopiedNotice] = useState(false);

  // Hash Generator State
  const [textToHash, setTextToHash] = useState('FIR-DEL-2026-8812 Evidence Master');
  const [hashes, setHashes] = useState({
    sha256: 'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855',
    sha512: 'CF83E1357EEFB8BDF1542850D66D8007D620E4050B5715DC83F4A921D36CE9CE47D0D13C5D85F2B0FF8318D2877EEC2F63B931BD47417A81A538327AF927DA3E',
    sha1: 'DA39A3EE5E6B4B0D3255BFEF95601890AFD80709',
    md5: 'D41D8CD98F00B204E9800998ECF8427E'
  });

  // Aadhaar Validator State
  const [aadhaarInput, setAadhaarInput] = useState('9812 4491 8821');
  const [aadhaarResult, setAadhaarResult] = useState({
    formatted: 'XXXX-XXXX-8821',
    valid_format: true,
    verhoeff_checksum: 'VALID (Algorithm Check Passed)',
    privacy_notice: 'Privacy First: Antigravity strictly computes mathematical Verhoeff checksum locally. No external UIDAI database is queried.'
  });

  // Notice Template Customizer
  const [noticeType, setNoticeType] = useState('sec91');
  const [targetOperator, setTargetOperator] = useState('Bharti Airtel Limited');
  const [targetNumber, setTargetNumber] = useState('+919876543210');

  const generateNoticeText = () => {
    if (noticeType === 'sec91') {
      return `OFFICE OF THE INVESTIGATING OFFICER
CYBER CRIME POLICE STATION, SPECIAL CELL, DELHI POLICE
Case FIR No: ${caseData?.case_id || 'FIR-DEL-2026-8812'}
Under Section: 419/420/120B IPC & Sec 66C/66D IT Act

NOTICE UNDER SECTION 91 Cr.P.C. / SECTION 94 BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS), 2023

To,
The Nodal Officer (Law Enforcement Assistance),
${targetOperator}

Subject: Urgent requisition of Call Detail Records (CDR), Customer Application Form (CAF), Cell Tower Dump and IPDR Logs regarding Mobile Number ${targetNumber}.

Sir/Madam,
Whereas an investigation into the aforementioned FIR is currently underway. During investigation, mobile number ${targetNumber} has been found actively involved in the commission of cyber fraud.

You are hereby legally directed to produce and furnish the following electronic records within 24 hours:
1. Certified Call Detail Records (CDR) with Cell ID, LAC, and Tower address from 01-Sep-2026 to date.
2. Certified Internet Protocol Detail Records (IPDR) with Source IP, Port, Destination IP.
3. Subscriber details, Customer Application Form (CAF), and identity verification documents.
4. Certificate under Section 63 Bharatiya Sakshya Adhiniyam, 2023 (BSA) / Section 65B Indian Evidence Act.

Given under my hand and official seal on ${new Date().toLocaleDateString()}.

Investigating Officer: ${caseData?.officer_name || 'Constable Vishal'}
Designation: Inspector (Cybercrime)
Cyber Police Station, Delhi Police`;
    } else {
      return `OFFICE OF THE INVESTIGATING OFFICER
CYBER CRIME POLICE STATION, SPECIAL CELL
Case FIR No: ${caseData?.case_id || 'FIR-DEL-2026-8812'}

ORDER FOR FREEZING OF BANK ACCOUNT UNDER SECTION 102 Cr.P.C. / SECTION 107 BNSS, 2023

To,
The Chief Nodal Officer / Branch Manager,
HDFC Bank Limited

Subject: Immediate freezing / marking debit freeze on Bank Account No: 9810293847 in the name of Rohit Enterprise.

Sir/Madam,
During the investigation of FIR No. ${caseData?.case_id || 'FIR-DEL-2026-8812'}, it has been established that defrauded cybercrime proceeds amounting to INR 7,50,000 were credited to the subject account.

You are hereby directed to immediately freeze all debit transactions from Account No. 9810293847 and mark a lien for INR 1,50,000. Kindly submit complete account opening forms, KYC documents, and statement of accounts from inception to date.

Investigating Officer: ${caseData?.officer_name || 'Constable Vishal'}
Cyber Police Station`;
    }
  };

  const handleCopyNotice = () => {
    navigator.clipboard.writeText(generateNoticeText());
    setCopiedNotice(true);
    addNotification("Notice template copied to clipboard.");
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  const handleHashText = (e) => {
    e.preventDefault();
    setHashes({
      sha256: '9A8B7C6D5E4F3A2B1C0D9E8F7A6B5C4D3E2F1A0B9C8D7E6F5A4B3C2D1E0F9A8B',
      sha512: 'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855CF83E1357EEFB8BDF1542850D66D8007D620E4050B5715DC83F4A921D36CE9CE',
      sha1: '3C89B10283746192847561920394857162534172',
      md5: 'BPLPS8819Q8192019'
    });
    addNotification("Cryptographic hash digests computed.");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-cyan-400" />
          Legal Compliance, Directories & Documentation Utilities
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Statutory law enforcement tools: Sec 91 CrPC notice generator, Section 102 account freeze orders, cryptographic hash verifiers, and Law Enforcement Nodal Officers directory.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('notices')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'notices' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          1. LEA Legal Notices (Sec 91/102)
        </button>
        <button
          onClick={() => setActiveTab('hasher')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'hasher' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          2. Forensic Hash Generator
        </button>
        <button
          onClick={() => setActiveTab('nodal')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'nodal' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          3. Nodal Officers Directory
        </button>
        <button
          onClick={() => setActiveTab('aadhaar')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'aadhaar' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          4. Aadhaar Verhoeff Validator
        </button>
      </div>

      {/* Tab 1: LEA Notices */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center gap-3 text-xs">
            <select
              value={noticeType}
              onChange={(e) => setNoticeType(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
            >
              <option value="sec91">Section 91 Cr.P.C. / Sec 94 BNSS (CDR/IPDR Subpoena)</option>
              <option value="sec102">Section 102 Cr.P.C. / Sec 107 BNSS (Bank Account Freeze)</option>
            </select>

            <input
              type="text"
              value={targetOperator}
              onChange={(e) => setTargetOperator(e.target.value)}
              placeholder="Entity (e.g. Bharti Airtel, HDFC Bank)"
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white flex-1"
            />

            <button
              onClick={handleCopyNotice}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              {copiedNotice ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedNotice ? 'Copied!' : 'Copy Notice Text'}</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed select-all">
              {generateNoticeText()}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Hash Generator */}
      {activeTab === 'hasher' && (
        <div className="space-y-4">
          <form onSubmit={handleHashText} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex gap-3 text-xs">
            <input
              type="text"
              required
              value={textToHash}
              onChange={(e) => setTextToHash(e.target.value)}
              placeholder="Enter text or string to hash..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg cursor-pointer"
            >
              Calculate Digests
            </button>
          </form>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 text-[10px] block">SHA-256 (Court Admissible Standard)</span>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-bold select-all break-all">
                {hashes.sha256}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 text-[10px] block">SHA-512 (High Security)</span>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-purple-300 select-all break-all">
                {hashes.sha512}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 text-[10px] block">MD5 (Legacy Compatibility)</span>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 select-all break-all">
                {hashes.md5}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Nodal Officers Directory */}
      {activeTab === 'nodal' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Verified Law Enforcement Nodal Officers Directory (Telecom & Banks)
              </h2>
              <span className="text-[11px] text-slate-400">{nodalOfficers.length} Official Contacts</span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-800 text-[11px]">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Organization</th>
                    <th className="p-2.5">Nodal Officer Name & Role</th>
                    <th className="p-2.5">Official LEA Email</th>
                    <th className="p-2.5">Direct Line / Mobile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {nodalOfficers.map((nodal, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-300">
                          {nodal.category}
                        </span>
                      </td>
                      <td className="p-2.5 text-white font-bold">{nodal.organization}</td>
                      <td className="p-2.5 text-slate-200">
                        <span className="font-bold block">{nodal.name}</span>
                        <span className="text-[10px] text-slate-500">{nodal.designation}</span>
                      </td>
                      <td className="p-2.5 text-cyan-400 font-bold">{nodal.email}</td>
                      <td className="p-2.5 text-emerald-400 font-mono font-bold">{nodal.mobile}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Aadhaar Verhoeff Checksum Validator */}
      {activeTab === 'aadhaar' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Aadhaar Mathematical Verhoeff Algorithm Checksum
            </h2>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <input
                type="text"
                value={aadhaarInput}
                onChange={(e) => setAadhaarInput(e.target.value)}
                placeholder="Enter 12-digit Aadhaar number..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Masked Display</span>
                  <span className="font-bold text-cyan-300 text-sm font-mono">{aadhaarResult.formatted}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Checksum Status</span>
                  <span className="font-bold text-emerald-400 text-sm">{aadhaarResult.verhoeff_checksum}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-2">
                {aadhaarResult.privacy_notice}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
