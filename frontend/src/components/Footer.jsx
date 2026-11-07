import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Shield, Scale, FileText, Info, Mail, Sparkles } from 'lucide-react';

export default function Footer() {
  const { setCurrentView } = useApp();

  return (
    <footer className="mt-16 border-t border-slate-800 bg-[#060a15] text-slate-400 text-xs py-10 px-6 font-mono">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Platform Overview */}
        <div className="space-y-3">
          <div className="text-white font-extrabold tracking-wider text-sm flex items-center gap-1.5 font-mono">
            INVESTIGATION <span className="px-1.5 py-0.2 bg-cyan-500/20 text-cyan-400 text-[10px] rounded font-bold">PRO</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            The Power of Digital Investigation – A unified digital forensics and cyber intelligence ecosystem for Telecom (CDR/IPDR), Banking (Arthagya/NCRP), OSINT, Movement (LBS), and Judicial Evidence Management.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Section 63 BSA 2023 / Section 65B IEA Certified</span>
          </div>
        </div>

        {/* Col 2: Investigation Suites */}
        <div className="space-y-2">
          <div className="text-white font-semibold text-xs uppercase font-mono tracking-wider">Investigation Suites</div>
          <ul className="space-y-1.5 text-[11px]">
            <li><button onClick={() => setCurrentView('tools-directory')} className="hover:text-cyan-400 transition-colors flex items-center gap-1"><Sparkles className="w-3 h-3 text-cyan-400"/> All 36+ Tools Directory</button></li>
            <li><button onClick={() => setCurrentView('cdr-overview')} className="hover:text-cyan-400 transition-colors">CDR 2.0 Telecom Forensics</button></li>
            <li><button onClick={() => setCurrentView('arthagya-bank')} className="hover:text-cyan-400 transition-colors">Arthagya Bank Intelligence</button></li>
            <li><button onClick={() => setCurrentView('ncrp-graph')} className="hover:text-cyan-400 transition-colors">NCRP Cyber Fraud Money Trail</button></li>
            <li><button onClick={() => setCurrentView('ipdr-analysis')} className="hover:text-cyan-400 transition-colors">IPDR Packet Data Sessions</button></li>
            <li><button onClick={() => setCurrentView('lbs-mapping')} className="hover:text-cyan-400 transition-colors">LBS Cellular Movement Mapping</button></li>
          </ul>
        </div>

        {/* Col 3: Legal & Judicial Compliance */}
        <div className="space-y-2">
          <div className="text-white font-semibold text-xs uppercase font-mono tracking-wider">Statutory Compliance</div>
          <ul className="space-y-1.5 text-[11px]">
            <li><button onClick={() => setCurrentView('legal-utilities')} className="hover:text-cyan-400 transition-colors flex items-center gap-1"><Scale className="w-3 h-3 text-cyan-400"/> LEA Statutory Notices (Sec 91/102)</button></li>
            <li><button onClick={() => setCurrentView('evidence-management')} className="hover:text-cyan-400 transition-colors flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-400"/> SHA-256 Custody Locker</button></li>
            <li><button onClick={() => setCurrentView('report-generation')} className="hover:text-cyan-400 transition-colors flex items-center gap-1"><FileText className="w-3 h-3 text-cyan-400"/> Court-Admissible Dossier Export</button></li>
            <li><button onClick={() => setCurrentView('privacy-policy')} className="hover:text-cyan-400 transition-colors flex items-center gap-1"><Shield className="w-3 h-3 text-purple-400"/> DPDP Act 2023 Data Privacy</button></li>
            <li><button onClick={() => setCurrentView('legal-disclaimer')} className="hover:text-cyan-400 transition-colors flex items-center gap-1"><Info className="w-3 h-3 text-amber-400"/> Legal Disclaimer & Boundaries</button></li>
          </ul>
        </div>

        {/* Col 4: Platform & Support */}
        <div className="space-y-2">
          <div className="text-white font-semibold text-xs uppercase font-mono tracking-wider">Platform & Access</div>
          <ul className="space-y-1.5 text-[11px]">
            <li><button onClick={() => setCurrentView('case-management')} className="hover:text-cyan-400 transition-colors">Case Management (FIR)</button></li>
            <li><button onClick={() => setCurrentView('downloads')} className="hover:text-cyan-400 transition-colors">iC Apps Desktop Builds</button></li>
            <li><button onClick={() => setCurrentView('community')} className="hover:text-cyan-400 transition-colors">Officer Community Network</button></li>
            <li><button onClick={() => setCurrentView('pricing')} className="hover:text-cyan-400 transition-colors">Deployment & Pricing</button></li>
            <li><button onClick={() => setCurrentView('officer-auth')} className="hover:text-cyan-400 transition-colors">Officer Login / 2FA</button></li>
            <li><button onClick={() => setCurrentView('contact-us')} className="hover:text-cyan-400 transition-colors flex items-center gap-1"><Mail className="w-3 h-3"/> Official Contact Desk</button></li>
          </ul>
          <div className="pt-2 text-[10px] text-slate-500 font-mono">
            &copy; {new Date().getFullYear()} Investigation Pro – The Power of Investigation. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
