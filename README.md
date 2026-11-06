# CDR ANALYSIS PRO
### Advanced Telecom Intelligence & Digital Forensic Analysis Platform

[![Platform Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com)
[![Compliance](https://img.shields.io/badge/compliance-BSA%20Sec%2063%20%7C%20IEA%20Sec%2065B-emerald.svg)](https://github.com)
[![License](https://img.shields.io/badge/license-Law%20Enforcement%20%26%20Research-cyan.svg)](https://github.com)
[![Python](https://img.shields.io/badge/backend-FastAPI%20%7C%20Pandas%20%7C%20ReportLab-blue.svg)](https://github.com)
[![React](https://img.shields.io/badge/frontend-React%20%7C%20Tailwind%20v4%20%7C%20Leaflet-indigo.svg)](https://github.com)

**CDR ANALYSIS PRO** is a complete, modern, professional, responsive, and fully functional web application designed for digital forensic investigators, cybercrime analysts, police personnel, law enforcement agencies, telecom engineers, and cybersecurity researchers.

The platform bridges the gap between raw cellular switch records and court-admissible forensic intelligence. It enables rapid ingestion, cryptographic hashing, schema normalization, multi-target link analysis, handset switching detection, diurnal time heatmaps, chronological serving cell reconstruction, and one-click PDF/Excel judicial dossier generation.

---

## 🌟 Key Functional Capabilities

### 1. Unified Forensic Ingestion & Chain of Custody
- **Multi-Format Ingestion**: Supports CSV, Microsoft Excel (`.XLS`, `.XLSX`), JSON, and delimited TXT files.
- **Cryptographic SHA-256 Hashing**: Automatic hashing upon upload to guarantee bit-for-bit authenticity pursuant to Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (BSA).
- **Intelligent Column Auto-Detection**: Standardizes diverse carrier column names (`msisdn_a`, `calling_party`, `calling_no`, etc.) into a normalized internal schema.
- **Preservation of Original Master Evidence**: Cleaning and deduplication operate exclusively on a dedicated working copy while leaving the master file untouched.

### 2. Comprehensive Telecom Analytical Suite
- **Main Forensic Dashboard**: Live KPI cards (Total records, incoming/outgoing calls, SMS, missed calls, unique MSISDNs, unique IMEIs, unique IMSIs, airtime, and peak hours).
- **Call Traffic Analysis**: Incoming/outgoing breakdown, duration histograms, longest substantive dialogues, and repeated brief signal pings (`≤ 15s`).
- **Number Deep Profile**: 360-degree subscriber profile: counterparty ranking, inbound-to-outbound ratio, and device timeline.
- **24-Hour Diurnal Heatmap Matrix**: 7-day by 24-hour intensity grid isolating nocturnal communications (`23:00` to `05:00`).
- **IMEI & Handset Switching Engine**: Decoding GSMA Type Allocation Codes (TAC) and detecting suspect burner phone swaps across single phone numbers.
- **IMSI & SIM Profile**: ITU-T E.212 structure analysis (MCC, MNC, MSIN) and SIM swap detection.
- **Cell ID & Tower Analysis**: Serving cell antenna sectors, handovers, and physical base station usage.
- **Geolocation & Chronological Trajectory**: Interactive Leaflet maps with custom tower markers, sector footprint circles, and directional transit polylines.
- **Contact Ranking & Network Graphs**: Interactive SVG/Canvas network diagrams visualizing node centrality, reciprocal communication, and network degree.
- **Multi-Target Link Analysis**: Cross-referencing two target subscribers to identify mutual accomplices, direct calls, and shared cell towers.
- **Timeline Reconstruction**: Minute-by-minute sequential log of all voice, SMS, device swap, and cell transit events.
- **Rule-Based Anomaly Detection**: Heuristics flagging communication bursts, nocturnal spikes, burner swaps, repeated pings, and rapid transit velocity (`> 120 km/h`).
- **Multiple CDR Cross-Comparison**: Side-by-side comparison of multiple independent CDR files.
- **IPDR Analysis**: Packet-switched mobile data session inspection (private/public IPs, transport ports, megabytes, and encrypted application protocols).

### 3. Knowledge, Reference & Reporting
- **All 32 CDR Parameters Reference**: Interactive glossary detailing definition, purpose, example, forensic importance, and analytical use for all 32 standard CDR fields.
- **Practical Case Studies**: 4 realistic synthetic investigation scenarios (Midnight Extortion, Kidnapping Route Reconstruction, Hawala Link Network, Tower Dump Anomaly).
- **Learning Center**: Comprehensive guides on GSM/LTE/5G architecture, BTS/BSC/MSC/HLR/VLR, investigation workflows, and courtroom pitfalls.
- **Court-Ready PDF Dossier & Excel Export**: Multi-sheet analytical workbooks and certified PDF reports complete with Section 63 BSA / Section 65B IEA certificates.

---

## 🏗️ Architecture & Technology Stack

```
CDR-ANALYSIS-PRO/
├── backend/
│   ├── main.py                  # FastAPI REST API & Static App Server
│   ├── generate_demo_data.py    # Synthetic realistic CDR/IPDR generator
│   ├── models/
│   │   └── cdr.py               # Pydantic data schemas
│   ├── services/
│   │   ├── cdr_service.py       # Smart file parser, SHA-256 & cleaning
│   │   ├── analytics.py         # Vectorized forensics analytics engine
│   │   └── reporting.py         # ReportLab PDF & OpenPyXL Excel generator
│   ├── data/                    # Synthetic demo datasets (Case 1, Case 2, IPDR, Towers)
│   └── tests/
│       └── test_backend.py      # Automated unit tests
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main router & layout controller
│   │   ├── index.css            # Tailwind CSS v4 & custom cyber styling
│   │   ├── context/
│   │   │   └── AppContext.jsx   # Global reactive state management
│   │   ├── components/
│   │   │   ├── Sidebar.jsx      # Collapsible 30-item categorized navigation
│   │   │   ├── Navbar.jsx       # Global search, privacy toggle & notifications
│   │   │   ├── Footer.jsx       # Statutory references & compliance notices
│   │   │   ├── StatCard.jsx     # Reusable cyber KPI card
│   │   │   ├── NetworkGraph.jsx # Interactive communication link graph
│   │   │   └── MapComponent.jsx # Leaflet OpenStreetMap trajectory visualizer
│   │   ├── views/               # 26 specialized views
│   │   └── data/
│   │       └── telecomData.js   # 32 CDR fields, case studies & curriculum
│   └── package.json
└── README.md
```

---

## 🚀 Installation & Execution Guide

### Prerequisites
- **Python 3.10+** (Python 3.11 recommended)
- **Node.js 18+** & **npm 9+**

### Step 1: Install Dependencies
Open your terminal in the project directory:

```bash
# 1. Install Backend Dependencies (FastAPI, Pandas, ReportLab, OpenPyXL, Uvicorn)
pip install fastapi uvicorn pandas openpyxl reportlab pypdf networkx

# 2. Install Frontend Dependencies
cd frontend
npm install
npm run build
cd ..
```

### Step 2: Generate Demo Datasets
Generate the pre-packaged synthetic realistic datasets (196 records for Suspect A, 143 records for Suspect B, 80 IPDR sessions, 14 Delhi NCR cell towers):

```bash
python backend/generate_demo_data.py
```

### Step 3: Run the Complete Application
You can run the full-stack application with a single command:

```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Open your web browser and navigate to:
👉 **`http://localhost:8000`**

*(Optional Development Mode: You can also run `cd frontend && npm run dev` to launch the Vite live-reloading dev server at `http://localhost:5173`, which automatically proxies `/api` requests to the backend).*

---

## 🧪 Running Automated Tests

Run the automated test suite verifying parser auto-detection, SHA-256 calculation, anomaly flags, and report generation:

```bash
python backend/tests/test_backend.py
```

Expected output:
```
.......
----------------------------------------------------------------------
Ran 7 tests in 0.497s

OK
```

---

## ⚖️ Statutory & Evidentiary Compliance (India)

The platform has been specifically architected in alignment with the Indian digital evidence legal framework:
- **Bharatiya Sakshya Adhiniyam, 2023 (BSA) - Section 63**: Incorporates automated certificate generation documenting computer system integrity, lawful ingestion, and cryptographic SHA-256 hash anchoring (corresponding to former Section 65B of the Indian Evidence Act, 1872).
- **Information Technology Act, 2000 (Sections 43, 66, 69)**: Ensures all analytical operations respect statutory privacy and authorized requisition mandates.
- **Telecommunications Act, 2023**: Standards for telecommunications metadata interpretation.

> [!CAUTION]
> **Forensic Distinction Warning**: Cell antenna coordinates represent the physical installation site of the serving base station and its approximate radio coverage sector. Historical CDR records reflect radio cell handovers and do **NOT** constitute exact GPS positioning of individuals. All anomaly flags represent investigative leads and do not constitute direct judicial proof of guilt without independent material corroboration.

---

## 🛡️ License & Ethical Use Policy
Developed strictly for authorized law enforcement, digital forensics education, and academic cybersecurity research. Unauthorized interception or unauthorized database tampering is strictly prohibited under applicable telecommunications and cybersecurity statutes.

