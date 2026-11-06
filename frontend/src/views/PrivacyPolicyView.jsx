import React from 'react';
import { Shield, Lock, EyeOff, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

export default function PrivacyPolicyView() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          Privacy Policy & Forensic Data Handling Safeguards
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Strict operational guidelines and security protocols governing telecommunications metadata ingestion and handling.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5 text-xs text-slate-300 leading-relaxed font-sans">
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            1. Lawful & Authorized Custody Mandate
          </h2>
          <p>
            CDR Analysis Pro is designed exclusively for authorized law enforcement agencies, cybercrime investigators, and forensic researchers operating under valid statutory authority (such as Section 91 CrPC / Section 94 BNSS in India). The platform accepts only user-provided records obtained through lawful judicial or administrative requisition.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-cyan-400" />
            2. Strict Non-Interception Boundary
          </h2>
          <p>
            This system does <b>NOT</b> intercept live telephone calls, read SMS message contents, record voice conversations, or query live telecom provider databases without authorization. All analytical computations are executed strictly against historical offline metadata records supplied by the user.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-cyan-400" />
            3. Local Air-Gapped Workstation Processing
          </h2>
          <p>
            To guarantee complete evidentiary privacy, all data parsing, relationship graph generation, and cryptographic hashing take place locally within the host server/browser environment. No subscriber telephone numbers, IMEIs, or location records are ever transmitted to third-party public cloud endpoints.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-cyan-400" />
            4. Evidentiary Deletion & Retention Controls
          </h2>
          <p>
            Authorized administrators retain full sovereignty to purge active working copies, case files, and session logs upon conclusion of an investigation or in compliance with local court directives and statutory retention periods.
          </p>
        </div>
      </div>
    </div>
  );
}

