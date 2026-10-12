/* Additional laboratory tests (endocrine, cardiac, toxicology, hematology, rheumatology...). Loaded after labs.js.
   Same shape as NS.LABS.C entries. Other files may add a test with:  NS.LABS.C['Name'] = NS.LABS.C['Name'] || { ... }  */
(() => {
  const C = NS.LABS.C;
  const add = (code, def) => { if (!C[code]) C[code] = def; };

  // Endocrine
  add('Beta-hydroxybutyrate', { cat: 'Endocrine', units: 'mmol/L', ref: [0.02, 0.27], dec: 1, base: 0.1, crit: [null, 5.0], refText: '<0.30' });
  add('Anion gap', { cat: 'CMP', units: 'mmol/L', ref: [4, 12], dec: 0, base: 9, crit: [null, 30] });
  add('Serum osmolality', { cat: 'CMP', units: 'mOsm/kg', ref: [275, 295], dec: 0, base: 287, crit: [240, 330] });
  add('Cortisol', { cat: 'Endocrine', units: 'mcg/dL', ref: [6, 23], dec: 1, base: 12, refText: '6-23 (AM)' });
  add('ACTH', { cat: 'Endocrine', units: 'pg/mL', ref: [7, 63], dec: 0, base: 30 });
  add('Free T4', { cat: 'Endocrine', units: 'ng/dL', ref: [0.8, 1.8], dec: 2, base: 1.2 });
  add('Free T3', { cat: 'Endocrine', units: 'pg/mL', ref: [2.3, 4.2], dec: 1, base: 3.2 });
  add('PTH', { cat: 'Endocrine', units: 'pg/mL', ref: [15, 65], dec: 0, base: 40 });
  add('25-OH Vitamin D', { cat: 'Endocrine', units: 'ng/mL', ref: [30, 100], dec: 0, base: 38 });
  add('Ionized calcium', { cat: 'CMP', units: 'mmol/L', ref: [1.12, 1.32], dec: 2, base: 1.2, crit: [0.8, 1.6] });
  add('Uric acid', { cat: 'CMP', units: 'mg/dL', ref: { M: [3.4, 7.0], F: [2.4, 6.0] }, dec: 1, base: { M: 5.5, F: 4.5 } });
  add('Triglycerides', { cat: 'Lipid', units: 'mg/dL', ref: [0, 150], dec: 0, base: 120, refText: '<150', crit: [null, 1000] });
  add('HDL cholesterol', { cat: 'Lipid', units: 'mg/dL', ref: [40, 200], dec: 0, base: 50, refText: '>40' });
  add('Total cholesterol', { cat: 'Lipid', units: 'mg/dL', ref: [0, 200], dec: 0, base: 185, refText: '<200' });

  // Cardiac
  add('CK-MB', { cat: 'Cardiac', units: 'ng/mL', ref: [0, 5], dec: 1, base: 1.5, refText: '<5.0' });
  add('Creatine kinase', { cat: 'Cardiac', units: 'U/L', ref: { M: [39, 308], F: [26, 192] }, dec: 0, base: { M: 140, F: 100 } });
  add('Digoxin level', { cat: 'Drug level', units: 'ng/mL', ref: [0.8, 2.0], dec: 1, base: 1.0, crit: [null, 2.5] });
  add('D-dimer', { cat: 'Coagulation', units: 'ng/mL FEU', ref: [0, 500], dec: 0, base: 250, refText: '<500' });
  add('Fibrinogen', { cat: 'Coagulation', units: 'mg/dL', ref: [200, 400], dec: 0, base: 300, crit: [100, null] });

  // Hepatic / GI / toxicology
  add('Amylase', { cat: 'Hepatic', units: 'U/L', ref: [30, 110], dec: 0, base: 65 });
  add('Ammonia', { cat: 'Hepatic', units: 'mcmol/L', ref: [15, 45], dec: 0, base: 28 });
  add('Direct bilirubin', { cat: 'Hepatic', units: 'mg/dL', ref: [0, 0.3], dec: 1, base: 0.1, refText: '<0.3' });
  add('GGT', { cat: 'Hepatic', units: 'U/L', ref: [9, 48], dec: 0, base: 25 });
  add('Ethanol level', { cat: 'Toxicology', units: 'mg/dL', ref: [0, 10], dec: 0, base: 0, refText: '<10', crit: [null, 400] });
  add('Acetaminophen level', { cat: 'Toxicology', units: 'mcg/mL', ref: [0, 10], dec: 0, base: 0, refText: '<10' });
  add('Salicylate level', { cat: 'Toxicology', units: 'mg/dL', ref: [0, 20], dec: 0, base: 0, refText: '<20' });

  // Hematology / iron / inflammation
  add('Reticulocyte count', { cat: 'CBC', units: '%', ref: [0.5, 2.5], dec: 1, base: 1.2 });
  add('Ferritin', { cat: 'Iron studies', units: 'ng/mL', ref: { M: [24, 336], F: [11, 307] }, dec: 0, base: { M: 120, F: 60 } });
  add('Iron', { cat: 'Iron studies', units: 'mcg/dL', ref: [60, 170], dec: 0, base: 95 });
  add('TIBC', { cat: 'Iron studies', units: 'mcg/dL', ref: [250, 450], dec: 0, base: 330 });
  add('Vitamin B12', { cat: 'Iron studies', units: 'pg/mL', ref: [200, 900], dec: 0, base: 450 });
  add('Folate', { cat: 'Iron studies', units: 'ng/mL', ref: [3, 17], dec: 1, base: 9 });
  add('ESR', { cat: 'Other', units: 'mm/hr', ref: [0, 20], dec: 0, base: 8, refText: '<20' });
  add('LDH', { cat: 'Other', units: 'U/L', ref: [140, 280], dec: 0, base: 190 });
  add('Vancomycin trough', { cat: 'Drug level', units: 'mcg/mL', ref: [10, 20], dec: 1, base: 12, crit: [null, 30] });
  add('Phenytoin level', { cat: 'Drug level', units: 'mcg/mL', ref: [10, 20], dec: 1, base: 12, crit: [null, 30] });
  add('Lithium level', { cat: 'Drug level', units: 'mmol/L', ref: [0.6, 1.2], dec: 2, base: 0.8, crit: [null, 2.0] });
  add('Tacrolimus level', { cat: 'Drug level', units: 'ng/mL', ref: [5, 15], dec: 1, base: 8 });

  // Blood gas extras, filled in automatically beside every arterial or venous gas (see completeGases in engine.js)
  add('Base excess', { cat: 'ABG', units: 'mmol/L', ref: [-2, 2], dec: 1, base: 0, crit: [-10, 10], specimen: 'Arterial blood' });
  add('O2 saturation (arterial)', { cat: 'ABG', units: '%', ref: [95, 100], dec: 0, base: 97, crit: [88, null], specimen: 'Arterial blood' });
  add('Venous HCO3', { cat: 'Blood gas', units: 'mmol/L', ref: [22, 28], dec: 0, base: 25, specimen: 'Venous blood' });
  add('Venous pO2', { cat: 'Blood gas', units: 'mmHg', ref: [30, 50], dec: 0, base: 40, specimen: 'Venous blood' });
  add('Venous base excess', { cat: 'Blood gas', units: 'mmol/L', ref: [-2, 2], dec: 1, base: 0, specimen: 'Venous blood' });
  add('Venous O2 saturation', { cat: 'Blood gas', units: '%', ref: [60, 80], dec: 0, base: 70, specimen: 'Venous blood' });
})();
