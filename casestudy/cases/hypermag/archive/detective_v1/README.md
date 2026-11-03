# Archive: detective_v1 (the original "Case of the Silent Mineral")

The first, illustrated 27-page version of the Ray Kessler group case study: roles Chart Detective, Lab Interpreter and Bedside Nurse that rotate, drawn pictures, Mg-o-meter, ECG decoder.
It was replaced by a simpler 12-page charge-nurse version (sources in `../../student2/`).

Contents: `CASE_STUDY_PACKET.docx/.pdf`, `INSTRUCTOR_CASESTUDY_KEY.docx/.pdf/.md`, and `student/` (all sources: build_all.sh, build_packet.py, build_key.py, check_facts.py, content files, figs).

## Bring it back
    cd casestudy/cases/hypermag
    cp archive/detective_v1/CASE_STUDY_PACKET.* archive/detective_v1/INSTRUCTOR_CASESTUDY_KEY.* .
    python3 ../../make_index.py      # from casestudy/cases/hypermag: python3 ../../make_index.py
To rebuild from source instead: copy `archive/detective_v1/student` to `casestudy/cases/hypermag/student` and run `bash build_all.sh` there (needs python-docx, matplotlib, LibreOffice).
