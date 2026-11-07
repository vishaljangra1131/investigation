import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Landmark, ArrowDownLeft, ArrowUpRight, Search, Filter,
  Download, Upload, ShieldAlert, AlertTriangle, CheckCircle,
  FileSpreadsheet, FileText, Activity, CreditCard, Wallet,
  Calendar, Building2, Plus, Trash2, Eye
} from 'lucide-react';
import StatCard from '../components/StatCard';
import Papa from 'papaparse';

export default function ArthagyaBankView() {
  const { bankTransactions, setBankTransactions, addNotification, formatNumber } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [onlySuspicious, setOnlySuspicious] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New transaction modal state
  const [newTxn, setNewTxn] = useState({
    date: new Date().toISOString().slice(0, 10),
    description: '',
    ref_no: '',
    type: 'CREDIT',
    category: 'UPI',
    amount: '',
    counterparty: '',
    bank: 'HDFC Bank',
    suspicious: false,
    flag_reason: ''
  });

  const categories = ['ALL', 'UPI', 'IMPS', 'NEFT', 'RTGS', 'ATM', 'CASH_DEPOSIT', 'INTEREST'];

  const filteredTransactions = useMemo(() => {
    return bankTransactions.filter(t => {
      if (filterCategory !== 'ALL' && t.category !== filterCategory) return false;
      if (filterType !== 'ALL' && t.type !== filterType) return false;
      if (onlySuspicious && !t.suspicious) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const match =
          (t.id && t.id.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          (t.ref_no && t.ref_no.toLowerCase().includes(q)) ||
          (t.counterparty && t.counterparty.toLowerCase().includes(q)) ||
          (t.bank && t.bank.toLowerCase().includes(q)) ||
          (t.flag_reason && t.flag_reason.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [bankTransactions, filterCategory, filterType, onlySuspicious, searchTerm]);

  // Aggregate Metrics
  const totalCredit = useMemo(() => {
    return bankTransactions
      .filter(t => t.type === 'CREDIT')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [bankTransactions]);

  const totalDebit = useMemo(() => {
    return bankTransactions
      .filter(t => t.type === 'DEBIT')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [bankTransactions]);

  const suspiciousTotal = useMemo(() => {
    return bankTransactions
      .filter(t => t.suspicious)
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [bankTransactions]);

  const suspiciousCount = useMemo(() => {
    return bankTransactions.filter(t => t.suspicious).length;
  }, [bankTransactions]);

  // Handle CSV file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data.map((r, i) => {
          const amt = Number(r.Amount || r.amount || r.Debit || r.Credit || 0);
          const isCredit = Boolean(r.Credit || (r.Type && r.Type.toUpperCase().includes('CR')));
          return {
            id: `TXN-UPL-${Date.now()}-${i}`,
            date: r.Date || r.date || new Date().toISOString().slice(0, 10),
            description: r.Description || r.narrative || r.Particulars || 'Transaction',
            ref_no: r.RefNo || r.ref_no || r.ChqNo || `REF-${Math.floor(Math.random()*100000)}`,
            type: isCredit ? 'CREDIT' : 'DEBIT',
            category: r.Category || (r.Description?.includes('UPI') ? 'UPI' : 'IMPS'),
            amount: Math.abs(amt),
            balance: Number(r.Balance || r.balance || 0),
            counterparty: r.Counterparty || r.Beneficiary || 'Extracted Entity',
            bank: r.Bank || 'Bank Statement',
            suspicious: amt > 50000 || r.Description?.includes('MULE'),
            flag_reason: amt > 50000 ? 'High-value transaction above ₹50,000 threshold' : null
          };
        });
        setBankTransactions(prev => [...parsed, ...prev]);
        addNotification(`Imported ${parsed.length} bank transactions from ${file.name}.`);
      }
    });
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!newTxn.amount || !newTxn.description) return;
    const item = {
      id: `TXN-MANUAL-${Date.now()}`,
      date: newTxn.date,
      description: newTxn.description,
      ref_no: newTxn.ref_no || `MAN-${Math.floor(Math.random()*100000)}`,
      type: newTxn.type,
      category: newTxn.category,
      amount: Number(newTxn.amount),
      balance: 150000,
      counterparty: newTxn.counterparty || 'Manual Entry',
      bank: newTxn.bank,
      suspicious: Number(newTxn.amount) > 50000 || Boolean(newTxn.flag_reason),
      flag_reason: newTxn.flag_reason || (Number(newTxn.amount) > 50000 ? 'High-value transaction' : null)
    };
    setBankTransactions(prev => [item, ...prev]);
    setShowAddModal(false);
    setNewTxn({
      date: new Date().toISOString().slice(0, 10),
      description: '',
      ref_no: '',
      type: 'CREDIT',
      category: 'UPI',
      amount: '',
      counterparty: '',
      bank: 'HDFC Bank',
      suspicious: false,
      flag_reason: ''
    });
    addNotification("New bank transaction added manually to case record.");
  };

  const exportBankCsv = () => {
    if (filteredTransactions.length === 0) return;
    const headers = Object.keys(filteredTransactions[0]).join(',');
    const rows = filteredTransactions.map(r => Object.values(r).map(v => `"${v || ''}"`).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Arthagya_Bank_Analysis_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification("Bank statement analysis exported to CSV.");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-400" />
            Arthagya – Bank Statement Intelligence & Financial Forensics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated forensic bank statement parsing (PDF/Excel/CSV), credit/debit structuring detection, rapid mule velocity analysis, and counterparty money trail mapping.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-lg shadow-cyan-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Transaction</span>
          </button>

          <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload Statement</span>
            <input type="file" accept=".csv,.xlsx,.xls,.pdf" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={exportBankCsv}
            disabled={filteredTransactions.length === 0}
            className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total Inflow (Credit)" value={`₹${totalCredit.toLocaleString('en-IN')}`} subtitle="Fraud / Deposit Credits" color="emerald" icon={ArrowDownLeft} />
        <StatCard title="Total Outflow (Debit)" value={`₹${totalDebit.toLocaleString('en-IN')}`} subtitle="Layered Outflow / Cashout" color="cyan" icon={ArrowUpRight} />
        <StatCard title="Suspicious Flags" value={suspiciousCount} subtitle={`₹${suspiciousTotal.toLocaleString('en-IN')} Flagged`} color="rose" icon={ShieldAlert} />
        <StatCard title="Total Transactions" value={bankTransactions.length} subtitle="Indexed Entries" color="purple" icon={FileSpreadsheet} />
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search narrative, UTR, counterparty, bank, or reason..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Types</option>
              <option value="CREDIT">Credits Only</option>
              <option value="DEBIT">Debits Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Channel:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              {categories.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={onlySuspicious}
              onChange={(e) => setOnlySuspicious(e.target.checked)}
              className="rounded border-slate-700 text-rose-500 focus:ring-0"
            />
            <span className="text-rose-400 font-bold">Only Mule Alerts</span>
          </label>
        </div>
      </div>

      {/* Forensic Intelligence Alert Box */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-300">
          <span className="font-bold text-amber-300 uppercase tracking-wide font-mono">
            Key Financial Heuristic Observations:
          </span>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            • <strong>Layer 1 Structuring Detected:</strong> ₹1,50,000 credit received on 2026-10-01 was immediately split into two ₹49,000 UPI transfers within 25 minutes to evade mandatory PAN reporting thresholds.<br/>
            • <strong>Mule Velocity:</strong> Remaining balance of ₹40,000 drained on the exact same date via physical ATM cash withdrawal in Connaught Place, leaving low residual balance.
          </p>
        </div>
      </div>

      {/* Master Transactions Table */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Landmark className="w-4 h-4 text-emerald-400" />
            Financial Ledger Records ({filteredTransactions.length} Filtered Transactions)
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            Automated Structuring & Mule Heuristics Engine
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800 text-[11px] font-mono">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2.5">Txn ID / Date</th>
                <th className="p-2.5">Narrative / Description</th>
                <th className="p-2.5">Channel</th>
                <th className="p-2.5">Counterparty / Account</th>
                <th className="p-2.5">Amount (INR)</th>
                <th className="p-2.5">Balance</th>
                <th className="p-2.5">Forensic Flag & Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredTransactions.map((t, idx) => (
                <tr key={idx} className={`hover:bg-slate-900/40 ${t.suspicious ? 'bg-rose-950/20' : ''}`}>
                  <td className="p-2.5">
                    <span className="font-bold text-white block">{t.id}</span>
                    <span className="text-[10px] text-slate-500">{t.date}</span>
                  </td>
                  <td className="p-2.5 max-w-xs">
                    <span className="text-slate-200 block truncate" title={t.description}>{t.description}</span>
                    <span className="text-[10px] text-slate-500">Ref: {t.ref_no}</span>
                  </td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-300">
                      {t.category}
                    </span>
                  </td>
                  <td className="p-2.5">
                    <span className="text-white font-medium block">{t.counterparty}</span>
                    <span className="text-[10px] text-slate-500">{t.counterparty_account || t.bank}</span>
                  </td>
                  <td className="p-2.5">
                    <span className={`font-bold text-xs ${t.type === 'CREDIT' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.type === 'CREDIT' ? '+' : '-'} ₹{Number(t.amount).toLocaleString('en-IN')}
                    </span>
                    <span className="block text-[9px] text-slate-500 uppercase">{t.type}</span>
                  </td>
                  <td className="p-2.5 text-slate-400 font-medium">
                    ₹{Number(t.balance).toLocaleString('en-IN')}
                  </td>
                  <td className="p-2.5 max-w-xs">
                    {t.suspicious ? (
                      <div className="space-y-0.5">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          MULE ALERT
                        </span>
                        <p className="text-[10px] text-rose-300/80 leading-tight">{t.flag_reason}</p>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500">Legitimate / Routine</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#090f20] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl space-y-4 font-mono text-xs">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-400" />
              Add Investigation Bank Transaction
            </h3>
            <form onSubmit={handleAddTransaction} className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Transaction Narrative / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., UPI/DR/52910281/SUSPECT_ACCOUNT/OKAXIS"
                  value={newTxn.description}
                  onChange={(e) => setNewTxn({ ...newTxn, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Amount (INR)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 50000"
                    value={newTxn.amount}
                    onChange={(e) => setNewTxn({ ...newTxn, amount: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Transaction Type</label>
                  <select
                    value={newTxn.type}
                    onChange={(e) => setNewTxn({ ...newTxn, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="CREDIT">CREDIT (Inflow)</option>
                    <option value="DEBIT">DEBIT (Outflow)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Channel</label>
                  <select
                    value={newTxn.category}
                    onChange={(e) => setNewTxn({ ...newTxn, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="UPI">UPI</option>
                    <option value="IMPS">IMPS</option>
                    <option value="NEFT">NEFT</option>
                    <option value="RTGS">RTGS</option>
                    <option value="ATM">ATM Cash</option>
                    <option value="CASH_DEPOSIT">Cash Deposit (CDM)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Counterparty Entity</label>
                  <input
                    type="text"
                    placeholder="e.g., Rohit Kumar (Mule 1)"
                    value={newTxn.counterparty}
                    onChange={(e) => setNewTxn({ ...newTxn, counterparty: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Suspicious / Structuring Flag Reason (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Rapid credit followed by instant cash out"
                  value={newTxn.flag_reason}
                  onChange={(e) => setNewTxn({ ...newTxn, flag_reason: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
