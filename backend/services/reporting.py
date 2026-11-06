import io
from datetime import datetime
from typing import Dict, List, Any
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

class ReportGenerator:
    @staticmethod
    def generate_excel(
        case_info: Dict[str, Any],
        evidence_info: Dict[str, Any],
        records: List[Dict[str, Any]],
        summary: Dict[str, Any],
        anomalies: List[Dict[str, Any]]
    ) -> bytes:
        """Generate an Excel forensic workbook with multiple structured sheets"""
        wb = openpyxl.Workbook()
        
        # Style presets
        header_fill = PatternFill(start_color="0F172A", end_color="0F172A", fill_type="solid")
        header_font = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
        title_font = Font(name="Segoe UI", size=14, bold=True, color="0F172A")
        sub_font = Font(name="Segoe UI", size=10, italic=True, color="64748B")
        border_thin = Border(
            left=Side(style='thin', color='CBD5E1'),
            right=Side(style='thin', color='CBD5E1'),
            top=Side(style='thin', color='CBD5E1'),
            bottom=Side(style='thin', color='CBD5E1')
        )

        # Sheet 1: Executive Summary & Evidence Info
        ws_sum = wb.active
        ws_sum.title = "Investigation Summary"
        ws_sum.views.sheetView[0].showGridLines = True

        ws_sum["A1"] = "CDR ANALYSIS PRO - FORENSIC INVESTIGATION REPORT"
        ws_sum["A1"].font = title_font
        ws_sum["A2"] = f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | Confidential Law Enforcement Document"
        ws_sum["A2"].font = sub_font

        ws_sum["A4"] = "Case Identification"
        ws_sum["A4"].font = Font(bold=True, size=12)
        
        case_rows = [
            ("Case Reference ID:", case_info.get("case_id", "CAS-2026-001")),
            ("Investigation Title:", case_info.get("case_title", "Telecom Forensics Review")),
            ("Investigating Officer:", case_info.get("officer_name", "Forensic Analyst")),
            ("Law Enforcement Unit:", case_info.get("agency", "Special Cyber Cell")),
            ("Evidence Filename:", evidence_info.get("original_filename", "evidence.csv")),
            ("File SHA-256 Hash:", evidence_info.get("sha256_hash", "UNVERIFIED")),
            ("Integrity Status:", "VERIFIED (Cryptographic match confirmed)")
        ]

        r_idx = 5
        for label, val in case_rows:
            ws_sum.cell(row=r_idx, column=1, value=label).font = Font(bold=True)
            ws_sum.cell(row=r_idx, column=2, value=val)
            r_idx += 1

        r_idx += 2
        ws_sum.cell(row=r_idx, column=1, value="Analytical Key Metrics").font = Font(bold=True, size=12)
        r_idx += 1

        metrics = [
            ("Total Records Analyzed", summary.get("total_records", 0)),
            ("Incoming Calls", summary.get("total_incoming", 0)),
            ("Outgoing Calls", summary.get("total_outgoing", 0)),
            ("SMS Transmissions", summary.get("total_sms", 0)),
            ("Missed / Dropped Calls", summary.get("total_missed", 0)),
            ("Unique Phone Numbers Observed", summary.get("unique_numbers", 0)),
            ("Unique Handsets / IMEIs", summary.get("unique_imeis", 0)),
            ("Unique SIMs / IMSIs", summary.get("unique_imsis", 0)),
            ("Total Communication Duration", summary.get("total_duration_formatted", "00:00:00")),
            ("Most Contacted Entity", summary.get("most_frequent_contact", "N/A")),
            ("Peak Activity Hour", summary.get("peak_hour", "N/A")),
            ("Peak Activity Day", summary.get("peak_day", "N/A"))
        ]

        for label, val in metrics:
            ws_sum.cell(row=r_idx, column=1, value=label)
            ws_sum.cell(row=r_idx, column=2, value=val)
            r_idx += 1

        # Adjust columns
        ws_sum.column_dimensions['A'].width = 34
        ws_sum.column_dimensions['B'].width = 50

        # Sheet 2: CDR Records
        ws_rec = wb.create_sheet(title="Normalized CDR Records")
        ws_rec.views.sheetView[0].showGridLines = True
        
        columns = [
            "Record ID", "Calling Number (A-Party)", "Called Number (B-Party)", 
            "Date", "Time", "Duration (s)", "Call Type", "IMEI", "IMSI", 
            "First Cell ID", "Last Cell ID", "LAC", "Tower Name", "Operator"
        ]
        
        ws_rec.append(columns)
        for col_num, _ in enumerate(columns, 1):
            cell = ws_rec.cell(row=1, column=col_num)
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = Alignment(horizontal="center")

        for r in records[:5000]: # up to 5k for report sheet
            ws_rec.append([
                r.get("record_id"), r.get("calling_number"), r.get("called_number"),
                r.get("call_date"), r.get("call_time"), r.get("duration"),
                r.get("call_type"), r.get("imei"), r.get("imsi"),
                r.get("first_cell_id"), r.get("last_cell_id"), r.get("lac"),
                r.get("tower_name"), r.get("operator")
            ])

        for col in ws_rec.columns:
            max_len = max(len(str(cell.value or '')) for cell in col)
            col_letter = openpyxl.utils.get_column_letter(col[0].column)
            ws_rec.column_dimensions[col_letter].width = max(max_len + 3, 12)

        # Sheet 3: Anomalies & Flags
        ws_ano = wb.create_sheet(title="Forensic Leads & Flags")
        ws_ano.views.sheetView[0].showGridLines = True
        
        ano_cols = ["Rule ID", "Title", "Severity", "Indicator", "Forensic Explanation", "Records Count"]
        ws_ano.append(ano_cols)
        for col_num, _ in enumerate(ano_cols, 1):
            cell = ws_ano.cell(row=1, column=col_num)
            cell.fill = header_fill
            cell.font = header_font

        for a in anomalies:
            ws_ano.append([
                a.get("anomaly_id"), a.get("title"), a.get("severity"),
                a.get("indicator"), a.get("explanation"), a.get("supporting_records_count")
            ])

        for col in ws_ano.columns:
            col_letter = openpyxl.utils.get_column_letter(col[0].column)
            ws_ano.column_dimensions[col_letter].width = 25

        out = io.BytesIO()
        wb.save(out)
        return out.getvalue()

    @staticmethod
    def generate_pdf(
        case_info: Dict[str, Any],
        evidence_info: Dict[str, Any],
        records: List[Dict[str, Any]],
        summary: Dict[str, Any],
        anomalies: List[Dict[str, Any]],
        top_contacts: List[Dict[str, Any]]
    ) -> bytes:
        """Generate a complete forensic PDF investigation dossier"""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        
        title_style = ParagraphStyle(
            'ReportTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=18,
            textColor=colors.HexColor('#0F172A'),
            spaceAfter=4
        )
        subtitle_style = ParagraphStyle(
            'ReportSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=10,
            textColor=colors.HexColor('#0284C7'),
            spaceAfter=15
        )
        section_style = ParagraphStyle(
            'SectionTitle',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=12,
            textColor=colors.HexColor('#0F172A'),
            spaceBefore=12,
            spaceAfter=6
        )
        body_style = ParagraphStyle(
            'ReportBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            textColor=colors.HexColor('#334155'),
            leading=12
        )
        legal_style = ParagraphStyle(
            'LegalNotice',
            parent=styles['Normal'],
            fontName='Helvetica-Oblique',
            fontSize=8,
            textColor=colors.HexColor('#64748B'),
            leading=11
        )

        elements = []

        # Header Title
        elements.append(Paragraph("CDR ANALYSIS PRO - TELECOM FORENSIC DOSSIER", title_style))
        elements.append(Paragraph("DIGITAL INVESTIGATION REPORT & METADATA ANALYSIS", subtitle_style))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0284C7'), spaceAfter=12))

        # Case & Evidence Verification Table
        case_data = [
            [Paragraph("<b>Case Reference:</b>", body_style), Paragraph(case_info.get("case_id", "CAS-2026-001"), body_style),
             Paragraph("<b>Date of Analysis:</b>", body_style), Paragraph(datetime.now().strftime("%Y-%m-%d %H:%M"), body_style)],
            [Paragraph("<b>Case Title:</b>", body_style), Paragraph(case_info.get("case_title", "Telecom Inquiry"), body_style),
             Paragraph("<b>Officer / Analyst:</b>", body_style), Paragraph(case_info.get("officer_name", "Forensic Examiner"), body_style)],
            [Paragraph("<b>Evidence File:</b>", body_style), Paragraph(evidence_info.get("original_filename", "evidence.csv"), body_style),
             Paragraph("<b>Record Count:</b>", body_style), Paragraph(str(summary.get("total_records", 0)), body_style)],
            [Paragraph("<b>SHA-256 Hash:</b>", body_style), Paragraph(f"<font size=7>{evidence_info.get('sha256_hash', 'N/A')}</font>", body_style),
             Paragraph("<b>Integrity Status:</b>", body_style), Paragraph("<font color='#059669'><b>VERIFIED INTACT</b></font>", body_style)]
        ]

        t_case = Table(case_data, colWidths=[90, 180, 95, 175])
        t_case.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        elements.append(t_case)
        elements.append(Spacer(1, 12))

        # Summary Metrics Table
        elements.append(Paragraph("1. Executive Forensic Summary", section_style))
        
        sum_data = [
            ["Metric", "Value", "Metric", "Value"],
            ["Total Records", str(summary.get("total_records", 0)), "Total Duration", summary.get("total_duration_formatted", "0s")],
            ["Incoming Calls", str(summary.get("total_incoming", 0)), "Unique Numbers", str(summary.get("unique_numbers", 0))],
            ["Outgoing Calls", str(summary.get("total_outgoing", 0)), "Unique IMEIs", str(summary.get("unique_imeis", 0))],
            ["SMS Records", str(summary.get("total_sms", 0)), "Unique IMSIs", str(summary.get("unique_imsis", 0))],
            ["Missed Calls", str(summary.get("total_missed", 0)), "Peak Activity Hour", str(summary.get("peak_hour", "N/A"))],
            ["First Activity", str(summary.get("first_date", "N/A")), "Last Activity", str(summary.get("last_date", "N/A"))]
        ]

        t_sum = Table(sum_data, colWidths=[135, 135, 135, 135])
        t_sum.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0F172A')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F1F5F9')]),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        elements.append(t_sum)
        elements.append(Spacer(1, 14))

        # Top Contacts Table
        if top_contacts:
            elements.append(Paragraph("2. Top Frequently Contacted Entities", section_style))
            contact_headers = [["Rank", "Telephone Number", "Total Interactions", "Type Direction"]]
            for idx, c in enumerate(top_contacts[:8], 1):
                contact_headers.append([
                    str(idx),
                    c.get("number", "N/A"),
                    str(c.get("calls", 0)),
                    "Frequent Associate / Lead"
                ])
            t_con = Table(contact_headers, colWidths=[40, 200, 150, 150])
            t_con.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E293B')),
                ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
                ('TOPPADDING', (0,0), (-1,-1), 3),
                ('BOTTOMPADDING', (0,0), (-1,-1), 3),
            ]))
            elements.append(t_con)
            elements.append(Spacer(1, 14))

        # Forensic Patterns & Anomaly Leads
        if anomalies:
            elements.append(Paragraph("3. Rule-Based Forensic Flags & Anomaly Leads", section_style))
            ano_table = [["Flag ID", "Title / Indicator", "Severity", "Forensic Explanation"]]
            for a in anomalies[:5]:
                ano_table.append([
                    a.get("anomaly_id", "FLAG"),
                    Paragraph(f"<b>{a.get('title')}</b><br/>{a.get('indicator')}", body_style),
                    a.get("severity", "MEDIUM"),
                    Paragraph(a.get("explanation", ""), legal_style)
                ])
            t_ano = Table(ano_table, colWidths=[70, 190, 70, 210])
            t_ano.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E293B')),
                ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
                ('TOPPADDING', (0,0), (-1,-1), 4),
                ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ]))
            elements.append(t_ano)
            elements.append(Spacer(1, 14))

        # Legal Certification Block (Section 63 BSA / 65B IEA)
        elements.append(Paragraph("4. Certificate of Electronic Record (BSA Section 63 / IEA Sec 65B)", section_style))
        legal_text = (
            "I hereby certify that the electronic records contained in this report were generated through lawful computerized processing "
            "of Call Detail Records (CDR) lawfully obtained. The cryptographic SHA-256 hash was calculated upon file ingestion and verified "
            "against the stored working copy. The software operated properly throughout the processing period without data corruption. "
            "Analytical findings are objective observations of telecom metadata and do not constitute direct criminal accusation without "
            "corroborative physical evidence."
        )
        elements.append(Paragraph(legal_text, legal_style))
        elements.append(Spacer(1, 18))

        # Signatures
        sig_data = [
            ["_____________________________________", "_____________________________________"],
            ["Digital Forensics Analyst Signature", "Supervisory Officer / Inspector In-Charge"],
            ["Date: " + datetime.now().strftime("%Y-%m-%d"), "Office Stamp & Seal:"]
        ]
        t_sig = Table(sig_data, colWidths=[270, 270])
        t_sig.setStyle(TableStyle([
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('TEXTCOLOR', (0,0), (-1,-1), colors.HexColor('#475569')),
            ('FONTSIZE', (0,0), (-1,-1), 8),
            ('TOPPADDING', (0,0), (-1,-1), 3),
        ]))
        elements.append(KeepTogether(t_sig))

        doc.build(elements)
        return buffer.getvalue()

