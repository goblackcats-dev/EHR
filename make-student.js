/* Builds student.html from index.html. Run after any change to index.html:   node make-student.js
   The student page hides the instructor tools (Quiz, Case Builder, Saved Patients, Import Patient, Med-pass setup, faculty rubrics)
   and adds "Open Patient" and "My Results". Students open student.html; the instructor uses index.html. */
const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');
const must = (cond, msg) => { if (!cond) { console.error('make-student: ' + msg); process.exit(1); } };
must(h.includes('<script src="quiz.js"></script>'), 'quiz script tag not found');
h = h.replace('<script src="quiz.js"></script>\n', '').replace('<script src="quiz.js"></script>', '');
h = h.replace(/<a class="top-link" href="case-builder\/index.html">Case Builder<\/a>\s*/, '');
h = h.replace('<body>', '<body class="student">');
h = h.replace(/<title>[^<]*<\/title>/, '<title>NursingSim EHR (Student)</title>');
h = h.replace('href="manifest.webmanifest"', 'href="manifest-student.webmanifest"');
h = h.replace('content="NursingSim"', 'content="NursingSim Student"');
h = h.replace('Import simulated patient JSON to begin', 'Tap Open Patient and choose the file your instructor gave you');
const first = h.indexOf('<script src=');
must(first > 0, 'no script tags');
h = h.slice(0, first) + '<script>window.NS_STUDENT = true;</script>\n  ' + h.slice(first);
must(h.includes('<script src="results.js"></script>'), 'results.js missing from index.html');
h = h.replace('</body>', '  <script src="student.js"></script>\n</body>');
fs.writeFileSync('student.html', h);
console.log('student.html written (' + h.length + ' bytes)');
