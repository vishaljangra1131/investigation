export const TOOLS_CATEGORIES = [
  { id: 'telecom', name: 'Telecom & CDR Investigation', color: 'cyan' },
  { id: 'financial', name: 'Financial Investigation', color: 'emerald' },
  { id: 'cyber', name: 'Internet & Cyber Intelligence', color: 'purple' },
  { id: 'location', name: 'Location & Movement', color: 'amber' },
  { id: 'suspect', name: 'Suspect & Identity Intelligence', color: 'rose' },
  { id: 'legal', name: 'Legal Utilities & Documentation', color: 'blue' },
  { id: 'platform', name: 'Cases, Evidence & Management', color: 'indigo' }
];

export const TOOLS_CATALOG = [
  // Telecom & CDR
  {
    id: 'cdr-2.0',
    viewId: 'cdr-overview',
    title: 'CDR 2.0 Analysis',
    category: 'telecom',
    icon: 'Radio',
    badge: 'Flagship',
    description: 'Comprehensive Call Detail Record analysis: inbound/outbound traffic, nocturnal calling matrix, multi-target cross-comparison, handset IMEI switching, and serving cell towers.',
    tags: ['CDR', 'Telecom', 'Calling Patterns', 'IMEI', 'Towers', 'Cell ID']
  },
  {
    id: 'ipdr-analysis',
    viewId: 'ipdr-analysis',
    title: 'IPDR Analysis',
    category: 'telecom',
    icon: 'Globe',
    badge: 'Popular',
    description: 'Packet-switched mobile data inspection: private/public IP sessions, transport ports, megabytes transferred, protocol recognition (Tor, VoIP, VPN), and subscriber correlation.',
    tags: ['IPDR', 'Internet Protocol', 'Ports', 'Data Volume', 'Protocols']
  },
  {
    id: 'tsp-lookup',
    viewId: 'tsp-lookup',
    title: 'TSP Lookup',
    category: 'telecom',
    icon: 'PhoneCall',
    badge: 'Instant',
    description: 'Telecom Service Provider and circle identification for Indian mobile numbers with MNP portability and LSA circle mapping.',
    tags: ['Carrier', 'Airtel', 'Jio', 'Vi', 'BSNL', 'Circle']
  },
  {
    id: 'cell-spyder',
    viewId: 'cell-spyder',
    title: 'Cell Spyder',
    category: 'telecom',
    icon: 'TowerControl',
    badge: 'Forensic',
    description: 'Cell ID decoding, LAC/TAC resolution, sector azimuth visualizer, beam-width angle calculation, and interactive antenna footprint plotting.',
    tags: ['Cell ID', 'LAC', 'TAC', 'Azimuth', 'Sector', 'BTS']
  },
  {
    id: 'imei-lookup',
    viewId: 'imei-lookup',
    title: 'IMEI & TAC Lookup',
    category: 'telecom',
    icon: 'Smartphone',
    badge: 'Verified',
    description: 'GSMA Type Allocation Code (TAC) decoder, device manufacturer, smartphone model identification, Luhn check validation, and dual-SIM correlation.',
    tags: ['IMEI', 'TAC', 'GSMA', 'Hardware', 'Handset']
  },
  {
    id: 'mcc-mnc-lookup',
    viewId: 'mcc-mnc-lookup',
    title: 'MCC-MNC Directory',
    category: 'telecom',
    icon: 'Database',
    description: 'Global ITU-T E.212 Mobile Country Code and Mobile Network Code lookup. Identify carrier and country from raw cellular signaling records.',
    tags: ['MCC', 'MNC', 'IMSI', 'Country Code', 'Network']
  },
  {
    id: 'mni-analysis',
    viewId: 'mni-analysis',
    title: 'MNI Analysis',
    category: 'telecom',
    icon: 'Shield',
    badge: 'Bilingual',
    description: 'Mobile Number Investigation framework: communication frequency profiling, contact centrality, suspect checklist, and bilingual English/Hindi dossier.',
    tags: ['MNI', 'Dossier', 'Subscriber', 'Behavior']
  },

  // Financial
  {
    id: 'arthagya-bank',
    viewId: 'arthagya-bank',
    title: 'Arthagya – Bank Statement Intelligence',
    category: 'financial',
    icon: 'Landmark',
    badge: 'AI Powered',
    description: 'Automated bank statement parsing (PDF/Excel/CSV): credit/debit classification, high-value structuring detection, balance tracking, and mule velocity alerts.',
    tags: ['Bank Statement', 'Forensics', 'Structuring', 'UPI', 'IMPS', 'NEFT']
  },
  {
    id: 'ncrp-graph',
    viewId: 'ncrp-graph',
    title: 'NCRP Graph / Money Trail',
    category: 'financial',
    icon: 'GitMerge',
    badge: 'Flagship',
    description: 'Interactive visual money trail analysis: multi-layer cyber fraud fund flows, Layer 1/2 mule account tracking, freezing status, and common beneficiary detection.',
    tags: ['NCRP', 'Money Trail', 'Cyber Crime', 'Mule Accounts', 'Freezing']
  },
  {
    id: 'phonepe-analyzer',
    viewId: 'phonepe-analyzer',
    title: 'PhonePe Analyzer',
    category: 'financial',
    icon: 'Wallet',
    badge: 'Fintech',
    description: 'Parse user-provided PhonePe and UPI transaction account statements, extract UTR/transaction IDs, receiver VPA handles, and detect burst transfer patterns.',
    tags: ['PhonePe', 'UPI', 'VPA', 'UTR', 'Wallets']
  },
  {
    id: 'upi-lookup',
    viewId: 'upi-lookup',
    title: 'UPI Handle & VPA Validator',
    category: 'financial',
    icon: 'CreditCard',
    description: 'Validate UPI handle syntax, resolve Payment Service Provider (@okaxis, @okhdfcbank, @paytm, @ybl), and identify institutional merchant handles.',
    tags: ['UPI', 'VPA', 'PSP', 'NPCI', 'Handles']
  },
  {
    id: 'ifsc-lookup',
    viewId: 'ifsc-lookup',
    title: 'IFSC & Bank Directory',
    category: 'financial',
    icon: 'Building2',
    description: 'Instant lookup for Indian Financial System Code (IFSC), bank name, branch address, contact details, MICR, and RTGS/NEFT/IMPS enablement status.',
    tags: ['IFSC', 'Bank', 'Branch', 'RTGS', 'NEFT']
  },
  {
    id: 'atm-lookup',
    viewId: 'atm-lookup',
    title: 'ATM Directory & Locator',
    category: 'financial',
    icon: 'MapPin',
    description: 'Search official ATM locations, bank kiosks, cash deposit machines (CDM), terminal IDs, and nearby surveillance camera contact points.',
    tags: ['ATM', 'Cash Dispenser', 'Terminal ID', 'CDM']
  },
  {
    id: 'tsdp-parser',
    viewId: 'tsdp-parser',
    title: 'TSDP – Transaction Screenshot OCR',
    category: 'financial',
    icon: 'FileCheck',
    badge: 'OCR',
    description: 'Transaction Screenshot Data Parser: extract visible UTR, transaction amount, timestamp, sender/receiver UPI ID, and check against duplicate fraudulent slips.',
    tags: ['Screenshot', 'OCR', 'Payment Slip', 'UTR', 'Verification']
  },

  // Cyber & OSINT
  {
    id: 'ip-intelligence',
    viewId: 'ip-intelligence',
    title: 'IP Intelligence & Threat Score',
    category: 'cyber',
    icon: 'Activity',
    badge: 'OSINT',
    description: 'IPv4 & IPv6 enrichment: GeoIP location, ASN, ISP, VPN/Proxy detection, Tor exit node status, threat categorization, and open port fingerprinting.',
    tags: ['IP', 'GeoIP', 'ASN', 'VPN', 'Proxy', 'Tor', 'Reputation']
  },
  {
    id: 'domain-intelligence',
    viewId: 'domain-intelligence',
    title: 'Domain & DNS Intelligence',
    category: 'cyber',
    icon: 'Search',
    badge: 'OSINT',
    description: 'Deep domain investigation: RDAP/WHOIS registration, DNS records (A, AAAA, MX, NS, TXT), email security (SPF, DKIM, DMARC), and SSL/TLS certificates.',
    tags: ['Domain', 'WHOIS', 'DNS', 'SSL', 'SPF', 'DMARC', 'Phishing']
  },
  {
    id: 'google-analyzer',
    viewId: 'google-analyzer',
    title: 'Google Takeout Analyzer',
    category: 'cyber',
    icon: 'Layers',
    description: 'Parse lawfully acquired Google Takeout archives: Location history semantic logs, YouTube searches, Chrome web visits, and sequential account timeline.',
    tags: ['Google Takeout', 'Timeline', 'Browser History', 'Location']
  },
  {
    id: 'mac-lookup',
    viewId: 'mac-lookup',
    title: 'MAC Hardware OUI Lookup',
    category: 'cyber',
    icon: 'Cpu',
    description: 'Identify hardware vendor and network card manufacturer from MAC address IEEE Organizationally Unique Identifier (OUI).',
    tags: ['MAC', 'OUI', 'Hardware', 'Network Card', 'Router']
  },
  {
    id: 'sms-header-intelligence',
    viewId: 'sms-header-intelligence',
    title: 'SMS Header Intelligence (DLT)',
    category: 'cyber',
    icon: 'Mail',
    badge: 'TRAI DLT',
    description: 'Decode 6-character commercial SMS headers (e.g. AX-HDFCBK, VM-SBIINB) to identify telecom operator, service area, and registered Principal Entity.',
    tags: ['SMS Header', 'TRAI', 'DLT', 'Smishing', 'Sender ID']
  },

  // Location & Movement
  {
    id: 'lbs-mapping',
    viewId: 'lbs-mapping',
    title: 'LBS Movement Mapping',
    category: 'location',
    icon: 'Map',
    badge: 'Visual Map',
    description: 'Location-Based Services trajectory mapping: chronological cell observation sequence, transit speed calculations, dwell times, and co-location detection.',
    tags: ['LBS', 'Movement', 'Trajectory', 'Speed', 'Dwell Time', 'GPS']
  },
  {
    id: 'lat-long-mapper',
    viewId: 'lat-long-mapper',
    title: 'Lat-Long Coordinate Mapper',
    category: 'location',
    icon: 'Navigation',
    description: 'Interactive coordinates plotter: plot multiple GPS coordinate points, measure geodesic distances, calculate suspect routes, and export visual maps.',
    tags: ['Coordinates', 'Latitude', 'Longitude', 'Distance', 'Polyline']
  },
  {
    id: 'sugam-route',
    viewId: 'sugam-route',
    title: 'Sugam Route Planner',
    category: 'location',
    icon: 'Compass',
    description: 'Multi-point suspect travel route reconstruction, transit time estimations, alternate highway corridor comparisons, and judicial route documentation.',
    tags: ['Route', 'Travel Time', 'Corridor', 'Highway', 'Speed']
  },
  {
    id: 'toll-plaza-analysis',
    viewId: 'toll-plaza-analysis',
    title: 'FASTag & Toll Plaza Sequence',
    category: 'location',
    icon: 'Truck',
    description: 'Analyze FASTag toll transaction sequences: vehicle entry/exit chronology, average transit speeds between toll barriers, and getaway route mapping.',
    tags: ['FASTag', 'Toll Plaza', 'Vehicle', 'NHAI', 'Transit']
  },
  {
    id: 'cctv-calculator',
    viewId: 'cctv-calculator',
    title: 'CCTV Clock Offset Calculator',
    category: 'location',
    icon: 'Clock',
    badge: 'Utility',
    description: 'Calculate real-world actual timestamp from DVR/NVR clock drift offset. Cross-reference footage against exact cellular CDR call timestamps.',
    tags: ['CCTV', 'DVR', 'Clock Drift', 'Offset', 'Timestamp']
  },

  // Suspect & Identity
  {
    id: 'suspect-intelligence',
    viewId: 'suspect-intelligence',
    title: 'Suspect Intelligence & Profiles',
    category: 'suspect',
    icon: 'UserCheck',
    badge: 'Dossier',
    description: 'Case-linked subject dossiers: aliases, known phone numbers, IMEIs, masked Aadhaar/PAN, bank accounts, criminal history, and bilingual export.',
    tags: ['Suspect', 'Dossier', 'Profile', 'Identifiers', 'Crime History']
  },
  {
    id: 'vajra-dashboard',
    viewId: 'vajra-dashboard',
    title: 'Vajra – Investigation Command Center',
    category: 'suspect',
    icon: 'ShieldAlert',
    badge: 'Unified',
    description: 'Integrated case command center: synthesize telecom events, financial money trail, cyber indicators, and location movements into one unified master case view.',
    tags: ['Vajra', 'Command Center', 'Case Intelligence', 'Synthesis']
  },
  {
    id: 'ceir-trace',
    viewId: 'ceir-trace',
    title: 'CEIR Reference & Device Trace',
    category: 'suspect',
    icon: 'FileSpreadsheet',
    description: 'Central Equipment Identity Register (CEIR) request tracking, device blacklist status monitoring, and legal trace subpoena record management.',
    tags: ['CEIR', 'DoT', 'Blacklist', 'Stolen Device', 'IMEI Trace']
  },

  // Legal Utilities & Documentation
  {
    id: 'lea-templates',
    viewId: 'lea-templates',
    title: 'LEA Statutory Legal Notices',
    category: 'legal',
    icon: 'Scale',
    badge: 'Court-Ready',
    description: 'Editable law enforcement notice templates: Section 91 CrPC / Section 94 BNSS, Section 102 CrPC account freeze, Section 69A IT Act, and bank/telecom notices.',
    tags: ['Sec 91 CrPC', 'BNSS 94', 'Sec 102', 'Subpoena', 'Legal Notices']
  },
  {
    id: 'caf-summarizer',
    viewId: 'caf-summarizer',
    title: 'CAF Document Summarizer',
    category: 'legal',
    icon: 'FileText',
    description: 'Customer Application Form summarizer: extract subscriber name, residential address, alternate contact, POI/POA document numbers, and retailer details.',
    tags: ['CAF', 'Subscriber', 'KYC', 'Aadhaar', 'Voter ID', 'Retailer']
  },
  {
    id: 'hash-generator',
    viewId: 'hash-generator',
    title: 'Forensic Hash Generator & Verifier',
    category: 'legal',
    icon: 'Hash',
    badge: 'Crypto',
    description: 'Cryptographic hashing tool: calculate SHA-256, SHA-512, SHA-1, and MD5 digests for text or raw forensic disk files with Section 63 BSA certificate.',
    tags: ['SHA-256', 'MD5', 'SHA-512', 'Integrity', 'Hash', 'BSA 63']
  },
  {
    id: 'nodal-directory',
    viewId: 'nodal-directory',
    title: 'Nodal Officers Directory',
    category: 'legal',
    icon: 'BookOpen',
    description: 'Verified directory of Law Enforcement Nodal Officers across Indian Telecom Operators (Airtel, Jio, Vi, BSNL) and Major Public & Private Banks.',
    tags: ['Nodal Officer', 'Telecom', 'Bank', 'Contacts', 'Escalation']
  },
  {
    id: 'police-stations',
    viewId: 'police-stations',
    title: 'Police Station Directory',
    category: 'legal',
    icon: 'Building2',
    description: 'Directory of Police Stations, Cyber Crime Units, Specialized Cells, SHO contacts, and jurisdictions across Indian States and Union Territories.',
    tags: ['Police Station', 'SHO', 'Cyber Cell', 'IFSO', 'Jurisdiction']
  },
  {
    id: 'aadhaar-validator',
    viewId: 'aadhaar-validator',
    title: 'Aadhaar Verhoeff Checksum Validator',
    category: 'legal',
    icon: 'CheckCircle',
    badge: 'Privacy Safe',
    description: 'Mathematical Verhoeff algorithm validation for 12-digit Aadhaar format without contacting external databases. Safe, offline, privacy-first validation.',
    tags: ['Aadhaar', 'Verhoeff', 'Algorithm', 'Checksum', 'Validation']
  },
  {
    id: 'sampark-vcf',
    viewId: 'sampark-vcf',
    title: 'Sampark – VCF Contact Manager',
    category: 'legal',
    icon: 'Share2',
    description: 'Forensic contact organizer: parse .VCF vCard exports from seized handsets, normalize telephone numbers (+91), deduplicate entries, and export clean CSVs.',
    tags: ['VCF', 'Contacts', 'Address Book', 'Phonebook', 'Export']
  },

  // Platform & Cases
  {
    id: 'case-management',
    viewId: 'case-management',
    title: 'Case Management System',
    category: 'platform',
    icon: 'FolderPlus',
    badge: 'Core',
    description: 'Centralized investigation case file: FIR details, case title, assigned officers, linked suspects/victims, timeline logs, and evidence attachment indexing.',
    tags: ['Case Management', 'FIR', 'Investigating Officer', 'Timeline']
  },
  {
    id: 'evidence-management',
    viewId: 'evidence-management',
    title: 'Digital Evidence Locker',
    category: 'platform',
    icon: 'ShieldCheck',
    badge: 'Sec 63 BSA',
    description: 'Immutable electronic evidence locker: real-time SHA-256 integrity verification, chain of custody logs, write-block certification, and courtroom receipts.',
    tags: ['Evidence Locker', 'Chain of Custody', 'Integrity', 'Tamper-Proof']
  },
  {
    id: 'report-generation',
    viewId: 'report-generation',
    title: 'Judicial Dossier Generator',
    category: 'platform',
    icon: 'FileText',
    badge: 'Court Dossier',
    description: 'Generate comprehensive judicial forensic dossiers in PDF, multi-sheet Excel workbooks, and CSV with Section 63 BSA / Section 65B IEA certificates.',
    tags: ['Court Report', 'PDF', 'Excel', 'BSA Certificate', 'Dossier']
  },
  {
    id: 'downloads',
    viewId: 'downloads',
    title: 'iC Apps & Desktop Downloads',
    category: 'platform',
    icon: 'Download',
    description: 'Official desktop standalone clients, forensic browser extensions, and command-line tools with verified SHA-256 release hashes.',
    tags: ['Desktop App', 'Download', 'Offline Tool', 'Extension']
  },
  {
    id: 'admin-panel',
    viewId: 'admin-panel',
    title: 'Administrator Control Panel',
    category: 'platform',
    icon: 'Settings',
    badge: 'Admin Only',
    description: 'Manage registered officers, review police identity credentials, approve department access, inspect system audit logs, and configure security policies.',
    tags: ['Admin', 'User Management', 'Audit Logs', 'Permissions', 'RBAC']
  },
  {
    id: 'community',
    viewId: 'community',
    title: 'Officer Community & Network',
    category: 'platform',
    icon: 'Users',
    badge: 'Restricted',
    description: 'Verified law enforcement professional community: forensic discussion forums, cybercrime MO alerts, training calendar, and technical whitepapers.',
    tags: ['Community', 'Forum', 'Training', 'Alerts', 'Modus Operandi']
  },
  {
    id: 'pricing',
    viewId: 'pricing',
    title: 'Subscriptions & Pricing',
    category: 'platform',
    icon: 'CreditCard',
    description: 'Flexible tiered deployment plans: Trial, Individual Professional, Department Enterprise, and State Police HQ with transparent procurement terms.',
    tags: ['Pricing', 'Subscription', 'Department', 'Enterprise']
  }
];
