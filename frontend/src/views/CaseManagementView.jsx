import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderPlus, Folder, Shield, Calendar, User, Building2,
  AlertTriangle, CheckCircle, Clock, Plus, ArrowRight,
  FileText, Phone, Landmark, Globe, CheckSquare, MessageSquare
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function CaseManagementView() {
  const {
    caseData, setCaseData, casesList, setCasesList,
    addNotification, setCurrentView, userAuth
  } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCase, setNewCase] = useState({
    case_id: `FIR-DEL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    case_title: '',
    agency: 'Special Cyber Crime Division',
    police_station: 'Cyber Police Station IFSO, Dwarka',
    district: 'South West Delhi',
    state: 'Delhi',
    priority: 'HIGH',
    status: 'ACTIVE',
    category: 'Financial Cyber Fraud',
    description: '',
    target_numbers: '',
    target_banks: ''
  });

  const handleSelectCase = (c) => {
    setCaseData({
      ...caseData,
      case_id: c.case_id,
      case_title: c.case_title,
      officer_name: c.officer_name,
      agency: c.agency,
      police_station: c.police_station,
      district: c.district,
      state: c.state,
      priority: c.priority,
      status: c.status,
      category: c.category,
      created_at: c.created_at
    });
    addNotification(`Active workspace switched to Case: ${c.case_id}`);
  };

  const handleCreateCase = (e) => {
    e.preventDefault();
    if (!newCase.case_title) return;

    const created = {
      case_id: newCase.case_id,
      case_title: newCase.case_title,
      officer_name: userAuth?.user?.name || 'Constable Vishal',
      agency: newCase.agency,
      police_station: newCase.police_station,
      district: newCase.district,
      state: newCase.state,
      priority: newCase.priority,
      status: newCase.status,
      category: newCase.category,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      target_count: newCase.target_numbers ? newCase.target_numbers.split(',').length : 1,
      evidence_count: 0
    };

    setCasesList(prev => [created, ...prev]);
    handleSelectCase(created);
    setShowCreateModal(false);
    addNotification(`New Investigation Case ${created.case_id} registered.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-cyan-400" />
            Case Management System & Investigative File Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Centralized case dossiers: FIR numbers, assigned investigating officers, suspect/victim associations, evidence attachments, and team collaboration logs.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Case</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Active Case" value={caseData?.case_id || 'FIR-DEL-2026-8812'} subtitle={caseData?.status || 'ACTIVE'} color="cyan" icon={Folder} />
        <StatCard title="Total Cases" value={casesList.length} subtitle="Indexed FIR Files" color="purple" icon={FileText} />
        <StatCard title="Investigating Officer" value={userAuth?.user?.name || 'Constable Vishal'} subtitle={userAuth?.user?.designation || 'Inspector'} color="emerald" icon={User} />
        <StatCard title="Police Station" value="Cyber PS IFSO" subtitle="South West Delhi" color="amber" icon={Building2} />
      </div>

      {/* Active Case Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0a1226] to-slate-950 border border-cyan-500/30 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                CURRENT ACTIVE WORKSPACE CASE
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              {caseData?.case_title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span><strong>FIR ID:</strong> {caseData?.case_id}</span>
              <span>•</span>
              <span><strong>Category:</strong> {caseData?.category}</span>
              <span>•</span>
              <span><strong>Priority:</strong> <span className="text-rose-400 font-bold">{caseData?.priority}</span></span>
              <span>•</span>
              <span><strong>Station:</strong> {caseData?.police_station}</span>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('report-generation')}
            className="px-3.5 py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Case Report</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
          {caseData?.description}
        </p>
      </div>

      {/* Master Case Files List */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Folder className="w-4 h-4 text-cyan-400" />
          Master Law Enforcement Case Files ({casesList.length} Registered Cases)
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-800 text-[11px]">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Case ID</th>
                <th className="p-3">Case Title & Brief</th>
                <th className="p-3">Police Station / Unit</th>
                <th className="p-3">Lead Officer</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {casesList.map((c) => {
                const isActive = caseData?.case_id === c.case_id;
                return (
                  <tr key={c.case_id} className={`hover:bg-slate-900/40 ${isActive ? 'bg-cyan-950/20' : ''}`}>
                    <td className="p-3 text-cyan-400 font-bold">{c.case_id}</td>
                    <td className="p-3 max-w-sm">
                      <span className="font-bold text-white block">{c.case_title}</span>
                      <span className="text-[10px] text-slate-500">{c.category} • Created: {c.created_at}</span>
                    </td>
                    <td className="p-3 text-slate-300">{c.police_station}</td>
                    <td className="p-3 text-slate-200">{c.officer_name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                        c.priority === 'CRITICAL' || c.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded font-bold text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {isActive ? (
                        <span className="text-emerald-400 font-bold text-xs">● Active Workspace</span>
                      ) : (
                        <button
                          onClick={() => handleSelectCase(c)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Switch to Case
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Notes & Activity Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Investigative Notes */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            Official Case Diary & Investigation Notes
          </h2>
          <div className="space-y-2.5">
            {(caseData?.notes || []).map((note, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-bold text-cyan-300">{note.author}</span>
                  <span>{note.date}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{note.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Tasks & Next Steps */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            Pending Investigation Checklist & Subpoenas
          </h2>
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
              <input type="checkbox" defaultChecked className="rounded border-slate-700 text-cyan-500 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Requisition Airtel & Jio CDR Under Sec 91 CrPC</span>
                <span className="text-[10px] text-emerald-400">COMPLETED & VERIFIED WITH SHA-256</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
              <input type="checkbox" defaultChecked className="rounded border-slate-700 text-cyan-500 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Freeze Layer 1 Mule Bank Account (HDFC)</span>
                <span className="text-[10px] text-emerald-400">LIEN MARKED FOR ₹1,50,000</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
              <input type="checkbox" className="rounded border-slate-700 text-cyan-500 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Requisition Connaught Place ATM CCTV Footage</span>
                <span className="text-[10px] text-amber-400">PENDING RESPONSE FROM BANK NODAL DESK</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Register New Case */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#090f20] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl space-y-4 text-xs font-mono">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-cyan-400" />
              Register New Investigation Case (FIR)
            </h3>

            <form onSubmit={handleCreateCase} className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Case Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operation CyberTrack: Hawala Extortion Syndicate"
                  value={newCase.case_title}
                  onChange={(e) => setNewCase({ ...newCase, case_title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">FIR / Case ID</label>
                  <input
                    type="text"
                    required
                    value={newCase.case_id}
                    onChange={(e) => setNewCase({ ...newCase, case_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Priority</label>
                  <select
                    value={newCase.priority}
                    onChange={(e) => setNewCase({ ...newCase, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Police Station</label>
                  <input
                    type="text"
                    value={newCase.police_station}
                    onChange={(e) => setNewCase({ ...newCase, police_station: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={newCase.category}
                    onChange={(e) => setNewCase({ ...newCase, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Financial Cyber Fraud">Financial Cyber Fraud</option>
                    <option value="SIM Box & Telecom Abuse">SIM Box & Telecom Abuse</option>
                    <option value="Kidnapping & Extortion">Kidnapping & Extortion</option>
                    <option value="Narcotics Hawala Syndicate">Narcotics Hawala Syndicate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Case Brief & Description</label>
                <textarea
                  rows={3}
                  placeholder="Investigation summary..."
                  value={newCase.description}
                  onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer"
                >
                  Register Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

