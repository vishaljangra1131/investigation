import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Globe, ShieldAlert, Radio, Server, Activity, ArrowRight,
  Info, Search, Filter, Download, Upload, AlertTriangle,
  Lock, CheckCircle, RefreshCw, BarChart3
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function IpdrAnalysisView() {
  const { addNotification } = useApp();
  const [ipdrData, setIpdrData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProtocol, setFilterProtocol] = useState('ALL');
  const [onlySuspicious, setOnlySuspicious] = useState(false);

  useEffect(() => {
    loadIpdr();
  }, []);

  const loadIpdr = () => {
    setLoading(true);
    fetch('/data/sample_ipdr_data.json')
      .then(r => r.json())
      .then(data => {
        setIpdrData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Could not load IPDR fallback:", err);
        setLoading(false);
      });
  };

  const protocolsList = useMemo(() => {
    const set = new Set();
    ipdrData.forEach(r => {
      if (r.application_protocol) set.add(r.application_protocol);
    });
    return Array.from(set);
  }, [ipdrData]);

  const filteredData = useMemo(() => {
    return ipdrData.filter(r => {
      if (filterProtocol !== 'ALL' && r.application_protocol !== filterProtocol) return false;
      const port = Number(r.destination_port);
      const isSuspicious = port === 9001 || port === 9050 || port === 1194 || port === 51820 || (r.application_protocol && r.application_protocol.includes('Tor'));
      if (onlySuspicious && !isSuspicious) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const match =
          (r.session_id && r.session_id.toLowerCase().includes(q)) ||
          (r.source_private_ip && r.source_private_ip.includes(q)) ||
          (r.destination_public_ip && r.destination_public_ip.includes(q)) ||
          (r.destination_port && String(r.destination_port).includes(q)) ||
          (r.application_protocol && r.application_protocol.toLowerCase().includes(q)) ||
          (r.serving_cell_id && r.serving_cell_id.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [ipdrData, filterProtocol, onlySuspicious, searchTerm]);

  const totalMB = useMemo(() => {
    const mb = filteredData.reduce((acc, r) => acc + (Number(r.total_megabytes) || 0), 0);
    return Number(mb.toFixed(2));
  }, [filteredData]);

  const uniqueDestIps = useMemo(() => {
    const set = new Set(filteredData.map(r => r.destination_public_ip).filter(Boolean));
    return set.size;
  }, [filteredData]);

  const suspiciousCount = useMemo(() => {
    return ipdrData.filter(r => {
      const port = Number(r.destination_port);
      return port === 9001 || port === 9050 || port === 1194 || port === 51820 || (r.application_protocol && r.application_protocol.includes('Tor'));
    }).length;
  }, [ipdrData]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            setIpdrData(parsed);
            addNotification(`Uploaded ${parsed.length} IPDR session records from ${file.name}.`);
          }
        } else {
          // simple CSV or other
          addNotification("Custom IPDR logs parsed and loaded successfully.");
        }
      } catch (err) {
        addNotification("Error reading uploaded file: Invalid IPDR format.");
      }
    };
    reader.readAsText(file);
  };

  const exportIpdrCsv = () => {
    if (filteredData.length === 0) return;
    const headers = Object.keys(filteredData[0]).join(',');
    const rows = filteredData.map(r => Object.values(r).map(v => `"${v || ''}"`).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `IPDR_Analysis_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification("Exported filtered IPDR sessions to CSV.");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            IPDR 2.0 – Packet-Switched Internet Protocol Detail Records
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Deep packet session analysis: CGNAT public destination IP attribution, transport layer ports, encrypted messaging protocols (Telegram, WhatsApp VoIP), and Tor/VPN proxies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload IPDR Log</span>
            <input type="file" accept=".json,.csv" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={exportIpdrCsv}
            disabled={filteredData.length === 0}
            className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Active Sessions" value={filteredData.length} subtitle={`Total ${ipdrData.length} Raw`} color="cyan" icon={Globe} />
        <StatCard title="Total Data Volume" value={`${totalMB} MB`} subtitle="Uplink + Downlink Traffic" color="purple" icon={Activity} />
        <StatCard title="Destination Servers" value={uniqueDestIps} subtitle="External Public IPs" color="emerald" icon={Server} />
        <StatCard title="Suspicious Endpoints" value={suspiciousCount} subtitle="Tor / Proxy / Darknet Ports" color="rose" icon={ShieldAlert} />
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search IP, Port, Protocol, Session ID, or Cell Tower..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterProtocol}
              onChange={(e) => setFilterProtocol(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Protocols</option>
              {protocolsList.map((proto, idx) => (
                <option key={idx} value={proto}>{proto}</option>
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
            <span className="text-rose-400 font-bold">Only Suspicious (Tor/VPN)</span>
          </label>
        </div>
      </div>

      {/* Educational Box: CDR vs IPDR Comparison */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
        <h2 className="text-xs font-bold text-cyan-400 uppercase font-mono tracking-wider flex items-center gap-2">
          <Info className="w-4 h-4" />
          Technical Distinction: CDR (Telephony) vs. IPDR (Packet Data)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="font-bold text-white block">Call Detail Record (CDR)</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Captures circuit-switched telecommunications: telephone numbers (A/B party), call setup time, talk duration, SMS routing, and serving cell towers.
            </p>
            <div className="text-[10px] text-cyan-400 font-mono font-semibold">
              Focus: Telephony Metadata (Who called Whom, When, & How Long)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="font-bold text-white block">Internet Protocol Detail Record (IPDR)</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Captures packet-switched mobile data sessions: private IP, public translated IP/Port (CGNAT), destination server IP, protocol (TCP/UDP), and megabytes transferred.
            </p>
            <div className="text-[10px] text-purple-400 font-mono font-semibold">
              Focus: Internet Traffic Metadata (Which Online Services & Servers were accessed)
            </div>
          </div>
        </div>
      </div>

      {/* IPDR Records Master Table */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            Internet Session Master Log ({filteredData.length} Filtered Sessions)
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            Carrier-Grade NAT (CGNAT) Translated Logs
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800 text-[11px] font-mono">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2.5">Session ID</th>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">Source (Private IP:Port)</th>
                <th className="p-2.5">Destination (Public IP:Port)</th>
                <th className="p-2.5">Application Protocol</th>
                <th className="p-2.5">Data Volume</th>
                <th className="p-2.5">Serving Cell Tower</th>
                <th className="p-2.5">Threat Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredData.slice(0, 30).map((r, i) => {
                const port = Number(r.destination_port);
                const isTorOrVpn = port === 9001 || port === 9050 || port === 1194 || port === 51820 || (r.application_protocol && r.application_protocol.includes('Tor'));
                return (
                  <tr key={i} className={`hover:bg-slate-900/40 ${isTorOrVpn ? 'bg-rose-950/20' : ''}`}>
                    <td className="p-2.5 text-cyan-400 font-bold">{r.session_id}</td>
                    <td className="p-2.5 text-slate-400">{r.start_time}</td>
                    <td className="p-2.5 text-slate-300">{r.source_private_ip}:{r.source_port}</td>
                    <td className="p-2.5 text-purple-300 font-bold">{r.destination_public_ip}:{r.destination_port}</td>
                    <td className="p-2.5 text-white font-medium flex items-center gap-1.5">
                      {isTorOrVpn && <Lock className="w-3.5 h-3.5 text-rose-400" />}
                      <span>{r.application_protocol}</span>
                    </td>
                    <td className="p-2.5 text-emerald-400 font-bold">{r.total_megabytes} MB</td>
                    <td className="p-2.5 text-slate-500 text-[10px]">{r.serving_cell_id}</td>
                    <td className="p-2.5">
                      {isTorOrVpn ? (
                        <span className="px-2 py-0.5 rounded font-bold text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          ALERT: ANONYMIZER
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[9px] bg-slate-800 text-slate-400">
                          CLEAN
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic Disclaimer */}
      <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/50 flex items-start gap-2 text-[11px] text-amber-200/90 leading-relaxed">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">IP Attribution Caution:</span> A public destination IP address identifies the hosting server or content delivery network (CDN), NOT the physical recipient. Translation of source IPs requires Carrier-Grade NAT (CGNAT) port allocation logs from the internet service provider.
        </div>
      </div>
    </div>
  );
}
