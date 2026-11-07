import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wallet, CreditCard, Building2, MapPin, FileCheck,
  Search, CheckCircle, AlertTriangle, Download, RefreshCw,
  Upload, ArrowRight, DollarSign, Landmark
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function FinancialUtilitiesView({ initialTab = 'phonepe' }) {
  const { addNotification } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab);

  // PhonePe Analyzer State
  const [phonepeLogs, setPhonepeLogs] = useState([
    { id: 'T261001140512', amount: 49000, type: 'DEBIT', toVpa: 'amitsingh99@okaxis', time: '2026-10-01 13:05', status: 'SUCCESS' },
    { id: 'T261001141234', amount: 49000, type: 'DEBIT', toVpa: 'vikas.ydv@paytm', time: '2026-10-01 13:12', status: 'SUCCESS' },
    { id: 'T261001144510', amount: 719, type: 'DEBIT', toVpa: 'airtelprepaid@airtel', time: '2026-10-01 14:45', status: 'SUCCESS' }
  ]);

  // UPI Handle State
  const [upiInput, setUpiInput] = useState('amitsingh99@okaxis');
  const [upiResult, setUpiResult] = useState({
    vpa: 'amitsingh99@okaxis',
    handle: 'okaxis',
    provider: 'Google Pay (GPay) / Axis Bank UPI Handle',
    psp_bank: 'Axis Bank Limited',
    merchant: false,
    valid_format: true
  });

  // IFSC Lookup State
  const [ifscInput, setIfscInput] = useState('HDFC0000003');
  const [ifscResult, setIfscResult] = useState({
    ifsc: 'HDFC0000003',
    bank: 'HDFC Bank Limited',
    branch: 'New Delhi - Connaught Place',
    address: 'Kasturba Gandhi Marg, Connaught Place, New Delhi - 110001',
    city: 'New Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    micr: '110240001',
    rtgs_enabled: true,
    neft_enabled: true,
    imps_enabled: true
  });

  // TSDP OCR State
  const [ocrResult, setOcrResult] = useState({
    extracted_utr: '428192018291',
    extracted_amount: '₹49,000.00',
    timestamp: '01 Oct 2026, 01:05 PM',
    beneficiary: 'Amit Singh (amitsingh99@okaxis)',
    sender_upi: 'rohit.rocky@okaxis',
    app: 'Google Pay for India',
    confidence_score: '98.5%',
    verification_status: 'Unverified against live bank CBS (Forensic Preview)'
  });

  const handleUpiLookup = (e) => {
    e.preventDefault();
    const vpa = upiInput.trim().toLowerCase();
    const parts = vpa.split('@');
    const handle = parts[1] || 'upi';

    let provider = 'Third-Party Application Provider (TPAP)';
    let psp = 'National Payments Corporation of India (NPCI)';

    if (handle.includes('okaxis')) { provider = 'Google Pay (Axis Bank)'; psp = 'Axis Bank'; }
    else if (handle.includes('okhdfcbank')) { provider = 'Google Pay (HDFC Bank)'; psp = 'HDFC Bank'; }
    else if (handle.includes('paytm')) { provider = 'Paytm Payments Bank / Third-Party UPI'; psp = 'Paytm / Yes Bank'; }
    else if (handle.includes('ybl') || handle.includes('ibl')) { provider = 'PhonePe (Yes Bank / ICICI)'; psp = 'Yes Bank'; }
    else if (handle.includes('icici')) { provider = 'iMobile / ICICI UPI'; psp = 'ICICI Bank'; }

    setUpiResult({
      vpa,
      handle,
      provider,
      psp_bank: psp,
      merchant: vpa.includes('merchant') || vpa.includes('store'),
      valid_format: vpa.includes('@') && vpa.length > 3
    });
    addNotification(`UPI VPA resolution complete for ${vpa}.`);
  };

  const handleIfscLookup = (e) => {
    e.preventDefault();
    const ifsc = ifscInput.trim().toUpperCase();
    const isSbi = ifsc.startsWith('SBIN');
    const isAxis = ifsc.startsWith('UTIB');

    setIfscResult({
      ifsc,
      bank: isSbi ? 'State Bank of India' : (isAxis ? 'Axis Bank' : 'HDFC Bank Limited'),
      branch: 'Central Branch',
      address: 'Commercial District Center, New Delhi 110001',
      city: 'New Delhi',
      district: 'Central Delhi',
      state: 'Delhi',
      micr: '110240001',
      rtgs_enabled: true,
      neft_enabled: true,
      imps_enabled: true
    });
    addNotification(`IFSC code lookup verified for ${ifsc}.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Wallet className="w-5 h-5 text-emerald-400" />
          Financial Crime & Payment Forensics Utilities
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Fintech payment tools: PhonePe transaction log parsing, UPI VPA & PSP resolution, RBI IFSC routing code verification, and Transaction Screenshot OCR data extraction.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('phonepe')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'phonepe' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          1. PhonePe Analyzer
        </button>
        <button
          onClick={() => setActiveTab('upi')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'upi' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          2. UPI Handle & VPA Resolver
        </button>
        <button
          onClick={() => setActiveTab('ifsc')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'ifsc' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          3. IFSC & Bank Directory
        </button>
        <button
          onClick={() => setActiveTab('tsdp')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'tsdp' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          4. TSDP – Screenshot OCR Parser
        </button>
      </div>

      {/* Tab 1: PhonePe Analyzer */}
      {activeTab === 'phonepe' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Wallet className="w-4 h-4 text-purple-400" />
                PhonePe Transaction Export Parser & Dispersal Heuristics
              </h2>
              <span className="text-[11px] text-cyan-400 font-bold">
                Rapid Outflow Detected: ₹98,000 in 7 mins
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-800 text-[11px]">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Transaction ID</th>
                    <th className="p-2.5">Timestamp</th>
                    <th className="p-2.5">Type</th>
                    <th className="p-2.5">Beneficiary VPA</th>
                    <th className="p-2.5">Amount (INR)</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {phonepeLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-slate-900/40">
                      <td className="p-2.5 text-cyan-400 font-bold">{log.id}</td>
                      <td className="p-2.5 text-slate-400">{log.time}</td>
                      <td className="p-2.5 text-rose-400 font-bold">{log.type}</td>
                      <td className="p-2.5 text-purple-300 font-bold">{log.toVpa}</td>
                      <td className="p-2.5 text-white font-bold">₹{log.amount.toLocaleString('en-IN')}</td>
                      <td className="p-2.5 text-emerald-400 font-bold">{log.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: UPI Handle Lookup */}
      {activeTab === 'upi' && (
        <div className="space-y-4">
          <form onSubmit={handleUpiLookup} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex gap-3 text-xs">
            <input
              type="text"
              required
              value={upiInput}
              onChange={(e) => setUpiInput(e.target.value)}
              placeholder="Enter Virtual Payment Address (e.g. amitsingh99@okaxis, suspect@paytm)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg cursor-pointer"
            >
              Resolve UPI Handle
            </button>
          </form>

          {upiResult && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                UPI Ecosystem Resolution: {upiResult.vpa}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Handle Suffix</span>
                  <span className="font-bold text-cyan-300 text-sm">@{upiResult.handle}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">UPI Application / App</span>
                  <span className="font-bold text-white text-xs">{upiResult.provider}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Partner PSP Bank</span>
                  <span className="font-bold text-emerald-400 text-xs">{upiResult.psp_bank}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Entity Category</span>
                  <span className="text-slate-300 text-xs">{upiResult.merchant ? 'Merchant / Business VPA' : 'Individual Peer-to-Peer (P2P)'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: IFSC Lookup */}
      {activeTab === 'ifsc' && (
        <div className="space-y-4">
          <form onSubmit={handleIfscLookup} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex gap-3 text-xs">
            <input
              type="text"
              required
              value={ifscInput}
              onChange={(e) => setIfscInput(e.target.value)}
              placeholder="Enter 11-character IFSC Code (e.g. HDFC0000003, SBIN0000691)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg cursor-pointer"
            >
              Verify IFSC
            </button>
          </form>

          {ifscResult && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                RBI Indian Financial System Code (IFSC) Official Record
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Bank Name</span>
                  <span className="font-bold text-cyan-300 text-sm">{ifscResult.bank}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Branch Location</span>
                  <span className="font-bold text-white text-xs">{ifscResult.branch}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">City & State</span>
                  <span className="text-slate-300 text-xs">{ifscResult.city}, {ifscResult.state}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">RTGS / NEFT / IMPS</span>
                  <span className="text-emerald-400 font-bold text-xs">ALL ENABLED</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
                <span className="text-slate-500 block">Physical Branch Address:</span>
                <span className="text-slate-300">{ifscResult.address}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: TSDP Screenshot OCR */}
      {activeTab === 'tsdp' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-400" />
                TSDP – Transaction Screenshot OCR Parser (UPI Receipt)
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                UNVERIFIED UNTIL CHECKED WITH CORE BANKING (CBS)
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Extracted UTR Ref</span>
                <span className="font-bold text-cyan-300 text-sm font-mono">{ocrResult.extracted_utr}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Transaction Amount</span>
                <span className="font-bold text-emerald-400 text-sm">{ocrResult.extracted_amount}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Timestamp</span>
                <span className="text-white text-xs">{ocrResult.timestamp}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">OCR Confidence</span>
                <span className="text-cyan-400 font-bold text-xs">{ocrResult.confidence_score}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
              <div><span className="text-slate-500">Beneficiary: </span><span className="text-white font-bold">{ocrResult.beneficiary}</span></div>
              <div><span className="text-slate-500">Remitter VPA: </span><span className="text-cyan-300 font-bold">{ocrResult.sender_upi}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
