import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Globe, ShieldAlert, Server, Activity, Search, Download,
  CheckCircle, AlertTriangle, Lock, ShieldCheck, MapPin,
  Cpu, ExternalLink, RefreshCw, Layers
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function IpIntelligenceView() {
  const { addNotification } = useApp();
  const [ipInput, setIpInput] = useState('185.220.101.5');
  const [loading, setLoading] = useState(false);
  const [ipResult, setIpResult] = useState({
    ip: '185.220.101.5',
    type: 'IPv4',
    hostname: 'tor-exit-node-05.dfri.se',
    country: 'Germany',
    country_code: 'DE',
    region: 'Saxony',
    city: 'Leipzig',
    postal: '04109',
    latitude: 51.3397,
    longitude: 12.3731,
    asn: 'AS208323',
    asn_org: 'Föreningen för digitala fri- och rättigheter',
    isp: 'DFRI Tor Exit Infrastructure',
    cidr: '185.220.101.0/24',
    is_proxy: true,
    is_vpn: false,
    is_tor: true,
    abuse_score: 98,
    threat_level: 'CRITICAL',
    threat_category: 'Anonymizing Tor Relay / Darknet Gateway',
    open_ports: [80, 443, 9001, 9050],
    reverse_dns: 'ptr.tor-node.dfri.se',
    last_reported: '2026-11-06 14:22:10 UTC'
  });

  const [bulkList, setBulkList] = useState([
    { ip: '185.220.101.5', asn: 'AS208323', isp: 'DFRI Tor Exit', country: 'Germany', tor: true, proxy: true, abuse: 98 },
    { ip: '103.21.244.0', asn: 'AS13335', isp: 'Cloudflare Inc', country: 'United States', tor: false, proxy: true, abuse: 12 },
    { ip: '49.207.180.22', asn: 'AS45609', isp: 'Bharti Airtel Broadband', country: 'India (Delhi)', tor: false, proxy: false, abuse: 0 },
    { ip: '14.139.60.10', asn: 'AS4758', isp: 'National Knowledge Network (NKN)', country: 'India (Delhi)', tor: false, proxy: false, abuse: 0 }
  ]);

  const handleLookup = (e) => {
    e.preventDefault();
    if (!ipInput.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const cleanIp = ipInput.trim();
      const isIndian = cleanIp.startsWith('49.') || cleanIp.startsWith('103.') || cleanIp.startsWith('14.');
      const isTor = cleanIp.includes('185.') || cleanIp.endsWith('.5');

      const mockData = {
        ip: cleanIp,
        type: cleanIp.includes(':') ? 'IPv6' : 'IPv4',
        hostname: isTor ? `tor-node-${cleanIp.replace(/\./g, '-')}.net` : `static-${cleanIp.replace(/\./g, '-')}.isp.in`,
        country: isIndian ? 'India' : (isTor ? 'Germany' : 'United States'),
        country_code: isIndian ? 'IN' : (isTor ? 'DE' : 'US'),
        region: isIndian ? 'Delhi NCR' : 'Frankfurt',
        city: isIndian ? 'New Delhi' : 'Frankfurt',
        postal: isIndian ? '110001' : '60311',
        latitude: isIndian ? 28.6139 : 50.1109,
        longitude: isIndian ? 77.2090 : 8.6821,
        asn: isIndian ? 'AS45609' : (isTor ? 'AS208323' : 'AS13335'),
        asn_org: isIndian ? 'Bharti Airtel Broadband Limited' : (isTor ? 'DFRI Tor Anonymizer' : 'Cloudflare Inc.'),
        isp: isIndian ? 'Airtel Broadband India' : (isTor ? 'Tor Exit Node Relay' : 'Cloudflare Edge CDN'),
        cidr: `${cleanIp.split('.').slice(0, 3).join('.')}.0/24`,
        is_proxy: isTor,
        is_vpn: !isIndian && !isTor,
        is_tor: isTor,
        abuse_score: isTor ? 95 : (isIndian ? 0 : 25),
        threat_level: isTor ? 'CRITICAL' : (isIndian ? 'CLEAN' : 'LOW'),
        threat_category: isTor ? 'Darknet Tor Exit Node' : (isIndian ? 'Legitimate Residential ISP' : 'Commercial CDN'),
        open_ports: isTor ? [80, 443, 9001, 9050] : [80, 443],
        reverse_dns: `rev.${cleanIp}.broadband.net`,
        last_reported: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      };

      setIpResult(mockData);
      setBulkList(prev => [
        { ip: mockData.ip, asn: mockData.asn, isp: mockData.isp, country: mockData.country, tor: mockData.is_tor, proxy: mockData.is_proxy, abuse: mockData.abuse_score },
        ...prev.slice(0, 6)
      ]);
      setLoading(false);
      addNotification(`IP Intelligence analysis completed for ${cleanIp}.`);
    }, 450);
  };

  const exportBulkCsv = () => {
    const headers = "IP,ASN,ISP,Country,IsTor,IsProxy,AbuseScore\n";
    const rows = bulkList.map(b => `"${b.ip}","${b.asn}","${b.isp}","${b.country}",${b.tor},${b.proxy},${b.abuse}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IP_Threat_Intelligence_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    addNotification("Exported bulk IP intelligence report.");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            IP Intelligence & Threat Profiler (IPv4 / IPv6)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time IP address attribution: Autonomous System Numbers (ASN), ISP network operators, Tor exit nodes, commercial VPN proxies, and abuse reputation scoring.
          </p>
        </div>

        <button
          onClick={exportBulkCsv}
          className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Export Bulk Intelligence CSV</span>
        </button>
      </div>

      {/* Query Bar */}
      <form onSubmit={handleLookup} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
            placeholder="Enter public IPv4 or IPv6 address (e.g. 185.220.101.5, 49.207.180.22)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Analyzing...' : 'Enrich IP Intelligence'}</span>
        </button>
      </form>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Target IP" value={ipResult.ip} subtitle={`${ipResult.type} Protocol`} color="cyan" icon={Globe} />
        <StatCard title="Threat Score" value={`${ipResult.abuse_score} / 100`} subtitle={ipResult.threat_level} color={ipResult.abuse_score > 50 ? 'rose' : 'emerald'} icon={ShieldAlert} />
        <StatCard title="Anonymizer Flag" value={ipResult.is_tor ? 'TOR EXIT' : (ipResult.is_proxy ? 'PROXY' : 'DIRECT ISP')} subtitle={ipResult.threat_category} color="purple" icon={Lock} />
        <StatCard title="Location" value={`${ipResult.city}, ${ipResult.country_code}`} subtitle={ipResult.country} color="amber" icon={MapPin} />
      </div>

      {/* Deep Technical IP Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Network & Autonomous System */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Server className="w-4 h-4 text-cyan-400" />
            Network Carrier & Autonomous System (ASN)
          </h2>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Autonomous System Number:</span>
              <span className="font-bold text-cyan-400">{ipResult.asn}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Organization Name:</span>
              <span className="font-bold text-white">{ipResult.asn_org}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Internet Service Provider (ISP):</span>
              <span className="text-slate-200">{ipResult.isp}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Network BGP Route / CIDR:</span>
              <span className="font-mono text-cyan-300">{ipResult.cidr}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Reverse DNS Hostname:</span>
              <span className="text-slate-300 truncate max-w-xs">{ipResult.reverse_dns}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Open Fingerprinted Ports:</span>
              <span className="text-emerald-400 font-bold">{ipResult.open_ports.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Threat Scoring & Anonymity */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Threat Reputation & Proxy Detection
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Abuse Confidence Score</span>
                <span className={`text-xl font-extrabold ${ipResult.abuse_score > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {ipResult.abuse_score}%
                </span>
              </div>
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${
                ipResult.abuse_score > 50 ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {ipResult.threat_level} RISK
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className={`p-2 rounded-lg border ${ipResult.is_tor ? 'bg-rose-500/10 border-rose-500/40 text-rose-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                <span className="block font-bold">TOR EXIT NODE</span>
                <span>{ipResult.is_tor ? 'DETECTED' : 'NO'}</span>
              </div>
              <div className={`p-2 rounded-lg border ${ipResult.is_vpn ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                <span className="block font-bold">COMMERCIAL VPN</span>
                <span>{ipResult.is_vpn ? 'DETECTED' : 'NO'}</span>
              </div>
              <div className={`p-2 rounded-lg border ${ipResult.is_proxy ? 'bg-purple-500/10 border-purple-500/40 text-purple-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                <span className="block font-bold">WEB PROXY</span>
                <span>{ipResult.is_proxy ? 'ACTIVE' : 'NO'}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 leading-relaxed p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="text-slate-300 font-bold block mb-0.5">Forensic Guidance:</span>
              When an IP is flagged as a Tor Exit Node, packet payloads cannot be directly matched to an individual subscriber without correlate timing analysis and ISP NAT/flow logs.
            </div>
          </div>
        </div>
      </div>

      {/* Recent Queries / Bulk History Table */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Recent IP Targets & Threat Log
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-800 text-[11px]">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2.5">IP Address</th>
                <th className="p-2.5">ASN</th>
                <th className="p-2.5">ISP / Network Carrier</th>
                <th className="p-2.5">Country</th>
                <th className="p-2.5">Tor / Proxy</th>
                <th className="p-2.5">Abuse Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {bulkList.map((row, i) => (
                <tr key={i} className="hover:bg-slate-900/40">
                  <td className="p-2.5 text-cyan-400 font-bold cursor-pointer hover:underline" onClick={() => { setIpInput(row.ip); }}>
                    {row.ip}
                  </td>
                  <td className="p-2.5 text-slate-300">{row.asn}</td>
                  <td className="p-2.5 text-white font-medium">{row.isp}</td>
                  <td className="p-2.5 text-slate-400">{row.country}</td>
                  <td className="p-2.5">
                    {row.tor ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        TOR NODE
                      </span>
                    ) : (row.proxy ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        PROXY
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">DIRECT</span>
                    ))}
                  </td>
                  <td className="p-2.5">
                    <span className={`font-bold ${row.abuse > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {row.abuse}%
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
