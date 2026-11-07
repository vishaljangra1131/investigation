import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GitMerge, ShieldCheck, Download, Search, AlertTriangle,
  Lock, CheckCircle, RefreshCw, DollarSign, ArrowRight,
  Landmark, User, CornerDownRight, ExternalLink, ShieldAlert
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function NcrpGraphView() {
  const { ncrpData, addNotification } = useApp();
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!ncrpData) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono">
        Loading NCRP Money Trail Intelligence...
      </div>
    );
  }

  const { victim, nodes, edges, complaint_id } = ncrpData;

  const filteredNodes = nodes.filter(n => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      n.label.toLowerCase().includes(term) ||
      (n.account && n.account.toLowerCase().includes(term)) ||
      (n.bank && n.bank.toLowerCase().includes(term)) ||
      (n.phone && n.phone.includes(term))
    );
  });

  const totalLoss = victim?.loss_amount || 750000;
  const frozenAmount = 199000; // sum of frozen nodes
  const recoveryRate = ((frozenAmount / totalLoss) * 100).toFixed(1);

  const exportGraphReport = () => {
    window.print();
    addNotification("Printed NCRP Money Trail Graph summary.");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-cyan-400" />
            NCRP Graph – Multi-Layer Cyber Fraud Money Trail Analysis
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visual fund-flow link graph: Complainant (Victim) → Layer 1 Mule Accounts → Layer 2 Distribution VPAs → Layer 3 Cash Out & Crypto OTC sinks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportGraphReport}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-lg shadow-cyan-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Money Trail Dossier</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Defrauded Principal" value={`₹${totalLoss.toLocaleString('en-IN')}`} subtitle={`NCRP: ${complaint_id}`} color="rose" icon={DollarSign} />
        <StatCard title="Funds Put on Lien" value={`₹${frozenAmount.toLocaleString('en-IN')}`} subtitle="Bank Hold Confirmed" color="emerald" icon={ShieldCheck} />
        <StatCard title="Recovery Potential" value={`${recoveryRate}%`} subtitle="Section 102 CrPC Lien" color="cyan" icon={CheckCircle} />
        <StatCard title="Mule Layers Traced" value="3 Distinct Layers" subtitle="Layer 1, Layer 2 & Sinks" color="purple" icon={GitMerge} />
      </div>

      {/* Interactive Visual Network Diagram */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-[#070d1e] to-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Visual Fund Flow Architecture: Complaint #{complaint_id}
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Click on any account node to inspect subpoena details & freezing status
          </span>
        </div>

        {/* SVG Money Trail Tree Representation */}
        <div className="relative py-6 px-2 overflow-x-auto">
          <div className="min-w-[700px] flex flex-col items-center space-y-8">
            
            {/* Layer 0: Victim Node */}
            <div className="flex flex-col items-center">
              <div
                onClick={() => setSelectedNode(nodes.find(n => n.id === 'node-victim'))}
                className="p-4 rounded-xl bg-slate-900 border-2 border-slate-700 hover:border-slate-400 cursor-pointer text-center w-72 shadow-xl transition-all"
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-200">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>VICTIM (COMPLAINANT)</span>
                </div>
                <div className="text-sm font-extrabold text-white mt-1">{victim.name}</div>
                <div className="text-[11px] font-mono text-slate-400">SBI A/C: 3918274619</div>
                <div className="text-xs font-bold text-rose-400 mt-1 font-mono">Lost: ₹{victim.loss_amount.toLocaleString('en-IN')}</div>
              </div>

              {/* Edge 1 to Mule 1 */}
              <div className="w-0.5 h-8 bg-gradient-to-b from-slate-500 to-cyan-500 relative flex items-center justify-center">
                <span className="absolute bg-slate-900 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-cyan-300 border border-slate-700 shadow whitespace-nowrap">
                  RTGS: ₹7,50,000 (12:35)
                </span>
              </div>
            </div>

            {/* Layer 1: Mule 1 */}
            <div className="flex flex-col items-center">
              <div
                onClick={() => setSelectedNode(nodes.find(n => n.id === 'node-mule1'))}
                className="p-4 rounded-xl bg-cyan-950/40 border-2 border-cyan-500/70 hover:border-cyan-400 cursor-pointer text-center w-80 shadow-2xl transition-all"
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-cyan-300">
                  <Landmark className="w-4 h-4 text-cyan-400" />
                  <span>LAYER 1 PRIMARY MULE ACCOUNT</span>
                </div>
                <div className="text-sm font-extrabold text-white mt-1">Rohit Enterprise (Rohit Verma)</div>
                <div className="text-[11px] font-mono text-cyan-200">HDFC A/C: 9810293847 | PAN: BPLPS8819Q</div>
                <div className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  🔒 FROZEN BY LEA (Lien: ₹1,50,000)
                </div>
              </div>

              {/* Fork Arrows Down to Layer 2 and ATM */}
              <div className="w-full max-w-xl h-8 border-b-2 border-x-2 border-cyan-500/50 rounded-b-xl relative">
                <span className="absolute -top-3 left-1/4 -translate-x-1/2 bg-slate-900 px-2 py-0.5 text-[9px] font-mono text-slate-300 rounded border border-slate-800">
                  IMPS: ₹2.5L
                </span>
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 px-2 py-0.5 text-[9px] font-mono text-slate-300 rounded border border-slate-800">
                  UPI: ₹2.0L
                </span>
                <span className="absolute -top-3 left-3/4 -translate-x-1/2 bg-slate-900 px-2 py-0.5 text-[9px] font-mono text-slate-300 rounded border border-slate-800">
                  ATM Cash: ₹1.0L
                </span>
              </div>
            </div>

            {/* Layer 2 Branches */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {/* Mule 2A */}
              <div
                onClick={() => setSelectedNode(nodes.find(n => n.id === 'node-mule2a'))}
                className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-300 cursor-pointer space-y-1 text-center shadow-lg transition-all"
              >
                <span className="text-[10px] font-bold text-cyan-400 uppercase font-mono block">Layer 2-A (Mule Runner)</span>
                <div className="font-bold text-white text-xs">Amit Singh</div>
                <div className="text-[11px] font-mono text-slate-400">UPI: amitsingh99@okaxis</div>
                <div className="text-[10px] font-mono text-emerald-400 font-bold">🔒 Lien Marked: ₹49,000</div>
              </div>

              {/* Mule 2B -> Crypto */}
              <div
                onClick={() => setSelectedNode(nodes.find(n => n.id === 'node-mule2b'))}
                className="p-3.5 rounded-xl bg-slate-900 border border-purple-500/40 hover:border-purple-300 cursor-pointer space-y-1 text-center shadow-lg transition-all"
              >
                <span className="text-[10px] font-bold text-purple-400 uppercase font-mono block">Layer 2-B (OTC Converter)</span>
                <div className="font-bold text-white text-xs">Vikas Yadav</div>
                <div className="text-[11px] font-mono text-slate-400">Paytm VPA: vikas.ydv@paytm</div>
                <div className="text-[10px] font-mono text-rose-400">Drained to USDT P2P: ₹1.95L</div>
              </div>

              {/* ATM Cash Out */}
              <div
                onClick={() => setSelectedNode(nodes.find(n => n.id === 'node-mule3-atm'))}
                className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/40 hover:border-rose-300 cursor-pointer space-y-1 text-center shadow-lg transition-all"
              >
                <span className="text-[10px] font-bold text-rose-400 uppercase font-mono block">Layer 3 Physical Sink</span>
                <div className="font-bold text-white text-xs">ATM Cash Dispenser</div>
                <div className="text-[11px] font-mono text-slate-400">South Ex Part 2, Delhi</div>
                <div className="text-[10px] font-mono text-amber-400">CCTV Subpoena Requisitioned</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white text-sm">{selectedNode.label}</span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
            <div><span className="text-slate-500 block">Bank & Branch</span><span className="text-white font-bold">{selectedNode.bank || '-'}, {selectedNode.branch || '-'}</span></div>
            <div><span className="text-slate-500 block">Account / Identifier</span><span className="text-cyan-300 font-bold">{selectedNode.account || '-'}</span></div>
            <div><span className="text-slate-500 block">Linked Mobile Phone</span><span className="text-white">{selectedNode.phone || '-'}</span></div>
            <div><span className="text-slate-500 block">PAN Card</span><span className="text-white">{selectedNode.pan || '-'}</span></div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400">Freezing / Lien Status: </span>
              <span className={`font-bold ${selectedNode.frozen ? 'text-emerald-400' : 'text-rose-400'}`}>
                {selectedNode.frozen ? `FROZEN UNDER SEC 102 CrPC (Lien: ${selectedNode.lien_amount})` : 'UNFROZEN / DRAINED'}
              </span>
            </div>
            {selectedNode.freeze_date && (
              <span className="text-slate-500 text-[10px]">Frozen on: {selectedNode.freeze_date}</span>
            )}
          </div>
        </div>
      )}

      {/* Inter-Account Transaction Edges Summary */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-cyan-400" />
          Cross-Layer Inter-Bank Transaction Logs ({edges.length} Transfers)
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-800 text-[11px] font-mono">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2.5">Origin Node</th>
                <th className="p-2.5">Beneficiary Node</th>
                <th className="p-2.5">Amount (INR)</th>
                <th className="p-2.5">Channel</th>
                <th className="p-2.5">Transaction ID / UTR</th>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {edges.map((e, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="p-2.5 text-slate-300 font-bold">{e.from}</td>
                  <td className="p-2.5 text-cyan-300 font-bold">{e.to}</td>
                  <td className="p-2.5 text-emerald-400 font-bold">₹{e.amount.toLocaleString('en-IN')}</td>
                  <td className="p-2.5 text-slate-200">{e.channel}</td>
                  <td className="p-2.5 text-slate-400">{e.txn_id}</td>
                  <td className="p-2.5 text-slate-500">{e.time}</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

