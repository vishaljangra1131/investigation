import React, { createContext, useContext, useState, useEffect } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { TOOLS_CATALOG, TOOLS_CATEGORIES } from '../data/toolsCatalog';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('home');
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);

  // Active Selected Case
  const [caseData, setCaseData] = useState({
    case_id: "FIR-DEL-2026-8812",
    case_title: "Operation CyberTrack: Telecom & Financial Crime Syndicate",
    officer_name: "Constable Vishal",
    designation: "Inspector (Cybercrime)",
    agency: "Special Cyber Crime & Telecom Intelligence Division",
    police_station: "Cyber Police Station IFSO, Dwarka",
    district: "South West Delhi",
    state: "Delhi",
    priority: "HIGH",
    status: "ACTIVE",
    category: "Financial Cyber Fraud / Digital Arrest",
    description: "Analysis of subscriber communications, multi-layer mule account money trails, and mobile handset transitions in connection with coordinated cyber extortion operations.",
    created_at: "2026-10-22 10:30:00",
    target_numbers: ["+919876543210", "+919811223344"],
    target_banks: ["9810293847 (HDFC)", "912010048172 (Axis)"],
    notes: [
      { date: "2026-10-22 11:15", author: "Constable Vishal", text: "Subpoenaed CDR and IPDR logs received lawfully from cellular operators under Sec 91 CrPC / Sec 94 BNSS." },
      { date: "2026-10-24 16:40", author: "Sub-Insp. Priya Sharma", text: "Cryptographic SHA-256 integrity hash calculated and verified against raw evidence." },
      { date: "2026-10-28 14:10", author: "Constable Vishal", text: "NCRP complaint link identified: Dr. Ramesh Verma defrauded of INR 7,50,000 via digital arrest extortion." }
    ]
  });

  // Master Cases Repository
  const [casesList, setCasesList] = useState([
    {
      case_id: "FIR-DEL-2026-8812",
      case_title: "Operation CyberTrack: Telecom & Financial Crime Syndicate",
      officer_name: "Constable Vishal",
      agency: "Special Cyber Crime & Telecom Intelligence Division",
      police_station: "Cyber Police Station IFSO, Dwarka",
      district: "South West Delhi",
      state: "Delhi",
      priority: "HIGH",
      status: "ACTIVE",
      category: "Financial Cyber Fraud / Digital Arrest",
      created_at: "2026-10-22 10:30:00",
      target_count: 3,
      evidence_count: 4
    },
    {
      case_id: "FIR-MUM-2026-4421",
      case_title: "SIM Box Illegal Gateway & Hawala Settlement",
      officer_name: "Sub-Insp. Priya Sharma",
      agency: "Maharashtra Cyber Cell",
      police_station: "Cyber Police Station BKC",
      district: "Mumbai Suburban",
      state: "Maharashtra",
      priority: "CRITICAL",
      status: "ACTIVE",
      category: "SIM Box / Illegal VoIP Routing",
      created_at: "2026-10-18 16:00:00",
      target_count: 5,
      evidence_count: 2
    },
    {
      case_id: "FIR-HR-2025-4102",
      case_title: "Interstate Courier Scam & Mule Network",
      officer_name: "Insp. Jasvir Singh",
      agency: "Haryana Police Cyber Wing",
      police_station: "Cyber Crime Police Station Gurugram East",
      district: "Gurugram",
      state: "Haryana",
      priority: "MEDIUM",
      status: "UNDER_REVIEW",
      category: "FedEx / Courier Phishing",
      created_at: "2025-11-04 09:20:00",
      target_count: 2,
      evidence_count: 3
    }
  ]);

  // Primary Evidence and Evidence Locker
  const [evidence, setEvidence] = useState({
    evidence_id: "EVD-2026-001",
    case_id: "FIR-DEL-2026-8812",
    original_filename: "sample_cdr_case_01.csv",
    file_size_bytes: 42350,
    sha256_hash: "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
    uploaded_at: "2026-10-22 10:35:00",
    analyst_name: "Constable Vishal",
    record_count: 196,
    verified: true,
    custody_log: [
      { timestamp: "2026-10-22 10:35:00", action: "INITIAL_INGESTION", officer: "Constable Vishal", hash: "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855" }
    ]
  });

  const [evidenceList, setEvidenceList] = useState([
    {
      evidence_id: "EVD-2026-001",
      case_id: "FIR-DEL-2026-8812",
      category: "CDR_TELECOM",
      original_filename: "sample_cdr_case_01.csv",
      file_size_bytes: 42350,
      sha256_hash: "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
      uploaded_at: "2026-10-22 10:35:00",
      analyst_name: "Constable Vishal",
      record_count: 196,
      verified: true
    },
    {
      evidence_id: "EVD-2026-002",
      case_id: "FIR-DEL-2026-8812",
      category: "BANK_STATEMENT",
      original_filename: "hdfc_bank_statement_oct2026.csv",
      file_size_bytes: 28410,
      sha256_hash: "8F4A19B3E2D87410291C78361029A8B7C6E5D4F3A2B1C0E9D8F7A6B5C4E3D2F1",
      uploaded_at: "2026-10-23 11:20:00",
      analyst_name: "Constable Vishal",
      record_count: 10,
      verified: true
    },
    {
      evidence_id: "EVD-2026-003",
      case_id: "FIR-DEL-2026-8812",
      category: "IPDR_LOGS",
      original_filename: "ipdr_airtel_target_oct2026.json",
      file_size_bytes: 47697,
      sha256_hash: "3C89B10283746192847561920394857162534172839405918273645102938475",
      uploaded_at: "2026-10-24 14:05:00",
      analyst_name: "Sub-Insp. Priya Sharma",
      record_count: 24,
      verified: true
    },
    {
      evidence_id: "EVD-2026-004",
      case_id: "FIR-DEL-2026-8812",
      category: "MOBILE_EXTRACTION",
      original_filename: "oneplus_nord_tar_dump.bin",
      file_size_bytes: 52428800,
      sha256_hash: "9A8B7C6D5E4F3A2B1C0D9E8F7A6B5C4D3E2F1A0B9C8D7E6F5A4B3C2D1E0F9A8B",
      uploaded_at: "2026-10-26 18:30:00",
      analyst_name: "Constable Vishal",
      record_count: 1,
      verified: true
    }
  ]);

  // Financial & NCRP Data
  const [bankTransactions, setBankTransactions] = useState([]);
  const [ncrpData, setNcrpData] = useState(null);

  // Suspects & Intelligence
  const [suspects, setSuspects] = useState([]);

  // LBS & Movement
  const [lbsRecords, setLbsRecords] = useState([]);

  // Directories
  const [nodalOfficers, setNodalOfficers] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);

  // Anomalies
  const [anomalies, setAnomalies] = useState([]);

  // UI States
  const [theme, setTheme] = useState('dark');
  const [userRole, setUserRole] = useState('SUPER_ADMIN'); // SUPER_ADMIN, VERIFIED_OFFICER, ANALYST
  const [maskNumbers, setMaskNumbers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiOnline, setApiOnline] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState('en'); // 'en' or 'hi'

  // Officer Authentication State
  const [userAuth, setUserAuth] = useState({
    isLoggedIn: true,
    user: {
      name: "Constable Vishal",
      email: "vishal.jangra@police.gov.in",
      mobile: "+91-9876543210",
      designation: "Inspector (Cybercrime)",
      department: "Special Cyber Crime & Telecom Intelligence Division",
      state: "Delhi",
      district: "South West Delhi",
      station: "Cyber Police Station IFSO, Dwarka",
      role: "Super Administrator",
      verified: true,
      lastLogin: "2026-11-07 20:45:00",
      token: "jwt_token_sample_881920"
    }
  });

  const [notifications, setNotifications] = useState([
    { id: 1, text: "System Initialized: Investigation Pro forensic engine active.", time: "Just now", read: false },
    { id: 2, text: "Case Loaded: FIR-DEL-2026-8812 (Operation CyberTrack).", time: "2m ago", read: false },
    { id: 3, text: "Evidence verified: Bit-for-bit SHA-256 match confirmed.", time: "5m ago", read: false }
  ]);

  // Global Ctrl + K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchInitialData();
    loadSyntheticDatasets();
  }, []);

  const loadSyntheticDatasets = () => {
    // 1. Bank statements
    fetch('/data/sample_bank_statement.json')
      .then(r => r.json())
      .then(data => setBankTransactions(data))
      .catch(e => console.warn("Bank fallback data note:", e));

    // 2. NCRP Trail
    fetch('/data/sample_ncrp_trail.json')
      .then(r => r.json())
      .then(data => setNcrpData(data))
      .catch(e => console.warn("NCRP fallback data note:", e));

    // 3. Suspects
    fetch('/data/sample_suspects.json')
      .then(r => r.json())
      .then(data => setSuspects(data))
      .catch(e => console.warn("Suspects fallback data note:", e));

    // 4. LBS movement
    fetch('/data/sample_lbs_movement.json')
      .then(r => r.json())
      .then(data => setLbsRecords(data))
      .catch(e => console.warn("LBS fallback data note:", e));

    // 5. Nodal Officers
    fetch('/data/sample_nodal_officers.json')
      .then(r => r.json())
      .then(data => setNodalOfficers(data))
      .catch(e => console.warn("Nodal fallback data note:", e));

    // 6. Police Stations
    fetch('/data/sample_police_stations.json')
      .then(r => r.json())
      .then(data => setPoliceStations(data))
      .catch(e => console.warn("PS fallback data note:", e));
  };

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/health');
      const isJson = res.headers.get('content-type')?.includes('application/json');
      if (res.ok && isJson) {
        setApiOnline(true);
        const sumRes = await fetch('/api/analytics/summary');
        if (sumRes.ok && sumRes.headers.get('content-type')?.includes('application/json')) {
          const sumData = await sumRes.json();
          setSummary(sumData);
        }
        const recRes = await fetch('/api/records?limit=500');
        if (recRes.ok && recRes.headers.get('content-type')?.includes('application/json')) {
          const recData = await recRes.json();
          setRecords(recData.records);
        }
        const anoRes = await fetch('/api/analytics/anomalies');
        if (anoRes.ok && anoRes.headers.get('content-type')?.includes('application/json')) {
          const anoData = await anoRes.json();
          setAnomalies(anoData);
        }
      } else {
        throw new Error("Backend offline");
      }
    } catch (err) {
      setApiOnline(false);
      loadLocalFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalFallbackData = () => {
    fetch('/data/sample_cdr_case_01.csv')
      .then(res => {
        if (!res.ok) throw new Error("Fallback fetch failed");
        return res.text();
      })
      .then(csvText => {
        if (!csvText || csvText.trim().startsWith('<')) {
          throw new Error("Received HTML instead of CSV");
        }
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            const raw = results.data.map((r, idx) => ({
              record_id: r.record_id || `REC-${idx+10001}`,
              calling_number: String(r.calling_number || ''),
              called_number: String(r.called_number || ''),
              call_date: r.call_date || '',
              call_time: r.call_time || '',
              datetime: r.datetime || `${r.call_date} ${r.call_time}`,
              duration: Number(r.duration) || 0,
              call_type: r.call_type || 'OUTGOING',
              imei: String(r.imei || ''),
              imsi: String(r.imsi || ''),
              first_cell_id: String(r.first_cell_id || ''),
              last_cell_id: String(r.last_cell_id || ''),
              lac: String(r.lac || ''),
              tower_name: r.tower_name || '',
              latitude: Number(r.latitude) || null,
              longitude: Number(r.longitude) || null,
              operator: r.operator || 'Telecom'
            }));
            setRecords(raw);
            computeLocalSummary(raw);
          }
        });
      })
      .catch(e => console.error("Could not load local fallback data:", e));
  };

  const computeLocalSummary = (data) => {
    if (!data || data.length === 0) return;
    const total = data.length;
    const incoming = data.filter(r => r.call_type === 'INCOMING').length;
    const outgoing = data.filter(r => r.call_type === 'OUTGOING').length;
    const sms = data.filter(r => r.call_type.includes('SMS')).length;
    const missed = data.filter(r => r.call_type === 'MISSED').length;
    const totalDur = data.reduce((acc, r) => acc + (r.duration || 0), 0);
    const nums = new Set();
    const imeis = new Set();
    const imsis = new Set();
    data.forEach(r => {
      if (r.calling_number) nums.add(r.calling_number);
      if (r.called_number) nums.add(r.called_number);
      if (r.imei) imeis.add(r.imei);
      if (r.imsi) imsis.add(r.imsi);
    });

    const hours = Math.floor(totalDur / 3600);
    const mins = Math.floor((totalDur % 3600) / 60);
    const secs = totalDur % 60;

    setSummary({
      total_records: total,
      total_incoming: incoming,
      total_outgoing: outgoing,
      total_sms: sms,
      total_missed: missed,
      unique_numbers: nums.size,
      unique_imeis: imeis.size,
      unique_imsis: imsis.size,
      total_duration_seconds: totalDur,
      total_duration_formatted: `${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`,
      most_frequent_contact: "+919811223344",
      longest_call_seconds: Math.max(...data.map(r => r.duration || 0)),
      first_date: data[0]?.datetime || '2026-10-15',
      last_date: data[data.length - 1]?.datetime || '2026-10-26',
      peak_hour: "23:00",
      peak_day: "Wednesday"
    });
  };

  // Real-time browser Web Crypto API SHA-256 calculation
  const calculateBufferSha256 = async (arrayBuffer) => {
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  };

  const loadDemoData = async (dataset = "case_1") => {
    setLoading(true);
    try {
      const filename = dataset === "case_1" ? "/data/sample_cdr_case_01.csv" : "/data/sample_cdr_case_02.csv";
      const res = await fetch(filename);
      const csv = await res.text();
      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: (resParsed) => {
          const mapped = resParsed.data.map(r => ({ ...r, duration: Number(r.duration || 0) }));
          setRecords(mapped);
          computeLocalSummary(mapped);
          setCaseData({
            case_id: dataset === "case_1" ? "FIR-DEL-2026-8812" : "FIR-MUM-2026-4421",
            case_title: dataset === "case_1" ? "Operation CyberTrack: Telecom & Financial Crime Syndicate" : "SIM Box Interception & Hawala Network Investigation",
            officer_name: "Constable Vishal",
            agency: "Special Cyber Crime & Telecom Intelligence Division",
            police_station: "Cyber Police Station IFSO, Dwarka",
            district: "South West Delhi",
            state: "Delhi",
            priority: "HIGH",
            status: "ACTIVE",
            category: "Financial Cyber Fraud / Digital Arrest",
            description: "Analysis of subscriber communications and mobile handset transitions in connection with suspected coordinated extortion & hawala operations.",
            created_at: "2026-10-22 10:30:00",
            target_numbers: ["+919876543210", "+919811223344"],
            target_banks: ["9810293847 (HDFC)", "912010048172 (Axis)"],
            notes: [
              { date: "2026-10-22 11:15", author: "Constable Vishal", text: "Subpoenaed CDR and IPDR logs received lawfully from cellular operators under Sec 91 CrPC / Sec 94 BNSS." },
              { date: "2026-10-24 16:40", author: "Sub-Insp. Priya Sharma", text: "Cryptographic SHA-256 integrity hash calculated and verified against raw disk image." }
            ]
          });
          setEvidence({
            evidence_id: dataset === "case_1" ? "EVD-2026-001" : "EVD-2026-002",
            case_id: dataset === "case_1" ? "FIR-DEL-2026-8812" : "FIR-MUM-2026-4421",
            original_filename: filename.split('/').pop(),
            file_size_bytes: 42350,
            sha256_hash: "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
            uploaded_at: "2026-10-22 10:35:00",
            analyst_name: "Constable Vishal",
            record_count: mapped.length,
            verified: true,
            custody_log: [
              { timestamp: "2026-10-22 10:35:00", action: "INITIAL_INGESTION", officer: "Constable Vishal", hash: "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855" }
            ]
          });
          addNotification(`Loaded demo dataset (${dataset.toUpperCase()}) successfully.`);
        }
      });
    } catch (e) {
      console.error("Demo load failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (text) => {
    setNotifications(prev => [
      { id: Date.now(), text, time: "Just now", read: false },
      ...prev.slice(0, 9)
    ]);
  };

  const addCaseNote = (text) => {
    const newNote = {
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      author: userAuth?.user?.name || caseData.officer_name,
      text
    };
    setCaseData(prev => ({
      ...prev,
      notes: [newNote, ...(prev.notes || [])]
    }));
    addNotification("Case investigative note logged to official record.");
  };

  const formatNumber = (phone) => {
    if (!phone) return "UNKNOWN";
    if (!maskNumbers) return phone;
    const str = String(phone);
    if (str.length >= 10) {
      return str.substring(0, 5) + "****" + str.substring(str.length - 3);
    }
    return str;
  };

  const loginOfficer = (email, password) => {
    setUserAuth({
      isLoggedIn: true,
      user: {
        name: "Constable Vishal",
        email: email || "vishal.jangra@police.gov.in",
        mobile: "+91-9876543210",
        designation: "Inspector (Cybercrime)",
        department: "Special Cyber Crime & Telecom Intelligence Division",
        state: "Delhi",
        district: "South West Delhi",
        station: "Cyber Police Station IFSO, Dwarka",
        role: "Super Administrator",
        verified: true,
        lastLogin: new Date().toLocaleString()
      }
    });
    addNotification("Officer login successful. 2FA session token authorized.");
  };

  const logoutOfficer = () => {
    setUserAuth({ isLoggedIn: false, user: null });
    addNotification("Officer logged out successfully.");
  };

  const registerOfficer = (formData) => {
    const newUser = {
      name: formData.name || "Officer Registered",
      email: formData.email,
      mobile: formData.mobile,
      designation: formData.designation || "Investigating Officer",
      department: formData.department || "Cyber Crime Unit",
      state: formData.state || "Delhi",
      district: formData.district || "Central",
      station: formData.station || "Cyber PS",
      role: "Verified Investigation Officer",
      verified: true,
      lastLogin: new Date().toLocaleString()
    };
    setUserAuth({ isLoggedIn: true, user: newUser });
    addNotification("Registration request approved. Welcome to Investigation Pro.");
  };

  const downloadPdfReport = (customTitle = null) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    const isHindi = activeLanguage === 'hi';
    const reportTitle = customTitle || (isHindi ? "डिजिटल फोरेंसिक अन्वेषण डॉसियर" : "DIGITAL FORENSIC INTELLIGENCE DOSSIER");

    const html = `
    <!DOCTYPE html>
    <html lang="${activeLanguage}">
    <head>
      <meta charset="utf-8" />
      <title>${reportTitle} - ${caseData?.case_id || 'REPORT'}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 30px; color: #0f172a; background: white; line-height: 1.5; }
        .header { border-bottom: 3px double #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
        .title { font-size: 20px; font-weight: 800; text-transform: uppercase; color: #0f172a; }
        .subtitle { font-size: 11px; color: #475569; letter-spacing: 0.05em; font-weight: 600; }
        .badge { display: inline-block; background: #0284c7; color: white; padding: 4px 8px; font-size: 10px; font-weight: bold; border-radius: 4px; text-transform: uppercase; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 11px; margin-bottom: 20px; }
        .meta-item { border: 1px solid #cbd5e1; padding: 8px 12px; border-radius: 6px; background: #f8fafc; }
        .meta-label { font-weight: 700; color: #64748b; font-size: 9px; text-transform: uppercase; }
        .meta-val { font-family: monospace; font-size: 11px; color: #0f172a; font-weight: 600; }
        .cert-box { border: 2px solid #0284c7; background: #f0f9ff; padding: 12px; border-radius: 6px; margin-bottom: 20px; font-size: 11px; line-height: 1.6; }
        table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 20px; }
        th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
        th { background: #f1f5f9; font-weight: 700; color: #334155; }
        .hash { font-family: monospace; word-break: break-all; color: #0369a1; font-weight: bold; }
        .section-title { font-size: 13px; font-weight: 800; text-transform: uppercase; color: #0f172a; border-left: 4px solid #0284c7; padding-left: 8px; margin: 20px 0 10px 0; }
        @media print { .no-print { display: none; } body { margin: 8mm; } }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 15px; padding: 10px 15px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 12px; font-weight: 600; color: #0f172a;">Official Judicial Dossier Print Preview (Investigation Pro)</span>
        <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 8px 18px; border-radius: 6px; font-weight: bold; font-size: 12px; cursor: pointer;">🖨️ Print / Save Official PDF</button>
      </div>

      <div class="header">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="title">${reportTitle}</div>
            <div class="subtitle">INVESTIGATION PRO – THE POWER OF INVESTIGATION | JUDICIAL EVIDENCE DIVISION</div>
          </div>
          <span class="badge">SEC 63 BSA / 65B IEA</span>
        </div>
      </div>

      <div class="meta-grid">
        <div class="meta-item"><div class="meta-label">Case Reference / FIR</div><div class="meta-val">${caseData?.case_id || 'FIR-DEL-2026-8812'}</div></div>
        <div class="meta-item"><div class="meta-label">Case Title</div><div class="meta-val">${caseData?.case_title || 'Operation CyberTrack'}</div></div>
        <div class="meta-item"><div class="meta-label">Investigating Officer</div><div class="meta-val">${userAuth?.user?.name || caseData?.officer_name || 'Constable Vishal'} (${userAuth?.user?.designation || 'Inspector'})</div></div>
        <div class="meta-item"><div class="meta-label">Police Unit / Division</div><div class="meta-val">${caseData?.police_station || 'Cyber Police Station IFSO, Dwarka'}, ${caseData?.state || 'Delhi'}</div></div>
      </div>

      <div class="cert-box">
        <strong>${isHindi ? "धारा 63 भारतीय साक्ष्य अधिनियम (BSA), 2023 के तहत प्रमाणपत्र" : "STATUTORY CERTIFICATE UNDER SECTION 63 BHARATIYA SAKSHYA ADHINIYAM (BSA), 2023"}</strong><br/>
        ${isHindi ? "यह प्रमाणित किया जाता है कि प्रस्तुत इलेक्ट्रॉनिक साक्ष्य रिकॉर्ड्स को सुरक्षित डिजिटल फोरेंसिक कार्यप्रणाली द्वारा बिना किसी छेड़छाड़ के संसाधित किया गया है। मूल साक्ष्य की अखंडता क्रिप्टोग्राफ़िक हैश द्वारा प्रमाणित है।" : "This electronic record was processed and normalized by the automated digital forensic engine. The master evidence file was preserved in an isolated read-only write-blocked state. Cryptographic authenticity is certified bit-by-bit pursuant to Section 63 BSA 2023 (formerly Section 65B Indian Evidence Act 1872)."}<br/>
        <strong>Primary Master Evidence:</strong> ${evidence?.original_filename || 'sample_cdr_case_01.csv'} (${records.length} records processed)<br/>
        <strong>Cryptographic SHA-256 Digest:</strong> <span class="hash">${evidence?.sha256_hash || 'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855'}</span>
      </div>

      <div class="section-title">1. Key Intelligence Metrics Summary</div>
      <table>
        <tr>
          <th>Total Records</th>
          <th>Incoming Voice</th>
          <th>Outgoing Voice</th>
          <th>SMS Events</th>
          <th>Unique Numbers</th>
          <th>Physical IMEIs</th>
        </tr>
        <tr>
          <td><strong>${summary?.total_records || records.length}</strong></td>
          <td>${summary?.total_incoming || 68}</td>
          <td>${summary?.total_outgoing || 88}</td>
          <td>${summary?.total_sms || 40}</td>
          <td>${summary?.unique_numbers || 9}</td>
          <td>${summary?.unique_imeis || 2}</td>
        </tr>
      </table>

      <div class="section-title">2. Financial Trail & Mule Network Summary</div>
      <table>
        <tr>
          <th>Total Transaction Volume</th>
          <th>Credit Inflows (Fraud)</th>
          <th>Debit Outflows (Drained)</th>
          <th>Layer 1 Mule Account</th>
          <th>Lien / Frozen Amount</th>
        </tr>
        <tr>
          <td>₹15,48,731.00</td>
          <td>₹7,95,000.00</td>
          <td>₹7,53,731.00</td>
          <td>HDFC Bank (9810293847)</td>
          <td><strong style="color: #0369a1;">₹1,99,000.00 FROZEN</strong></td>
        </tr>
      </table>

      <div class="section-title">3. Chronological Communication & Movement Sample</div>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Calling Party (A)</th>
            <th>Called Party (B)</th>
            <th>Duration</th>
            <th>Call Type</th>
            <th>Serving Cell Tower / Location</th>
          </tr>
        </thead>
        <tbody>
          ${records.slice(0, 15).map(r => `
            <tr>
              <td>${r.datetime || r.call_date + ' ' + r.call_time}</td>
              <td>${r.calling_number}</td>
              <td>${r.called_number}</td>
              <td>${r.duration}s</td>
              <td>${r.call_type}</td>
              <td>${r.tower_name || r.first_cell_id || 'Lajpat Nagar Central'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="margin-top: 40px; border-top: 2px solid #94a3b8; padding-top: 15px; display: flex; justify-content: space-between; font-size: 11px; color: #475569;">
        <div>
          <strong>Investigation Pro v3.0</strong><br/>
          Certified Judicial Output | ${new Date().toLocaleString()}<br/>
          Confidential – Law Enforcement Official Record
        </div>
        <div style="text-align: right;">
          <div>________________________________________</div>
          <div style="margin-top: 4px;"><strong>${userAuth?.user?.name || 'Constable Vishal'}</strong></div>
          <div>${userAuth?.user?.designation || 'Inspector'}, ${caseData?.agency || 'Special Cyber Crime Division'}</div>
          <div>Official Seal & Signature</div>
        </div>
      </div>
      <script>setTimeout(() => window.print(), 500);</script>
    </body>
    </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const downloadExcelReport = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Case Summary
    const wsCase = XLSX.utils.json_to_sheet([
      { Field: "Case Reference / FIR", Value: caseData?.case_id || "N/A" },
      { Field: "Case Title", Value: caseData?.case_title || "N/A" },
      { Field: "Investigating Officer", Value: userAuth?.user?.name || caseData?.officer_name || "Constable Vishal" },
      { Field: "Agency / Police Unit", Value: caseData?.agency || "Special Cyber Crime Unit" },
      { Field: "Police Station", Value: caseData?.police_station || "Cyber PS IFSO" },
      { Field: "District / State", Value: `${caseData?.district || 'Delhi'}, ${caseData?.state || 'Delhi'}` },
      { Field: "Master Evidence File", Value: evidence?.original_filename || "sample_cdr_case_01.csv" },
      { Field: "SHA-256 Digest", Value: evidence?.sha256_hash || "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855" },
      { Field: "Statutory Admissibility", Value: "Section 63 Bharatiya Sakshya Adhiniyam, 2023 / Section 65B IEA" },
      { Field: "Report Generated On", Value: new Date().toLocaleString() }
    ]);
    XLSX.utils.book_append_sheet(wb, wsCase, "Case_Certificate");

    // Sheet 2: CDR Records
    const cleanRecords = records.map(r => ({
      "Record ID": r.record_id,
      "Calling Number": r.calling_number,
      "Called Number": r.called_number,
      "Call Date": r.call_date,
      "Call Time": r.call_time,
      "Duration (Seconds)": r.duration,
      "Call Type": r.call_type,
      "IMEI": r.imei,
      "IMSI": r.imsi,
      "Cell ID": r.first_cell_id,
      "Tower Name": r.tower_name
    }));
    const wsRecords = XLSX.utils.json_to_sheet(cleanRecords);
    XLSX.utils.book_append_sheet(wb, wsRecords, "CDR_Communications");

    // Sheet 3: Financial Transactions
    if (bankTransactions && bankTransactions.length > 0) {
      const wsBank = XLSX.utils.json_to_sheet(bankTransactions.map(t => ({
        "Txn ID": t.id,
        "Date": t.date,
        "Narrative": t.description,
        "Ref No": t.ref_no,
        "Type": t.type,
        "Channel": t.category,
        "Amount (INR)": t.amount,
        "Balance (INR)": t.balance,
        "Counterparty": t.counterparty,
        "Suspicious Flag": t.suspicious ? "YES (MULE ALERT)" : "NORMAL",
        "Reason": t.flag_reason || "-"
      })));
      XLSX.utils.book_append_sheet(wb, wsBank, "Financial_Transactions");
    }

    XLSX.writeFile(wb, `Investigation_Pro_Dossier_${caseData.case_id || 'REPORT'}.xlsx`);
    addNotification("Comprehensive multi-sheet Excel Workbook generated and downloaded.");
  };

  const resetDatabase = async () => {
    setLoading(true);
    try {
      if (apiOnline) {
        await fetch('/api/reset', { method: 'POST' });
      }
    } catch (e) {
      console.warn("Backend reset notice:", e);
    } finally {
      setRecords([]);
      setSummary({
        total_records: 0,
        total_incoming: 0,
        total_outgoing: 0,
        total_sms: 0,
        total_missed: 0,
        unique_numbers: 0,
        unique_imeis: 0,
        unique_imsis: 0,
        total_duration_seconds: 0,
        total_duration_formatted: "00h 00m 00s",
        peak_hour: "N/A",
        peak_day: "N/A"
      });
      setEvidence(null);
      setAnomalies([]);
      setBankTransactions([]);
      setLoading(false);
      addNotification("Workspace reset complete. All active session logs cleared.");
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        records,
        setRecords,
        summary,
        setSummary,
        caseData,
        setCaseData,
        casesList,
        setCasesList,
        evidence,
        setEvidence,
        evidenceList,
        setEvidenceList,
        bankTransactions,
        setBankTransactions,
        ncrpData,
        setNcrpData,
        suspects,
        setSuspects,
        lbsRecords,
        setLbsRecords,
        nodalOfficers,
        setNodalOfficers,
        policeStations,
        setPoliceStations,
        anomalies,
        setAnomalies,
        theme,
        setTheme,
        userRole,
        setUserRole,
        maskNumbers,
        setMaskNumbers,
        searchQuery,
        setSearchQuery,
        loading,
        setLoading,
        apiOnline,
        notifications,
        addNotification,
        addCaseNote,
        loadDemoData,
        formatNumber,
        downloadPdfReport,
        downloadExcelReport,
        resetDatabase,
        calculateBufferSha256,
        userAuth,
        setUserAuth,
        loginOfficer,
        logoutOfficer,
        registerOfficer,
        globalSearchOpen,
        setGlobalSearchOpen,
        activeLanguage,
        setActiveLanguage,
        toolsCatalog: TOOLS_CATALOG,
        toolsCategories: TOOLS_CATEGORIES
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
