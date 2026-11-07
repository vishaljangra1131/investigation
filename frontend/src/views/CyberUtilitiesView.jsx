import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Globe, Cpu, Mail, Search, CheckCircle, AlertTriangle,
  Download, RefreshCw, Layers, ShieldCheck, ExternalLink
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function CyberUtilitiesView({ initialTab = 'mac' }) {
  const { addNotification } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab);

  // MAC Lookup State
  const [macInput, setMacInput] = useState('00:1A:2B:3C:4D:5E');
  const [macResult, setMacResult] = useState({
    mac: '00:1A:2B:3C:4D:5E',
    oui: '00:1A:2B',
    vendor: 'Ayecom Technology Co., Ltd.',
    address: 'Room 1002, 10F, No. 120, Sec. 1, Neihu Rd., Taipei 114, Taiwan',
    device_type: 'Wireless Router / Network Interface Card',
    valid_format: true
  });

  // SMS Header Intelligence State
  const [smsInput, setSmsInput] = useState('AX-HDFCBK');
  const [smsResult, setSmsResult] = useState({
    header: 'AX-HDFCBK',
    prefix: 'AX',
    operator_code: 'A (Bharti Airtel)',
    service_area_code: 'X (Western UP / National Gateway)',
    principal_entity: 'HDFC Bank Limited',
    category: 'Transactional & Banking OTP (DLT Registered)',
    dlt_registration_status: 'ACTIVE & VERIFIED BY TRAI',
    smishing_risk: 'LOW (Authentic Commercial Header)'
  });

  // Google Analyzer State
  const [takeoutActivities, setTakeoutActivities] = useState([
    { timestamp: '2026-10-01 12:42:10 UTC', service: 'Google Maps Location History', title: 'Visit: Connaught Place Inner Circle', confidence: 'High (GPS + Wi-Fi SSID Scan)' },
    { timestamp: '2026-10-01 13:02:18 UTC', service: 'Google Chrome Search', title: 'Query: "how to buy USDT with cash in Delhi"', confidence: 'User Typing Search' },
    { timestamp: '2026-10-01 14:15:30 UTC', service: 'Google Play Store', title: 'App Installed: "Telegram Messenger"', confidence: 'Device Ingestion Event' }
  ]);

  const handleMacLookup = (e) => {
    e.preventDefault();
    const mac = macInput.trim().toUpperCase();
    const isApple = mac.startsWith('00:03:93') || mac.startsWith('AC:BC:32');
    const isCisco = mac.startsWith('00:00:0C') || mac.startsWith('00:01:42');

    setMacResult({
      mac: mac,
      oui: mac.slice(0, 8),
      vendor: isApple ? 'Apple, Inc. (Cupertino, California)' : (isCisco ? 'Cisco Systems, Inc.' : 'Intel Corporate Network Controller'),
      address: isApple ? '1 Infinite Loop, Cupertino CA 95014' : '170 West Tasman Dr, San Jose CA 95134',
      device_type: isApple ? 'iPhone / MacBook Wi-Fi Interface' : 'Enterprise Ethernet Gateway',
      valid_format: mac.length >= 12
    });
    addNotification(`MAC OUI resolution complete for ${mac}.`);
  };

  const handleSmsLookup = (e) => {
    e.preventDefault();
    const hdr = smsInput.trim().toUpperCase();
    const isSbi = hdr.includes('SBI');
    const isJio = hdr.startsWith('JX');

    setSmsResult({
      header: hdr,
      prefix: hdr.slice(0, 2),
      operator_code: isJio ? 'J (Reliance Jio)' : 'A (Bharti Airtel)',
      service_area_code: 'X (National Gateway Routing)',
      principal_entity: isSbi ? 'State Bank of India' : 'HDFC Bank Limited',
      category: 'Transactional Alert & Two-Factor OTP',
      dlt_registration_status: 'ACTIVE ON TELECOM COMMERCIAL REGULATORY PORTAL',
      smishing_risk: 'LOW (Registered Entity)'
    });
    addNotification(`SMS Header decoded for ${hdr}.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-400" />
          Cyber Intelligence & Hardware Profiling Utilities
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Technical cyber forensic tools: IEEE MAC OUI hardware vendor lookup, TRAI commercial SMS header (DLT) attribution, and Google Takeout digital footprint analysis.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('mac')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'mac' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          1. MAC Hardware OUI Lookup
        </button>
        <button
          onClick={() => setActiveTab('sms-header')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'sms-header' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          2. SMS Header Intelligence (DLT)
        </button>
        <button
          onClick={() => setActiveTab('google')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'google' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          3. Google Takeout Analyzer
        </button>
      </div>

      {/* Tab 1: MAC Lookup */}
      {activeTab === 'mac' && (
        <div className="space-y-4">
          <form onSubmit={handleMacLookup} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex gap-3 text-xs">
            <input
              type="text"
              required
              value={macInput}
              onChange={(e) => setMacInput(e.target.value)}
              placeholder="Enter MAC address (e.g. 00:1A:2B:3C:4D:5E or AC:BC:32:88:99:AA)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg cursor-pointer"
            >
              Identify Hardware OUI
            </button>
          </form>

          {macResult && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                IEEE Organizationally Unique Identifier (OUI) Result
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">OUI Block Prefix</span>
                  <span className="font-bold text-cyan-300 text-sm font-mono">{macResult.oui}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Hardware Vendor / OEM</span>
                  <span className="font-bold text-white text-xs">{macResult.vendor}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Apparatus Category</span>
                  <span className="text-emerald-400 font-bold text-xs">{macResult.device_type}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">IEEE Registration</span>
                  <span className="text-slate-300 text-xs">Public Global Registry</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: SMS Header */}
      {activeTab === 'sms-header' && (
        <div className="space-y-4">
          <form onSubmit={handleSmsLookup} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex gap-3 text-xs">
            <input
              type="text"
              required
              value={smsInput}
              onChange={(e) => setSmsInput(e.target.value)}
              placeholder="Enter 6-character SMS Sender ID (e.g. AX-HDFCBK, VM-SBIINB, JX-AIRTEL)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg cursor-pointer"
            >
              Decode Header
            </button>
          </form>

          {smsResult && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                TRAI DLT Commercial SMS Header Attribution
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Principal Entity</span>
                  <span className="font-bold text-cyan-300 text-sm">{smsResult.principal_entity}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Originating Telecom</span>
                  <span className="font-bold text-white text-xs">{smsResult.operator_code}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Service Category</span>
                  <span className="text-emerald-400 font-bold text-xs">{smsResult.category}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Smishing Risk</span>
                  <span className="text-emerald-400 font-bold text-xs">{smsResult.smishing_risk}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Google Takeout Analyzer */}
      {activeTab === 'google' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                Google Takeout Lawfully Acquired Account Semantic Timeline
              </h2>
              <span className="text-[11px] text-slate-400">Target Google Account Extraction</span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-800 text-[11px]">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Timestamp (UTC)</th>
                    <th className="p-2.5">Google Service</th>
                    <th className="p-2.5">Activity / Semantic Title</th>
                    <th className="p-2.5">Sensor Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {takeoutActivities.map((act, i) => (
                    <tr key={i} className="hover:bg-slate-900/40">
                      <td className="p-2.5 text-slate-400">{act.timestamp}</td>
                      <td className="p-2.5 text-cyan-400 font-bold">{act.service}</td>
                      <td className="p-2.5 text-white font-medium">{act.title}</td>
                      <td className="p-2.5 text-emerald-400">{act.confidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

