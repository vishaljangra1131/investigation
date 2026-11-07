import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck, Lock, Mail, Phone, User, Building2,
  CheckCircle, AlertTriangle, ArrowRight, KeyRound, Shield
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function OfficerAuthView({ initialMode = 'login' }) {
  const { userAuth, loginOfficer, logoutOfficer, registerOfficer, addNotification, setCurrentView } = useApp();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'

  // Login Form
  const [loginEmail, setLoginEmail] = useState('vishal.jangra@police.gov.in');
  const [loginPassword, setLoginPassword] = useState('SecurePass2026!');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('881290');

  // Register Form
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: 'Inspector',
    department: 'Cyber Crime Police Station',
    state: 'Delhi',
    district: 'South West Delhi',
    station: 'Cyber PS IFSO',
    password: '',
    confirmPassword: '',
    agreed: true
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
      addNotification("Two-Factor Authentication OTP sent to registered official mobile number (+91-98****3210).");
      return;
    }
    loginOfficer(loginEmail, loginPassword);
    setCurrentView('dashboard');
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (regData.password !== regData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    registerOfficer(regData);
    setCurrentView('dashboard');
  };

  if (userAuth?.isLoggedIn) {
    const u = userAuth.user;
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12 font-mono">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Verified Officer Profile & Active Session
          </h1>
          <button
            onClick={logoutOfficer}
            className="px-3.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-bold cursor-pointer"
          >
            Log Out Officer
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950 border-2 border-cyan-500 flex items-center justify-center text-cyan-400 font-extrabold text-xl">
              VJ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{u?.name}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  {u?.role}
                </span>
              </div>
              <p className="text-xs text-slate-400">{u?.designation} • {u?.department}</p>
              <p className="text-xs text-cyan-400">{u?.station}, {u?.state}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Government Email</span>
              <span className="text-white font-bold">{u?.email}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Official Mobile</span>
              <span className="text-white font-bold">{u?.mobile}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Last Authenticated</span>
              <span className="text-emerald-400 font-bold">{u?.lastLogin || 'Just now'}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-cyan-600/20 flex items-center gap-2"
            >
              <span>Go to Command Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 pb-12 font-mono">
      {/* Auth Card Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 shadow-xl shadow-cyan-950/50">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">
          {mode === 'login' ? 'Law Enforcement Officer Login' : 'Officer Verification Registration'}
        </h1>
        <p className="text-xs text-slate-400">
          {mode === 'login'
            ? 'Authorized access strictly for Verified Police & Forensic Personnel.'
            : 'Register your official credentials for Department clearance.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-slate-950 border border-slate-800 p-1 text-xs">
        <button
          onClick={() => { setMode('login'); setOtpSent(false); }}
          className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
            mode === 'login' ? 'bg-cyan-600 text-white' : 'text-slate-400'
          }`}
        >
          Officer Sign In
        </button>
        <button
          onClick={() => setMode('register')}
          className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
            mode === 'register' ? 'bg-cyan-600 text-white' : 'text-slate-400'
          }`}
        >
          New Officer Registration
        </button>
      </div>

      {/* Login Mode Form */}
      {mode === 'login' ? (
        <form onSubmit={handleLoginSubmit} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Official Government Email or Mobile</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="officer@police.gov.in"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Officer Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {otpSent && (
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-2">
              <label className="text-cyan-300 font-bold block">
                Two-Factor (2FA) OTP Verification Code
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit OTP (e.g. 881290)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white font-mono font-bold tracking-widest text-center"
                />
              </div>
              <span className="text-[10px] text-slate-400 block">
                OTP sent via encrypted law enforcement gateway to linked SIM.
              </span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/25"
          >
            <span>{otpSent ? 'Verify 2FA & Access Dashboard' : 'Continue to 2FA Authentication'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        /* Register Mode Form */
        <form onSubmit={handleRegisterSubmit} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Full Officer Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Insp. Rajesh Sharma"
              value={regData.name}
              onChange={(e) => setRegData({ ...regData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Official Email</label>
              <input
                type="email"
                required
                placeholder="officer@police.gov.in"
                value={regData.email}
                onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Mobile Number</label>
              <input
                type="tel"
                required
                placeholder="+91-9876543210"
                value={regData.mobile}
                onChange={(e) => setRegData({ ...regData, mobile: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Designation</label>
              <input
                type="text"
                placeholder="Inspector / Sub-Inspector"
                value={regData.designation}
                onChange={(e) => setRegData({ ...regData, designation: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Police Station / Unit</label>
              <input
                type="text"
                placeholder="Cyber Crime PS"
                value={regData.station}
                onChange={(e) => setRegData({ ...regData, station: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={regData.password}
                onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Confirm Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={regData.confirmPassword}
                onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <label className="flex items-start gap-2 pt-1 text-[11px] text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={regData.agreed}
              onChange={(e) => setRegData({ ...regData, agreed: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>I certify that I am an authorized Law Enforcement Officer or verified forensic researcher pursuant to the Digital Personal Data Protection Act, 2023.</span>
          </label>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/25 mt-2"
          >
            <span>Submit Registration for Clearance</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}
