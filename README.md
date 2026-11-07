# INVESTIGATION PRO – THE POWER OF INVESTIGATION
### Complete Digital Investigation & Cyber Forensics Platform

[![Platform Version](https://img.shields.io/badge/version-3.2.0-blue.svg)](https://github.com)
[![Compliance](https://img.shields.io/badge/compliance-BSA%20Sec%2063%20%7C%20IEA%20Sec%2065B-emerald.svg)](https://github.com)
[![DPDP Act](https://img.shields.io/badge/statutory-DPDP%20Act%202023%20%7C%20IT%20Act%202000-cyan.svg)](https://github.com)
[![License](https://img.shields.io/badge/license-Law%20Enforcement%20%26%20Research-indigo.svg)](https://github.com)

**Investigation Pro – The Power of Investigation** is a modern, unified, responsive, and court-admissible digital investigation platform inspired by the operational feature coverage of leading investigative systems (such as *investigationcamp.in*). It bridges the operational gaps between raw cellular switch records, multi-layer banking transaction logs, cyber threat intelligence, mobile location tracking, and judicial courtroom dossiers.

---

## 🌟 Key Functional Capabilities

### 1. Priority Investigation Engines
1. **CDR 2.0 Advanced Analysis**: Automated column detection, incoming/outgoing breakdown, diurnal 24-hour calling matrix, nocturnal (23:00 to 05:00) suspicious communications, handset IMEI transitions, common contact detection, and interactive network link graphs.
2. **IPDR Packet Data Analysis**: Packet-switched mobile data sessions, CGNAT public destination IP attribution, transport layer ports (Tor 9001/9050, VoIP SIP 5060, VPN 1194/51820), and protocol classification.
3. **Arthagya – Bank Statement Intelligence**: Automated parsing of PDF/Excel/CSV bank statements, structuring detection (multiple deposits below ₹50,000 threshold), rapid mule credit-to-debit velocity, counterparty money trails, and balance reconciliation.
4. **NCRP Money Trail Graph**: Interactive fund-flow graph connecting Complainants (Victims) → Layer 1 Mule Accounts → Layer 2 Distribution VPAs → Layer 3 Cash Out Sinks, with real-time Section 102 CrPC lien tracking.
5. **IP Intelligence & Threat Profiler**: IPv4 & IPv6 enrichment: GeoIP coordinates, ASN, ISP network operators, Tor exit node detection, commercial VPN proxies, and abuse reputation scoring.
6. **Domain & DNS Intelligence**: WHOIS/RDAP registration dates, typosquatting alerts, DNS records (A, AAAA, MX, NS, TXT), email authentication (SPF, DKIM, DMARC), and SSL/TLS cryptographic certificates.
7. **LBS Movement Mapping**: Sequential cellular serving cell observation mapping, inter-tower transit velocity calculations (>120 km/h anomaly flags), suspect dwell times at crime locations, and co-location verification.
8. **Suspect Intelligence & Vajra Command Center**: Authorized subject dossiers, alias mapping, handset IMEIs, masked Aadhaar/PAN references, linked mule accounts, and 360-degree multi-vector case timeline fusion.
9. **Digital Evidence Locker & Custody Ledger**: Bit-for-bit SHA-256 cryptographic hashing via the browser Web Crypto API, immutable chain of custody logs, write-blocking guarantees, and Section 63 BSA certificates.
10. **Judicial Dossier Generator**: Court-admissible report generation in official PDF, multi-sheet Excel workbooks, CSV, and structured JSON with bilingual English and Hindi (हिन्दी) support.

### 2. Complete 36+ Modular Tools Directory
- **Telecom & Cellular**: CDR 2.0, IPDR, TSP Carrier Lookup, Cell Spyder Azimuth/Footprint, IMEI TAC Resolution, MCC-MNC Directory, MNI Mobile Number Investigation Framework.
- **Financial Crime**: Arthagya Bank Statements, NCRP Money Trail Graph, PhonePe Analyzer, UPI Handle/VPA Resolver, IFSC Directory, ATM Locator, TSDP Screenshot OCR.
- **Cyber & OSINT**: IP Intelligence, Domain Intelligence, Google Takeout Analyzer, MAC OUI Lookup, TRAI Commercial SMS Header (DLT) Decoder.
- **Location & Surveillance**: LBS Movement Mapping, Lat-Long Coordinate Mapper, Sugam Route Planner, FASTag Highway Toll Plaza Sequence, CCTV Clock Drift Offset Calculator.
- **Documentation & Legal**: LEA Statutory Notices (Sec 91/102 CrPC, Sec 94/107 BNSS), CAF Customer Application Form Summarizer, Forensic Hash Generator (SHA-256, SHA-512, MD5), Nodal Officers Directory, Police Station Directory, Aadhaar Verhoeff Checksum Validator, Sampark VCF Contact Manager.
- **Platform & Governance**: FIR Case Management System, iC Apps Desktop Downloads, Officer Community & Networking, Tiered Subscriptions, Administrator Control Panel, and Officer 2FA Login.

---

## 🏗️ Architecture & Technology Stack

```
investigation/
├── build.js                     # Root build orchestrator (installs frontend, runs vite, syncs dist)
├── vercel.json                  # Vercel zero-config single page deployment rewrite
├── package.json                 # Project configuration
├── dist/                        # Production build output
└── frontend/
    ├── package.json             # React 19 + Tailwind v4 + Vite + Leaflet + Lucide
    ├── vite.config.ts           # Vite bundler configuration
    ├── index.html               # Main entry HTML
    ├── public/data/             # Fictional synthetic training datasets
    │   ├── sample_cdr_case_01.csv
    │   ├── sample_cdr_case_02.csv
    │   ├── sample_ipdr_data.json
    │   ├── sample_bank_statement.json
    │   ├── sample_ncrp_trail.json
    │   ├── sample_suspects.json
    │   ├── sample_lbs_movement.json
    │   ├── sample_nodal_officers.json
    │   └── sample_police_stations.json
    └── src/
        ├── context/AppContext.jsx          # Unified state store, Web Crypto SHA-256, and auth
        ├── data/toolsCatalog.js            # 36+ tools catalog and categories
        ├── components/
        │   ├── Navbar.jsx                  # Brand, case badge, Ctrl+K search, privacy mask, 2FA
        │   ├── Sidebar.jsx                 # 9 collapsible navigation groups
        │   ├── GlobalSearchModal.jsx       # Instant tool search modal (Ctrl + K)
        │   ├── MapComponent.jsx            # Leaflet interactive cellular mapping
        │   ├── NetworkGraph.jsx            # Link analysis network diagram
        │   └── Footer.jsx                  # Statutory compliance notices and legal links
        └── views/                          # 30+ dedicated functional views & tools
```

---

## ⚖️ Statutory & Judicial Compliance

1. **Bharatiya Sakshya Adhiniyam, 2023 (BSA)**:
   - Automated generation of electronic certificates pursuant to **Section 63 BSA** (formerly Section 65B Indian Evidence Act, 1872).
   - Immutable SHA-256 cryptographic hashing guarantees bit-for-bit authenticity of master files.
2. **Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)**:
   - Notice templates for requisition of telecom records (**Section 94 BNSS / Section 91 CrPC**).
   - Account freeze orders for proceeds of crime (**Section 107 BNSS / Section 102 CrPC**).
3. **Digital Personal Data Protection Act, 2023 (DPDP)**:
   - Strict Privacy Mask toggle (`+91-98****3210`) protects sensitive subscriber numbers in screen-sharing environments.
   - Synthetic sample datasets clearly identified as fictional training records.

---

## 🚀 Setup & Deployment

### Local Development
```bash
# 1. Install frontend dependencies
cd frontend
npm install

# 2. Run local development server
npm run dev
```

### Production Build
```bash
# Run root build script (installs dependencies, builds Vite client, syncs dist/)
node build.js
```

### Deployment to Vercel
The repository includes a root `vercel.json` and `build.js` configured for immediate deployment to Vercel:
```bash
vercel --prod
```
