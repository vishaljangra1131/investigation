import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users, MessageSquare, ShieldCheck, GraduationCap, Bell,
  Search, Plus, ThumbsUp, Lock, AlertTriangle, CheckCircle
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function CommunityView() {
  const { addNotification, userAuth } = useApp();
  const [newTopic, setNewTopic] = useState('');
  const [threads, setThreads] = useState([
    {
      id: 1,
      title: "New MO Alert: FedEx / Digital Arrest Extortion using Fake CBI Video Summons",
      author: "ACP (Cyber) Devendra Negi",
      agency: "Delhi Police Special Cell",
      replies: 14,
      likes: 38,
      category: "Modus Operandi Alert",
      time: "2 hours ago",
      pinned: true
    },
    {
      id: 2,
      title: "Best Practices: Securing Section 63 BSA Compliance Certificates from Cellular Operators",
      author: "Sub-Insp. Priya Sharma",
      agency: "Maharashtra Cyber Cell",
      replies: 8,
      likes: 22,
      category: "Courtroom Procedure",
      time: "Yesterday",
      pinned: false
    },
    {
      id: 3,
      title: "Upcoming 3-Day Hands-on Training: Advanced IPDR Decoding & Tor Traffic Analysis",
      author: "Investigation Pro Academy",
      agency: "National Cyber Forensics Wing",
      replies: 29,
      likes: 65,
      category: "Training & Workshop",
      time: "2 days ago",
      pinned: false
    }
  ]);

  const handlePostThread = (e) => {
    e.preventDefault();
    if (!newTopic.trim()) return;
    const item = {
      id: Date.now(),
      title: newTopic,
      author: userAuth?.user?.name || "Constable Vishal",
      agency: userAuth?.user?.department || "Cyber Crime Unit",
      replies: 0,
      likes: 1,
      category: "Case Discussion",
      time: "Just now",
      pinned: false
    };
    setThreads(prev => [item, ...prev]);
    setNewTopic('');
    addNotification("Discussion topic posted to verified officer forum.");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Officer Community & Law Enforcement Knowledge Network
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Restricted professional collaboration for verified officers: cybercrime modus operandi alerts, courtroom legal discussions, and forensic training announcements.
          </p>
        </div>
      </div>

      {/* Strict Privacy Notice */}
      <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-900/60 flex items-start gap-2.5 text-xs text-amber-200">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Confidentiality Protocol:</span> Never publish real active suspect names, unredacted telephone numbers, or sensitive national security investigation logs in public discussion threads. Discuss methodology, technical tools, and legal frameworks only.
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Verified Officers" value="842 Members" subtitle="Police & LEA Only" color="cyan" icon={ShieldCheck} />
        <StatCard title="Active Discussions" value={`${threads.length} Topics`} subtitle="Forensic Exchanges" color="purple" icon={MessageSquare} />
        <StatCard title="Upcoming Trainings" value="3 Workshops" subtitle="BSA & Telecom Forensics" color="emerald" icon={GraduationCap} />
        <StatCard title="Security Level" value="OFFICIAL RESTRICTED" subtitle="Moderated Forum" color="amber" icon={Lock} />
      </div>

      {/* Create Topic Bar */}
      <form onSubmit={handlePostThread} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex gap-3 text-xs">
        <input
          type="text"
          required
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          placeholder="Start a new discussion topic or ask a technical forensic question..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg cursor-pointer"
        >
          Publish Topic
        </button>
      </form>

      {/* Discussion Threads List */}
      <div className="space-y-3">
        {threads.map((thread) => (
          <div
            key={thread.id}
            className={`p-5 rounded-2xl border transition-all ${
              thread.pinned ? 'bg-cyan-950/20 border-cyan-500/40 shadow-lg' : 'bg-slate-900/50 border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  {thread.pinned && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                      PINNED ALERT
                    </span>
                  )}
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-800 text-slate-300">
                    {thread.category}
                  </span>
                  <span className="text-[10px] text-slate-500">{thread.time}</span>
                </div>

                <h3 className="text-sm font-bold text-white hover:text-cyan-300 cursor-pointer transition-colors">
                  {thread.title}
                </h3>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="text-cyan-400 font-bold">{thread.author}</span>
                  <span>•</span>
                  <span>{thread.agency}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 shrink-0">
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{thread.replies} replies</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{thread.likes}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

