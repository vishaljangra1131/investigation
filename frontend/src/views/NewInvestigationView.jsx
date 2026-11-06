import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderPlus, Shield, User, FileText, CheckCircle, 
  Plus, Calendar, AlertCircle, Save
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function NewInvestigationView() {
  const { caseData, setCaseData, addCaseNote, addNotification, setCurrentView } = useApp();
  const [newNoteText, setNewNoteText] = useState('');
  const [newTargetNum, setNewTargetNum] = useState('');

  const handleCaseSave = (e) => {
    e.preventDefault();
    addNotification(`Investigation case "${caseData.case_id}" metadata saved.`);
    setCurrentView('dashboard');
  };

  const handleAddTarget = () => {
    if (newTargetNum.trim() && !caseData.target_numbers.includes(newTargetNum.trim())) {
      setCaseData(prev => ({
        ...prev,
        target_numbers: [...prev.target_numbers, newTargetNum.trim()]
      }));
      setNewTargetNum('');
      addNotification(`Added target number to case dossier.`);
    }
  };

  const handleAddNote = () => {
    if (newNoteText.trim()) {
      addCaseNote(newNoteText.trim());
      setNewNoteText('');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <FolderPlus className="w-5 h-5 text-cyan-400" />
          Forensic Investigation Workspace & Case Management
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Maintain official law enforcement case files, assigned forensic officers, tagged suspect numbers, and chronological investigation diary entries.
        </p>
      </div>

      <form onSubmit={handleCaseSave} className="space-y-6">
        {/* Case Metadata Form */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            Case Identification & Administrative Requisition Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">CASE REFERENCE / FIR NUMBER</label>
              <input
                type="text"
                value={caseData.case_id}
                onChange={(e) => setCaseData({ ...caseData, case_id: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-bold text-xs focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">INVESTIGATION TITLE</label>
              <input
                type="text"
                value={caseData.case_title}
                onChange={(e) => setCaseData({ ...caseData, case_title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-bold text-xs focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">INVESTIGATING OFFICER (IO) / EXAMINER</label>
              <input
                type="text"
                value={caseData.officer_name}
                onChange={(e) => setCaseData({ ...caseData, officer_name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">LAW ENFORCEMENT DIVISION / AGENCY</label>
              <input
                type="text"
                value={caseData.agency}
                onChange={(e) => setCaseData({ ...caseData, agency: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-slate-400 block mb-1">INVESTIGATION BRIEF / SCOPE</label>
              <textarea
                value={caseData.description}
                onChange={(e) => setCaseData({ ...caseData, description: e.target.value })}
                rows="3"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:border-cyan-500 focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Target Numbers */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            Tagged Suspect Numbers (Target Scope)
          </h2>

          <div className="flex flex-wrap gap-2 items-center">
            {caseData.target_numbers.map(num => (
              <span key={num} className="px-3 py-1.5 rounded-lg bg-slate-950 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold flex items-center gap-2">
                {num}
              </span>
            ))}
          </div>

          <div className="flex gap-2 max-w-sm pt-1">
            <input
              type="text"
              value={newTargetNum}
              onChange={(e) => setNewTargetNum(e.target.value)}
              placeholder="Add +91XXXXXXXXXX..."
              className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddTarget}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Investigative Notes Diary */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Chronological Investigation Diary Notes
          </h2>

          <div className="space-y-3">
            {caseData.notes.map((note, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Author: <b className="text-white">{note.author}</b></span>
                  <span>{note.date}</span>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">{note.text}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Record forensic observation or investigative finding..."
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:border-cyan-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddNote}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
            >
              Add Note
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Case Profile & Open Dashboard</span>
          </button>
        </div>
      </form>
    </div>
  );
}

