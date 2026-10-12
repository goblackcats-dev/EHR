# Care-plan case study tool (faculty only)

Builds a printable ADN Med-Surg II case study (student packet, answer key, score sheet) from a NursingSim patient JSON.
See `BLUEPRINT.md` for the design, the workflow and how photos of student work are scored.

    python3 extract_facts.py patient.json > facts.txt
    python3 build_casestudy.py content.json patient.json out/

Requires `python-docx` (`pip install python-docx`). Keep `content.json` and the `*_KEY.docx` private: this repo is public.
