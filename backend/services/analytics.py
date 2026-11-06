from collections import defaultdict, Counter
from datetime import datetime
import math
from typing import List, Dict, Any, Optional
import pandas as pd

class AnalyticsEngine:
    @staticmethod
    def get_dashboard_summary(records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate high-level forensic KPI summary from CDR records"""
        if not records:
            return {
                "total_records": 0, "total_incoming": 0, "total_outgoing": 0,
                "total_sms": 0, "total_missed": 0, "unique_numbers": 0,
                "unique_imeis": 0, "unique_imsis": 0, "total_duration_seconds": 0,
                "total_duration_formatted": "00:00:00", "most_frequent_contact": "N/A",
                "longest_call_seconds": 0, "first_date": "N/A", "last_date": "N/A",
                "peak_hour": "N/A", "peak_day": "N/A"
            }

        total = len(records)
        incoming = sum(1 for r in records if r["call_type"] == "INCOMING")
        outgoing = sum(1 for r in records if r["call_type"] == "OUTGOING")
        sms = sum(1 for r in records if "SMS" in r["call_type"])
        missed = sum(1 for r in records if r["call_type"] == "MISSED")

        all_numbers = set()
        all_imeis = set()
        all_imsis = set()
        contact_counter = Counter()
        hourly_counter = Counter()
        day_counter = Counter()

        total_duration = 0
        longest_call = 0

        for r in records:
            c_from = r.get("calling_number", "")
            c_to = r.get("called_number", "")
            if c_from and c_from != "UNKNOWN": all_numbers.add(c_from)
            if c_to and c_to != "UNKNOWN": all_numbers.add(c_to)
            
            # Counterparty tracking
            contact_counter[c_from] += 1
            contact_counter[c_to] += 1

            if r.get("imei"): all_imeis.add(r["imei"])
            if r.get("imsi"): all_imsis.add(r["imsi"])

            dur = int(r.get("duration", 0))
            total_duration += dur
            if dur > longest_call:
                longest_call = dur

            dt_str = r.get("datetime", "")
            if dt_str:
                try:
                    dt = pd.to_datetime(dt_str)
                    hourly_counter[dt.hour] += 1
                    day_counter[dt.strftime("%A")] += 1
                except:
                    pass

        # Most frequent contact
        most_frequent = contact_counter.most_common(1)[0][0] if contact_counter else "N/A"
        
        # Peak hour and day
        peak_hour = f"{hourly_counter.most_common(1)[0][0]:02d}:00" if hourly_counter else "N/A"
        peak_day = day_counter.most_common(1)[0][0] if day_counter else "N/A"

        # Duration formatted
        hours = total_duration // 3600
        mins = (total_duration % 3600) // 60
        secs = total_duration % 60
        dur_fmt = f"{hours:02d}h {mins:02d}m {secs:02d}s"

        sorted_recs = sorted(records, key=lambda x: x.get("datetime", ""))
        first_date = sorted_recs[0].get("datetime", "N/A") if sorted_recs else "N/A"
        last_date = sorted_recs[-1].get("datetime", "N/A") if sorted_recs else "N/A"

        return {
            "total_records": total,
            "total_incoming": incoming,
            "total_outgoing": outgoing,
            "total_sms": sms,
            "total_missed": missed,
            "unique_numbers": len(all_numbers),
            "unique_imeis": len(all_imeis),
            "unique_imsis": len(all_imsis),
            "total_duration_seconds": total_duration,
            "total_duration_formatted": dur_fmt,
            "most_frequent_contact": most_frequent,
            "longest_call_seconds": longest_call,
            "first_date": first_date,
            "last_date": last_date,
            "peak_hour": peak_hour,
            "peak_day": peak_day
        }

    @staticmethod
    def analyze_calls(records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Detailed call types, duration distribution, hourly and day patterns"""
        type_counts = Counter(r["call_type"] for r in records)
        
        # Duration buckets
        buckets = {
            "Zero / Missed (0s)": 0,
            "Short (< 30s)": 0,
            "Medium (30s - 2m)": 0,
            "Long (2m - 10m)": 0,
            "Very Long (> 10m)": 0
        }
        
        for r in records:
            d = int(r.get("duration", 0))
            if d == 0:
                buckets["Zero / Missed (0s)"] += 1
            elif d < 30:
                buckets["Short (< 30s)"] += 1
            elif d <= 120:
                buckets["Medium (30s - 2m)"] += 1
            elif d <= 600:
                buckets["Long (2m - 10m)"] += 1
            else:
                buckets["Very Long (> 10m)"] += 1

        # Hourly distribution (0-23)
        hours = {h: 0 for h in range(24)}
        # Daily distribution
        daily = defaultdict(int)
        
        for r in records:
            dt_str = r.get("datetime", "")
            if dt_str:
                try:
                    dt = pd.to_datetime(dt_str)
                    hours[dt.hour] += 1
                    daily[dt.strftime("%Y-%m-%d")] += 1
                except:
                    pass

        # Top 10 longest calls
        longest_calls = sorted(records, key=lambda x: int(x.get("duration", 0)), reverse=True)[:10]

        return {
            "call_types": dict(type_counts),
            "duration_distribution": buckets,
            "hourly_distribution": hours,
            "daily_trend": [{"date": k, "count": v} for k, v in sorted(daily.items())],
            "top_longest_calls": longest_calls
        }

    @staticmethod
    def analyze_number(records: List[Dict[str, Any]], target_number: str) -> Dict[str, Any]:
        """Deep dive forensic profile of a specific telephone number"""
        target_norm = target_number.strip()
        if not target_norm.startswith("+"):
            if target_norm.startswith("91") and len(target_norm) == 12:
                target_norm = f"+{target_norm}"
            elif len(target_norm) == 10:
                target_norm = f"+91{target_norm}"
        
        matched = []
        for r in records:
            c1 = r.get("calling_number", "").strip()
            c2 = r.get("called_number", "").strip()
            if c1 == target_norm or c2 == target_norm or c1.endswith(target_norm[-10:]) or c2.endswith(target_norm[-10:]):
                matched.append(r)

        if not matched:
            return {"error": f"No records found for number: {target_number}"}

        incoming_count = sum(1 for r in matched if r["called_number"] == target_norm)
        outgoing_count = sum(1 for r in matched if r["calling_number"] == target_norm)
        total_duration = sum(int(r.get("duration", 0)) for r in matched)

        # Counterparties
        counterparties = Counter()
        for r in matched:
            other = r["calling_number"] if r["called_number"] == target_norm else r["called_number"]
            counterparties[other] += 1

        # Associated IMEIs & IMSIs
        observed_imeis = set(r["imei"] for r in matched if r.get("imei"))
        observed_imsis = set(r["imsi"] for r in matched if r.get("imsi"))
        observed_towers = Counter(r["tower_name"] for r in matched if r.get("tower_name"))

        sorted_recs = sorted(matched, key=lambda x: x.get("datetime", ""))

        return {
            "number": target_norm,
            "total_records": len(matched),
            "incoming_calls": incoming_count,
            "outgoing_calls": outgoing_count,
            "in_out_ratio": round(incoming_count / max(1, outgoing_count), 2),
            "total_duration_seconds": total_duration,
            "first_activity": sorted_recs[0]["datetime"],
            "last_activity": sorted_recs[-1]["datetime"],
            "unique_counterparties": len(counterparties),
            "top_contacts": [{"number": k, "calls": v} for k, v in counterparties.most_common(10)],
            "associated_imeis": list(observed_imeis),
            "associated_imsis": list(observed_imsis),
            "top_locations": [{"tower": k, "events": v} for k, v in observed_towers.most_common(5)],
            "recent_records": sorted_recs[-20:]
        }

    @staticmethod
    def analyze_datetime(records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Date, hour, night-time (23:00 - 05:00) analysis and heatmap matrix"""
        # 7 days x 24 hours matrix
        days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        matrix = {d: [0]*24 for d in days_of_week}
        
        night_calls = [] # 23:00 to 05:00
        hourly = {h: 0 for h in range(24)}
        daily = defaultdict(int)

        for r in records:
            dt_str = r.get("datetime", "")
            if dt_str:
                try:
                    dt = pd.to_datetime(dt_str)
                    day_name = dt.strftime("%A")
                    hour = dt.hour
                    matrix[day_name][hour] += 1
                    hourly[hour] += 1
                    daily[dt.strftime("%Y-%m-%d")] += 1

                    if hour in [23, 0, 1, 2, 3, 4]:
                        night_calls.append(r)
                except:
                    pass

        return {
            "heatmap_matrix": matrix,
            "hourly_totals": hourly,
            "daily_totals": [{"date": k, "count": v} for k, v in sorted(daily.items())],
            "night_activity_count": len(night_calls),
            "night_activity_percentage": round(len(night_calls) / max(1, len(records)) * 100, 1),
            "night_calls_sample": night_calls[:15]
        }

    @staticmethod
    def analyze_imei(records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """IMEI structure, device-swapping detection, number-to-IMEI associations"""
        imei_to_numbers = defaultdict(set)
        number_to_imeis = defaultdict(set)
        imei_timeline = defaultdict(list)

        for r in records:
            imei = r.get("imei", "").strip()
            if not imei: continue
            
            c_from = r.get("calling_number", "")
            c_to = r.get("called_number", "")
            
            if c_from:
                imei_to_numbers[imei].add(c_from)
                number_to_imeis[c_from].add(imei)
            if c_to:
                number_to_imeis[c_to].add(imei)

            imei_timeline[imei].append({
                "datetime": r.get("datetime"),
                "calling": c_from,
                "called": c_to,
                "cell_id": r.get("first_cell_id")
            })

        # Device switching alerts (Multiple IMEIs for single number, or multiple numbers on single IMEI)
        device_switches = []
        for num, imeis in number_to_imeis.items():
            if len(imeis) > 1 and num != "UNKNOWN":
                device_switches.append({
                    "phone_number": num,
                    "observed_imeis": list(imeis),
                    "switch_count": len(imeis),
                    "flag": "MULTIPLE_DEVICES_USED",
                    "note": f"Phone {num} was observed operating on {len(imeis)} different mobile devices (IMEIs)."
                })

        # TAC Identification (Type Allocation Code - first 8 digits)
        imei_details = []
        for imei, nums in imei_to_numbers.items():
            tac = imei[:8] if len(imei) >= 8 else "UNKNOWN"
            # Sample TAC manufacturer lookup
            device_model = "Generic Smartphone / 4G Handset"
            if tac.startswith("867543"):
                device_model = "Samsung Galaxy S-Series (TAC: 867543)"
            elif tac.startswith("354129"):
                device_model = "OnePlus Nord / Burner Handset (TAC: 354129)"
            elif tac.startswith("869104"):
                device_model = "Xiaomi Redmi Note Series (TAC: 869104)"

            sorted_events = sorted(imei_timeline[imei], key=lambda x: x["datetime"])
            imei_details.append({
                "imei": imei,
                "tac": tac,
                "estimated_model": device_model,
                "associated_numbers": list(nums),
                "total_events": len(sorted_events),
                "first_seen": sorted_events[0]["datetime"] if sorted_events else "N/A",
                "last_seen": sorted_events[-1]["datetime"] if sorted_events else "N/A"
            })

        return {
            "unique_imeis": len(imei_to_numbers),
            "device_switches": device_switches,
            "imei_inventory": imei_details
        }

    @staticmethod
    def analyze_imsi(records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """IMSI breakdown (MCC, MNC, MSIN), SIM card swaps"""
        imsi_to_numbers = defaultdict(set)
        imsi_timeline = defaultdict(list)

        for r in records:
            imsi = r.get("imsi", "").strip()
            if not imsi: continue
            
            c_from = r.get("calling_number", "")
            if c_from: imsi_to_numbers[imsi].add(c_from)
            imsi_timeline[imsi].append(r)

        imsi_inventory = []
        for imsi, nums in imsi_to_numbers.items():
            mcc = imsi[:3] if len(imsi) >= 3 else "N/A"
            mnc = imsi[3:5] if len(imsi) >= 5 else "N/A"
            msin = imsi[5:] if len(imsi) > 5 else "N/A"
            
            country = "India (MCC 404/405)" if mcc in ["404", "405"] else "International"
            operator = "Airtel / Jio / Vi" if mcc in ["404", "405"] else "Unknown"

            sorted_events = sorted(imsi_timeline[imsi], key=lambda x: x.get("datetime", ""))
            imsi_inventory.append({
                "imsi": imsi,
                "mcc": mcc,
                "mnc": mnc,
                "msin": msin,
                "country": country,
                "operator_circle": operator,
                "associated_numbers": list(nums),
                "event_count": len(sorted_events),
                "first_seen": sorted_events[0]["datetime"] if sorted_events else "N/A",
                "last_seen": sorted_events[-1]["datetime"] if sorted_events else "N/A"
            })

        return {
            "unique_imsis": len(imsi_to_numbers),
            "imsi_inventory": imsi_inventory
        }

    @staticmethod
    def analyze_towers(records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Cell Tower usage, serving cell handovers, sector information"""
        tower_counter = Counter()
        cell_counter = Counter()
        transitions = []
        last_cell = None
        last_dt = None

        for r in records:
            tower = r.get("tower_name")
            cell = r.get("first_cell_id")
            dt = r.get("datetime")
            
            if tower: tower_counter[tower] += 1
            if cell: cell_counter[cell] += 1

            if last_cell and cell and cell != last_cell:
                transitions.append({
                    "from_cell": last_cell,
                    "to_cell": cell,
                    "datetime": dt,
                    "prev_datetime": last_dt
                })
            if cell:
                last_cell = cell
                last_dt = dt

        return {
            "top_towers": [{"tower": k, "count": v} for k, v in tower_counter.most_common(10)],
            "top_cell_ids": [{"cell_id": k, "count": v} for k, v in cell_counter.most_common(10)],
            "total_cell_transitions": len(transitions),
            "recent_transitions": transitions[-15:]
        }

    @staticmethod
    def analyze_geolocation(records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Geographical tower locations and chronological movement trajectory"""
        geo_records = [r for r in records if r.get("latitude") and r.get("longitude")]
        
        tower_map = {}
        for r in geo_records:
            t_key = f"{r['latitude']},{r['longitude']}"
            if t_key not in tower_map:
                tower_map[t_key] = {
                    "lat": r["latitude"],
                    "lon": r["longitude"],
                    "tower_name": r.get("tower_name", "Unknown Tower"),
                    "cell_id": r.get("first_cell_id", ""),
                    "lac": r.get("lac", ""),
                    "operator": r.get("operator", ""),
                    "event_count": 0,
                    "first_seen": r.get("datetime"),
                    "last_seen": r.get("datetime")
                }
            tower_map[t_key]["event_count"] += 1
            tower_map[t_key]["last_seen"] = r.get("datetime")

        # Chronological waypoint route
        sorted_geo = sorted(geo_records, key=lambda x: x["datetime"])
        trajectory = []
        last_coord = None
        for r in sorted_geo:
            coord = (r["latitude"], r["longitude"])
            if coord != last_coord:
                trajectory.append({
                    "lat": r["latitude"],
                    "lon": r["longitude"],
                    "tower_name": r.get("tower_name"),
                    "datetime": r.get("datetime"),
                    "call_type": r.get("call_type")
                })
                last_coord = coord

        return {
            "has_geolocation_data": len(geo_records) > 0,
            "total_geo_events": len(geo_records),
            "unique_tower_sites": list(tower_map.values()),
            "chronological_trajectory": trajectory,
            "disclaimer": "Serving cell coverage coordinates represent approximate radio sector areas, NOT real-time GPS locations of individuals."
        }

    @staticmethod
    def analyze_network_graph(records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Build communication network graph: nodes (numbers) and edges (call frequencies)"""
        nodes_dict = {}
        edges_dict = {}

        for r in records:
            src = r.get("calling_number", "").strip()
            dst = r.get("called_number", "").strip()
            if not src or not dst or src == "UNKNOWN" or dst == "UNKNOWN":
                continue

            for num in [src, dst]:
                if num not in nodes_dict:
                    nodes_dict[num] = {"id": num, "label": num, "call_count": 0, "total_duration": 0}
                nodes_dict[num]["call_count"] += 1
                nodes_dict[num]["total_duration"] += int(r.get("duration", 0))

            edge_key = f"{src}->{dst}"
            if edge_key not in edges_dict:
                edges_dict[edge_key] = {
                    "source": src,
                    "target": dst,
                    "weight": 0,
                    "total_duration": 0,
                    "call_types": Counter()
                }
            edges_dict[edge_key]["weight"] += 1
            edges_dict[edge_key]["total_duration"] += int(r.get("duration", 0))
            edges_dict[edge_key]["call_types"][r.get("call_type", "CALL")] += 1

        # Format edges
        edges_list = []
        for k, v in edges_dict.items():
            edges_list.append({
                "source": v["source"],
                "target": v["target"],
                "calls": v["weight"],
                "duration": v["total_duration"],
                "types": dict(v["call_types"])
            })

        return {
            "nodes": list(nodes_dict.values()),
            "edges": edges_list
        }

    @staticmethod
    def detect_patterns_and_anomalies(records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Rule-based forensic pattern detection and investigative lead generation"""
        anomalies = []
        
        # 1. Midnight / Late Night Burst (23:00 - 05:00)
        night_calls = [r for r in records if r.get("datetime") and pd.to_datetime(r["datetime"]).hour in [23, 0, 1, 2, 3, 4]]
        if len(night_calls) >= 5:
            anomalies.append({
                "anomaly_id": "PAT-001",
                "title": "Unusual Late-Night Communication Spike",
                "severity": "HIGH",
                "indicator": f"{len(night_calls)} calls/SMS occurred between 23:00 and 05:00 hours.",
                "explanation": "High volume of nocturnal communications is atypical for regular business activity and warrants investigation.",
                "supporting_records_count": len(night_calls),
                "supporting_sample": night_calls[:5],
                "confidence": "HIGH"
            })

        # 2. Burner Device / IMEI Swap Check
        num_to_imeis = defaultdict(set)
        for r in records:
            if r.get("imei") and r.get("calling_number"):
                num_to_imeis[r["calling_number"]].add(r["imei"])
        
        for num, imeis in num_to_imeis.items():
            if len(imeis) > 1 and num != "UNKNOWN":
                anomalies.append({
                    "anomaly_id": f"PAT-DEV-{num[-4:]}",
                    "title": f"Device / Handset Switching Observed ({num})",
                    "severity": "CRITICAL",
                    "indicator": f"Target {num} transitioned across {len(imeis)} different IMEIs: {', '.join(imeis)}.",
                    "explanation": "Multiple physical devices utilized for the same SIM card indicates deliberate handset swaps or burner handset usage.",
                    "supporting_records_count": len(imeis),
                    "confidence": "HIGH"
                })

        # 3. Repeated Short / Dropped Calls (Pings / Signaling)
        short_calls = [r for r in records if 0 < int(r.get("duration", 0)) <= 15]
        if len(short_calls) >= 8:
            anomalies.append({
                "anomaly_id": "PAT-003",
                "title": "Repeated Short-Duration / Signal Calls",
                "severity": "MEDIUM",
                "indicator": f"{len(short_calls)} calls observed with duration under 15 seconds.",
                "explanation": "Frequent brief calls can signify covert signaling, missed call codes, or unstable cellular coverage.",
                "supporting_records_count": len(short_calls),
                "supporting_sample": short_calls[:5],
                "confidence": "MEDIUM"
            })

        # 4. Rapid Geographical Cell Jump (Impossible transit speed)
        geo_recs = sorted([r for r in records if r.get("latitude") and r.get("longitude") and r.get("datetime")], key=lambda x: x["datetime"])
        rapid_jumps = []
        for i in range(len(geo_recs) - 1):
            r1 = geo_recs[i]
            r2 = geo_recs[i+1]
            t1 = pd.to_datetime(r1["datetime"])
            t2 = pd.to_datetime(r2["datetime"])
            time_diff_hours = (t2 - t1).total_seconds() / 3600.0

            if 0 < time_diff_hours <= 0.5: # within 30 mins
                # Haversine distance in km
                lat1, lon1 = math.radians(r1["latitude"]), math.radians(r1["longitude"])
                lat2, lon2 = math.radians(r2["latitude"]), math.radians(r2["longitude"])
                dlat = lat2 - lat1
                dlon = lon2 - lon1
                a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
                c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
                dist_km = 6371 * c

                speed_kmh = dist_km / time_diff_hours
                if speed_kmh > 120 and dist_km > 20: # over 120 km/h
                    rapid_jumps.append({
                        "from_tower": r1.get("tower_name"),
                        "to_tower": r2.get("tower_name"),
                        "distance_km": round(dist_km, 2),
                        "time_diff_minutes": round(time_diff_hours * 60, 1),
                        "speed_kmh": round(speed_kmh, 1),
                        "time_window": f"{r1['datetime']} -> {r2['datetime']}"
                    })

        if rapid_jumps:
            anomalies.append({
                "anomaly_id": "PAT-GEO-01",
                "title": "Rapid Cell Tower Transition / High Transit Velocity",
                "severity": "HIGH",
                "indicator": f"{len(rapid_jumps)} transitions with apparent velocity > 120 km/h.",
                "explanation": "Suggests rapid vehicular travel along transit corridors or network handover between distant sectors.",
                "supporting_records_count": len(rapid_jumps),
                "supporting_sample": rapid_jumps[:3],
                "confidence": "HIGH"
            })

        # 5. Sudden Communication Burst (Daily spike)
        daily_counts = Counter(r.get("call_date") for r in records if r.get("call_date"))
        if daily_counts:
            avg_daily = sum(daily_counts.values()) / len(daily_counts)
            for d, count in daily_counts.items():
                if count > avg_daily * 2.2 and count >= 25:
                    anomalies.append({
                        "anomaly_id": f"PAT-SPIKE-{d}",
                        "title": f"Activity Spike on {d} ({count} calls)",
                        "severity": "HIGH",
                        "indicator": f"Daily volume ({count} calls) was {round(count/avg_daily, 1)}x higher than baseline ({round(avg_daily, 1)} calls/day).",
                        "explanation": "Dramatic spike in volume often corresponds to the date of incident planning or execution.",
                        "supporting_records_count": count,
                        "confidence": "HIGH"
                    })

        return anomalies

    @staticmethod
    def compare_multiple_cdrs(records_1: List[Dict[str, Any]], records_2: List[Dict[str, Any]], label_1: str = "CDR 1", label_2: str = "CDR 2") -> Dict[str, Any]:
        """Cross-link analysis between 2 distinct CDR files or target subscribers"""
        contacts_1 = set()
        towers_1 = set()
        imeis_1 = set()
        for r in records_1:
            contacts_1.add(r["calling_number"])
            contacts_1.add(r["called_number"])
            if r.get("tower_name"): towers_1.add(r["tower_name"])
            if r.get("imei"): imeis_1.add(r["imei"])

        contacts_2 = set()
        towers_2 = set()
        imeis_2 = set()
        for r in records_2:
            contacts_2.add(r["calling_number"])
            contacts_2.add(r["called_number"])
            if r.get("tower_name"): towers_2.add(r["tower_name"])
            if r.get("imei"): imeis_2.add(r["imei"])

        common_contacts = contacts_1.intersection(contacts_2) - {"UNKNOWN", ""}
        common_towers = towers_1.intersection(towers_2)
        common_imeis = imeis_1.intersection(imeis_2)

        # Check direct communication between the two datasets
        direct_calls = []
        for r in records_1:
            if r["called_number"] in contacts_2 or r["calling_number"] in contacts_2:
                direct_calls.append(r)

        return {
            "label_1": label_1,
            "label_2": label_2,
            "cdr_1_records": len(records_1),
            "cdr_2_records": len(records_2),
            "common_contacts_count": len(common_contacts),
            "common_contacts": list(common_contacts),
            "common_towers_count": len(common_towers),
            "common_towers": list(common_towers),
            "common_imeis_count": len(common_imeis),
            "common_imeis": list(common_imeis),
            "direct_communications_found": len(direct_calls),
            "direct_calls_sample": direct_calls[:10]
        }
