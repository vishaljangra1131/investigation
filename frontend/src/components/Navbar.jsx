import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu, Search, Bell, Shield, Eye, EyeOff, Moon, Sun,
  User, CheckCircle, Database, Download, RefreshCw, RotateCcw,
  Sparkles, Folder, LogOut, KeyRound, ExternalLink
} from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const {
    caseData, theme, setTheme, maskNumbers, setMaskNumbers,
    userAuth, logoutOfficer, searchQuery, setSearchQuery,
    notifications, loadDemoData, loading, setCurrentView,
    resetDatabase, records, setGlobalSearchOpen
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
    <header className="sticky top-0 z-20 h-16 bg-[#070c1a]/95 backdrop-blur-md border-b border-slate-800/80 px-4 flex items-center justify-between font-mono">
      {/* Left: Mobile hamburger & Active Case Tag */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Label on Mobile/Desktop */}
        <div
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 cursor-pointer group pr-2"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-cyan-500/20">
            IP
          </div>
          <div className="hidden sm:block">
            <span className="font-extrabold text-white text-sm tracking-wider block leading-none group-hover:text-cyan-300 transition-colors">
              INVESTIGATION <span className="text-cyan-400">PRO</span>
            </span>
            <span className="text-[9px] text-slate-500 tracking-tighter">THE POWER OF INVESTIGATION</span>
          </div>
        </div>

        {/* Case Badge Button */}
        <div
          onClick={() => setCurrentView('case-management')}
          className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs cursor-pointer hover:border-cyan-500/50 transition-all"
          title="Click to view & switch Case Files"
        >
          <span className={`w-2 h-2 rounded-full ${caseData?.case_id ? "bg-cyan-400 animate-pulse" : "bg-slate-500"}`}></span>
          <span className="text-slate-400 font-mono text-[11px]">CASE:</span>
          <span className="font-bold text-white font-mono text-[11px]">{caseData?.case_id || 'NO ACTIVE CASE'}</span>
          <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${
            caseData?.case_id ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
          }`}>
            {caseData?.case_id ? (caseData?.status || 'ACTIVE') : 'UNASSIGNED'}
          </span>
        </div>
      </div>

      {/* Center: Global Search Bar with Ctrl + K Trigger */}
      <div className="flex-1 max-w-md mx-4">
        <div
          onClick={() => setGlobalSearchOpen(true)}
          className="relative cursor-pointer group"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-cyan-400 transition-colors" />
          <div className="w-full pl-9 pr-14 py-1.5 bg-slate-950/80 border border-slate-800 group-hover:border-cyan-500/50 rounded-lg text-xs text-slate-400 flex items-center justify-between transition-all font-mono">
            <span>Search 36+ tools, cases, & records...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-slate-800 text-slate-400 text-[10px] rounded border border-slate-700">
              Ctrl + K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Load Demo Data Quick Button */}
        <button
          onClick={() => loadDemoData('case_1')}
          disabled={loading}
          className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/60 text-cyan-300 text-xs font-medium transition-all cursor-pointer"
          title="Reload Fictional Synthetic Investigation Data"
        >
          <Database className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Demo Data</span>
        </button>

        {/* Reset Database Quick Button */}
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to reset? This will clear all uploaded records and temporary session data.")) {
              resetDatabase();
            }
          }}
          disabled={loading}
          className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900/40 border border-rose-800/50 text-rose-400 text-xs font-medium transition-all cursor-pointer"
          title="Reset workspace"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        {/* Privacy Mask Toggle */}
        <button
          onClick={() => setMaskNumbers(!maskNumbers)}
          className={`p-2 rounded-lg border text-xs transition-all flex items-center gap-1 cursor-pointer ${
            maskNumbers
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
          title={maskNumbers ? "Privacy Mask Active: Numbers Masked (+91-98****3210)" : "Toggle Privacy Masking"}
        >
          {maskNumbers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {notifications.some(n => !n.read) && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 absolute top-1.5 right-1.5 animate-ping"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#090f20] border border-cyan-500/30 rounded-xl shadow-2xl p-3 z-30 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white uppercase text-[11px]">System Audit Notifications</span>
                <span className="text-[10px] text-cyan-400 font-mono">Live</span>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1.5">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 space-y-0.5">
                    <p className="text-slate-300 text-[11px] leading-tight">{n.text}</p>
                    <span className="text-[9px] text-slate-500 font-mono block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Officer Profile Badge & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
              {userAuth?.user?.name ? userAuth.user.name.slice(0, 2).toUpperCase() : 'OF'}
            </div>
            <div className="hidden xl:block text-left pr-1">
              <span className="text-xs font-bold text-white block leading-none">{userAuth?.user?.name || 'Officer'}</span>
              <span className="text-[9px] text-cyan-400 font-mono block leading-none mt-0.5">{userAuth?.user?.role || 'Verified'}</span>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-[#090f20] border border-cyan-500/30 rounded-xl shadow-2xl p-3 z-30 space-y-2 text-xs">
              <div className="border-b border-slate-800 pb-2 space-y-0.5">
                <span className="font-bold text-white block">{userAuth?.user?.name || 'Officer Login'}</span>
                <span className="text-[10px] text-slate-400 block">{userAuth?.user?.email}</span>
                <span className="text-[10px] text-cyan-400 block">{userAuth?.user?.station}</span>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => { setCurrentView('officer-auth'); setShowUserMenu(false); }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Officer Profile & 2FA</span>
                </button>

                <button
                  onClick={() => { setCurrentView('admin-panel'); setShowUserMenu(false); }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span>Administrator Panel</span>
                </button>

                <button
                  onClick={() => { setCurrentView('pricing'); setShowUserMenu(false); }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Subscription & Plans</span>
                </button>

                <button
                  onClick={() => { logoutOfficer(); setShowUserMenu(false); }}
                  className="w-full text-left p-2 rounded-lg hover:bg-rose-950/40 text-rose-400 flex items-center gap-2 cursor-pointer border-t border-slate-800/80 pt-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out Officer</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
