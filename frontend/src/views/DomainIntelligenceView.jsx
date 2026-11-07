import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search, Shield, Globe, Lock, Server, CheckCircle,
  AlertTriangle, Download, RefreshCw, FileText, ArrowRight,
  ExternalLink, Mail, ShieldAlert
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function DomainIntelligenceView() {
  const { addNotification } = useApp();
  const [domainInput, setDomainInput] = useState('secure-bank-login-portal.net');
  const [loading, setLoading] = useState(false);

  const [domainData, setDomainData] = useState({
    domain: 'secure-bank-login-portal.net',
    status: 'ACTIVE_SUSPECT',
    risk_score: 92,
    threat_category: 'Credential Phishing / Impersonation',
    registrar: 'NameCheap Inc.',
    created_date: '2026-10-18 (19 days ago - TYPOSQUATTING ALERT)',
    expiry_date: '2027-10-18',
    registrant_country: 'Iceland (Privacy Guard Protected)',
    name_servers: ['dns1.registrar-servers.com', 'dns2.registrar-servers.com'],
    dns_records: {
      A: ['185.220.101.5', '185.220.101.6'],
      AAAA: ['2a0b:f4c0::12'],
      MX: ['mail.secure-bank-login-portal.net (Priority 10)'],
      TXT: ['v=spf1 include:_spf.google.com ~all'],
      NS: ['dns1.registrar-servers.com', 'dns2.registrar-servers.com']
    },
    email_security: {
      spf: { valid: true, record: 'v=spf1 include:_spf.google.com ~all', status: 'SOFTFAIL (~all)' },
      dkim: { valid: false, selector: 'default', status: 'DKIM Record Not Configured' },
      dmarc: { valid: false, policy: 'NONE', status: 'Missing DMARC Policy (Spoofing Vulnerable)' }
    },
    ssl_cert: {
      issuer: 'Let\'s Encrypt Authority X3 (Free Automated SSL)',
      valid_from: '2026-10-18',
      valid_to: '2027-01-16 (90-day short validity)',
      common_name: 'secure-bank-login-portal.net',
      sans: ['secure-bank-login-portal.net', 'www.secure-bank-login-portal.net'],
      cipher: 'TLS_AES_256_GCM_SHA384'
    },
    subdomains: [
      'login.secure-bank-login-portal.net',
      'verify.secure-bank-login-portal.net',
      'otp.secure-bank-login-portal.net',
      'admin.secure-bank-login-portal.net'
    ],
    http_headers: {
      server: 'nginx/1.24.0 (Ubuntu)',
      hsts: 'Missing Strict-Transport-Security Header',
      csp: 'Missing Content-Security-Policy',
      x_frame_options: 'ALLOW-FROM (Clickjacking Vulnerable)'
    }
  });

  const handleLookup = (e) => {
    e.preventDefault();
    if (!domainInput.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const d = domainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      const isLegit = d.includes('gov.in') || d.includes('nic.in') || d.includes('google.com') || d.includes('airtel.in');

      setDomainData({
        domain: d,
        status: isLegit ? 'CLEAN_VERIFIED' : 'ACTIVE_SUSPECT',
        risk_score: isLegit ? 5 : 88,
        threat_category: isLegit ? 'Authorized Official Domain' : 'Suspicious Recently Registered Domain',
        registrar: isLegit ? 'National Informatics Centre / GoDaddy' : 'Hostinger / NameCheap',
        created_date: isLegit ? '2005-04-12 (Historic Trust)' : '2026-10-24 (Recent Registration)',
        expiry_date: '2027-10-24',
        registrant_country: isLegit ? 'India (Official)' : 'Panama / Privacy Protected',
        name_servers: [`ns1.${d}`, `ns2.${d}`],
        dns_records: {
          A: isLegit ? ['164.100.12.50'] : ['185.220.101.5'],
          AAAA: isLegit ? ['2405:200:800::1'] : [],
          MX: [`mail.${d} (Priority 10)`],
          TXT: ['v=spf1 -all'],
          NS: [`ns1.${d}`, `ns2.${d}`]
        },
        email_security: {
          spf: { valid: true, record: 'v=spf1 -all', status: 'PASS' },
          dkim: { valid: isLegit, selector: 'mail', status: isLegit ? 'DKIM Signed' : 'DKIM Not Detected' },
          dmarc: { valid: isLegit, policy: isLegit ? 'REJECT' : 'NONE', status: isLegit ? 'Protected (p=reject)' : 'Missing Policy' }
        },
        ssl_cert: {
          issuer: isLegit ? 'DigiCert Global CA' : 'Let\'s Encrypt Authority X3',
          valid_from: '2026-01-01',
          valid_to: '2027-01-01',
          common_name: d,
          sans: [d, `www.${d}`],
          cipher: 'TLS_AES_256_GCM_SHA384'
        },
        subdomains: [
          `api.${d}`,
          `portal.${d}`,
          `auth.${d}`
        ],
        http_headers: {
          server: 'nginx',
          hsts: isLegit ? 'max-age=31536000; includeSubDomains' : 'Missing',
          csp: isLegit ? 'default-src \'self\'' : 'Missing',
          x_frame_options: 'SAMEORIGIN'
        }
      });
      setLoading(false);
      addNotification(`Domain intelligence scan completed for ${d}.`);
    }, 450);
  };

  const exportReport = () => {
    window.print();
    addNotification(`Exported domain intelligence dossier for ${domainData.domain}.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" />
            Domain & DNS Intelligence (WHOIS, RDAP, SSL & Email Security)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Investigate suspicious URLs, typosquatting domains, email spoofing records (SPF/DKIM/DMARC), cryptographic SSL certificates, and passive subdomains.
          </p>
        </div>

        <button
          onClick={exportReport}
          className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Export Domain Dossier</span>
        </button>
      </div>

      {/* Query Bar */}
      <form onSubmit={handleLookup} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex-1 min-w-[260px] relative">
          <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            placeholder="Enter target domain or URL (e.g. secure-bank-login-portal.net, scam-courier.org)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Scanning...' : 'Run Forensic Domain Scan'}</span>
        </button>
      </form>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Domain Name" value={domainData.domain} subtitle={domainData.status} color="cyan" icon={Globe} />
        <StatCard title="Phishing Risk Score" value={`${domainData.risk_score} / 100`} subtitle={domainData.threat_category} color={domainData.risk_score > 50 ? 'rose' : 'emerald'} icon={ShieldAlert} />
        <StatCard title="SSL Authority" value={domainData.ssl_cert.issuer.split(' ')[0]} subtitle="90-day automated cert" color="purple" icon={Lock} />
        <StatCard title="DMARC Protection" value={domainData.email_security.dmarc.policy} subtitle={domainData.email_security.dmarc.status} color={domainData.email_security.dmarc.valid ? 'emerald' : 'rose'} icon={Mail} />
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* RDAP & Registration Details */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            RDAP & WHOIS Registration Metadata
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Registrar Organization:</span>
              <span className="font-bold text-white">{domainData.registrar}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Creation Date:</span>
              <span className="text-rose-400 font-bold">{domainData.created_date}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Registrant Country:</span>
              <span className="text-slate-200">{domainData.registrant_country}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Authoritative Name Servers:</span>
              <span className="text-cyan-300 text-right">{domainData.name_servers.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* DNS Records */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Server className="w-4 h-4 text-purple-400" />
            DNS Resolution Records
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">A Records (IPv4):</span>
              <span className="font-bold text-emerald-400">{domainData.dns_records.A.join(', ')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">MX Mail Exchanger:</span>
              <span className="text-slate-300">{domainData.dns_records.MX.join(', ') || 'None'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">TXT Verification Records:</span>
              <span className="text-slate-400 text-right truncate max-w-xs">{domainData.dns_records.TXT.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Email Spoofing Defense (SPF / DKIM / DMARC) */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Mail className="w-4 h-4 text-amber-400" />
            Email Impersonation & Spoofing Defense
          </h2>
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">SPF Record</span>
                <span className="text-[10px] text-slate-400">{domainData.email_security.spf.record}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {domainData.email_security.spf.status}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">DMARC Policy</span>
                <span className="text-[10px] text-slate-400">Policy setting: p={domainData.email_security.dmarc.policy}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                domainData.email_security.dmarc.valid ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {domainData.email_security.dmarc.status}
              </span>
            </div>
          </div>
        </div>

        {/* SSL / TLS Certificate Analysis */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            Cryptographic SSL/TLS Certificate
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Issuing Certificate Authority:</span>
              <span className="font-bold text-white">{domainData.ssl_cert.issuer}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Validity Horizon:</span>
              <span className="text-slate-300">{domainData.ssl_cert.valid_from} to {domainData.ssl_cert.valid_to}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Subject Alternative Names (SANs):</span>
              <span className="text-cyan-300">{domainData.ssl_cert.sans.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Discovered Subdomains List */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          Discovered Target Subdomains & Attack Surface ({domainData.subdomains.length} Nodes)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {domainData.subdomains.map((sub, i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500/50 flex items-center justify-between">
              <span className="text-white text-xs truncate" title={sub}>{sub}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
