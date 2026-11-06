import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Shield, Scale, FileText, Info, Mail } from 'lucide-react';

export default function Footer() {
  const { setCurrentView } = useApp();

  return (
    <footer className="mt-16 border-t border-slate-800 bg-[#070b16] text-slate-400 text-xs py-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Platform Overview */}
        <div className="space-y-2.5">
          <div className="text-white font-extrabold tracking-wider text-sm flex items-center gap-1.5 font-mono">
            CDR ANALYSIS <span className="px-1.5 py-0.2 bg-cyan-500/20 text-cyan-400 text-[10px] rounded">PRO</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Advanced Telecom Intelligence & Digital Forensic Analysis Platform designed for authorized law enforcement agencies, cybercrime investigators, and forensic researchers.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cryptographic Integrity & Chain of Custody</span>
          </div>
        </div>

        {/* Col 2: Core Analytical Modules */}
        <div className="space-y-2">
          <div className="text-white font-semibold text-xs uppercase font-mono tracking-wider">Analytical Modules</div>
          <ul className="space-y-1 text-[11px]">
            <li><button onClick={() => setCurrentView('call-analysis')} className="hover:text-cyan-400 transition-colors">Call & Duration Breakdown</button></li>
            <li><button onClick={() => setCurrentView('imei-analysis')} className="hover:text-cyan-400 transition-colors">IMEI & Handset Transition</button></li>
            <li><button onClick={() => setCurrentView('geolocation-analysis')} className="hover:text-cyan-400 transition-colors">Serving Cell Geolocation</button></li>
            <li><button onClick={() => setCurrentView('link-analysis')} className="hover:text-cyan-400 transition-colors">Multi-Target Link Analysis</button></li>
            <li><button onClick={() => setCurrentView('pattern-detection')} className="hover:text-cyan-400 transition-colors">Rule-Based Anomaly Detection</button></li>
          </ul>
        </div>

        {/* Col 3: Legal & Standards */}
        <div className="space-y-2">
          <div className="text-white font-semibold text-xs uppercase font-mono tracking-wider">Legal & Statutory</div>
          <ul className="space-y-1 text-[11px]">
            <li><button onClick={() => setCurrentView('legal-disclaimer')} className="hover:text-cyan-400 transition-colors flex items-center gap-1"><Scale className="w-3 h-3"/> Section 63 BSA / 65B IEA Certificate</button></li>
            <li><button onClick={() => setCurrentView('privacy-policy')} className="hover:text-cyan-400 transition-colors flex items-center gap-1"><Shield className="w-3 h-3"/> Data Protection & Security</button></li>
            <li><button onClick={() => setCurrentView('evidence-management')} className="hover:text-cyan-400 transition-colors flex items-center gap-1"><FileText className="w-3 h-3"/> SHA-256 Custody Log</button></li>
            <li><button onClick={() => setCurrentView('learning-center')} className="hover:text-cyan-400 transition-colors">Telecom Architecture Guidelines</button></li>
          </ul>
        </div>

        {/* Col 4: Ethics & Boundaries */}
        <div className="space-y-2">
          <div className="text-white font-semibold text-xs uppercase font-mono tracking-wider">Investigative Boundaries</div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            This platform operates strictly on user-provided metadata records under lawful process. It does not perform live network interception, audio recording, or unauthorized operator database queries.
          </p>
          <div className="pt-1 text-[10px] text-slate-400 font-mono">
            &copy; {new Date().getFullYear()} CDR Analysis Pro. Fictional demo data for training.
          </div>
        </div>
      </div>
    </footer>
  );
}

