#!/bin/bash
# Rebuilds the Lauren Mitchell team case study packet + key, converts to PDF and checks layout and facts.   bash build_all.sh
# (Screenshots: start a server at the repo root, run node capture_shots.js, then python3 crop_shots.py. They are kept in figs/.)
cd "$(dirname "$0")"
python3 crop_shots.py >/dev/null && python3 build_packet.py && python3 build_key.py && \
 (cd .. && soffice --headless --convert-to pdf --outdir student/out CASE_STUDY_PACKET.docx INSTRUCTOR_CASESTUDY_KEY.docx >/dev/null 2>&1) && \
 cp out/CASE_STUDY_PACKET.pdf out/INSTRUCTOR_CASESTUDY_KEY.pdf .. && python3 render_check.py && python3 check_facts.py
