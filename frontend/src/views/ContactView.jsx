import React, { useState } from 'react';
import { Mail, Send, ShieldCheck, CheckCircle, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ContactView() {
  const { addNotification } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    agency: '',
    email: '',
    badgeNumber: '',
    inquiryType: 'TRAINING',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addNotification("Official inquiry submitted. Our digital forensics team will respond via official departmental channels.");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-cyan-400" />
          Authorized Law Enforcement & Forensic Support Inquiries
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Official departmental communication channel for forensic laboratory deployments, academic training inquiries, and technical feedback.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h2 className="text-base font-bold text-white">Inquiry Registered Successfully</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Your inquiry has been logged in the audit queue. Departmental responses are processed through authorized official communications only.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 block mb-1">OFFICER / INVESTIGATOR NAME</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Insp. S. Sharma"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">LAW ENFORCEMENT AGENCY / UNIT</label>
                <input
                  type="text"
                  required
                  value={form.agency}
                  onChange={(e) => setForm({ ...form, agency: e.target.value })}
                  placeholder="e.g. State Cyber Cell / Police Dept"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">OFFICIAL GOVERNMENT / POLICE EMAIL</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. officer@police.gov.in"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">INQUIRY CATEGORY</label>
                <select
                  value={form.inquiryType}
                  onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:border-cyan-500 focus:outline-none"
                >
                  <option value="TRAINING">Academic / Police Training Requisition</option>
                  <option value="DEPLOYMENT">Lab Deployment Assistance</option>
                  <option value="BUG_REPORT">Technical Bug / Schema Parsing Support</option>
                  <option value="LEGAL">Section 63 BSA Formatting Query</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-slate-400 block mb-1">MESSAGE / TECHNICAL SPECIFICATION</label>
                <textarea
                  required
                  rows="4"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your operational requirement or dataset parsing query..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:border-cyan-500 focus:outline-none font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-600/20"
              >
                <Send className="w-4 h-4" />
                <span>Submit Official Inquiry</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

