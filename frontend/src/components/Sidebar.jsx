import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Home, LayoutDashboard, FolderPlus, Upload, FileSpreadsheet, PhoneCall,
  UserCheck, Calendar, Smartphone, Cpu, Radio, TowerControl, MapPin,
  Share2, GitMerge, Clock, AlertTriangle, Layers, Globe, Filter,
  ShieldCheck, FileText, BookOpen, GraduationCap, HelpCircle, Settings,
  Info, Shield, Scale, Mail, ChevronDown, ChevronRight, Menu, X,
  Landmark, Wallet, Search, Navigation, Download, Users, CreditCard,
  Lock, Sparkles
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { currentView, setCurrentView, records, anomalies, bankTransactions, evidenceList } = useApp();
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const toggleGroup = (grp) => {
    setCollapsedGroups(prev => ({ ...prev, [grp]: !prev[grp] }));
  };

  const navGroups = [
    {
      name: "1. OVERVIEW & CASES",
      items: [
        { id: 'home', label: 'Home Page', icon: Home },
        { id: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard },
        { id: 'tools-directory', label: 'Tools Directory (36+)', icon: Sparkles, badge: 'All Tools', badgeColor: 'bg-cyan-500' },
        { id: 'case-management', label: 'Case Management (FIR)', icon: FolderPlus },
        { id: 'new-investigation', label: 'New Investigation', icon: PlusIcon }
      ]
    },
    {
      name: "2. TELECOM & CDR INVESTIGATION",
      items: [
        { id: 'cdr-overview', label: 'CDR 2.0 Overview', icon: FileSpreadsheet, badge: records.length || 0 },
        { id: 'upload-cdr', label: 'Upload CDR Files', icon: Upload },
        { id: 'call-analysis', label: 'Call Traffic Analysis', icon: PhoneCall },
        { id: 'number-analysis', label: 'Number Deep Profile', icon: UserCheck },
        { id: 'datetime-analysis', label: '24h Diurnal & Day Matrix', icon: Calendar },
        { id: 'telecom-utilities', label: 'TSP, Cell Spyder & IMEI', icon: TowerControl, badge: 'Utilities' },
        { id: 'timeline-analysis', label: 'Timeline Reconstruction', icon: Clock }
      ]
    },
    {
      name: "3. FINANCIAL INVESTIGATION",
      items: [
        { id: 'arthagya-bank', label: 'Arthagya Bank Intelligence', icon: Landmark, badge: bankTransactions.length || 'AI', badgeColor: 'bg-emerald-500' },
        { id: 'ncrp-graph', label: 'NCRP Money Trail Graph', icon: GitMerge, badge: 'Flagship' },
        { id: 'financial-utilities', label: 'PhonePe, UPI, IFSC & OCR', icon: Wallet, badge: 'Fintech' }
      ]
    },
    {
      name: "4. INTERNET & CYBER OSINT",
      items: [
        { id: 'ipdr-analysis', label: 'IPDR Packet Data Analysis', icon: Globe, badge: 'Packets' },
        { id: 'ip-intelligence', label: 'IP Threat Intelligence', icon: Activity, badge: 'Threat' },
        { id: 'domain-intelligence', label: 'Domain & DNS Intelligence', icon: Search, badge: 'WHOIS' },
        { id: 'cyber-utilities', label: 'MAC OUI & DLT Headers', icon: Cpu, badge: 'Hardware' }
      ]
    },
    {
      name: "5. LOCATION & MOVEMENT",
      items: [
        { id: 'lbs-mapping', label: 'LBS Movement Mapping', icon: MapPin, badge: 'GPS/BTS' },
        { id: 'geolocation-analysis', label: 'Serving Cell Geolocation', icon: Navigation },
        { id: 'location-utilities', label: 'CCTV Offset & Toll Plazas', icon: Clock, badge: 'Utility' }
      ]
    },
    {
      name: "6. SUSPECT & IDENTITY",
      items: [
        { id: 'suspect-intelligence', label: 'Suspect Profiles & Dossiers', icon: UserCheck, badge: 'Dossier', badgeColor: 'bg-rose-500' },
        { id: 'vajra-dashboard', label: 'Vajra Unified Command', icon: ShieldAlert, badge: 'Vajra' },
        { id: 'imei-analysis', label: 'Handset IMEI Swapping', icon: Smartphone },
        { id: 'imsi-analysis', label: 'SIM IMSI Analysis', icon: Cpu },
        { id: 'tower-analysis', label: 'Cell Tower Footprints', icon: TowerControl }
      ]
    },
    {
      name: "7. INTELLIGENCE & LINKING",
      items: [
        { id: 'contact-analysis', label: 'Contact Centrality Ranking', icon: Share2 },
        { id: 'link-analysis', label: 'Interactive Link Graphs', icon: GitMerge },
        { id: 'pattern-detection', label: 'Anomaly Pattern Detection', icon: AlertTriangle, badge: anomalies.length || 0, badgeColor: 'bg-red-500' },
        { id: 'cdr-comparison', label: 'Multi-Target Comparison', icon: Layers }
      ]
    },
    {
      name: "8. LEGAL & EVIDENCE",
      items: [
        { id: 'evidence-management', label: 'Digital Evidence Locker', icon: ShieldCheck, badge: evidenceList.length || 'SHA-256', badgeColor: 'bg-emerald-500' },
        { id: 'report-generation', label: 'Judicial Dossier Generator', icon: FileText, badge: 'BSA Sec 63' },
        { id: 'legal-utilities', label: 'LEA Notices (Sec 91/102)', icon: Scale },
        { id: 'data-cleaning', label: 'Data Cleaning & Validation', icon: Filter }
      ]
    },
    {
      name: "9. PORTAL & REFERENCE",
      items: [
        { id: 'downloads', label: 'iC Apps & Downloads', icon: Download },
        { id: 'community', label: 'Officer Community Forum', icon: Users },
        { id: 'pricing', label: 'Deployment & Pricing', icon: CreditCard },
        { id: 'admin-panel', label: 'Administrator Panel', icon: Settings, badge: 'Admin' },
        { id: 'officer-auth', label: 'Officer Login / 2FA', icon: Lock },
        { id: 'case-studies', label: 'Practical Case Studies', icon: BookOpen },
        { id: 'learning-center', label: 'Forensic Learning Center', icon: GraduationCap },
        { id: 'cdr-fields-glossary', label: '32 Telecom Fields Glossary', icon: HelpCircle },
        { id: 'settings', label: 'System Settings', icon: Settings },
        { id: 'about-us', label: 'About Platform', icon: Info },
        { id: 'privacy-policy', label: 'Privacy & Legal Notice', icon: Shield },
        { id: 'contact-us', label: 'Official Contact', icon: Mail }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-[#060a14] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 font-mono ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/70">
          <div
            onClick={() => { setCurrentView('home'); setIsOpen(false); }}
            className="flex items-center space-x-2.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-cyan-500/25">
              IP
            </div>
            <div>
              <span className="font-extrabold text-white text-sm tracking-wider block leading-none">
                INVESTIGATION <span className="text-cyan-400">PRO</span>
              </span>
              <span className="text-[9px] text-cyan-400 font-mono tracking-tighter">THE POWER OF INVESTIGATION</span>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs no-scrollbar">
          {navGroups.map((group, gIdx) => {
            const isCollapsed = collapsedGroups[group.name];
            return (
              <div key={gIdx} className="space-y-1">
                <button
                  onClick={() => toggleGroup(group.name)}
                  className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-bold text-slate-400 hover:text-slate-200 uppercase tracking-wider font-mono cursor-pointer"
                >
                  <span>{group.name}</span>
                  {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {!isCollapsed && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon || Radio;
                      const isActive = currentView === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setCurrentView(item.id);
                            setIsOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                            isActive
                              ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 truncate">
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>

                          {item.badge !== undefined && (
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                                item.badgeColor || (isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400')
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Security Stamp */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/70 text-[10px] text-slate-500 flex items-center justify-between font-mono">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>BSA SEC 63 COMPLIANT</span>
          </div>
          <span>v3.2.0</span>
        </div>
      </aside>
    </>
  );
}

function PlusIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}
