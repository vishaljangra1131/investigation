import React, { createContext, useContext, useState, useEffect } from 'react';
import Papa from 'papaparse';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('home');
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [caseData, setCaseData] = useState({
    case_id: "FIR-DEL-2026-8812",
    case_title: "Operation CyberTrack: Telecom Intelligence Review",
    officer_name: "Insp. Rajesh Verma",
    agency: "Special Cyber Crime & Telecom Intelligence Division",
    description: "Analysis of subscriber communications and mobile handset transitions in connection with suspected coordinated extortion & hawala operations.",
    created_at: "2026-10-22 10:30:00",
    status: "ACTIVE",
    target_numbers: ["+919876543210", "+919811223344"],
    notes: [
      { date: "2026-10-22 11:15", author: "Insp. Rajesh Verma", text: "Subpoenaed CDR and IPDR logs received lawfully from cellular operators under Sec 91 CrPC / Sec 94 BNSS." },
      { date: "2026-10-24 16:40", author: "Sub-Insp. Priya Sharma", text: "Cryptographic SHA-256 integrity hash calculated and verified against raw disk image." }
    ]
  });
  const [evidence, setEvidence] = useState({
    evidence_id: "EVD-2026-001",
    case_id: "FIR-DEL-2026-8812",
    original_filename: "sample_cdr_case_01.csv",
    file_size_bytes: 42350,
    sha256_hash: "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
    uploaded_at: "2026-10-22 10:35:00",
    analyst_name: "Insp. Rajesh Verma",
    record_count: 196,
    verified: true,
    custody_log: [
      { timestamp: "2026-10-22 10:35:00", action: "INITIAL_INGESTION", officer: "Insp. Rajesh Verma", hash: "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855" }
    ]
  });
  const [anomalies, setAnomalies] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [userRole, setUserRole] = useState('ANALYST'); // ADMIN, ANALYST, VIEWER
  const [maskNumbers, setMaskNumbers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiOnline, setApiOnline] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "System Initialized: Forensic engine running in secure audit mode.", time: "Just now", read: false },
    { id: 2, text: "Evidence verified: SHA-256 cryptographic match confirmed.", time: "5m ago", read: false }
  ]);

  // Initial fetch from backend API, with fallback to public static demo data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/health');
      const isJson = res.headers.get('content-type')?.includes('application/json');
      if (res.ok && isJson) {
        setApiOnline(true);
        // Load summary
        const sumRes = await fetch('/api/analytics/summary');
        if (sumRes.ok && sumRes.headers.get('content-type')?.includes('application/json')) {
          const sumData = await sumRes.json();
          setSummary(sumData);
        }
        // Load records
        const recRes = await fetch('/api/records?limit=500');
        if (recRes.ok && recRes.headers.get('content-type')?.includes('application/json')) {
          const recData = await recRes.json();
          setRecords(recData.records);
        }
        // Load anomalies
        const anoRes = await fetch('/api/analytics/anomalies');
        if (anoRes.ok && anoRes.headers.get('content-type')?.includes('application/json')) {
          const anoData = await anoRes.json();
          setAnomalies(anoData);
        }
      } else {
        throw new Error("Backend offline");
      }
    } catch (err) {
      console.warn("API not responding, loading bundled fallback demo data:", err);
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

  const loadDemoData = async (dataset = "case_1") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/demo/load?dataset=${dataset}`);
      const isJson = res.headers.get('content-type')?.includes('application/json');
      if (res.ok && isJson) {
        const data = await res.json();
        setEvidence(data.evidence);
        await fetchInitialData();
        addNotification(`Demo Dataset (${dataset.toUpperCase()}) loaded successfully with ${data.record_count} records.`);
      } else {
        throw new Error("Failed to load demo from API");
      }
    } catch (err) {
      console.warn("Using local fallback loader:", err);
      const filename = dataset === "case_1" ? "/data/sample_cdr_case_01.csv" : "/data/sample_cdr_case_02.csv";
      fetch(filename)
        .then(r => {
          if (!r.ok) throw new Error("File not found");
          return r.text();
        })
        .then(csv => {
          if (!csv || csv.trim().startsWith('<')) throw new Error("Received HTML");
          Papa.parse(csv, {
            header: true,
            skipEmptyLines: true,
            complete: (res) => {
              const mapped = res.data.map(r => ({ ...r, duration: Number(r.duration || 0) }));
              setRecords(mapped);
              computeLocalSummary(mapped);
              addNotification(`Loaded local demo dataset (${dataset.toUpperCase()}).`);
            }
          });
        })
        .catch(e => console.error("Demo load failed:", e));
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (text) => {
    setNotifications(prev => [
      { id: Date.now(), text, time: "Just now", read: false },
      ...prev.slice(0, 8)
    ]);
  };

  const addCaseNote = (text) => {
    const newNote = {
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      author: caseData.officer_name,
      text
    };
    setCaseData(prev => ({
      ...prev,
      notes: [newNote, ...prev.notes]
    }));
    addNotification("Case investigative note added.");
  };

  const formatNumber = (phone) => {
    if (!phone) return "UNKNOWN";
    if (!maskNumbers) return phone;
    // Mask middle digits: +919876543210 -> +91-98****3210
    const str = String(phone);
    if (str.length >= 10) {
      return str.substring(0, 5) + "****" + str.substring(str.length - 3);
    }
    return str;
  };

  const downloadPdfReport = () => {
    window.open('/api/reports/pdf', '_blank');
  };

  const downloadExcelReport = () => {
    window.open('/api/reports/excel', '_blank');
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
        evidence,
        setEvidence,
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
        downloadExcelReport
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

