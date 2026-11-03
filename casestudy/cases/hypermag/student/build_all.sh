#!/bin/bash
# Rebuilds the student packet, converts to PDF and checks the layout.   bash build_all.sh
cd "$(dirname "$0")"
python3 build_packet.py && (cd .. && soffice --headless --convert-to pdf --outdir student/out CASE_STUDY_PACKET.docx >/dev/null 2>&1) && python3 render_check.py
