import os
import sys

# Ensure backend directory is in python search path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

import json
from datetime import datetime
from typing import Dict, List, Any, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from fastapi.staticfiles import StaticFiles

from models.cdr import CaseModel, EvidenceModel, ColumnMapping
from services.cdr_service import CDRService
from services.analytics import AnalyticsEngine
from services.reporting import ReportGenerator

app = FastAPI(
    title="CDR ANALYSIS PRO API",
    description="Telecom Forensics and Call Detail Record Analysis Engine",
    version="2.0.0"
)

# Enable CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session store for investigation state (persisted per session)
SESSION_DATA = {
    "records": [],
    "cleaned_records": [],
    "evidence": None,
    "case": {
        "case_id": "FIR-DEL-2026-8812",
        "case_title": "Operation CyberTrack: Telecom Intelligence Review",
        "officer_name": "Constable Vishal",
        "agency": "Special Cyber Crime & Telecom Intelligence Division",
        "description": "Analysis of subscriber communications and mobile handset transitions in connection with suspected coordinated extortion & hawala operations.",
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "status": "ACTIVE",
        "target_numbers": ["+919876543210", "+919811223344"],
        "notes": [
            {"date": "2026-10-22", "author": "Constable Vishal", "text": "Subpoenaed CDR and IPDR logs received lawfully from cellular operators under Sec 91 CrPC / BNSS."},
            {"date": "2026-10-24", "author": "Sub-Insp. Priya Sharma", "text": "Cryptographic SHA-256 integrity hash calculated and verified against raw disk image."}
        ]
    },
    "cases_list": [],
    "audit_logs": [
        {"timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "action": "SYSTEM_INITIALIZED", "user": "admin", "details": "Forensic Engine initialized in secure audit mode"}
    ]
}

# Auto-load synthetic demo data on startup
@app.on_event("startup")
def startup_event():
    demo_file = os.path.join(CURRENT_DIR, "data", "sample_cdr_case_01.csv")
    if os.path.exists(demo_file):
        with open(demo_file, "rb") as f:
            content = f.read()
        records, summary = CDRService.parse_file(content, "sample_cdr_case_01.csv")
        sha = CDRService.calculate_sha256(content)
        SESSION_DATA["records"] = records
        SESSION_DATA["cleaned_records"] = records
        SESSION_DATA["evidence"] = {
            "evidence_id": "EVD-2026-001",
            "case_id": "FIR-DEL-2026-8812",
            "original_filename": "sample_cdr_case_01.csv",
            "file_size_bytes": len(content),
            "sha256_hash": sha,
            "uploaded_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "analyst_name": "Constable Vishal",
            "record_count": len(records),
            "verified": True,
            "custody_log": [
                {"timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "action": "INITIAL_INGESTION", "officer": "Constable Vishal", "hash": sha}
            ]
        }
        print(f"Loaded {len(records)} initial demo records.")

@app.get("/api/health")
def health_check():
    return {
        "status": "OPERATIONAL",
        "system": "CDR ANALYSIS PRO v2.0",
        "current_case": SESSION_DATA["case"]["case_id"],
        "records_loaded": len(SESSION_DATA["records"]),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/demo/load")
def load_demo(dataset: str = "case_1"):
    """Load pre-packaged synthetic CDR datasets"""
    filename = "sample_cdr_case_01.csv" if dataset == "case_1" else "sample_cdr_case_02.csv"
    filepath = os.path.join(CURRENT_DIR, "data", filename)
    
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail=f"Demo dataset {dataset} not found")

    with open(filepath, "rb") as f:
        content = f.read()

    records, val_summary = CDRService.parse_file(content, filename)
    sha = CDRService.calculate_sha256(content)

    SESSION_DATA["records"] = records
    SESSION_DATA["cleaned_records"] = records
    SESSION_DATA["evidence"] = {
        "evidence_id": f"EVD-{datetime.now().strftime('%y%m%d%H%M')}",
        "case_id": SESSION_DATA["case"]["case_id"],
        "original_filename": filename,
        "file_size_bytes": len(content),
        "sha256_hash": sha,
        "uploaded_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "analyst_name": "Forensic Officer",
        "record_count": len(records),
        "verified": True,
        "custody_log": [
            {"timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "action": f"DEMO_IMPORT_{dataset.upper()}", "officer": "Forensic Officer", "hash": sha}
        ]
    }

    # Audit log
    SESSION_DATA["audit_logs"].append({
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "action": "DATASET_IMPORTED",
        "user": "Analyst",
        "details": f"Imported demo dataset {filename} ({len(records)} records)"
    })

    return {
        "success": True,
        "message": f"Successfully loaded demo dataset {filename}",
        "record_count": len(records),
        "evidence": SESSION_DATA["evidence"],
        "validation": val_summary
    }

@app.post("/api/reset")
def reset_database():
    """Clear all active CDR records, evidence, and reset database session including case metadata"""
    SESSION_DATA["records"] = []
    SESSION_DATA["cleaned_records"] = []
    SESSION_DATA["evidence"] = None
    SESSION_DATA["case"] = {
        "case_id": "",
        "case_title": "",
        "officer_name": "",
        "agency": "",
        "description": "",
        "created_at": "",
        "status": "NO ACTIVE CASE",
        "target_numbers": [],
        "notes": []
    }
    SESSION_DATA["audit_logs"].append({
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "action": "DATABASE_RESET",
        "user": "Analyst",
        "details": "User cleared all active CDR records, evidence, and case details (Case No, Officer, Agency, Title, Brief)"
    })
    return {"success": True, "message": "CDR database, uploaded records, and case details removed successfully"}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload custom CDR file with cryptographic SHA-256 generation and column auto-detection"""
    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")

    sha = CDRService.calculate_sha256(content)
    try:
        records, val_summary = CDRService.parse_file(content, file.filename)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    evidence = {
        "evidence_id": f"EVD-{datetime.now().strftime('%y%m%d%H%M%S')}",
        "case_id": SESSION_DATA["case"]["case_id"],
        "original_filename": file.filename,
        "file_size_bytes": len(content),
        "sha256_hash": sha,
        "uploaded_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "analyst_name": SESSION_DATA["case"]["officer_name"],
        "record_count": len(records),
        "verified": True,
        "custody_log": [
            {"timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "action": "FILE_UPLOAD", "officer": SESSION_DATA["case"]["officer_name"], "hash": sha}
        ]
    }

    SESSION_DATA["records"] = records
    SESSION_DATA["cleaned_records"] = records
    SESSION_DATA["evidence"] = evidence
    
    SESSION_DATA["audit_logs"].append({
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "action": "EVIDENCE_UPLOADED",
        "user": SESSION_DATA["case"]["officer_name"],
        "details": f"Uploaded file {file.filename} (Hash: {sha[:16]}...)"
    })

    return {
        "success": True,
        "filename": file.filename,
        "evidence": evidence,
        "record_count": len(records),
        "validation": val_summary,
        "sample_records": records[:10]
    }

@app.post("/api/data/clean")
def clean_data(options: Dict[str, Any]):
    """Perform data cleaning on working copy without modifying original evidence"""
    records = SESSION_DATA["records"]
    cleaned = []
    seen = set()

    for r in records:
        if options.get("remove_duplicates", True):
            sig = (r["calling_number"], r["called_number"], r["datetime"], r["duration"])
            if sig in seen:
                continue
            seen.add(sig)

        if options.get("drop_unknown", False):
            if r["calling_number"] == "UNKNOWN" or r["called_number"] == "UNKNOWN":
                continue

        cleaned.append(r)

    SESSION_DATA["cleaned_records"] = cleaned
    return {
        "original_count": len(records),
        "cleaned_count": len(cleaned),
        "removed_records": len(records) - len(cleaned)
    }

@app.get("/api/records")
def get_records(
    page: int = 1,
    limit: int = 50,
    search: Optional[str] = None,
    call_type: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    sort_by: str = "datetime",
    sort_order: str = "desc"
):
    """Paginated, filtered, searchable CDR records table"""
    records = SESSION_DATA["cleaned_records"] or SESSION_DATA["records"]

    filtered = []
    for r in records:
        if call_type and call_type != "ALL" and r.get("call_type") != call_type:
            continue
        if date_from and r.get("call_date", "") < date_from:
            continue
        if date_to and r.get("call_date", "") > date_to:
            continue
        if search:
            s_low = search.lower()
            match = (
                s_low in r.get("calling_number", "").lower() or
                s_low in r.get("called_number", "").lower() or
                s_low in r.get("imei", "").lower() or
                s_low in r.get("imsi", "").lower() or
                s_low in r.get("tower_name", "").lower() or
                s_low in r.get("first_cell_id", "").lower() or
                s_low in r.get("record_id", "").lower()
            )
            if not match:
                continue
        filtered.append(r)

    # Sort
    reverse = (sort_order.lower() == "desc")
    filtered.sort(key=lambda x: str(x.get(sort_by, "")), reverse=reverse)

    total = len(filtered)
    start = (page - 1) * limit
    end = start + limit
    paginated = filtered[start:end]

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit if total > 0 else 1,
        "records": paginated
    }

@app.get("/api/analytics/summary")
def get_summary():
    records = SESSION_DATA["cleaned_records"] or SESSION_DATA["records"]
    return AnalyticsEngine.get_dashboard_summary(records)

@app.get("/api/analytics/calls")
def get_calls():
    records = SESSION_DATA["cleaned_records"] or SESSION_DATA["records"]
    return AnalyticsEngine.analyze_calls(records)

@app.get("/api/analytics/number")
def get_number_analysis(number: str):
    records = SESSION_DATA["cleaned_records"] or SESSION_DATA["records"]
    return AnalyticsEngine.analyze_number(records, number)

@app.get("/api/analytics/datetime")
def get_datetime():
    records = SESSION_DATA["cleaned_records"] or SESSION_DATA["records"]
    return AnalyticsEngine.analyze_datetime(records)

@app.get("/api/analytics/imei")
def get_imei():
    records = SESSION_DATA["cleaned_records"] or SESSION_DATA["records"]
    return AnalyticsEngine.analyze_imei(records)

@app.get("/api/analytics/imsi")
def get_imsi():
    records = SESSION_DATA["cleaned_records"] or SESSION_DATA["records"]
    return AnalyticsEngine.analyze_imsi(records)

@app.get("/api/analytics/towers")
def get_towers():
    records = SESSION_DATA["cleaned_records"] or SESSION_DATA["records"]
    return AnalyticsEngine.analyze_towers(records)

@app.get("/api/analytics/geolocation")
def get_geolocation():
    records = SESSION_DATA["cleaned_records"] or SESSION_DATA["records"]
    return AnalyticsEngine.analyze_geolocation(records)

@app.get("/api/analytics/network")
def get_network():
    records = SESSION_DATA["cleaned_records"] or SESSION_DATA["records"]
    return AnalyticsEngine.analyze_network_graph(records)

@app.get("/api/analytics/anomalies")
def get_anomalies():
    records = SESSION_DATA["cleaned_records"] or SESSION_DATA["records"]
    return AnalyticsEngine.detect_patterns_and_anomalies(records)

@app.get("/api/analytics/compare")
def compare_datasets():
    """Compare Case 1 and Case 2 CDR datasets for multi-target link analysis"""
    records_1 = SESSION_DATA["cleaned_records"] or SESSION_DATA["records"]
    
    # Load Case 2
    path_2 = os.path.join(CURRENT_DIR, "data", "sample_cdr_case_02.csv")
    if os.path.exists(path_2):
        with open(path_2, "rb") as f:
            records_2, _ = CDRService.parse_file(f.read(), "sample_cdr_case_02.csv")
    else:
        records_2 = []

    return AnalyticsEngine.compare_multiple_cdrs(records_1, records_2, "Target Suspect A", "Target Suspect B")

@app.get("/api/ipdr")
def get_ipdr():
    """Return synthetic IPDR records and protocol summary"""
    ipdr_path = os.path.join(CURRENT_DIR, "data", "sample_ipdr_data.json")
    if os.path.exists(ipdr_path):
        with open(ipdr_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    else:
        data = []

    # Quick aggregations
    proto_counts = {}
    dest_ips = {}
    total_bytes = 0

    for rec in data:
        p = rec.get("protocol", "OTHER")
        proto_counts[p] = proto_counts.get(p, 0) + 1
        d_ip = rec.get("destination_public_ip", "UNKNOWN")
        dest_ips[d_ip] = dest_ips.get(d_ip, 0) + 1
        total_bytes += rec.get("bytes_uplink", 0) + rec.get("bytes_downlink", 0)

    return {
        "records": data,
        "total_sessions": len(data),
        "total_data_mb": round(total_bytes / (1024 * 1024), 2),
        "protocol_breakdown": proto_counts,
        "top_destination_ips": sorted([{"ip": k, "sessions": v} for k, v in dest_ips.items()], key=lambda x: x["sessions"], reverse=True)[:8]
    }

@app.get("/api/case")
def get_case():
    return {
        "case": SESSION_DATA["case"],
        "evidence": SESSION_DATA["evidence"],
        "audit_logs": SESSION_DATA["audit_logs"][-20:]
    }

@app.post("/api/case/update")
def update_case(case_update: Dict[str, Any]):
    SESSION_DATA["case"].update(case_update)
    SESSION_DATA["audit_logs"].append({
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "action": "CASE_METADATA_UPDATED",
        "user": SESSION_DATA["case"]["officer_name"],
        "details": f"Updated case metadata for {SESSION_DATA['case']['case_id']}"
    })
    return SESSION_DATA["case"]

@app.post("/api/case/note")
def add_note(note: Dict[str, str]):
    new_note = {
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "author": note.get("author", SESSION_DATA["case"]["officer_name"]),
        "text": note.get("text", "")
    }
    SESSION_DATA["case"]["notes"].append(new_note)
    return SESSION_DATA["case"]["notes"]

@app.get("/api/reports/excel")
def download_excel():
    records = SESSION_DATA["cleaned_records"] or SESSION_DATA["records"]
    summary = AnalyticsEngine.get_dashboard_summary(records)
    anomalies = AnalyticsEngine.detect_patterns_and_anomalies(records)

    excel_bytes = ReportGenerator.generate_excel(
        SESSION_DATA["case"],
        SESSION_DATA["evidence"] or {},
        records,
        summary,
        anomalies
    )

    return Response(
        content=excel_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=CDR_Investigation_{SESSION_DATA['case']['case_id']}.xlsx"}
    )

@app.get("/api/reports/pdf")
def download_pdf():
    records = SESSION_DATA["cleaned_records"] or SESSION_DATA["records"]
    summary = AnalyticsEngine.get_dashboard_summary(records)
    anomalies = AnalyticsEngine.detect_patterns_and_anomalies(records)
    
    # Top contacts
    net = AnalyticsEngine.analyze_network_graph(records)
    top_contacts = sorted(net["nodes"], key=lambda x: x["call_count"], reverse=True)

    pdf_bytes = ReportGenerator.generate_pdf(
        SESSION_DATA["case"],
        SESSION_DATA["evidence"] or {},
        records,
        summary,
        anomalies,
        top_contacts
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=CDR_Dossier_{SESSION_DATA['case']['case_id']}.pdf"}
    )

# Mount frontend built static files if available
frontend_dist = os.path.join(CURRENT_DIR, "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend_static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
