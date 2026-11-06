from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class CDRRecord(BaseModel):
    record_id: Optional[str] = None
    calling_number: str
    called_number: str
    call_date: str
    call_time: str
    datetime: Optional[str] = None
    duration: int = 0
    call_type: str = "OUTGOING"
    imei: Optional[str] = ""
    imsi: Optional[str] = ""
    first_cell_id: Optional[str] = ""
    last_cell_id: Optional[str] = ""
    lac: Optional[str] = ""
    tower_name: Optional[str] = ""
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    network_technology: Optional[str] = "4G"
    roaming: Optional[str] = "HOME"
    operator: Optional[str] = ""
    raw_data: Optional[Dict[str, Any]] = None

class CaseModel(BaseModel):
    case_id: str
    case_title: str
    officer_name: str
    agency: str = "Cyber Crime Investigation Cell"
    description: Optional[str] = ""
    created_at: str
    status: str = "ACTIVE" # ACTIVE, UNDER_REVIEW, CLOSED, ARCHIVED
    target_numbers: List[str] = []
    notes: List[Dict[str, str]] = []

class EvidenceModel(BaseModel):
    evidence_id: str
    case_id: str
    original_filename: str
    file_size_bytes: int
    sha256_hash: str
    uploaded_at: str
    analyst_name: str
    record_count: int
    verified: bool = True
    custody_log: List[Dict[str, str]] = []

class ColumnMapping(BaseModel):
    calling_number: str
    called_number: str
    call_date: Optional[str] = None
    call_time: Optional[str] = None
    datetime: Optional[str] = None
    duration: Optional[str] = None
    call_type: Optional[str] = None
    imei: Optional[str] = None
    imsi: Optional[str] = None
    cell_id: Optional[str] = None
    lac: Optional[str] = None
    tower_name: Optional[str] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None

