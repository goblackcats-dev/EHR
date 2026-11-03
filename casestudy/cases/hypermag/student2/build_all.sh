#!/bin/bash
# Rebuilds the simplified student packet + key, converts to PDF and checks the layout.   bash build_all.sh
cd "$(dirname "$0")"
python3 make_strip.py && python3 build_packet.py && python3 build_key.py && \
 (cd .. && soffice --headless --convert-to pdf --outdir student2/out CASE_STUDY_PACKET.docx INSTRUCTOR_CASESTUDY_KEY.docx >/dev/null 2>&1) && \
 cp out/CASE_STUDY_PACKET.pdf out/INSTRUCTOR_CASESTUDY_KEY.pdf .. && python3 render_check.py
