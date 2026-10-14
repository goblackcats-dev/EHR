# NursingSim Student Site

Students open links like `https://YOUR-SITE/?case=NAME#k=KEY`. Nothing else is needed.

## How to publish (one time)
1. On GitHub create a new **public** repository named `EHR-student`.
2. Upload everything in this folder (drag and drop the files and the `cases` folder).
3. Settings > Pages > Deploy from a branch > `main` / root > Save.
4. Your student address is `https://YOUR-USERNAME.github.io/EHR-student/`.

## For each patient
On the instructor page open the patient, press **Student Link**, upload the downloaded `.enc.json` file into the `cases` folder here, then email the link.

The patient files are locked (AES-256). The key lives only in the link after the `#` and is never sent to GitHub.
