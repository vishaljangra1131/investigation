import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu, Search, Bell, Shield, Eye, EyeOff, Moon, Sun, 
  User, CheckCircle, Database, Download, RefreshCw, RotateCcw
} from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const { 
    caseData, theme, setTheme, maskNumbers, setMaskNumbers, 
    userRole, setUserRole, searchQuery, setSearchQuery, 
    notifications, loadDemoData, loading, setCurrentView,
    resetDatabase, records
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('cdr-overview');
    }
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#090e1d]/90 backdrop-blur-md border-b border-slate-800/80 px-4 flex items-center justify-between">
      {/* Left: Mobile hamburger & Active Case Tag */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
          <span className={`w-2 h-2 rounded-full ${caseData?.case_id ? "bg-cyan-400 animate-pulse" : "bg-slate-500"}`}></span>
          <span className="text-slate-400 font-mono">CASE:</span>
          <span className="font-bold text-white font-mono">{caseData?.case_id || 'NO ACTIVE CASE'}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${
            caseData?.case_id ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
          }`}>
            {caseData?.case_id ? (caseData?.status || 'ACTIVE') : 'UNASSIGNED'}
          </span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Global search: Phone, IMEI, IMSI, Tower, or Record ID..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
          />
        </div>
      </form>

      {/* Right: Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Load Demo Data Quick Button */}
        <button
          onClick={() => loadDemoData('case_1')}
          disabled={loading}
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-800/60 text-cyan-400 hover:text-cyan-300 text-xs font-medium transition-all"
          title="Reload Fictional Synthetic Investigation Data"
        >
          <Database className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Demo Data</span>
        </button>

        {/* Reset Database Quick Button */}
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to reset? This will remove all uploaded CDR files, forensic evidence, and case details (Case No, Officer, Agency, Title, Brief).")) {
              resetDatabase();
            }
          }}
          disabled={loading || ((records && records.length === 0) && !caseData?.case_id)}
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 text-rose-400 hover:text-rose-300 text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          title="Reset and clear CDR database and case details"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        {/* Mask Numbers Toggle (Privacy Guard) */}
        <button
          onClick={() => setMaskNumbers(!maskNumbers)}
          className={`p-2 rounded-lg border text-xs transition-all flex items-center gap-1 ${
            maskNumbers 
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' 
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
          title={maskNumbers ? "Privacy Mask Active: Numbers Masked" : "Toggle Privacy Masking (+91-98****3210)"}
        >
          {maskNumbers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span className="hidden xl:inline text-[11px] font-mono">
            {maskNumbers ? "Masked" : "Unmasked"}
          </span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-semibold text-slate-300">
                <span>Audit & System Logs</span>
                <span className="text-[10px] text-cyan-400 font-mono">2 unread</span>
              </div>
              <div className="py-2 space-y-2 max-h-60 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
                    <p className="text-slate-300 text-[11px] leading-snug">{n.text}</p>
                    <span className="text-[9px] text-slate-500 font-mono mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Role Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-left hover:border-slate-700 transition-all"
          >
            <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
              {(caseData?.officer_name || '-').charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:block">
              <div className="text-xs font-semibold text-slate-200 leading-tight">
                {caseData?.officer_name || 'Unassigned Officer'}
              </div>
              <div className="text-[10px] text-cyan-400 font-mono">{userRole}</div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-xs">
              <div className="px-2 py-1.5 border-b border-slate-800 mb-1">
                <div className="font-semibold text-white">{caseData?.officer_name || 'Unassigned Officer'}</div>
                <div className="text-[10px] text-slate-400">{caseData?.agency || 'No Agency Assigned'}</div>
              </div>
              <div className="py-1">
                <div className="text-[10px] uppercase font-mono text-slate-500 px-2 py-1">Switch Role:</div>
                {['ADMIN', 'ANALYST', 'VIEWER'].map(role => (
                  <button
                    key={role}
                    onClick={() => { setUserRole(role); setShowUserMenu(false); }}
                    className={`w-full text-left px-2 py-1.5 rounded-md flex items-center justify-between text-xs ${
                      userRole === role ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{role}</span>
                    {userRole === role && <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

