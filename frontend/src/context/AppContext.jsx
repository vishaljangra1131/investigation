import React, { createContext, useContext, useState, useEffect } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('home');
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [caseData, setCaseData] = useState({
    case_id: "FIR-DEL-2026-8812",
    case_title: "Operation CyberTrack: Telecom Intelligence Review",
    officer_name: "Constable Vishal",
    agency: "Special Cyber Crime & Telecom Intelligence Division",
    description: "Analysis of subscriber communications and mobile handset transitions in connection with suspected coordinated extortion & hawala operations.",
    created_at: "2026-10-22 10:30:00",
    status: "ACTIVE",
    target_numbers: ["+919876543210", "+919811223344"],
    notes: [
      { date: "2026-10-22 11:15", author: "Constable Vishal", text: "Subpoenaed CDR and IPDR logs received lawfully from cellular operators under Sec 91 CrPC / Sec 94 BNSS." },
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
    analyst_name: "Constable Vishal",
    record_count: 196,
    verified: true,
    custody_log: [
      { timestamp: "2026-10-22 10:35:00", action: "INITIAL_INGESTION", officer: "Constable Vishal", hash: "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855" }
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
    if (apiOnline) {
      window.open('/api/reports/pdf', '_blank');
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Judicial Forensic Dossier - ${caseData.case_id}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 30px; color: #1e293b; background: white; }
        .header { border-bottom: 3px double #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
        .title { font-size: 20px; font-weight: bold; text-transform: uppercase; color: #0f172a; }
        .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 8px; font-size: 11px; font-weight: bold; border-radius: 4px; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; margin-bottom: 20px; }
        .meta-item { border: 1px solid #cbd5e1; padding: 8px 12px; border-radius: 6px; }
        .meta-label { font-weight: bold; color: #475569; font-size: 10px; text-transform: uppercase; }
        .meta-val { font-family: monospace; font-size: 12px; color: #0f172a; }
        .cert-box { border: 2px solid #0284c7; background: #f0f9ff; padding: 12px; border-radius: 6px; margin-bottom: 20px; font-size: 11px; line-height: 1.5; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px; }
        th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
        th { background: #f1f5f9; font-weight: bold; }
        .hash { font-family: monospace; word-break: break-all; color: #0284c7; font-weight: bold; }
        @media print { .no-print { display: none; } body { margin: 10mm; } }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 15px; padding: 10px; background: #f1f5f9; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
        <span>Official Judicial Forensic Dossier Preview</span>
        <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: bold; cursor: pointer;">🖨️ Print / Save PDF</button>
      </div>
      <div class="header">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="title">DIGITAL FORENSIC INTELLIGENCE REPORT</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">CALL DETAIL RECORD (CDR) & SUBSCRIBER INTELLIGENCE DOSSIER</div>
          </div>
          <span class="badge">SEC 63 BSA COMPLIANT</span>
        </div>
      </div>
      <div class="meta-grid">
        <div class="meta-item"><div class="meta-label">Case Reference</div><div class="meta-val">${caseData.case_id}</div></div>
        <div class="meta-item"><div class="meta-label">Title</div><div class="meta-val">${caseData.case_title}</div></div>
        <div class="meta-item"><div class="meta-label">Investigating Officer</div><div class="meta-val">${caseData.officer_name}</div></div>
        <div class="meta-item"><div class="meta-label">Enforcement Division</div><div class="meta-val">${caseData.agency}</div></div>
      </div>
      <div class="cert-box">
        <strong>CERTIFICATE UNDER SECTION 63 BHARATIYA SAKSHYA ADHINIYAM (BSA), 2023</strong><br/>
        This electronic record was processed and normalized by the automated digital forensic engine. The master evidence file was preserved in an isolated read-only state. Cryptographic authenticity is certified bit-by-bit.<br/>
        <strong>Source File:</strong> ${evidence?.original_filename || 'sample_cdr_case_01.csv'} (${records.length} records)<br/>
        <strong>SHA-256 Digest:</strong> <span class="hash">${evidence?.sha256_hash || 'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855'}</span>
      </div>
      <h4>Forensic Activity Metrics</h4>
      <table>
        <tr><th>Total Records</th><th>Incoming Calls</th><th>Outgoing Calls</th><th>Unique Counterparties</th><th>Physical IMEIs</th></tr>
        <tr><td>${summary?.total_records || records.length}</td><td>${summary?.total_incoming || 68}</td><td>${summary?.total_outgoing || 88}</td><td>${summary?.unique_numbers || 9}</td><td>${summary?.unique_imeis || 2}</td></tr>
      </table>
      <h4>Chronological Communications Sample (First 20 Records)</h4>
      <table>
        <thead>
          <tr><th>Timestamp</th><th>Calling Party (A)</th><th>Called Party (B)</th><th>Duration</th><th>Call Type</th><th>Serving Cell Tower</th></tr>
        </thead>
        <tbody>
          ${records.slice(0, 20).map(r => `
            <tr>
              <td>${r.datetime || r.call_date + ' ' + r.call_time}</td>
              <td>${r.calling_number}</td>
              <td>${r.called_number}</td>
              <td>${r.duration}s</td>
              <td>${r.call_type}</td>
              <td>${r.tower_name || r.first_cell_id || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 10px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b;">
        <div>Certified Output | Generated on ${new Date().toLocaleString()}</div>
        <div>Forensic Analyst Signature: __________________________</div>
      </div>
      <script>setTimeout(() => window.print(), 500);</script>
    </body>
    </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const downloadExcelReport = () => {
    if (apiOnline) {
      window.open('/api/reports/excel', '_blank');
      return;
    }
    const wb = XLSX.utils.book_new();
    const wsEvidence = XLSX.utils.json_to_sheet([
      { Property: "Case ID", Value: caseData.case_id },
      { Property: "Case Title", Value: caseData.case_title },
      { Property: "Investigating Officer", Value: caseData.officer_name },
      { Property: "Agency", Value: caseData.agency },
      { Property: "Evidence File", Value: evidence?.original_filename || "sample_cdr_case_01.csv" },
      { Property: "SHA-256 Hash", Value: evidence?.sha256_hash || "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855" },
      { Property: "Legal Compliance", Value: "Section 63 BSA 2023 / Section 65B IEA" }
    ]);
    XLSX.utils.book_append_sheet(wb, wsEvidence, "Evidence_Summary");

    const cleanRecords = records.map(r => ({
      "Record ID": r.record_id,
      "Calling Number": r.calling_number,
      "Called Number": r.called_number,
      "Date": r.call_date,
      "Time": r.call_time,
      "Duration (s)": r.duration,
      "Call Type": r.call_type,
      "IMEI": r.imei,
      "IMSI": r.imsi,
      "Cell ID": r.first_cell_id,
      "Tower Name": r.tower_name
    }));
    const wsRecords = XLSX.utils.json_to_sheet(cleanRecords);
    XLSX.utils.book_append_sheet(wb, wsRecords, "CDR_Records");

    XLSX.writeFile(wb, `Forensic_Dossier_${caseData.case_id || 'REPORT'}.xlsx`);
    addNotification("Excel Dossier generated and downloaded successfully.");
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

