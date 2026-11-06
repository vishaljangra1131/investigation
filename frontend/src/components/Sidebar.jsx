import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Home, LayoutDashboard, FolderPlus, Upload, FileSpreadsheet, PhoneCall,
  UserCheck, Calendar, Smartphone, Cpu, Radio, TowerControl, MapPin,
  Share2, GitMerge, Clock, AlertTriangle, Layers, Globe, Filter,
  ShieldCheck, FileText, BookOpen, GraduationCap, HelpCircle, Settings,
  Info, Shield, Scale, Mail, ChevronDown, ChevronRight, Menu, X
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { currentView, setCurrentView, records, anomalies } = useApp();
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const toggleGroup = (grp) => {
    setCollapsedGroups(prev => ({ ...prev, [grp]: !prev[grp] }));
  };

  const navGroups = [
    {
      name: "OVERVIEW & CASES",
      items: [
        { id: 'home', label: '1. Home', icon: Home },
        { id: 'dashboard', label: '2. Dashboard', icon: LayoutDashboard },
        { id: 'new-investigation', label: '3. New Investigation', icon: FolderPlus },
      ]
    },
    {
      name: "DATA INGESTION",
      items: [
        { id: 'upload-cdr', label: '4. Upload CDR', icon: Upload },
        { id: 'data-cleaning', label: '20. Data Cleaning & Validation', icon: Filter },
        { id: 'evidence-management', label: '22. Evidence Management', icon: ShieldCheck },
      ]
    },
    {
      name: "CORE TELECOM ANALYSIS",
      items: [
        { id: 'cdr-overview', label: '5. CDR Overview', icon: FileSpreadsheet, badge: records.length || 0 },
        { id: 'call-analysis', label: '6. Call Analysis', icon: PhoneCall },
        { id: 'number-analysis', label: '7. Number Analysis', icon: UserCheck },
        { id: 'datetime-analysis', label: '8. Date & Time Analysis', icon: Calendar },
        { id: 'timeline-analysis', label: '16. Timeline Analysis', icon: Clock },
      ]
    },
    {
      name: "DEVICE & IDENTIFIERS",
      items: [
        { id: 'imei-analysis', label: '9. IMEI Analysis', icon: Smartphone },
        { id: 'imsi-analysis', label: '10. IMSI Analysis', icon: Cpu },
        { id: 'ipdr-analysis', label: '19. IPDR Analysis', icon: Globe },
      ]
    },
    {
      name: "CELL TOWER & LOCATION",
      items: [
        { id: 'cell-id-analysis', label: '11. Cell ID Analysis', icon: Radio },
        { id: 'tower-analysis', label: '12. Tower Analysis', icon: TowerControl },
        { id: 'geolocation-analysis', label: '13. Geolocation & Route', icon: MapPin },
      ]
    },
    {
      name: "INTELLIGENCE & LINKING",
      items: [
        { id: 'contact-analysis', label: '14. Contact Analysis', icon: Share2 },
        { id: 'link-analysis', label: '15. Link Analysis', icon: GitMerge },
        { id: 'pattern-detection', label: '17. Pattern Detection', icon: AlertTriangle, badge: anomalies.length || 0, badgeColor: 'bg-red-500' },
        { id: 'cdr-comparison', label: '18. CDR Comparison', icon: Layers },
      ]
    },
    {
      name: "REPORTS & FORENSICS",
      items: [
        { id: 'report-generation', label: '24. Report Generation', icon: FileText },
      ]
    },
    {
      name: "KNOWLEDGE & REFERENCE",
      items: [
        { id: 'case-studies', label: '23. Practical Case Studies', icon: BookOpen },
        { id: 'learning-center', label: '25. Learning Center', icon: GraduationCap },
        { id: 'cdr-fields-glossary', label: '4. 32 CDR Parameters & Glossary', icon: HelpCircle },
      ]
    },
    {
      name: "SYSTEM & LEGAL",
      items: [
        { id: 'settings', label: '26. Settings', icon: Settings },
        { id: 'about-us', label: '27. About Us', icon: Info },
        { id: 'privacy-policy', label: '28. Privacy Policy', icon: Shield },
        { id: 'legal-disclaimer', label: '29. Legal & Compliance', icon: Scale },
        { id: 'contact-us', label: '30. Contact Us', icon: Mail },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-40 w-72 bg-[#090e1d] border-r border-slate-800/80 
        flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand / Logo */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 bg-[#070b16]">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Radio className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="font-extrabold tracking-wider text-white text-base leading-tight flex items-center gap-1.5">
                CDR ANALYSIS <span className="text-xs px-1.5 py-0.5 rounded-sm bg-cyan-500/20 text-cyan-400 font-mono">PRO</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-wide">TELECOM FORENSICS PLATFORM</div>
            </div>
          </div>
          <button 
            className="lg:hidden text-slate-400 hover:text-white p-1"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs">
          {navGroups.map((group, gIdx) => {
            const isCollapsed = collapsedGroups[group.name];
            return (
              <div key={gIdx} className="space-y-1">
                <button
                  onClick={() => toggleGroup(group.name)}
                  className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-slate-400 hover:text-slate-200 tracking-wider uppercase"
                >
                  <span>{group.name}</span>
                  {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {!isCollapsed && (
                  <div className="space-y-0.5 pt-1">
                    {group.items.map(item => {
                      const Icon = item.icon;
                      const isActive = currentView === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setCurrentView(item.id);
                            if (window.innerWidth < 1024) setIsOpen(false);
                          }}
                          className={`
                            w-full flex items-center justify-between px-3 py-2 rounded-md font-medium text-left transition-all
                            ${isActive 
                              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border-l-2 border-cyan-400 shadow-xs' 
                              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'}
                          `}
                        >
                          <div className="flex items-center space-x-2.5 truncate">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.badge !== undefined && (
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono text-white ${item.badgeColor || 'bg-slate-700'}`}>
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

        {/* Security / System Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-[#070b16] text-[11px] text-slate-400">
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              SECURE SESSION
            </span>
            <span className="font-mono text-[10px] text-slate-400">v2.0 STABLE</span>
          </div>
          <div className="truncate text-slate-400 text-[10px]">
            BSA 2023 / Section 63 Compliant
          </div>
        </div>
      </aside>
    </>
  );
}

