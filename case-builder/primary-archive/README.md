# Archived primary diagnosis profiles

These files are every primary diagnosis the Case Builder had before it was cleared (about 50 diagnoses plus the 5 LPN Med Pass profiles).
They are kept unchanged. They are NOT loaded by `case-builder/index.html` right now, so the Case Builder's Primary diagnosis list is empty.

To use one again: copy it out of this folder into `case-builder/`, add `<script src="thatfile.js"></script>` after `primary_registry.js` in `case-builder/index.html`.
Files that depend on each other: `primary_ortho_gi.js` defines helpers (`NS.OG`) used by `primary_ortho2/3/4.js`, so load it first when using those.
`tools/make-prebuilt.js` loads this folder when it rebuilds the LPN Med Pass patients. The test tools (stress.js, review.js) load it too.
Patient files already built from these profiles (prebuilt/ and casestudy/cases/) are not affected.
