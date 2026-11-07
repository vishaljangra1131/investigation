import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings, Users, ShieldAlert, CheckCircle, XCircle,
  Activity, Database, Lock, Clock, Key, AlertTriangle,
  RefreshCw, Search, ShieldCheck
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function AdminDashboardView() {
  const { addNotification } = useApp();

  const [officers, setOfficers] = useState([
    { id: 'USR-8812', name: 'Constable Vishal', email: 'vishal.jangra@police.gov.in', station: 'Cyber PS IFSO', role: 'Super Administrator', status: 'VERIFIED', registered: '2026-10-15' },
    { id: 'USR-8813', name: 'Sub-Insp. Priya Sharma', email: 'priya.sharma@mahapolice.gov.in', station: 'Cyber Cell BKC Mumbai', role: 'Verified Investigation Officer', status: 'VERIFIED', registered: '2026-10-18' },
    { id: 'USR-8814', name: 'Insp. Jasvir Singh', email: 'jasvir.singh@hrypolice.gov.in', station: 'Cyber PS Gurugram East', role: 'Verified Investigation Officer', status: 'VERIFIED', registered: '2026-10-22' },
    { id: 'USR-8815', name: 'Sub-Insp. Rita Yadav', email: 'rita.yadav@uppolice.gov.in', station: 'Cyber PS Sector 36 Noida', role: 'Approved Professional', status: 'PENDING_APPROVAL', registered: '2026-11-06' }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { timestamp: '2026-11-07 20:45:10', officer: 'Constable Vishal', action: 'LOGIN_2FA_SUCCESS', ip: '14.139.60.10', status: 'AUTHORIZED' },
    { timestamp: '2026-11-07 20:50:35', officer: 'Constable Vishal', action: 'EVIDENCE_INGEST_SHA256', ip: '14.139.60.10', status: 'VERIFIED' },
    { timestamp: '2026-11-07 21:05:12', officer: 'Constable Vishal', action: 'NCRP_GRAPH_QUERY', ip: '14.139.60.10', status: 'AUTHORIZED' }
  ]);

  const handleApprove = (id) => {
    setOfficers(prev => prev.map(o => o.id === id ? { ...o, status: 'VERIFIED', role: 'Verified Investigation Officer' } : o));
    addNotification(`Officer ${id} verification approved. Access credentials granted.`);
  };

  const handleReject = (id) => {
    setOfficers(prev => prev.filter(o => o.id !== id));
    addNotification(`Registration request ${id} rejected.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            Administrator Command Panel & Access Governance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Centralized platform management: officer verification requests, role-based access control (RBAC), immutable system audit logs, and security telemetry.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Registered Officers" value={officers.length} subtitle="3 Active / 1 Pending" color="cyan" icon={Users} />
        <StatCard title="System Health" value="100% OPERATIONAL" subtitle="Zero Faults" color="emerald" icon={Activity} />
        <StatCard title="Audit Event Logs" value="1,492 Records" subtitle="Tamper-Sealed" color="purple" icon={Clock} />
        <StatCard title="Security Mode" value="STRICT 2FA / RBAC" subtitle="DPDP Act Compliant" color="amber" icon={Lock} />
      </div>

      {/* Officers Verification Table */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            Law Enforcement Officer Registry & Eligibility Verification
          </h2>
          <span className="text-[11px] text-slate-400">Strict Official Police ID Verification</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800 text-[11px]">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">User ID</th>
                <th className="p-3">Officer Name</th>
                <th className="p-3">Official Gov Email</th>
                <th className="p-3">Police Station / Unit</th>
                <th className="p-3">Role Tier</th>
                <th className="p-3">Verification</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {officers.map((o) => (
                <tr key={o.id} className="hover:bg-slate-900/40">
                  <td className="p-3 text-cyan-400 font-bold">{o.id}</td>
                  <td className="p-3 text-white font-bold">{o.name}</td>
                  <td className="p-3 text-slate-300">{o.email}</td>
                  <td className="p-3 text-slate-400">{o.station}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-300">
                      {o.role}
                    </span>
                  </td>
                  <td className="p-3">
                    {o.status === 'VERIFIED' ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                        <CheckCircle className="w-3.5 h-3.5" />
                        VERIFIED
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                        PENDING
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    {o.status === 'PENDING_APPROVAL' ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleApprove(o.id)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(o.id)}
                          className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[10px]">Approved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Immutable Audit Logs Table */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
          <Clock className="w-4 h-4 text-purple-400" />
          Real-Time System Audit Trail & Forensics Access Log
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-800 text-[11px]">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2.5">Timestamp (IST)</th>
                <th className="p-2.5">Officer Identity</th>
                <th className="p-2.5">Action Code</th>
                <th className="p-2.5">Client IP Address</th>
                <th className="p-2.5">Access Gate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {auditLogs.map((log, i) => (
                <tr key={i} className="hover:bg-slate-900/40">
                  <td className="p-2.5 text-slate-400">{log.timestamp}</td>
                  <td className="p-2.5 text-white font-bold">{log.officer}</td>
                  <td className="p-2.5 text-cyan-300 font-mono">{log.action}</td>
                  <td className="p-2.5 text-slate-400">{log.ip}</td>
                  <td className="p-2.5 text-emerald-400 font-bold">{log.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
