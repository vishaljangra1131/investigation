import hashlib
import io
import json
import re
from datetime import datetime
from typing import Dict, List, Tuple, Any, Optional
import pandas as pd

class CDRService:
    @staticmethod
    def calculate_sha256(content: bytes) -> str:
        """Calculate SHA-256 cryptographic hash of uploaded bytes for chain-of-custody"""
        hasher = hashlib.sha256()
        hasher.update(content)
        return hasher.hexdigest().upper()

    @staticmethod
    def detect_columns(columns: List[str]) -> Dict[str, str]:
        """Automatically identify CDR columns regardless of telecom provider format"""
        normalized_cols = {col.lower().strip().replace(" ", "_").replace("-", "_"): col for col in columns}
        mapping = {}

        patterns = {
            "calling_number": [
                r"^calling.*", r"^a_party.*", r"^caller.*", r"^source.*", r"^orig.*", 
                r"^msisdn_a.*", r"^from.*", r"^calling_no", r"^calling_number"
            ],
            "called_number": [
                r"^called.*", r"^b_party.*", r"^callee.*", r"^dest.*", r"^term.*", 
                r"^msisdn_b.*", r"^to.*", r"^called_no", r"^called_number"
            ],
            "call_date": [r"^call_date.*", r"^date$", r"^start_date.*", r"^event_date.*"],
            "call_time": [r"^call_time.*", r"^time$", r"^start_time.*", r"^event_time.*"],
            "datetime": [r"^date_?time.*", r"^timestamp.*", r"^call_timestamp.*", r"^start_datetime.*"],
            "duration": [r"^duration.*", r"^call_duration.*", r"^talk_time.*", r"^sec.*", r"^dur_sec.*"],
            "call_type": [r"^call_type.*", r"^type$", r"^direction.*", r"^service_type.*", r"^record_type.*"],
            "imei": [r"^imei.*", r"^device_id.*", r"^handset_id.*", r"^imei_a.*"],
            "imsi": [r"^imsi.*", r"^sim_id.*", r"^imsi_a.*"],
            "first_cell_id": [r"^first_cell.*", r"^cell_id.*", r"^cellid.*", r"^cgi.*", r"^ecgi.*", r"^start_cell.*"],
            "last_cell_id": [r"^last_cell.*", r"^end_cell.*", r"^last_cgi.*"],
            "lac": [r"^lac.*", r"^location_area.*", r"^tac.*"],
            "tower_name": [r"^tower_name.*", r"^site_name.*", r"^cell_name.*", r"^location.*", r"^site.*"],
            "latitude": [r"^lat.*", r"^latitude.*", r"^tower_lat.*"],
            "longitude": [r"^lon.*", r"^long.*", r"^longitude.*", r"^tower_lon.*"],
            "network_technology": [r"^tech.*", r"^technology.*", r"^network_tech.*", r"^rat.*"],
            "roaming": [r"^roaming.*", r"^roam.*"],
            "operator": [r"^operator.*", r"^service_provider.*", r"^telecom.*", r"^sp.*"]
        }

        for std_key, regex_list in patterns.items():
            for norm_key, orig_col in normalized_cols.items():
                if std_key in mapping:
                    continue
                for pat in regex_list:
                    if re.match(pat, norm_key):
                        mapping[std_key] = orig_col
                        break

        return mapping

    @staticmethod
    def normalize_phone_number(number: Any) -> str:
        """Standardize phone numbers: strip extra symbols while retaining international + if present"""
        if pd.isna(number) or not number:
            return "UNKNOWN"
        num_str = str(number).strip()
        # Keep leading '+' if exists, then digits
        has_plus = num_str.startswith("+")
        digits = re.sub(r"\D", "", num_str)
        if not digits:
            return "UNKNOWN"
        if has_plus:
            return f"+{digits}"
        if len(digits) == 10:
            return f"+91{digits}" # Standardize 10 digit Indian numbers to +91
        if len(digits) == 12 and digits.startswith("91"):
            return f"+{digits}"
        return digits

    @staticmethod
    def parse_file(content: bytes, filename: str, custom_mapping: Optional[Dict[str, str]] = None) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
        """Parse raw file bytes (CSV, XLSX, XLS, JSON, TXT) and return normalized records + validation metrics"""
        filename_lower = filename.lower()
        
        try:
            if filename_lower.endswith(".csv") or filename_lower.endswith(".txt"):
                # Detect separator
                text_sample = content[:4096].decode("utf-8", errors="ignore")
                sep = ","
                if "\t" in text_sample and text_sample.count("\t") > text_sample.count(","):
                    sep = "\t"
                elif ";" in text_sample and text_sample.count(";") > text_sample.count(","):
                    sep = ";"
                df = pd.read_csv(io.BytesIO(content), sep=sep, dtype=str)
            elif filename_lower.endswith(".xlsx") or filename_lower.endswith(".xls"):
                df = pd.read_excel(io.BytesIO(content), dtype=str)
            elif filename_lower.endswith(".json"):
                data = json.loads(content.decode("utf-8", errors="ignore"))
                df = pd.DataFrame(data)
            else:
                raise ValueError("Unsupported file format. Please upload CSV, XLSX, XLS, JSON, or TXT.")
        except Exception as e:
            raise ValueError(f"Error parsing file: {str(e)}")

        raw_columns = list(df.columns)
        auto_map = CDRService.detect_columns(raw_columns)
        
        # Override with custom mapping if provided
        mapping = auto_map.copy()
        if custom_mapping:
            for k, v in custom_mapping.items():
                if v and v in raw_columns:
                    mapping[k] = v

        # Validation counters
        total_raw_rows = len(df)
        duplicates_count = int(df.duplicated().sum())
        missing_numbers = 0
        invalid_dates = 0
        zero_duration_calls = 0

        records = []
        for idx, row in df.iterrows():
            rec_id = row.get("record_id", f"REC-{idx+10001}")
            
            # Calling & Called Numbers
            calling_col = mapping.get("calling_number")
            called_col = mapping.get("called_number")
            
            raw_calling = str(row[calling_col]) if calling_col and pd.notna(row.get(calling_col)) else ""
            raw_called = str(row[called_col]) if called_col and pd.notna(row.get(called_col)) else ""
            
            calling_norm = CDRService.normalize_phone_number(raw_calling)
            called_norm = CDRService.normalize_phone_number(raw_called)
            
            if calling_norm == "UNKNOWN" or called_norm == "UNKNOWN":
                missing_numbers += 1

            # Date & Time Handling
            dt_col = mapping.get("datetime")
            date_col = mapping.get("call_date")
            time_col = mapping.get("call_time")

            dt_str = ""
            date_str = ""
            time_str = ""

            if dt_col and pd.notna(row.get(dt_col)):
                raw_dt = str(row[dt_col]).strip()
                try:
                    dt_obj = pd.to_datetime(raw_dt)
                    date_str = dt_obj.strftime("%Y-%m-%d")
                    time_str = dt_obj.strftime("%H:%M:%S")
                    dt_str = dt_obj.strftime("%Y-%m-%d %H:%M:%S")
                except:
                    invalid_dates += 1
            
            if not dt_str:
                raw_d = str(row[date_col]).strip() if date_col and pd.notna(row.get(date_col)) else ""
                raw_t = str(row[time_col]).strip() if time_col and pd.notna(row.get(time_col)) else "00:00:00"
                try:
                    dt_obj = pd.to_datetime(f"{raw_d} {raw_t}")
                    date_str = dt_obj.strftime("%Y-%m-%d")
                    time_str = dt_obj.strftime("%H:%M:%S")
                    dt_str = dt_obj.strftime("%Y-%m-%d %H:%M:%S")
                except:
                    invalid_dates += 1
                    date_str = raw_d or "1970-01-01"
                    time_str = raw_t or "00:00:00"
                    dt_str = f"{date_str} {time_str}"

            # Duration
            dur_col = mapping.get("duration")
            dur_val = 0
            if dur_col and pd.notna(row.get(dur_col)):
                try:
                    raw_dur = str(row[dur_col]).strip()
                    if ":" in raw_dur: # hh:mm:ss
                        parts = [int(p) for p in raw_dur.split(":")]
                        if len(parts) == 3:
                            dur_val = parts[0]*3600 + parts[1]*60 + parts[2]
                        elif len(parts) == 2:
                            dur_val = parts[0]*60 + parts[1]
                    else:
                        dur_val = int(float(raw_dur))
                except:
                    dur_val = 0
            
            if dur_val == 0:
                zero_duration_calls += 1

            # Call Type
            type_col = mapping.get("call_type")
            call_type = "OUTGOING"
            if type_col and pd.notna(row.get(type_col)):
                raw_type = str(row[type_col]).upper().strip()
                if "MISS" in raw_type:
                    call_type = "MISSED"
                elif "SMS" in raw_type:
                    call_type = "SMS_OUT" if ("OUT" in raw_type or "MO" in raw_type) else "SMS_IN"
                elif "OUT" in raw_type or "MO" in raw_type or raw_type == "O":
                    call_type = "OUTGOING"
                elif "INCOMING" in raw_type or raw_type.startswith("IN") or "MT" in raw_type or "REC" in raw_type or raw_type == "I":
                    call_type = "INCOMING"
                else:
                    call_type = raw_type

            # Lat/Lon
            lat_col = mapping.get("latitude")
            lon_col = mapping.get("longitude")
            lat_val = None
            lon_val = None
            try:
                if lat_col and pd.notna(row.get(lat_col)):
                    lat_val = float(str(row[lat_col]).strip())
                if lon_col and pd.notna(row.get(lon_col)):
                    lon_val = float(str(row[lon_col]).strip())
            except:
                pass

            record = {
                "record_id": str(rec_id),
                "calling_number": calling_norm,
                "called_number": called_norm,
                "call_date": date_str,
                "call_time": time_str,
                "datetime": dt_str,
                "duration": dur_val,
                "call_type": call_type,
                "imei": str(row[mapping["imei"]]).strip() if "imei" in mapping and pd.notna(row.get(mapping["imei"])) else "",
                "imsi": str(row[mapping["imsi"]]).strip() if "imsi" in mapping and pd.notna(row.get(mapping["imsi"])) else "",
                "first_cell_id": str(row[mapping["first_cell_id"]]).strip() if "first_cell_id" in mapping and pd.notna(row.get(mapping["first_cell_id"])) else "",
                "last_cell_id": str(row[mapping["last_cell_id"]]).strip() if "last_cell_id" in mapping and pd.notna(row.get(mapping["last_cell_id"])) else "",
                "lac": str(row[mapping["lac"]]).strip() if "lac" in mapping and pd.notna(row.get(mapping["lac"])) else "",
                "tower_name": str(row[mapping["tower_name"]]).strip() if "tower_name" in mapping and pd.notna(row.get(mapping["tower_name"])) else "",
                "latitude": lat_val,
                "longitude": lon_val,
                "network_technology": str(row[mapping["network_technology"]]).strip() if "network_technology" in mapping and pd.notna(row.get(mapping["network_technology"])) else "4G",
                "roaming": str(row[mapping["roaming"]]).strip() if "roaming" in mapping and pd.notna(row.get(mapping["roaming"])) else "HOME",
                "operator": str(row[mapping["operator"]]).strip() if "operator" in mapping and pd.notna(row.get(mapping["operator"])) else "Telecom"
            }
            records.append(record)

        # Sort by datetime
        records.sort(key=lambda r: r["datetime"])

        validation_summary = {
            "total_rows": total_raw_rows,
            "processed_records": len(records),
            "duplicates_detected": duplicates_count,
            "missing_or_unknown_numbers": missing_numbers,
            "invalid_dates": invalid_dates,
            "zero_duration_or_missed_calls": zero_duration_calls,
            "columns_detected": auto_map,
            "raw_columns": raw_columns,
            "data_quality_score": max(10, min(100, 100 - (missing_numbers * 2 + invalid_dates * 5)))
        }

        return records, validation_summary
