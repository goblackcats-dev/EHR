/* Builds the STUDENT-ONLY site folder:   node make-student-site.js
   Output: student-site/  (upload its contents to a separate GitHub repo, e.g. "EHR-student", and turn on GitHub Pages for it).
   It contains only what students need. It does NOT contain the Case Builder, Quiz, case-study answer keys, or any instructor tool.
   The patient files go into student-site/cases/ (the instructor page's "Student Link" button makes them). */
const fs = require('fs'), path = require('path');
require('./make-student.js');
const out = 'student-site';
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out + '/cases', { recursive: true });
let h = fs.readFileSync('student.html', 'utf8');
// drop the instructor-only dialogs and buttons entirely (app.js tolerates their absence)
h = h.replace(/<dialog id="libraryDialog"[\s\S]*?<\/dialog>\s*/, '').replace(/<dialog id="importDialog"[\s\S]*?<\/dialog>\s*/, '');
h = h.replace(/<button id="openStudentViewBtn"[^>]*>[^<]*<\/button>\s*/, '').replace(/<button id="openLibraryBtn"[^>]*>[^<]*<\/button>\s*/, '').replace(/<button id="openImportBtn"[^>]*>[^<]*<\/button>\s*/, '');
h = h.replace(/\s*<script src="student-link\.js"><\/script>/, '');
const csp = "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; manifest-src 'self'; media-src 'self' blob:; worker-src 'self' blob:; base-uri 'none'; form-action 'none'";
h = h.replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n  <meta http-equiv="Content-Security-Policy" content="' + csp + '" />\n  <meta name="referrer" content="no-referrer" />\n  <meta name="robots" content="noindex, nofollow" />');
const scripts = [...h.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
const bad = ['quiz.js', 'student-link.js', 'make-student.js'];
if (scripts.some(s => bad.includes(s))) { console.error('instructor script present in student page'); process.exit(1); }
if (/case-builder|casestudy|openLibraryBtn|openImportBtn|libraryDialog|importDialog/.test(h.replace(/<script src[^>]*>/g, ''))) { console.error('instructor markup still present'); process.exit(1); }
fs.writeFileSync(out + '/index.html', h);
const files = new Set(scripts.concat(['manifest-student.webmanifest','styles.css', 'epic.css', 'icon.svg', 'icon-180.png', 'icon-192.png', 'icon-512.png']));
files.delete('manifest-student.webmanifest');
fs.writeFileSync(out + '/manifest-student.webmanifest', fs.readFileSync('manifest-student.webmanifest', 'utf8').replace('./student.html', './'));
files.forEach(f => { if (!fs.existsSync(f)) { console.error('missing ' + f); process.exit(1); } fs.copyFileSync(f, path.join(out, f)); });
fs.writeFileSync(out + '/cases/README.txt', 'Patient files (.enc.json) go here. They are locked; the key is only in the link you email.\n');
fs.writeFileSync(out + '/robots.txt', 'User-agent: *\nDisallow: /\n');
fs.writeFileSync(out + '/.nojekyll', '');
fs.writeFileSync(out + '/README.md', `# NursingSim Student Site

Students open links like \`https://YOUR-SITE/?case=NAME#k=KEY\`. Nothing else is needed.

## How to publish (one time)
1. On GitHub create a new **public** repository named \`EHR-student\`.
2. Upload everything in this folder (drag and drop the files and the \`cases\` folder).
3. Settings > Pages > Deploy from a branch > \`main\` / root > Save.
4. Your student address is \`https://YOUR-USERNAME.github.io/EHR-student/\`.

## For each patient
On the instructor page open the patient, press **Student Link**, upload the downloaded \`.enc.json\` file into the \`cases\` folder here, then email the link.

The patient files are locked (AES-256). The key lives only in the link after the \`#\` and is never sent to GitHub.
`);
console.log('student-site/ built: ' + (files.size + 6) + ' files');
