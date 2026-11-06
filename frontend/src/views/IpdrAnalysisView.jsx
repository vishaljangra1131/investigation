import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Globe, ShieldAlert, Radio, Server, Activity, ArrowRight, Info } from 'lucide-react';
import StatCard from '../components/StatCard';

export default function IpdrAnalysisView() {
  const { formatNumber } = useApp();
  const [ipdrData, setIpdrData] = useState([]);
  const [totalMB, setTotalMB] = useState(0);
  const [topIps, setTopIps] = useState([]);

  useEffect(() => {
    fetch('/api/ipdr')
      .then(res => res.json())
      .then(data => {
        setIpdrData(data.records || []);
        setTotalMB(data.total_data_mb || 0);
        setTopIps(data.top_destination_ips || []);
      })
      .catch(err => {
        console.warn("Loading static fallback IPDR data:", err);
        fetch('/data/sample_ipdr_data.json')
          .then(r => r.json())
          .then(data => {
            setIpdrData(data);
            const mb = data.reduce((acc, r) => acc + (r.total_megabytes || 0), 0);
            setTotalMB(round(mb, 2));
          });
      });
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          IPDR Analysis (Internet Protocol Detail Records)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Analysis of packet data sessions, public destination IP addresses, transport ports, and encrypted application protocols (Telegram, WhatsApp VoIP, Tor, VPN).
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total IPDR Sessions" value={ipdrData.length} subtitle="Packet Data Sessions" color="cyan" icon={Globe} />
        <StatCard title="Total Data Volume" value={`${totalMB} MB`} subtitle="Uplink + Downlink" color="purple" icon={Activity} />
        <StatCard title="Destination IPs" value={topIps.length} subtitle="External Servers" color="emerald" icon={Server} />
        <StatCard title="Access Bearer" value="4G LTE PDN" subtitle="Packet Data Network" color="blue" />
      </div>

      {/* Educational Box: CDR vs IPDR Comparison */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
        <h2 className="text-xs font-bold text-cyan-400 uppercase font-mono tracking-wider flex items-center gap-2">
          <Info className="w-4 h-4" />
          Technical Distinction: CDR (Voice/SMS) vs. IPDR (Internet Data)
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

      {/* IPDR Records Table */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          Internet Session Master Log ({ipdrData.length} Sessions)
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-800 text-[11px] font-mono">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2.5">Session ID</th>
                <th className="p-2.5">Start Time</th>
                <th className="p-2.5">Source IP / Port</th>
                <th className="p-2.5">Destination IP / Port</th>
                <th className="p-2.5">Application Protocol</th>
                <th className="p-2.5">Data Volume</th>
                <th className="p-2.5">Serving Cell</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {ipdrData.slice(0, 15).map((r, i) => (
                <tr key={i} className="hover:bg-slate-900/40">
                  <td className="p-2.5 text-cyan-400 font-bold">{r.session_id}</td>
                  <td className="p-2.5 text-slate-400">{r.start_time}</td>
                  <td className="p-2.5 text-slate-300">{r.source_private_ip}:{r.source_port}</td>
                  <td className="p-2.5 text-purple-300 font-bold">{r.destination_public_ip}:{r.destination_port}</td>
                  <td className="p-2.5 text-white font-medium">{r.application_protocol}</td>
                  <td className="p-2.5 text-emerald-400 font-bold">{r.total_megabytes} MB</td>
                  <td className="p-2.5 text-slate-500 text-[10px]">{r.serving_cell_id}</td>
                </tr>
              ))}
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

