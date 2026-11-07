import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search, X, Radio, Globe, PhoneCall, TowerControl, Smartphone,
  Database, Shield, Landmark, GitMerge, Wallet, CreditCard,
  Building2, MapPin, FileCheck, Activity, Layers, Cpu, Mail,
  Map, Navigation, Compass, Truck, Clock, UserCheck, ShieldAlert,
  FileSpreadsheet, Scale, FileText, Hash, BookOpen, CheckCircle,
  Share2, FolderPlus, ShieldCheck, Download, Settings, Users,
  ArrowRight, Sparkles
} from 'lucide-react';

const ICON_MAP = {
  Radio, Globe, PhoneCall, TowerControl, Smartphone, Database, Shield,
  Landmark, GitMerge, Wallet, CreditCard, Building2, MapPin, FileCheck,
  Activity, Search, Layers, Cpu, Mail, Map, Navigation, Compass,
  Truck, Clock, UserCheck, ShieldAlert, FileSpreadsheet, Scale, FileText,
  Hash, BookOpen, CheckCircle, Share2, FolderPlus, ShieldCheck, Download,
  Settings, Users
};

export default function GlobalSearchModal() {
  const { globalSearchOpen, setGlobalSearchOpen, toolsCatalog, toolsCategories, setCurrentView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const inputRef = useRef(null);

  useEffect(() => {
    if (globalSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
      setSelectedCategory('all');
    }
  }, [globalSearchOpen]);

  if (!globalSearchOpen) return null;

  const filteredTools = toolsCatalog.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return matchesCategory;
    const matchesTitle = tool.title.toLowerCase().includes(term);
    const matchesDesc = tool.description.toLowerCase().includes(term);
    const matchesTags = (tool.tags || []).some(t => t.toLowerCase().includes(term));
    return matchesCategory && (matchesTitle || matchesDesc || matchesTags);
  });

  const handleSelectTool = (viewId) => {
    setCurrentView(viewId);
    setGlobalSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-[#090f20] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search 36+ investigation tools (e.g., CDR, Arthagya, NCRP, IPDR, IP, LBS, IMEI)..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-mono"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setGlobalSearchOpen(false);
              if (e.key === 'Enter' && filteredTools.length > 0) {
                handleSelectTool(filteredTools[0].viewId);
              }
            }}
          />
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
              ESC to close
            </span>
            <button
              onClick={() => setGlobalSearchOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 overflow-x-auto text-xs no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            All Modules ({toolsCatalog.length})
          </button>
          {toolsCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto space-y-2 flex-1">
          {filteredTools.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-300 font-semibold">No investigation tools matched "{searchTerm}"</p>
              <p className="text-xs text-slate-500">Try keywords like CDR, Bank, NCRP, IP, Domain, LBS, IMEI, or Suspect.</p>
            </div>
          ) : (
            filteredTools.map((tool) => {
              const IconComponent = ICON_MAP[tool.icon] || Radio;
              return (
                <div
                  key={tool.id}
                  onClick={() => handleSelectTool(tool.viewId)}
                  className="p-3 rounded-xl bg-slate-900/40 hover:bg-cyan-950/30 border border-slate-800/80 hover:border-cyan-500/40 transition-all cursor-pointer flex items-start justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-cyan-500/20 text-slate-300 group-hover:text-cyan-400 transition-colors mt-0.5">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {tool.title}
                        </span>
                        {tool.badge && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {tool.description}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {(tool.tags || []).slice(0, 4).map((tag, i) => (
                          <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Investigation Pro Unified Workspace</span>
          </div>
          <div>Press <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">Ctrl + K</kbd> anywhere to open</div>
        </div>
      </div>
    </div>
  );
}
