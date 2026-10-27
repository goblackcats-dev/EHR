/* Primary diagnosis registry. The Case Builder's primary diagnoses are being rebuilt one patient at a time, very thoroughly.
   All of the earlier diagnosis profiles are saved, unchanged, in case-builder/primary-archive/ (see the README there).
   To add one back, move its profile (or write a new one) into a file loaded after this one, register it with
   NS.PRIMARY.<key> = {...}, and add a <script src> tag for it in index.html right below this line. */
NS.PRIMARY = NS.PRIMARY || {};
