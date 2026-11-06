"""
Generate rich synthetic CDR and IPDR datasets for CDR ANALYSIS PRO.
All phone numbers, IMEIs, IMSIs, and names are completely fictional for investigative demo & training purposes.
"""
import csv
import json
import random
from datetime import datetime, timedelta

random.seed(42)

# Fictional Tower Database in Delhi NCR region
TOWERS = [
    {"tower_id": "DEL-CP-01", "name": "Connaught Place Inner Circle", "lac": "1201", "cell_id": "404-45-1201-1001", "lat": 28.6315, "lon": 77.2167, "operator": "Airtel", "azimuth": 60},
    {"tower_id": "DEL-CP-02", "name": "Connaught Place Barakhamba", "lac": "1201", "cell_id": "404-45-1201-1002", "lat": 28.6290, "lon": 77.2280, "operator": "Airtel", "azimuth": 180},
    {"tower_id": "DEL-NP-01", "name": "Nehru Place Commercial Complex", "lac": "1202", "cell_id": "404-45-1202-2001", "lat": 28.5494, "lon": 77.2530, "operator": "Jio", "azimuth": 0},
    {"tower_id": "DEL-NP-02", "name": "Nehru Place Outer Ring Rd", "lac": "1202", "cell_id": "404-45-1202-2002", "lat": 28.5450, "lon": 77.2580, "operator": "Jio", "azimuth": 120},
    {"tower_id": "DEL-ROH-01", "name": "Rohini Sector 7 Hub", "lac": "1203", "cell_id": "404-45-1203-3001", "lat": 28.7041, "lon": 77.1025, "operator": "Vi", "azimuth": 90},
    {"tower_id": "DEL-ROH-02", "name": "Rohini Sector 14 Metro", "lac": "1203", "cell_id": "404-45-1203-3002", "lat": 28.7180, "lon": 77.1210, "operator": "Vi", "azimuth": 270},
    {"tower_id": "DEL-GUR-01", "name": "Gurugram CyberHub Phase 2", "lac": "1204", "cell_id": "404-45-1204-4001", "lat": 28.4986, "lon": 77.0892, "operator": "Airtel", "azimuth": 45},
    {"tower_id": "DEL-GUR-02", "name": "Gurugram Golf Course Rd", "lac": "1204", "cell_id": "404-45-1204-4002", "lat": 28.4650, "lon": 77.1050, "operator": "Airtel", "azimuth": 180},
    {"tower_id": "DEL-NOI-01", "name": "Noida Sector 62 Tech Park", "lac": "1205", "cell_id": "404-45-1205-5001", "lat": 28.6280, "lon": 77.3649, "operator": "Jio", "azimuth": 300},
    {"tower_id": "DEL-NOI-02", "name": "Noida Sector 18 Market", "lac": "1205", "cell_id": "404-45-1205-5002", "lat": 28.5700, "lon": 77.3200, "operator": "Jio", "azimuth": 150},
    {"tower_id": "DEL-AERO-01", "name": "IGI Airport Terminal 3", "lac": "1206", "cell_id": "404-45-1206-6001", "lat": 28.5562, "lon": 77.0863, "operator": "Vi", "azimuth": 0},
    {"tower_id": "DEL-KB-01", "name": "Karol Bagh Market", "lac": "1207", "cell_id": "404-45-1207-7001", "lat": 28.6517, "lon": 77.1906, "operator": "Airtel", "azimuth": 90},
    {"tower_id": "DEL-DWK-01", "name": "Dwarka Sector 21", "lac": "1208", "cell_id": "404-45-1208-8001", "lat": 28.5520, "lon": 77.0580, "operator": "Jio", "azimuth": 240},
    {"tower_id": "DEL-LKP-01", "name": "Lajpat Nagar Central Market", "lac": "1209", "cell_id": "404-45-1209-9001", "lat": 28.5680, "lon": 77.2430, "operator": "Airtel", "azimuth": 180}
]

def generate_cdr_1():
    """Generate CDR for Primary Target: +919876543210 (Suspect A - Raj Malhotra [Fictional])"""
    records = []
    target_number = "+919876543210"
    
    # Key contacts
    contacts = [
        {"number": "+919811223344", "role": "Suspect B (Vikram - Accomplice)", "prob": 0.28},
        {"number": "+919822334455", "role": "Associate C (Karan - Logistics)", "prob": 0.18},
        {"number": "+919833445566", "role": "Burner Contact (Unknown Source)", "prob": 0.12},
        {"number": "+919844556677", "role": "Courier / Driver (Ramesh)", "prob": 0.08},
        {"number": "+919855667788", "role": "Family (Wife / Fictional)", "prob": 0.10},
        {"number": "+919866778899", "role": "Lawyer / Associate", "prob": 0.06},
        {"number": "+919899001122", "role": "Money Handler / Hawala", "prob": 0.09},
        {"number": "+919100112233", "role": "Random / Delivery / Spam", "prob": 0.05},
        {"number": "+919200223344", "role": "Hotel Front Desk", "prob": 0.04}
    ]

    base_time = datetime(2026, 10, 15, 8, 30, 0)
    
    # Device A (Original Samsung Galaxy S22: TAC 867543)
    imei_primary = "867543048912345"
    imsi_primary = "404450123456789"
    
    # Swapped Device B (Burner OnePlus: TAC 354129) on Oct 22
    imei_burner = "354129087654321"
    imsi_burner = "404450987654321"
    
    record_id = 10001
    
    # Generate 180 records across 12 days
    current_time = base_time
    for day in range(12):
        day_date = (base_time + timedelta(days=day)).date()
        # Incident day is day 6 (Oct 21) - heavy spike and late night activity!
        if day == 6:
            calls_today = 35
        elif day == 7: # Post-incident burner switch day
            calls_today = 26
        elif day in [4, 5]:
            calls_today = 20
        else:
            calls_today = random.randint(10, 16)
            
        for _ in range(calls_today):
            # Pick hour with realistic patterns
            if day == 6: # Incident day: midnight & late night burst
                hour = random.choice([0, 1, 2, 3, 4, 11, 14, 18, 22, 23, 23])
            else:
                hour = random.choices(
                    list(range(24)),
                    weights=[1, 1, 0, 0, 0, 1, 3, 5, 8, 10, 12, 11, 9, 10, 11, 12, 10, 9, 8, 7, 5, 4, 3, 2]
                )[0]
                
            minute = random.randint(0, 59)
            second = random.randint(0, 59)
            call_dt = datetime(day_date.year, day_date.month, day_date.day, hour, minute, second)
            
            # Contact selection
            selected_contact = random.choices(contacts, weights=[c["prob"] for c in contacts])[0]["number"]
            
            # Incoming vs Outgoing
            call_type = random.choices(["OUTGOING", "INCOMING", "MISSED", "SMS_OUT", "SMS_IN"], weights=[45, 35, 8, 7, 5])[0]
            
            if call_type == "MISSED":
                duration = 0
            elif "SMS" in call_type:
                duration = 0
            else:
                if selected_contact == "+919811223344" and day == 6:
                    # Urgent short burst calls right before incident
                    duration = random.choice([12, 18, 24, 35, 420])
                else:
                    duration = random.choice([15, 45, 90, 180, 240, 360, 620, 85, 40])
                    
            if call_type in ["OUTGOING", "SMS_OUT"]:
                calling_p = target_number
                called_p = selected_contact
            else:
                calling_p = selected_contact
                called_p = target_number
                
            # Device switch on or after Oct 22 (day 7)
            if day >= 7:
                imei = imei_burner
                imsi = imsi_burner
            else:
                imei = imei_primary
                imsi = imsi_primary
                
            # Location progression
            if day in [0, 1]:
                tower = random.choice([TOWERS[0], TOWERS[1], TOWERS[11]]) # Central Delhi / CP / Karol Bagh
            elif day in [2, 3]:
                tower = random.choice([TOWERS[6], TOWERS[7]]) # Gurugram
            elif day in [4, 5]:
                tower = random.choice([TOWERS[2], TOWERS[3], TOWERS[13]]) # South Delhi / Nehru Place
            elif day == 6: # Incident day - moved from Rohini to CP to Gurugram
                if hour < 6:
                    tower = TOWERS[4] # Rohini night
                elif hour < 14:
                    tower = TOWERS[0] # CP
                elif hour < 20:
                    tower = TOWERS[8] # Noida
                else:
                    tower = TOWERS[6] # Gurugram CyberHub midnight
            elif day in [7, 8]:
                tower = random.choice([TOWERS[10], TOWERS[12]]) # Airport / Dwarka (Fleeing / burner active)
            else:
                tower = random.choice([TOWERS[0], TOWERS[6], TOWERS[8]])
                
            first_cell = tower["cell_id"]
            # Handover during long calls
            if duration > 120 and random.random() > 0.5:
                last_cell = f"{first_cell[:-1]}{int(first_cell[-1]) + 1}"
            else:
                last_cell = first_cell
                
            records.append({
                "record_id": f"CDR-{record_id}",
                "calling_number": calling_p,
                "called_number": called_p,
                "call_date": call_dt.strftime("%Y-%m-%d"),
                "call_time": call_dt.strftime("%H:%M:%S"),
                "datetime": call_dt.strftime("%Y-%m-%d %H:%M:%S"),
                "duration": duration,
                "call_type": call_type,
                "imei": imei,
                "imsi": imsi,
                "first_cell_id": first_cell,
                "last_cell_id": last_cell,
                "lac": tower["lac"],
                "tower_name": tower["name"],
                "latitude": tower["lat"],
                "longitude": tower["lon"],
                "network_technology": "4G" if random.random() > 0.25 else "5G",
                "roaming": "HOME",
                "operator": tower["operator"]
            })
            record_id += 1
            
    # Sort chronologically
    records.sort(key=lambda r: r["datetime"])
    return records


def generate_cdr_2():
    """Generate CDR for Suspect B: +919811223344 (Vikram Singhania [Fictional]) for multi-CDR link analysis"""
    records = []
    target_number = "+919811223344"
    
    contacts = [
        {"number": "+919876543210", "prob": 0.35}, # Suspect A
        {"number": "+919822334455", "prob": 0.25}, # Shared accomplice C
        {"number": "+919899001122", "prob": 0.15}, # Shared money handler
        {"number": "+919911224455", "prob": 0.15}, # Own associate
        {"number": "+919933447788", "prob": 0.10}  # Supplier
    ]
    
    base_time = datetime(2026, 10, 17, 9, 0, 0)
    record_id = 20001
    
    imei_b = "869104051234567"
    imsi_b = "404450555666777"
    
    for day in range(8):
        day_date = (base_time + timedelta(days=day)).date()
        calls_today = random.randint(12, 22)
        for _ in range(calls_today):
            hour = random.choice([1, 2, 9, 11, 14, 16, 19, 21, 23])
            call_dt = datetime(day_date.year, day_date.month, day_date.day, hour, random.randint(0, 59), random.randint(0, 59))
            contact = random.choices(contacts, weights=[c["prob"] for c in contacts])[0]["number"]
            call_type = random.choice(["OUTGOING", "INCOMING", "MISSED", "SMS_OUT"])
            duration = 0 if call_type in ["MISSED", "SMS_OUT"] else random.choice([20, 60, 150, 320, 750])
            
            calling_p = target_number if "OUT" in call_type else contact
            called_p = contact if "OUT" in call_type else target_number
            
            # Overlapping locations on incident day (Oct 21)
            if day_date.day == 21:
                tower = TOWERS[0] if hour < 16 else TOWERS[6] # CP and Gurugram coincident with Suspect A!
            else:
                tower = random.choice([TOWERS[0], TOWERS[6], TOWERS[8], TOWERS[11]])
                
            records.append({
                "record_id": f"CDR-{record_id}",
                "calling_number": calling_p,
                "called_number": called_p,
                "call_date": call_dt.strftime("%Y-%m-%d"),
                "call_time": call_dt.strftime("%H:%M:%S"),
                "datetime": call_dt.strftime("%Y-%m-%d %H:%M:%S"),
                "duration": duration,
                "call_type": call_type,
                "imei": imei_b,
                "imsi": imsi_b,
                "first_cell_id": tower["cell_id"],
                "last_cell_id": tower["cell_id"],
                "lac": tower["lac"],
                "tower_name": tower["name"],
                "latitude": tower["lat"],
                "longitude": tower["lon"],
                "network_technology": "4G",
                "roaming": "HOME",
                "operator": tower["operator"]
            })
            record_id += 1
            
    records.sort(key=lambda r: r["datetime"])
    return records


def generate_ipdr():
    """Generate realistic IPDR (Internet Protocol Detail Record) data"""
    ipdr_records = []
    target_msisdn = "+919876543210"
    
    services = [
        {"app": "Telegram Messenger (Encrypted VoIP / Chat)", "dest_ip": "149.154.167.91", "port": 443, "proto": "TCP/TLS"},
        {"app": "WhatsApp VoIP Call", "dest_ip": "157.240.23.60", "port": 3478, "proto": "UDP/STUN"},
        {"app": "Signal Private Messenger", "dest_ip": "76.223.111.144", "port": 443, "proto": "TCP/TLS"},
        {"app": "Tor Onion Router Gateway", "dest_ip": "185.220.101.5", "port": 9001, "proto": "TCP"},
        {"app": "ProtonVPN Tunnel", "dest_ip": "185.159.157.4", "port": 51820, "proto": "UDP/WireGuard"},
        {"app": "Google Search / Browsing", "dest_ip": "142.250.190.46", "port": 443, "proto": "QUIC"},
        {"app": "Cloudflare CDN Web Access", "dest_ip": "104.21.43.12", "port": 443, "proto": "TCP/HTTPS"}
    ]
    
    base_time = datetime(2026, 10, 18, 0, 0, 0)
    for i in range(80):
        offset_minutes = random.randint(10, 12000)
        start_time = base_time + timedelta(minutes=offset_minutes)
        duration_s = random.randint(15, 3600)
        end_time = start_time + timedelta(seconds=duration_s)
        service = random.choice(services)
        
        bytes_up = random.randint(5000, 4500000)
        bytes_down = random.randint(12000, 25000000)
        
        ipdr_records.append({
            "session_id": f"IPDR-2026-{i+1001}",
            "msisdn": target_msisdn,
            "source_private_ip": f"10.145.{random.randint(1, 254)}.{random.randint(1, 254)}",
            "source_port": random.randint(30000, 65000),
            "destination_public_ip": service["dest_ip"],
            "destination_port": service["port"],
            "protocol": service["proto"],
            "application_protocol": service["app"],
            "start_time": start_time.strftime("%Y-%m-%d %H:%M:%S"),
            "end_time": end_time.strftime("%Y-%m-%d %H:%M:%S"),
            "duration_seconds": duration_s,
            "bytes_uplink": bytes_up,
            "bytes_downlink": bytes_down,
            "total_megabytes": round((bytes_up + bytes_down) / (1024 * 1024), 2),
            "access_type": "4G_LTE_PDN",
            "serving_cell_id": random.choice(TOWERS)["cell_id"]
        })
        
    ipdr_records.sort(key=lambda r: r["start_time"])
    return ipdr_records


def main():
    cdr1 = generate_cdr_1()
    cdr2 = generate_cdr_2()
    ipdr = generate_ipdr()
    
    # Write Tower DB
    with open("backend/data/tower_database.json", "w", encoding="utf-8") as f:
        json.dump(TOWERS, f, indent=2)
        
    # Write CDR 1 CSV
    fieldnames = list(cdr1[0].keys())
    with open("backend/data/sample_cdr_case_01.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(cdr1)
        
    # Write CDR 2 CSV
    with open("backend/data/sample_cdr_case_02.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(cdr2)
        
    # Write IPDR JSON
    with open("backend/data/sample_ipdr_data.json", "w", encoding="utf-8") as f:
        json.dump(ipdr, f, indent=2)
        
    print(f"Generated {len(cdr1)} records for Case 1 CDR.")
    print(f"Generated {len(cdr2)} records for Case 2 CDR.")
    print(f"Generated {len(ipdr)} records for IPDR.")
    print(f"Generated {len(TOWERS)} cell towers.")

if __name__ == "__main__":
    main()

