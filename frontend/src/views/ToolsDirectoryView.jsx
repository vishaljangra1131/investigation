import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Radio, Globe, PhoneCall, TowerControl, Smartphone, Database,
  Shield, Landmark, GitMerge, Wallet, CreditCard, Building2,
  MapPin, FileCheck, Activity, Search, Layers, Cpu, Mail,
  Map, Navigation, Compass, Truck, Clock, UserCheck, ShieldAlert,
  FileSpreadsheet, Scale, FileText, Hash, BookOpen, CheckCircle,
  Share2, FolderPlus, ShieldCheck, Download, Settings, Users,
  ArrowRight, Sparkles, Filter
} from 'lucide-react';

const ICON_MAP = {
  Radio, Globe, PhoneCall, TowerControl, Smartphone, Database, Shield,
  Landmark, GitMerge, Wallet, CreditCard, Building2, MapPin, FileCheck,
  Activity, Search, Layers, Cpu, Mail, Map, Navigation, Compass,
  Truck, Clock, UserCheck, ShieldAlert, FileSpreadsheet, Scale, FileText,
  Hash, BookOpen, CheckCircle, Share2, FolderPlus, ShieldCheck, Download,
  Settings, Users
};

export default function ToolsDirectoryView() {
  const { toolsCatalog, toolsCategories, setCurrentView, setGlobalSearchOpen } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTools = toolsCatalog.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return matchesCategory;
    const matchesTitle = tool.title.toLowerCase().includes(term);
    const matchesDesc = tool.description.toLowerCase().includes(term);
    const matchesTags = (tool.tags || []).some(t => t.toLowerCase().includes(term));
    return matchesCategory && (matchesTitle || matchesDesc || matchesTags);
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>36+ SPECIALIZED DIGITAL INVESTIGATION SUITES</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Investigation Tools Master Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access our complete ecosystem of lawful digital forensics, cyber intelligence, telecom analysis, and financial crime tracking modules.
          </p>
        </div>

        <button
          onClick={() => setGlobalSearchOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quick Find</span>
          <kbd className="px-1.5 py-0.5 bg-slate-800 text-[10px] text-cyan-300 rounded border border-slate-700 font-bold">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[260px] relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tools by name, keyword, or investigative standard (e.g., CDR, UPI, IPDR, IMEI)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              All Tools ({toolsCatalog.length})
            </button>
            {toolsCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tools Master Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => {
          const IconComponent = ICON_MAP[tool.icon] || Radio;
          return (
            <div
              key={tool.id}
              onClick={() => setCurrentView(tool.viewId)}
              className="p-5 rounded-2xl bg-slate-900/40 hover:bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col justify-between group shadow-lg hover:shadow-cyan-950/20"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 group-hover:bg-cyan-500/20 text-slate-300 group-hover:text-cyan-400 transition-colors">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  {tool.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1 line-clamp-3">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 mt-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {(tool.tags || []).slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-xs text-cyan-400 font-bold group-hover:translate-x-1 transition-all">
                  <span>Launch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

