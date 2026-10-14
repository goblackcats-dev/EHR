# Security: keeping students out of the teacher tools

## What is protected
- **Students use a separate site** (`student-site/`, built by `node make-student-site.js`). It does not contain the Case Builder, Quiz, faculty rubrics, Med-pass setup, saved-patient library, import tool, or the case-study answer keys. There is nothing to click and no page to browse to.
- **Patients are locked.** "Student Link" locks the patient (AES-256) and strips the faculty answer key. The locked file sits on the student site; the key is only in the emailed link after the `#`, which browsers never send to GitHub. Nobody browsing the repository can read the patient.
- The student page blocks outside scripts and connections (Content-Security-Policy), sends no referrer, asks search engines not to index, and removes the key from the address bar after loading.

## What cannot be promised (static websites)
- Anyone who has a student's full link can open that patient, and a student could forward it. Links are per patient, not per student.
- A determined student can read the student app's code; it contains no answers, but it is not secret.
- The instructor site and `casestudy/` keys live in your public repository. For real protection make that repository **private** (GitHub Pages for private repos needs a paid plan), or keep answer keys on your own computer and not in the repo.

## Setup
See `student-site/README.md`. Re-run `node make-student-site.js` after any change to the app, then re-upload the folder.
