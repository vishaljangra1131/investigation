import React from 'react';
import { Scale, AlertTriangle, ShieldCheck, FileText, CheckCircle, Info } from 'lucide-react';

export default function LegalDisclaimerView() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-cyan-400" />
          Legal Compliance & Statutory Evidence Framework (India)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Reference guide covering statutory provisions governing electronic records, judicial admissibility, and metadata boundaries.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6 text-xs text-slate-300 leading-relaxed font-sans">
        {/* Statutory Overview */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            1. Bharatiya Sakshya Adhiniyam, 2023 (BSA) - Section 63
          </h2>
          <p>
            In the Republic of India, the admissibility of electronic evidence in judicial proceedings is governed by <b>Section 63 of the Bharatiya Sakshya Adhiniyam, 2023</b> (corresponding to the erstwhile Section 65B of the Indian Evidence Act, 1872).
          </p>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-[11px] font-mono">
            <span className="text-cyan-400 font-bold block">Statutory Requirements for Admissibility:</span>
            <ul className="list-disc list-inside space-y-1 text-slate-300 font-sans">
              <li>The computer output containing the electronic record was produced by the computer during the period over which the computer was used regularly to store or process information.</li>
              <li>During the material period, information of the kind contained in the electronic record was regularly fed into the computer in the ordinary course of legitimate activities.</li>
              <li>Throughout the material part of the said period, the computer was operating properly or out of operation only for periods that did not affect the accuracy of the electronic record.</li>
              <li>The information contained in the electronic record reproduces or is derived from such information fed into the computer in the ordinary course.</li>
            </ul>
          </div>
        </div>

        {/* Information Technology Act, 2000 */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            2. Information Technology Act, 2000 & Telecommunications Act, 2023
          </h2>
          <p>
            Requisition, retention, and inspection of subscriber call records must comply with applicable rules framed under <b>Section 69 of the Information Technology Act, 2000</b> and the <b>Telecommunications Act, 2023</b>, respecting constitutional safeguards on privacy recognized by the Supreme Court of India in <i>K.S. Puttaswamy v. Union of India (2017)</i>.
          </p>
        </div>

        {/* Evidentiary Boundaries & Hypothesis Warning */}
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-2">
          <h3 className="text-xs font-bold text-rose-300 font-mono uppercase flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            3. Evidentiary Boundary Notice: Metadata Observations vs. Criminal Proof
          </h3>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
            Call Detail Records establish communication metadata and radio cell antenna associations at specific moments in time. <b>They do not prove:</b>
          </p>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300 font-sans">
            <li>The real-world identity of the person speaking, unless corroborated by lawful SDR/CAF records and physical possession.</li>
            <li>The content, intent, or truthfulness of any spoken conversation or text message.</li>
            <li>Pinpoint GPS geographic coordinates of a person, as cell antenna coverage encompasses broad urban sectors.</li>
          </ul>
        </div>

        {/* Verification Reminder */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 italic">
          Disclaimer: This reference framework is provided for informational and training purposes only and does not constitute formal legal counsel. Statutory provisions, court precedents, and departmental standard operating procedures must be verified by the investigating officer before courtroom submission.
        </div>
      </div>
    </div>
  );
}

