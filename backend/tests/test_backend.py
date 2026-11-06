import unittest
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from services.cdr_service import CDRService
from services.analytics import AnalyticsEngine
from services.reporting import ReportGenerator

class TestCDRPlatform(unittest.TestCase):
    def setUp(self):
        # Sample test CSV bytes
        self.sample_csv = (
            "calling_number,called_number,call_date,call_time,duration,call_type,imei,imsi,tower_name,latitude,longitude\n"
            "+919876543210,+919811223344,2026-10-21,02:15:00,45,OUTGOING,867543048912345,404450123456789,Delhi CP,28.6315,77.2167\n"
            "+919811223344,+919876543210,2026-10-21,02:18:00,120,INCOMING,867543048912345,404450123456789,Delhi CP,28.6315,77.2167\n"
            "+919876543210,+919822334455,2026-10-21,03:30:00,10,OUTGOING,867543048912345,404450123456789,Gurugram CyberHub,28.4986,77.0892\n"
            "+919876543210,+919833445566,2026-10-22,14:00:00,0,MISSED,354129087654321,404450987654321,IGI Airport,28.5562,77.0863\n"
        ).encode("utf-8")

    def test_sha256_hash(self):
        sha = CDRService.calculate_sha256(self.sample_csv)
        self.assertEqual(len(sha), 64)
        self.assertTrue(sha.isupper())

    def test_cdr_parser(self):
        records, summary = CDRService.parse_file(self.sample_csv, "test.csv")
        self.assertEqual(len(records), 4)
        self.assertEqual(summary["total_rows"], 4)
        self.assertIn("calling_number", summary["columns_detected"])
        self.assertEqual(records[0]["calling_number"], "+919876543210")
        self.assertEqual(records[0]["duration"], 45)

    def test_analytics_summary(self):
        records, _ = CDRService.parse_file(self.sample_csv, "test.csv")
        summary = AnalyticsEngine.get_dashboard_summary(records)
        self.assertEqual(summary["total_records"], 4)
        self.assertEqual(summary["total_incoming"], 1)
        self.assertEqual(summary["total_outgoing"], 2)
        self.assertEqual(summary["total_missed"], 1)
        self.assertEqual(summary["unique_numbers"], 4)
        self.assertEqual(summary["unique_imeis"], 2)

    def test_number_profile(self):
        records, _ = CDRService.parse_file(self.sample_csv, "test.csv")
        profile = AnalyticsEngine.analyze_number(records, "+919876543210")
        self.assertEqual(profile["number"], "+919876543210")
        self.assertEqual(profile["total_records"], 4)
        self.assertEqual(profile["outgoing_calls"], 3)
        self.assertEqual(profile["incoming_calls"], 1)

    def test_imei_analysis(self):
        records, _ = CDRService.parse_file(self.sample_csv, "test.csv")
        imei_data = AnalyticsEngine.analyze_imei(records)
        self.assertEqual(imei_data["unique_imeis"], 2)
        # Should detect device switch on +919876543210
        switches = [s for s in imei_data["device_switches"] if s["phone_number"] == "+919876543210"]
        self.assertEqual(len(switches), 1)

    def test_pattern_detection(self):
        records, _ = CDRService.parse_file(self.sample_csv, "test.csv")
        anomalies = AnalyticsEngine.detect_patterns_and_anomalies(records)
        # Should detect device switch PAT-DEV
        dev_anomalies = [a for a in anomalies if "PAT-DEV" in a["anomaly_id"]]
        self.assertTrue(len(dev_anomalies) > 0)

    def test_report_generation(self):
        records, _ = CDRService.parse_file(self.sample_csv, "test.csv")
        summary = AnalyticsEngine.get_dashboard_summary(records)
        anomalies = AnalyticsEngine.detect_patterns_and_anomalies(records)
        case_info = {"case_id": "TEST-01", "case_title": "Unit Test Case", "officer_name": "Test Officer"}
        evidence_info = {"original_filename": "test.csv", "sha256_hash": "A"*64}

        excel_bytes = ReportGenerator.generate_excel(case_info, evidence_info, records, summary, anomalies)
        self.assertTrue(len(excel_bytes) > 1000)

        pdf_bytes = ReportGenerator.generate_pdf(case_info, evidence_info, records, summary, anomalies, [])
        self.assertTrue(len(pdf_bytes) > 1000)

if __name__ == "__main__":
    unittest.main()

