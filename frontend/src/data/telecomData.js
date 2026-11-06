// Complete CDR Fields Reference (All 32 Parameters), Learning Modules, and Practical Case Studies

export const CDR_FIELDS_32 = [
  {
    id: 1,
    name: "Calling Party Number (A-Party)",
    fullForm: "Calling Party Mobile Station International Subscriber Directory Number (MSISDN)",
    definition: "The unique telephone number that initiates the communication event (originating subscriber).",
    purpose: "Identifies the source subscriber requesting connection to the cellular network.",
    example: "+91-9876543210 (International E.164 format)",
    forensicImportance: "Primary identification parameter for the caller. Establishes who triggered the call event.",
    analyticalUse: "Used to determine call initiation patterns, frequency of outward calls, and outbound contact network."
  },
  {
    id: 2,
    name: "Called Party Number (B-Party)",
    fullForm: "Called Party Mobile Station International Subscriber Directory Number (MSISDN)",
    definition: "The destination telephone number to which the communication event is directed (terminating subscriber).",
    purpose: "Directs network switching infrastructure to route the call to the appropriate destination.",
    example: "+91-9811223344",
    forensicImportance: "Identifies the intended recipient or co-conspirator. Vital for counterparty link analysis.",
    analyticalUse: "Mapping incoming/outgoing associate circles, calculating call reciprocity, and identifying burner contacts."
  },
  {
    id: 3,
    name: "Date of Call",
    fullForm: "Communication Event Date",
    definition: "The calendar date on which the communication transaction commenced according to network switch time.",
    purpose: "Chronological recording of the network session for billing, SLA, and regulatory archiving.",
    example: "2026-10-21 (YYYY-MM-DD)",
    forensicImportance: "Anchors the event to an exact date relative to incident timelines or alibi verification.",
    analyticalUse: "Daily frequency trends, identification of quiet periods versus spike dates around incident days."
  },
  {
    id: 4,
    name: "Start Time",
    fullForm: "Call Setup / Seizure Timestamp",
    definition: "The precise time of day when radio channel allocation or call signaling commenced.",
    purpose: "Records the onset of network circuit or packet establishment.",
    example: "14:22:15 (HH:MM:SS, 24-Hour)",
    forensicImportance: "Pinpoints the exact minute and second when the call was attempted. Correlates with CCTV timestamps.",
    analyticalUse: "Peak hours analysis, nighttime activity (23:00-05:00), and sequence reconstruction."
  },
  {
    id: 5,
    name: "End Time",
    fullForm: "Call Termination / Release Timestamp",
    definition: "The exact timestamp when either party hung up or the network released the allocated radio bearer.",
    purpose: "Calculates total billable airtime and frees network channels.",
    example: "14:25:45",
    forensicImportance: "Confirms the duration of the communication event and precise moment of disconnection.",
    analyticalUse: "Correlating handover sequences and multi-party conference timings."
  },
  {
    id: 6,
    name: "Call Duration",
    fullForm: "Total Billable Duration in Seconds",
    definition: "The length of the answered conversation or data transaction, typically expressed in seconds.",
    purpose: "Determines user billing charges and network channel utilization.",
    example: "210 seconds (03m 30s)",
    forensicImportance: "Distinguishes between brief signaling/code calls (<15s) and detailed substantive discussions (>180s).",
    analyticalUse: "Duration histograms, identification of ping/missed call patterns, and prioritizing key conversations."
  },
  {
    id: 7,
    name: "Call Type",
    fullForm: "Communication Category / Service Identifier",
    definition: "The classification of the transmission: voice call, SMS, USSD, or packet data event.",
    purpose: "Applies appropriate rating engine logic and routing rules.",
    example: "VOICE, SMS, DATA, USSD",
    forensicImportance: "Identifies whether verbal communication or textual/data transmission took place.",
    analyticalUse: "Segregating call records from SMS or data sessions for targeted behavioral modeling."
  },
  {
    id: 8,
    name: "Incoming Call (MT)",
    fullForm: "Mobile Terminated Call (MT Call)",
    definition: "A voice call received by the subscriber from an external or internal network entity.",
    purpose: "Tracks terminating leg traffic on the Mobile Switching Center (MSC).",
    example: "MT / INCOMING",
    forensicImportance: "Demonstrates that the target was contacted by an external party, proving inbound influence.",
    analyticalUse: "Calculating inbound-to-outbound ratio; identifying individuals directing instructions to the target."
  },
  {
    id: 9,
    name: "Outgoing Call (MO)",
    fullForm: "Mobile Originated Call (MO Call)",
    definition: "A voice call initiated by the target subscriber towards another party.",
    purpose: "Authorizes outbound routing, charges user account, and allocates voice trunking.",
    example: "MO / OUTGOING",
    forensicImportance: "Proves active initiation by the target subscriber, reflecting deliberate intent.",
    analyticalUse: "Mapping proactive conspiratorial actions and identifying target-driven contacts."
  },
  {
    id: 10,
    name: "Missed Call",
    fullForm: "Unanswered / Ringing Timeout Event",
    definition: "A call that successfully rang the destination terminal but was terminated before being answered.",
    purpose: "Maintains network signaling logs without generating voice billing charges.",
    example: "MISSED (Duration: 0s)",
    forensicImportance: "Often used as pre-arranged 'ping' signaling between conspirators to trigger actions without voice metadata.",
    analyticalUse: "Frequency of unanswered alerts, tracking attempts to reach absent or fugitive parties."
  },
  {
    id: 11,
    name: "Answered Call",
    fullForm: "Connected / Completed Communication Event",
    definition: "A call in which an answer signal (ANM) was received and audio conversation took place.",
    purpose: "Confirms two-way audio path establishment for charging.",
    example: "ANSWERED (Duration > 0s)",
    forensicImportance: "Verifies bilateral engagement between parties. Definitively establishes two-way communication.",
    analyticalUse: "Filtering out noise to focus on substantial communication sessions."
  },
  {
    id: 12,
    name: "SMS Details (SM-MO / SM-MT)",
    fullForm: "Short Message Service Transaction Metadata",
    definition: "Record of a text transmission including sender, recipient, timestamp, and Service Center address.",
    purpose: "Routes message via SMSC (Short Message Service Center) and tracks delivery receipt.",
    example: "SM-MO to +91-9822334455 via SMSC +91-9810051914",
    forensicImportance: "Proves text transmission. Note: CDR contains only metadata (timestamp, parties), NOT message content.",
    analyticalUse: "Correlating text bursts with subsequent voice calls or physical meetings."
  },
  {
    id: 13,
    name: "IMEI Number",
    fullForm: "International Mobile Equipment Identity",
    definition: "A unique 15-digit decimal number allocated by GSMA identifying the physical mobile device.",
    purpose: "Authorizes device access to the network; blocks stolen handsets via EIR (Equipment Identity Register).",
    example: "867543048912345 (TAC: 867543, FAC: 04, SNR: 891234, CD: 5)",
    forensicImportance: "Proves which physical handset was used. Detects burner phone swapping and multi-SIM usage.",
    analyticalUse: "IMEI-to-MSISDN cross-matching, device switching timelines, and handset manufacturer identification."
  },
  {
    id: 14,
    name: "IMSI Number",
    fullForm: "International Mobile Subscriber Identity",
    definition: "A unique 15-digit number stored in the SIM card identifying the cellular subscription.",
    purpose: "Authenticates subscriber identity in the Home Location Register (HLR) / Home Subscriber Server (HSS).",
    example: "404450123456789 (MCC: 404, MNC: 45, MSIN: 0123456789)",
    forensicImportance: "Defines the actual SIM chip used. Identifies SIM swapping even if the phone number appears unchanged.",
    analyticalUse: "Detecting unauthorized SIM clones, SIM swaps, and roaming subscriber origin."
  },
  {
    id: 15,
    name: "MSISDN Number",
    fullForm: "Mobile Station International Subscriber Directory Number",
    definition: "The public telephone number dialed to reach a mobile phone subscriber.",
    purpose: "User-facing routing address mapped to an IMSI in the HLR.",
    example: "+91-9876543210 (CC: 91, NDC: 987, SN: 6543210)",
    forensicImportance: "The primary legal identifier subpoenaed in police court requisitions.",
    analyticalUse: "Central node key in link charts, contact frequency matrices, and subscriber profile analysis."
  },
  {
    id: 16,
    name: "Cell ID (CI)",
    fullForm: "Cell Identifier",
    definition: "A unique number allocated by the telecom operator identifying a specific radio sector antenna.",
    purpose: "Enables the Base Station Controller (BSC/RNC) to direct radio transmission to the user terminal.",
    example: "56781 (Decimal) or 0xDDD5 (Hexadecimal)",
    forensicImportance: "Establishes the approximate radio coverage footprint where the phone was located at call initiation.",
    analyticalUse: "Tower usage frequency, serving cell transitions, and co-location analysis."
  },
  {
    id: 17,
    name: "LAC (Location Area Code)",
    fullForm: "Location Area Code",
    definition: "A 16-bit integer identifying a geographical cluster of base stations within a cellular network.",
    purpose: "Optimizes subscriber paging by broadcasting alerts across a cluster of towers rather than entire network.",
    example: "1201 (Decimal) or 0x04B1 (Hex)",
    forensicImportance: "Helps disambiguate duplicate Cell IDs across different districts or regional zones.",
    analyticalUse: "Regional movement tracking across administrative district boundaries."
  },
  {
    id: 18,
    name: "TAC (Tracking Area Code)",
    fullForm: "Tracking Area Code (LTE / 4G / 5G)",
    definition: "The 4G LTE and 5G equivalent of 2G/3G LAC, defining an EPC/5GC paging cluster.",
    purpose: "Tracks UE (User Equipment) position in idle mode across modern 4G/5G networks.",
    example: "24501",
    forensicImportance: "Standard modern location area parameter in high-speed VoLTE and 5G CDRs.",
    analyticalUse: "Tracking modern smartphone movements across metropolitan cellular regions."
  },
  {
    id: 19,
    name: "CGI (Cell Global Identity)",
    fullForm: "Cell Global Identity (2G / 3G)",
    definition: "The globally unique identifier of a cellular antenna sector: MCC + MNC + LAC + Cell ID.",
    purpose: "Guarantees global uniqueness of every antenna site in international roaming and handover.",
    example: "404-45-1201-56781",
    forensicImportance: "The gold-standard parameter for precise cell tower database lookup.",
    analyticalUse: "Accurate tower mapping on GIS maps without risk of local sector ID collisions."
  },
  {
    id: 20,
    name: "ECGI (E-UTRAN Cell Global Identity)",
    fullForm: "E-UTRAN Cell Global Identity (4G LTE / 5G)",
    definition: "The globally unique identifier for an LTE eNodeB cell: PLMN ID (MCC+MNC) + E-UTRAN Cell ID.",
    purpose: "Provides globally unique addressing for 4G LTE eNodeBs and 5G gNodeBs.",
    example: "404-45-02A45B-01",
    forensicImportance: "Identifies exact 4G sector serving VoLTE calls or data packet sessions.",
    analyticalUse: "VoLTE and IPDR location correlation on modern LTE networks."
  },
  {
    id: 21,
    name: "MCC (Mobile Country Code)",
    fullForm: "Mobile Country Code",
    definition: "A 3-digit ITU-T E.212 code identifying the country of the cellular network.",
    purpose: "Identifies nationality of the network operator.",
    example: "404 or 405 (India), 310 (USA), 234 (UK)",
    forensicImportance: "Identifies whether an international SIM was utilized in domestic crimes.",
    analyticalUse: "Filtering foreign roaming SIM cards and identifying cross-border communication."
  },
  {
    id: 22,
    name: "MNC (Mobile Network Code)",
    fullForm: "Mobile Network Code",
    definition: "A 2 or 3-digit code identifying the specific telecom operator within a country.",
    purpose: "Routes traffic to the correct cellular carrier infrastructure.",
    example: "45 (Airtel Delhi), 840 (Jio Delhi), 20 (Vi Mumbai)",
    forensicImportance: "Confirms which telecom company operates the serving network or subscriber account.",
    analyticalUse: "Operator distribution analysis and identifying tower infrastructure sharing."
  },
  {
    id: 23,
    name: "Cell Tower ID / Site Name",
    fullForm: "Base Transceiver Station Physical Site Name",
    definition: "The internal operator moniker or civil site code for the physical tower infrastructure.",
    purpose: "Facilitates field maintenance, tower leasing, and radio frequency optimization.",
    example: "DEL-CP-01 (Connaught Place Inner Circle Rooftop)",
    forensicImportance: "Translates abstract hexadecimal Cell IDs into recognizable physical street locations.",
    analyticalUse: "Correlating subscriber presence with known physical landmarks and crime scenes."
  },
  {
    id: 24,
    name: "First Cell ID (Start CGI)",
    fullForm: "Serving Cell at Call Initiation",
    definition: "The specific antenna sector that handled the radio signaling when the call first connected.",
    purpose: "Allocates the initial radio channel for the call setup.",
    example: "404-45-1201-1001",
    forensicImportance: "Identifies where the target was standing or traveling when the call began.",
    analyticalUse: "Determining call initiation location and baseline origin coordinates."
  },
  {
    id: 25,
    name: "Last Cell ID (End CGI)",
    fullForm: "Serving Cell at Call Termination",
    definition: "The specific antenna sector handling the call immediately before disconnection.",
    purpose: "Tracks radio resource handover and records the terminating cell.",
    example: "404-45-1201-1002",
    forensicImportance: "Comparing First and Last Cell ID proves physical movement during a call (in-transit indicator).",
    analyticalUse: "Calculating transit speed and directional heading during a long phone conversation."
  },
  {
    id: 26,
    name: "Roaming Details",
    fullForm: "Roaming Status and Serving Network Type",
    definition: "Indicates whether the subscriber was on their home network or roaming nationally / internationally.",
    purpose: "Calculates inter-operator wholesale clearing fees.",
    example: "HOME, NATIONAL_ROAMING, INTERNATIONAL_ROAMING",
    forensicImportance: "Confirms travel away from home circle and identifies visited operator network.",
    analyticalUse: "Detecting interstate or cross-border travel patterns."
  },
  {
    id: 27,
    name: "Incoming & Outgoing Network Details",
    fullForm: "Point of Interconnection (POI) Trunk Details",
    definition: "Records the trunk group and POI switch used to hand over traffic between different carriers.",
    purpose: "Manages inter-carrier billing and interconnect settlement.",
    example: "POI-AIRTEL-TO-JIO-DEL-TRK04",
    forensicImportance: "Verifies call routing integrity and cross-operator exchange points.",
    analyticalUse: "Validating cross-network communication pathways."
  },
  {
    id: 28,
    name: "Network Technology",
    fullForm: "Radio Access Technology (RAT)",
    definition: "The generation of wireless technology used for the session: 2G (GSM), 3G (UMTS), 4G (LTE), 5G (NR).",
    purpose: "Selects appropriate core network interfaces (SGSN/MME/AMF).",
    example: "4G (VoLTE), 5G_NSA, 2G_GSM",
    forensicImportance: "Provides context on location accuracy; 5G/4G microcells offer narrower geographic radii than 2G macrocells.",
    analyticalUse: "Evaluating location precision confidence based on cell sector size."
  },
  {
    id: 29,
    name: "Cause Code / Release Cause",
    fullForm: "Q.850 / SIP Disconnect Cause Code",
    definition: "A standardized numeric code indicating why the communication event terminated.",
    purpose: "Diagnostic logging for network engineering and dropped call monitoring.",
    example: "16 (Normal Call Clearing), 17 (User Busy), 19 (No Answer)",
    forensicImportance: "Explains why a call failed: intentional rejection, battery death, out of coverage, or network drop.",
    analyticalUse: "Assessing suspect responsiveness and identifying deliberate call rejection."
  },
  {
    id: 30,
    name: "Record Type",
    fullForm: "CDR Format Identifier",
    definition: "Specific switch record specification: Transit CDR, Roaming CDR, Gateway CDR, SMS CDR.",
    purpose: "Directs mediation systems to parse the correct proprietary billing schema.",
    example: "MOC_REC, MTC_REC, ROAM_REC",
    forensicImportance: "Ensures forensic analysts interpret the record fields according to the correct standard.",
    analyticalUse: "Quality assurance during multi-operator data normalization."
  },
  {
    id: 31,
    name: "Time Zone",
    fullForm: "Coordinated Universal Time Offset",
    definition: "The time offset relative to UTC applied by the recording telecom switch.",
    purpose: "Standardizes timestamps across multi-state or international networks.",
    example: "UTC+05:30 (Indian Standard Time - IST)",
    forensicImportance: "CRITICAL: Ambiguous time zones can lead to 5.5 hour alibi errors if UTC is mistaken for local IST.",
    analyticalUse: "Time normalization to guarantee accurate chronological synchronization."
  },
  {
    id: 32,
    name: "Data Session Details (IPDR / APN)",
    fullForm: "Packet Data Protocol (PDP) Context Details",
    definition: "Parameters of mobile internet sessions, including Access Point Name (APN), data volume, and IP allocation.",
    purpose: "Tracks megabyte usage for mobile internet data billing.",
    example: "APN: airtelgprs.com, Uplink: 45MB, Downlink: 120MB",
    forensicImportance: "Reveals internet activity times when suspect wasn't making regular phone calls.",
    analyticalUse: "Correlating VoIP or messenger activity (WhatsApp/Telegram) with cellular data sessions."
  }
];

export const PRACTICAL_CASE_STUDIES = [
  {
    id: "CS-01",
    title: "Case Study 1: The Midnight Extortion & Handset Swap Ring",
    category: "Extortion & Burner Devices",
    scenario: "A high-profile industrialist in New Delhi received threatening extortion calls from an unknown number. Analysis of subpoenaed CDRs revealed targeted calling patterns, late-night coordination, and a sudden device swap.",
    sampleTarget: "+919876543210 (Suspect A)",
    keyFindings: [
      "Target made 35 calls on Oct 21 between 23:00 and 04:00 (Incident night).",
      "Communicated extensively with accomplice +919811223344 (Suspect B).",
      "Swapped physical handset (IMEI 867543048912345 to burner 354129087654321) on Oct 22 morning.",
      "Co-located with accomplice at Connaught Place and Gurugram CyberHub towers."
    ],
    analyticalMethod: "Call frequency analysis, IMEI transition detection, and cell tower co-location.",
    conclusion: "Demonstrated how combining call timing, device switching, and tower co-location isolates deliberate burner evasion."
  },
  {
    id: "CS-02",
    title: "Case Study 2: Kidnapping Timeline & Escape Route Reconstruction",
    category: "Violent Crime & Route Tracking",
    scenario: "Investigators reconstructed the sequential movement of a victim's snatched phone and suspect handsets across multiple district borders during a 6-hour kidnapping window.",
    sampleTarget: "+919822334455 (Logistics Accomplice)",
    keyFindings: [
      "Sequence of serving cells progressed along National Highway 48 from Rohini towards Jaipur border.",
      "Rapid tower transition observed with speeds exceeding 110 km/h between Delhi and Manesar.",
      "Short duration 'ping' calls observed immediately prior to each checkpoint transit."
    ],
    analyticalMethod: "Chronological trajectory mapping, serving cell sequence, and speed calculation.",
    conclusion: "Proved vehicle trajectory using serving cell sequences without relying on inaccurate GPS assumptions."
  },
  {
    id: "CS-03",
    title: "Case Study 3: Cross-Target Link Analysis in Financial Hawala Network",
    category: "Financial Crime & Hawala",
    scenario: "Two separate CDR files from independent targets were cross-referenced to discover common hidden contacts and mutual coordination.",
    sampleTarget: "Cross-comparison between Target A (+919876543210) and Target B (+919811223344)",
    keyFindings: [
      "Discovered 3 mutual contacts: a shared money courier (+919899001122) and fixer (+919822334455).",
      "Direct calls between Target A and Target B occurred immediately prior to cash drops.",
      "Shared cell tower presence in Nehru Place financial district on matching dates."
    ],
    analyticalMethod: "Multiple CDR comparison, Venn contact intersection, and shared tower analysis.",
    conclusion: "Uncovered the intermediary link connecting two previously disconnected criminal suspects."
  },
  {
    id: "CS-04",
    title: "Case Study 4: Tower Dump Anomaly & Crime Scene Presence",
    category: "Tower Dump Forensics",
    scenario: "A 4-hour tower dump from a cell tower near a burglary crime scene was filtered against suspect lists to identify unique anomalies.",
    sampleTarget: "Tower Dump DEL-CP-01 (10,000+ total sector transactions)",
    keyFindings: [
      "Eliminated routine daily commuters and residents by cross-referencing previous 30-day baseline.",
      "Isolated 2 newly observed IMSIs that had never appeared on this tower before the incident date.",
      "Both numbers switched off permanently 15 minutes after the crime timestamp."
    ],
    analyticalMethod: "Commuter baseline subtraction, first-time appearance filtering, and sudden dormancy detection.",
    conclusion: "Highlighted how systematic filtering reduces massive tower dump files to viable investigative leads."
  }
];

export const LEARNING_MODULES = [
  {
    id: "LM-01",
    title: "1. Understanding CDR Fundamentals",
    badge: "Core Basics",
    summary: "What is a Call Detail Record, what metadata it contains, and what it CANNOT tell you.",
    content: `
A **Call Detail Record (CDR)** is a digital transaction record generated by telecommunications exchange equipment (Mobile Switching Centers - MSC, Service GPRS Support Nodes - SGSN, and IP Multimedia Subsystem - IMS).

### What CDR Contains:
- **Parties Involved**: Calling number (A-Party), Called number (B-Party).
- **Time Attributes**: Date, start time, end time, duration.
- **Device & SIM Identifiers**: IMEI (handset), IMSI (subscriber SIM).
- **Network Routing**: Serving cell antenna (Cell ID), LAC/TAC, Network Technology (4G/5G).
- **Call Result**: Answered, Missed, Diverted, Terminated.

### What CDR Does NOT Contain:
> [!IMPORTANT]
> **A CDR does NOT contain the audio recording of the conversation, the text contents of SMS messages, or real-time GPS locations.** It is pure communication metadata created for billing, routing, and operational logging.
    `
  },
  {
    id: "LM-02",
    title: "2. Cellular Architecture: From Handset to Tower to Switch",
    badge: "Telecom Engineering",
    summary: "How mobile calls traverse BTS, BSC, MSC, HLR, VLR, and modern LTE/5G EPC/5GC networks.",
    content: `
When a user dials a phone number:
1. **User Equipment (UE)** sends radio frequency signals to the nearest **Base Transceiver Station (BTS / eNodeB / gNodeB)**.
2. The BTS forwards the signaling to the **Base Station Controller (BSC)** or **Radio Network Controller (RNC)**.
3. The **Mobile Switching Center (MSC)** queries the **Home Location Register (HLR)** and **Visitor Location Register (VLR)** to authenticate the subscriber and verify roaming rights.
4. Once authenticated, circuit or packet bearers connect the call to the terminating switch.
5. Upon call release, the switch generates a billing ticket—this raw ticket is mediated into the standardized **CDR**.
    `
  },
  {
    id: "LM-03",
    title: "3. Cell Tower Location vs. Real GPS: Critical Forensics Boundaries",
    badge: "Forensic Integrity",
    summary: "Why cell tower coordinates are NOT pinpoint GPS locations, and how to avoid courtroom pitfalls.",
    content: `
A common mistake in digital investigations is confusing a **Cell Tower Location** with the **Physical Location of a Person**.

- **Cell Tower Coordinates**: The latitude and longitude of the metal radio antenna mounted on a building or mast.
- **Coverage Sector**: Cellular antennas are typically split into 3 directional sectors (e.g. Sector 1: 0°-120°, Sector 2: 120°-240°, Sector 3: 240°-360°).
- **Coverage Radius**: Depending on terrain, urban density, and frequency band (e.g. 700MHz vs 2300MHz), a sector coverage area can span from 200 meters in dense cities to 15+ kilometers in rural areas!
- **Handovers & Load Balancing**: If a nearby tower is congested, a handset may connect to a tower further away.

> [!CAUTION]
> In court testimony, NEVER state "The suspect was at coordinates X, Y". State: *"The handset was served by radio sector Z of tower T, indicating the device was within the approximate radio coverage footprint of that antenna."*
    `
  },
  {
    id: "LM-04",
    title: "4. The 8-Step Telecom Forensics Investigation Workflow",
    badge: "Operational Guide",
    summary: "Standard operating procedure from lawful requisition to court report submission.",
    content: `
1. **Lawful Requisition**: Issue notice under applicable statutory provisions (e.g., Sec 91 CrPC / Section 94 BNSS in India) to telecom service providers.
2. **Chain of Custody & Hash Preservation**: Immediately compute SHA-256 hash of original files. Store untouched master copy in write-blocked storage.
3. **Data Normalization & Cleaning**: Map provider-specific column headers into standard forensic schema. Deduplicate working copy.
4. **Volume & Pattern Analysis**: Compute KPI summary, daily trends, duration buckets, and peak hours.
5. **Counterparty & Link Profiling**: Identify top associates, mutual contacts, and hidden burner devices.
6. **Device & Subscriber Verification**: Inspect IMEI and IMSI changes for handset or SIM swap maneuvers.
7. **Serving Cell Sequence Mapping**: Map chronological tower transitions to assess geographic movement plausibility.
8. **Forensic Dossier & Certification**: Compile formal report with evidence integrity certificates (e.g. BSA Section 63 / IEA Section 65B).
    `
  },
  {
    id: "LM-05",
    title: "5. Legal & Statutory Compliance in India (BSA 2023 / IT Act)",
    badge: "Legal Compliance",
    summary: "Bharatiya Sakshya Adhiniyam 2023, Section 63 electronic evidence certificates, and privacy protections.",
    content: `
In India, the admissibility of electronic records is governed by:
- **Bharatiya Sakshya Adhiniyam, 2023 (BSA)**: Section 63 specifies the conditions for admissibility of electronic records (corresponding to former Section 65B of the Indian Evidence Act, 1872).
- **Information Technology Act, 2000**: Sections 43, 66, and 69 regarding data protection and lawful interception/monitoring safeguards.
- **Telecommunications Act, 2023**: Framework governing lawful access and regulatory obligations of telecom entities.

### Key Certificate Requirements:
1. The computer/system was operating properly without interference during data ingestion.
2. The cryptographic SHA-256 hash verifies that the working copy is bit-for-bit identical to the received evidence.
3. The certificate must be signed by the officer in charge of the computer system or forensic laboratory.
    `
  }
];

